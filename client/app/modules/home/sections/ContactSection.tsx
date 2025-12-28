import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Translate, translate } from 'react-jhipster';
import { FloatingValidatedField } from 'app/shared/components';

export const ContactSection: React.FC = () => {
  const methods = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = data => {
    // TODO: hook into a backend service or email provider.
    // eslint-disable-next-line no-console
    console.log('Contact form submission', data);
  };

  return (
    <section id="contact" className="section bg-surface fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="w-full max-w-5xl mx-auto px-4">
        <h2 className="section-title">
          <Translate contentKey="home.contact.title" />
        </h2>
        <p className="text-center text-secondary mb-8">
          <Translate contentKey="home.contact.description" />
        </p>
        <FormProvider {...methods}>
          <form className="contact-form space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FloatingValidatedField name="name" label={translate('home.contact.name')} />
            <FloatingValidatedField type="email" name="email" label={translate('home.contact.email')} />
            <FloatingValidatedField type="textarea" name="message" label={translate('home.contact.message')} className="h-32" />
            <button type="submit" className="w-full px-4 py-2 rounded bg-btn-primary text-white font-medium hover:bg-primary transition">
              <Translate contentKey="home.contact.send" />
            </button>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};
