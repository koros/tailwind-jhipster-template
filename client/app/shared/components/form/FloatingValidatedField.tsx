import React, { useState } from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface FloatingValidatedFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  name: string;
  label: string;
  validate?: RegisterOptions;
  type?: string;
  className?: string;
}

export const FloatingValidatedField = ({
  name,
  label,
  validate,
  type = 'text',
  children,
  className,
  ...props
}: FloatingValidatedFieldProps) => {
  const { register, getFieldState, formState, watch } = useFormContext();
  const [focused, setFocused] = useState(false);

  // Watch the value to determine if the label should stay floating
  const value = watch(name);
  const { error } = getFieldState(name, formState);

  const isValueEmpty = value === undefined || value === null || value === '';
  const isFocused = focused || !isValueEmpty;

  const handleFocus = (e: React.FocusEvent<any>) => {
    setFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    setFocused(false);
    // Let react-hook-form handle its blur
    if (props.onBlur) props.onBlur(e);
  };

  // Extract register methods to wrap them if needed, or just spread them
  const registration = register(name, validate);

  const inputClass = `form-control floating-control ${error ? 'is-invalid' : ''} ${className || ''}`;
  const groupClass = `form-group floating-group ${isFocused ? 'focused' : ''}`;

  return (
    <div className={groupClass}>
      <label className="floating-label">{label}</label>

      {type === 'select' ? (
        <select
          {...registration}
          className={inputClass}
          onFocus={e => {
            handleFocus(e);
          }}
          onBlur={e => {
            registration.onBlur(e);
            handleBlur(e);
          }}
          {...props}
        >
          {children}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          {...registration}
          className={inputClass}
          onFocus={e => {
            handleFocus(e);
          }}
          onBlur={e => {
            registration.onBlur(e);
            handleBlur(e);
          }}
          {...props}
        />
      ) : (
        <input
          type={type}
          {...registration}
          className={inputClass}
          onFocus={e => {
            handleFocus(e);
          }}
          onBlur={e => {
            registration.onBlur(e);
            handleBlur(e);
          }}
          placeholder={isFocused ? props.placeholder : ''}
          {...props}
        />
      )}

      {error && <div className="invalid-feedback d-block">{error.message}</div>}
    </div>
  );
};
