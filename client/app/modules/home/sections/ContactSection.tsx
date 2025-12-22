import React from 'react';
import { Translate, translate } from 'react-jhipster';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="section bg-surface fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="w-full max-w-5xl mx-auto px-4">
        <h2 className="section-title">
          <Translate contentKey="home.contact.title" />
        </h2>
        <p className="text-center text-secondary mb-8">
          <Translate contentKey="home.contact.description" />
        </p>
        <form className="contact-form">
          <div>
            <label className="block text-sm font-medium mb-1">
              <Translate contentKey="home.contact.name" />
            </label>
            <input
              type="text"
              className="w-full rounded border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
              placeholder={translate('home.contact.name')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <Translate contentKey="home.contact.email" />
            </label>
            <input
              type="email"
              className="w-full rounded border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
              placeholder={translate('home.contact.email')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <Translate contentKey="home.contact.message" />
            </label>
            <textarea
              className="w-full rounded border border-input px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-focus"
              placeholder={translate('home.contact.message')}
            />
          </div>
          <button type="button" className="w-full px-4 py-2 rounded bg-btn-primary text-white font-medium hover:bg-primary transition">
            <Translate contentKey="home.contact.send" />
          </button>
        </form>
      </div>
    </section>
  );
};
