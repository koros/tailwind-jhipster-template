import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Translate, isEmail, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, FloatingValidatedField, FloatingMultiSelect } from 'app/shared/components';
import { useForm, FormProvider } from 'react-hook-form';

import { languages, locales } from 'app/config/translation';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer';

export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { login } = useParams<'login'>();
  const isNew = login === undefined;

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getUser(login));
    }
    dispatch(getRoles());
    return () => {
      dispatch(reset());
    };
  }, [login]);

  const handleClose = () => {
    navigate('/admin/user-management');
  };

  const saveUser = values => {
    // Whitelist fields to avoid sending relational data like `userImage`
    const sanitized = {
      id: values.id ?? user.id,
      login: values.login,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      activated: values.activated ?? user.activated,
      langKey: values.langKey,
      authorities: values.authorities,
      // imageUrl and any nested userImage are intentionally omitted
    };

    if (isNew) {
      dispatch(createUser(sanitized));
    } else {
      dispatch(updateUser(sanitized));
    }
  };

  const isInvalid = false;
  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);
  const updateSuccess = useAppSelector(state => state.userManagement.updateSuccess);

  const authorityOptions = authorities.map(role => ({ value: role, label: role }));

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
      toast.success(translate(isNew ? 'userManagement.created' : 'userManagement.updated', { param: user.login }));
    }
  }, [updateSuccess]);

  const methods = useForm({
    defaultValues: user,
    mode: 'onTouched',
  });
  const { handleSubmit, reset: resetForm } = methods;

  useEffect(() => {
    resetForm(user);
  }, [user, resetForm]);

  const onSubmit = values => {
    saveUser(values);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
        </h1>
      </div>
      <div className="bg-card shadow-md rounded-lg p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {user.id ? (
                <FloatingValidatedField
                  type="text"
                  name="id"
                  required
                  readOnly
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <FloatingValidatedField
                type="text"
                name="login"
                label={translate('userManagement.login')}
                validate={{
                  required: {
                    value: true,
                    message: translate('register.messages.validate.login.required'),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                    message: translate('register.messages.validate.login.pattern'),
                  },
                  minLength: {
                    value: 1,
                    message: translate('register.messages.validate.login.minlength'),
                  },
                  maxLength: {
                    value: 50,
                    message: translate('register.messages.validate.login.maxlength'),
                  },
                }}
              />
              <FloatingValidatedField
                type="text"
                name="firstName"
                label={translate('userManagement.firstName')}
                validate={{
                  maxLength: {
                    value: 50,
                    message: translate('entity.validation.maxlength', { max: 50 }),
                  },
                }}
              />
              <FloatingValidatedField
                type="text"
                name="lastName"
                label={translate('userManagement.lastName')}
                validate={{
                  maxLength: {
                    value: 50,
                    message: translate('entity.validation.maxlength', { max: 50 }),
                  },
                }}
              />
              <FloatingValidatedField
                name="email"
                label={translate('global.form.email.label')}
                type="email"
                validate={{
                  required: {
                    value: true,
                    message: translate('global.messages.validate.email.required'),
                  },
                  minLength: {
                    value: 5,
                    message: translate('global.messages.validate.email.minlength'),
                  },
                  maxLength: {
                    value: 254,
                    message: translate('global.messages.validate.email.maxlength'),
                  },
                  validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
                }}
              />
              <div className="form-check mb-4">
                <label className="form-check-label cursor-pointer flex items-center gap-2">
                  <input
                    className="form-check-input h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    type="checkbox"
                    name="activated"
                    disabled={!user.id}
                    {...methods.register('activated')}
                  />
                  {translate('userManagement.activated')}
                </label>
              </div>
              <FloatingValidatedField type="select" name="langKey" label={translate('userManagement.langKey')}>
                {locales.map(locale => (
                  <option value={locale} key={locale}>
                    {languages[locale].flag} {languages[locale].name}
                  </option>
                ))}
              </FloatingValidatedField>
              <FloatingMultiSelect name="authorities" label={translate('userManagement.profiles')} options={authorityOptions} />
              <Button tag={Link} to="/admin/user-management" replace variant="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="hidden md:inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button variant="primary" type="submit" disabled={isInvalid || updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
};

export default UserManagementUpdate;
