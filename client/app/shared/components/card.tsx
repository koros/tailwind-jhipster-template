import React from 'react';

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children }) => {
  const classes = ['bg-white rounded-lg shadow-md p-4', className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

export default Card;
