import React, { useEffect } from 'react';
import { Translate, ValidatedField, isEmail, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { Button, FloatingValidatedField } from 'app/shared/components';
import { useForm, FormProvider } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handlePasswordResetInit, reset } from '../password-reset.reducer';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = ({ email }) => {
    dispatch(handlePasswordResetInit(email));
  };

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  const methods = useForm({ mode: 'onTouched' });
  const { handleSubmit } = methods;

  const onSubmit = values => {
    handleValidSubmit(values);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          <Translate contentKey="reset.request.title">Reset your password</Translate>
        </h1>
      </div>
      <div className="bg-surface shadow-md rounded-lg p-6">
        <div className="bg-info/10 border border-info/30 text-info px-4 py-3 rounded-md mb-6">
          <p>
            <Translate contentKey="reset.request.messages.info">Enter the email address you used to register</Translate>
          </p>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FloatingValidatedField
              name="email"
              label={translate('global.form.email.label')}
              placeholder={translate('global.form.email.placeholder')}
              type="email"
              validate={{
                required: { value: true, message: translate('global.messages.validate.email.required') },
                minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
              }}
              data-cy="emailResetPassword"
            />
            <Button variant="primary" type="submit" data-cy="submit">
              <Translate contentKey="reset.request.form.button">Reset password</Translate>
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default PasswordResetInit;
