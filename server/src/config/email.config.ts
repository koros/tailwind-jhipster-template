import dotenv from 'dotenv';
dotenv.config();

export const emailConfig = {
  host: process.env.MAIL_HOST || 'localhost',
  port: parseInt(process.env.MAIL_PORT || '1025', 10),
  secure: process.env.MAIL_SECURE === 'true',
  auth:
    process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD
      ? {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        }
      : undefined,
  from: process.env.MAIL_FROM || 'noreply@localhost',
  baseUrl: process.env.MAIL_BASE_URL || 'http://localhost:9000',
  applicationName: process.env.APP_NAME || 'myTailwindJhipster',
};

// Provider examples (uncomment and configure as needed):
// Gmail: host: 'smtp.gmail.com', port: 587, secure: false
// SendGrid: host: 'smtp.sendgrid.net', port: 587
// Mailgun: host: 'smtp.mailgun.org', port: 587
// AWS SES: host: 'email-smtp.region.amazonaws.com', port: 587
// MailHog (dev): host: 'localhost', port: 1025, secure: false

/**
 * Email provider configurations for easy switching
 *
 * Gmail:
 * - MAIL_HOST=smtp.gmail.com
 * - MAIL_PORT=587
 * - MAIL_SECURE=false
 * - MAIL_USERNAME=your-email@gmail.com
 * - MAIL_PASSWORD=your-app-specific-password
 *
 * SendGrid:
 * - MAIL_HOST=smtp.sendgrid.net
 * - MAIL_PORT=587
 * - MAIL_SECURE=false
 * - MAIL_USERNAME=apikey
 * - MAIL_PASSWORD=your-sendgrid-api-key
 *
 * Mailgun:
 * - MAIL_HOST=smtp.mailgun.org
 * - MAIL_PORT=587
 * - MAIL_SECURE=false
 * - MAIL_USERNAME=postmaster@your-domain.mailgun.org
 * - MAIL_PASSWORD=your-mailgun-smtp-password
 *
 * AWS SES:
 * - MAIL_HOST=email-smtp.region.amazonaws.com
 * - MAIL_PORT=587
 * - MAIL_SECURE=false
 * - MAIL_USERNAME=your-ses-smtp-username
 * - MAIL_PASSWORD=your-ses-smtp-password
 *
 * MailHog (Development):
 * - MAIL_HOST=localhost
 * - MAIL_PORT=1025
 * - MAIL_SECURE=false
 * - No authentication needed
 */
