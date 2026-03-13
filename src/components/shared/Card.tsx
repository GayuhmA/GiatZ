import React from 'react';

type CardVariant = 'container' | 'content' | 'tinted-success' | 'tinted-warning' | 'tinted-danger' | 'tinted-info';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export default function Card({ variant = 'content', children, className = '', ...props }: CardProps) {
  const baseStyles = "transition-all duration-200";
  
  const variants = {
    container: "bg-bg-card p-4 md:p-5 rounded-3xl shadow-[var(--shadow-card)]",
    content: "bg-bg-card p-4 rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]",
    "tinted-success": "bg-success-light p-4 rounded-2xl",
    "tinted-warning": "bg-warning-light p-4 rounded-2xl",
    "tinted-danger": "bg-danger-light p-4 rounded-2xl",
    "tinted-info": "bg-secondary-light p-4 rounded-2xl"
  };

  const currentStyles = variants[variant] || variants.content;

  return (
    <div className={`${baseStyles} ${currentStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
