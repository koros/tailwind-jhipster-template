import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'light' | 'dark' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tag?: React.ElementType;
  to?: string;
  replace?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
  info: 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-600',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
  light: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300',
  dark: 'bg-gray-800 hover:bg-gray-900 text-white border-gray-800',
  link: 'bg-transparent hover:underline text-blue-600 border-transparent p-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  tag: Tag = 'button',
  to,
  replace,
  children,
  ...props
}) => {
  const baseClasses =
    variant === 'link'
      ? 'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none'
      : 'inline-flex items-center justify-center font-medium rounded border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = [baseClasses, variantClasses[variant], variant !== 'link' ? sizeClasses[size] : '', disabledClasses, className]
    .filter(Boolean)
    .join(' ');

  // Build tag props, only passing valid props for the tag type
  const tagProps: any = {
    className: classes,
    ...props,
  };

  // Add button-specific props only if Tag is 'button'
  if (Tag === 'button') {
    tagProps.disabled = disabled;
  }

  // Add link-specific props if Tag is a Link component
  if (to !== undefined) {
    tagProps.to = to;
    if (replace !== undefined) {
      tagProps.replace = replace;
    }
  }

  return <Tag {...tagProps}>{children}</Tag>;
};

export default Button;
