
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={`w-full bg-dark-input border border-dark-border rounded-lg py-2 px-4 text-dark-text placeholder-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 ${className}`}
      {...props}
    />
  );
};

export default Textarea;
