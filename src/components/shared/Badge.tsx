import React from 'react';

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', size = 'sm', children, icon, className = '' }: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wide rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-text-primary",
    success: "bg-success text-white",
    danger: "bg-danger text-white",
    warning: "bg-warning text-white",
    info: "bg-secondary text-white",
    outline: "border-2 border-border text-text-primary"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] md:text-xs gap-1",
    md: "px-3 py-1 text-xs md:text-sm gap-1.5",
    lg: "px-4 py-1.5 text-sm md:text-base gap-2"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
