import nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { convert } from 'html-to-text';
import { emailConfig } from '../config/email.config';
import { User } from '../entities/User';

class MailService {
  private transporter: nodemailer.Transporter;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });

    // Verify connection on startup
    this.transporter.verify(error => {
      if (error) {
        console.error('Mail service connection failed:', error);
      } else {
        console.log('Mail service is ready');
      }
    });
  }

  /**
   * Load and compile a Handlebars template
   */
  private loadTemplate(templateName: string): HandlebarsTemplateDelegate {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }
    const templatePath = path.join(__dirname, '../templates/mail', `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const compiled = Handlebars.compile(templateContent);
    this.templateCache.set(templateName, compiled);
    return compiled;
  }

  /**
   * Send an email with HTML content
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const text = convert(html, {
      wordwrap: 130,
    });
    await this.transporter.sendMail({
      from: emailConfig.from,
      to,
      subject,
      text,
      html,
    });
  }

  /**
   * Send activation email to newly registered user
   */
  async sendActivationEmail(user: User): Promise<void> {
    const template = this.loadTemplate('activationEmail');
    const activationUrl = `${emailConfig.baseUrl}/account/activate?key=${user.activationKey}`;
    const html = template({
      userName: user.firstName || user.login,
      activationUrl,
      langKey: user.langKey || 'en',
      applicationName: emailConfig.applicationName,
    });
    await this.sendEmail(user.email, `${emailConfig.applicationName} - Account Activation`, html);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user: User): Promise<void> {
    const template = this.loadTemplate('passwordResetEmail');
    const resetUrl = `${emailConfig.baseUrl}/account/reset/finish?key=${user.resetKey}`;
    const html = template({
      userName: user.firstName || user.login,
      resetUrl,
      applicationName: emailConfig.applicationName,
    });
    await this.sendEmail(user.email, `${emailConfig.applicationName} - Password Reset`, html);
  }

  /**
   * Send creation email when admin creates a user
   */
  async sendCreationEmail(user: User): Promise<void> {
    const template = this.loadTemplate('creationEmail');
    const resetUrl = `${emailConfig.baseUrl}/account/reset/finish?key=${user.resetKey}`;
    const html = template({
      userName: user.firstName || user.login,
      login: user.login,
      resetUrl,
      applicationName: emailConfig.applicationName,
    });
    await this.sendEmail(user.email, `${emailConfig.applicationName} - Account Created`, html);
  }
}

export default new MailService();
