
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`w-full bg-dark-input border border-dark-border rounded-lg py-2 px-4 text-dark-text placeholder-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 ${className}`}
      {...props}
    />
  );
};

export default Input;
