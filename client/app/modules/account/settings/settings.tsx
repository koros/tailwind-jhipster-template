import React, { useEffect } from 'react';
import { Translate, ValidatedField, isEmail, translate } from 'react-jhipster';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, FloatingValidatedField } from 'app/shared/components';

import { languages, locales } from 'app/config/translation';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { reset, saveAccountSettings } from './settings.reducer';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCamera } from '@fortawesome/free-solid-svg-icons';
import { ImageCropper } from 'app/shared/components/image-cropper/ImageCropper';
import { updateUserImage } from 'app/shared/reducers/authentication';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.settings.successMessage);

  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  const handleValidSubmit = values => {
    dispatch(
      saveAccountSettings({
        ...account,
        ...values,
      }),
    );
  };

  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [showCropper, setShowCropper] = React.useState(false);
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('/api/user-images', { responseType: 'blob' });
        if (response.data && response.data.size > 0) {
          const url = URL.createObjectURL(response.data);
          setProfileImageUrl(url);
          dispatch(updateUserImage(url));
        }
      } catch (e) {
        // No image found or error, keep generic placeholder
      }
    };
    fetchImage();
  }, [account.login, dispatch]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = async (croppedBlob: Blob) => {
    const optimisticUrl = URL.createObjectURL(croppedBlob);
    const previousUrl = profileImageUrl;

    // Optimistic update
    setProfileImageUrl(optimisticUrl);
    dispatch(updateUserImage(optimisticUrl));
    setShowCropper(false);

    try {
      const formData = new FormData();
      formData.append('image', croppedBlob, 'profile.jpg');
      await axios.post('/api/user-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(translate('settings.messages.success'));
    } catch (e) {
      // Revert on failure
      if (previousUrl) {
        setProfileImageUrl(previousUrl);
        dispatch(updateUserImage(previousUrl));
      } else {
        setProfileImageUrl(null);
        dispatch(updateUserImage(null));
      }
      toast.error('Failed to upload image');
    }
  };

  const onCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const methods = useForm({
    defaultValues: account,
    mode: 'onTouched',
  });
  const { handleSubmit, reset: resetForm } = methods;

  useEffect(() => {
    resetForm(account);
  }, [account, resetForm]);

  const onSubmit = values => {
    handleValidSubmit(values);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {showCropper && imageSrc && <ImageCropper imageSrc={imageSrc} onCropComplete={onCropComplete} onCancel={onCancelCrop} />}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary" id="settings-title">
          <Translate contentKey="settings.title" interpolate={{ username: account.login }}>
            User settings for {account.login}
          </Translate>
        </h2>
      </div>

      <div className="rounded-lg p-6 mb-6 flex flex-col items-center">
        <div className="relative group cursor-pointer" onClick={triggerFileInput}>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-sm relative">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-gray-400">
                <FontAwesomeIcon icon={faUser} size="4x" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <FontAwesomeIcon icon={faCamera} className="text-white opacity-0 group-hover:opacity-100 text-2xl" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-card rounded-full p-2 shadow-md border border-primary text-secondary hover:text-primary w-[35px] h-[35px] flex items-center justify-center cursor-pointer">
            <FontAwesomeIcon icon={faCamera} className="text-sm" />
          </div>
        </div>
        <p className="mt-2 text-sm text-secondary">Click to change profile image</p>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
      </div>

      <div className="bg-card shadow-md rounded-lg p-6">
        <FormProvider {...methods}>
          <form id="settings-form" onSubmit={handleSubmit(onSubmit)}>
            <FloatingValidatedField
              name="firstName"
              label={translate('settings.form.firstname')}
              id="firstName"
              validate={{
                required: { value: true, message: translate('settings.messages.validate.firstname.required') },
                minLength: { value: 1, message: translate('settings.messages.validate.firstname.minlength') },
                maxLength: { value: 50, message: translate('settings.messages.validate.firstname.maxlength') },
              }}
              data-cy="firstname"
              className="mb-4"
            />
            <FloatingValidatedField
              name="lastName"
              label={translate('settings.form.lastname')}
              id="lastName"
              validate={{
                required: { value: true, message: translate('settings.messages.validate.lastname.required') },
                minLength: { value: 1, message: translate('settings.messages.validate.lastname.minlength') },
                maxLength: { value: 50, message: translate('settings.messages.validate.lastname.maxlength') },
              }}
              data-cy="lastname"
              className="mb-4"
            />
            <FloatingValidatedField
              name="email"
              label={translate('global.form.email.label')}
              type="email"
              validate={{
                required: { value: true, message: translate('global.messages.validate.email.required') },
                minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
              }}
              data-cy="email"
              className="mb-4"
            />
            <FloatingValidatedField
              type="select"
              id="langKey"
              name="langKey"
              label={translate('settings.form.language')}
              data-cy="langKey"
              className="mb-6"
            >
              {locales.map(locale => (
                <option value={locale} key={locale}>
                  {languages[locale].flag} {languages[locale].name}
                </option>
              ))}
            </FloatingValidatedField>
            <Button variant="primary" type="submit" data-cy="submit">
              <Translate contentKey="settings.form.button">Save</Translate>
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SettingsPage;
