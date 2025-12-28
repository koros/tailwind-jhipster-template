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
  const [showPassword, setShowPassword] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);

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

  const togglePasswordVisibility = () => {
    setRippleActive(true);
    setTimeout(() => {
      setRippleActive(false);
    }, 500);
    setShowPassword(!showPassword);
  };

  // Extract register methods to wrap them if needed, or just spread them
  const registration = register(name, validate);

  const inputClass = `form-control floating-control ${error ? 'is-invalid' : ''} ${className || ''}`;
  const groupClass = `form-group floating-group ${isFocused ? 'focused' : ''}`;

  // Determine input type allowing for password visibility toggle
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={groupClass} style={{ position: 'relative' }}>
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
        <>
          <input
            type={inputType}
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
          {type === 'password' && (
            <span className={`passwrd-svgs ${rippleActive ? 'ripple-active' : ''}`} onClick={togglePasswordVisibility}>
              {!showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="passwrd-close-svg" viewBox="0 0 24 24" style={{ display: 'block' }}>
                  <path
                    fill="var(--color-textSecondary)"
                    fillRule="evenodd"
                    d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="passwrd-open-svg" viewBox="0 0 24 24" style={{ display: 'block' }}>
                  <path fill="var(--color-textSecondary)" d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"></path>
                  <path
                    fill="var(--color-textSecondary)"
                    fillRule="evenodd"
                    d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </span>
          )}
        </>
      )}

      {error && <div className="invalid-feedback d-block">{error.message}</div>}
    </div>
  );
};
