import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { Button, FloatingValidatedField } from 'app/shared/components';
import { useForm, FormProvider } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { reset, savePassword } from './password.reducer';

export const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  const handleValidSubmit = ({ currentPassword, newPassword }) => {
    dispatch(savePassword({ currentPassword, newPassword }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.password.successMessage);
  const errorMessage = useAppSelector(state => state.password.errorMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    } else if (errorMessage) {
      toast.error(translate(errorMessage));
    }
    dispatch(reset());
  }, [successMessage, errorMessage]);

  const methods = useForm({ mode: 'onTouched' });
  const { handleSubmit } = methods;

  const onSubmit = values => {
    handleValidSubmit(values);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary" id="password-title">
          <Translate contentKey="password.title" interpolate={{ username: account.login }}>
            Password for {account.login}
          </Translate>
        </h2>
      </div>
      <div className="bg-card shadow-md rounded-lg p-6">
        <FormProvider {...methods}>
          <form id="password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FloatingValidatedField
              name="currentPassword"
              label={translate('global.form.currentpassword.label')}
              type="password"
              validate={{
                required: { value: true, message: translate('global.messages.validate.newpassword.required') },
              }}
              data-cy="currentPassword"
            />
            <FloatingValidatedField
              name="newPassword"
              label={translate('global.form.newpassword.label')}
              type="password"
              validate={{
                required: { value: true, message: translate('global.messages.validate.newpassword.required') },
                minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
              }}
              onChange={updatePassword}
              data-cy="newPassword"
            />
            <PasswordStrengthBar password={password} />
            <FloatingValidatedField
              name="confirmPassword"
              label={translate('global.form.confirmpassword.label')}
              type="password"
              validate={{
                required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
                minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                validate: v => v === password || translate('global.messages.error.dontmatch'),
              }}
              data-cy="confirmPassword"
            />
            <Button variant="success" type="submit" data-cy="submit">
              <Translate contentKey="password.form.button">Save</Translate>
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default PasswordPage;
