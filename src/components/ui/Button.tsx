import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Button({ variant = 'primary', children, icon, className = '', ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide transition-all";
  
  const variants = {
    primary: "bg-primary text-white py-2.5 px-6 rounded-full border-b-4 border-primary-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0",
    secondary: "bg-secondary text-white py-2.5 px-6 rounded-full border-b-4 border-secondary-dark hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-gray-100 py-2.5 px-6 rounded-full",
    link: "bg-transparent text-secondary hover:opacity-80 p-0 hover:underline"
  };

  const currentStyles = variants[variant] || variants.primary;

  return (
    <button 
      className={`${baseStyles} ${currentStyles} ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
}
