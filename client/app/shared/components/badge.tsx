import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'light' | 'dark';

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-600 text-white',
  info: 'bg-cyan-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  danger: 'bg-red-600 text-white',
  light: 'bg-gray-100 text-gray-900',
  dark: 'bg-gray-800 text-white',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', className = '', children }) => {
  const classes = ['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
};

export default Badge;
