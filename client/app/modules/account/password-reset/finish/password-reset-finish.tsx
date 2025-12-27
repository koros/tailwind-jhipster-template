import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, translate } from 'react-jhipster';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, FloatingValidatedField } from 'app/shared/components';
import { useForm, FormProvider } from 'react-hook-form';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handlePasswordResetFinish, reset } from '../password-reset.reducer';

export const PasswordResetFinishPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');

  const [password, setPassword] = useState('');

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = ({ newPassword }) => dispatch(handlePasswordResetFinish({ key, newPassword }));

  const updatePassword = event => setPassword(event.target.value);

  const methods = useForm({ mode: 'onTouched' });
  const { handleSubmit } = methods;

  const onSubmit = values => {
    handleValidSubmit(values);
  };

  const getResetForm = () => {
    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FloatingValidatedField
            name="newPassword"
            label={translate('global.form.newpassword.label')}
            placeholder={translate('global.form.newpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, message: translate('global.messages.validate.newpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
            }}
            onChange={updatePassword}
            data-cy="resetPassword"
          />
          <PasswordStrengthBar password={password} />
          <FloatingValidatedField
            name="confirmPassword"
            label={translate('global.form.confirmpassword.label')}
            placeholder={translate('global.form.confirmpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
              validate: v => v === password || translate('global.messages.error.dontmatch'),
            }}
            data-cy="confirmResetPassword"
          />
          <Button variant="success" type="submit" data-cy="submit">
            <Translate contentKey="reset.finish.form.button">Validate new password</Translate>
          </Button>
        </form>
      </FormProvider>
    );
  };

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          <Translate contentKey="reset.finish.title">Reset password</Translate>
        </h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">{key ? getResetForm() : null}</div>
    </div>
  );
};

export default PasswordResetFinishPage;
