import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, ValidatedForm, isEmail, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'app/shared/components';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const handleValidSubmit = ({ username, email, firstName, lastName, firstPassword }) => {
    dispatch(handleRegister({ login: username, email, firstName, lastName, password: firstPassword, langKey: currentLocale }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const successMessage = useAppSelector(state => state.register.successMessage);
  const loading = useAppSelector(state => state.register.loading);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
      navigate('/');
    }
  }, [successMessage, navigate]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900" id="register-title" data-cy="registerTitle">
          <Translate contentKey="register.title">Registration</Translate>
        </h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <ValidatedForm id="register-form" onSubmit={handleValidSubmit}>
          <ValidatedField
            name="username"
            label={translate('global.form.username.label')}
            placeholder={translate('global.form.username.placeholder')}
            validate={{
              required: { value: true, message: translate('register.messages.validate.login.required') },
              pattern: {
                value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                message: translate('register.messages.validate.login.pattern'),
              },
              minLength: { value: 1, message: translate('register.messages.validate.login.minlength') },
              maxLength: { value: 50, message: translate('register.messages.validate.login.maxlength') },
            }}
            data-cy="username"
          />
          <ValidatedField
            name="firstName"
            label={translate('settings.form.firstname')}
            placeholder={translate('settings.form.firstname.placeholder')}
            validate={{
              required: { value: true, message: translate('settings.messages.validate.firstname.required') },
              minLength: { value: 1, message: translate('settings.messages.validate.firstname.minlength') },
              maxLength: { value: 50, message: translate('settings.messages.validate.firstname.maxlength') },
            }}
            data-cy="firstName"
          />
          <ValidatedField
            name="lastName"
            label={translate('settings.form.lastname')}
            placeholder={translate('settings.form.lastname.placeholder')}
            validate={{
              required: { value: true, message: translate('settings.messages.validate.lastname.required') },
              minLength: { value: 1, message: translate('settings.messages.validate.lastname.minlength') },
              maxLength: { value: 50, message: translate('settings.messages.validate.lastname.maxlength') },
            }}
            data-cy="lastName"
          />
          <ValidatedField
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
            data-cy="email"
          />
          <ValidatedField
            name="firstPassword"
            label={translate('global.form.newpassword.label')}
            placeholder={translate('global.form.newpassword.placeholder')}
            type="password"
            onChange={updatePassword}
            validate={{
              required: { value: true, message: translate('global.messages.validate.newpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
            }}
            data-cy="firstPassword"
          />
          <PasswordStrengthBar password={password} />
          <ValidatedField
            name="secondPassword"
            label={translate('global.form.confirmpassword.label')}
            placeholder={translate('global.form.confirmpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
              validate: v => v === password || translate('global.messages.error.dontmatch'),
            }}
            data-cy="secondPassword"
          />
          <Button id="register-submit" className="mt-4" variant="primary" type="submit" data-cy="submit" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <Translate contentKey="register.form.button">Register</Translate>
              </span>
            ) : (
              <Translate contentKey="register.form.button">Register</Translate>
            )}
          </Button>
        </ValidatedForm>
        <p>&nbsp;</p>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <span>
            <Translate contentKey="global.messages.info.authenticated.prefix">If you want to</Translate>{' '}
          </span>
          <Link to="/login" className="text-yellow-700 underline hover:text-yellow-800">
            <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
          </Link>
          <span>
            <Translate contentKey="global.messages.info.authenticated.suffix">
              , you can try the default accounts:
              <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
              <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
            </Translate>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
