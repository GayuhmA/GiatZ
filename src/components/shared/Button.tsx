import React, { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'link' | 'social';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, className = '', fullWidth = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all rounded-full focus:outline-none";
    
    // Add opacity and cursor for disabled state
    const blockStyles = disabled ? "opacity-70 cursor-not-allowed" : "";

    // Width
    const widthStyles = fullWidth ? "w-full" : "";

    // Base interaction for 3D buttons (Primary, Secondary, Danger)
    const button3DStyles = disabled ? "" : "mb-1 hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all";
    
    // Size variations
    const sizes = {
      sm: "py-2 px-4 text-xs uppercase tracking-widest",
      md: "py-3.5 px-6 text-[15px] uppercase tracking-wide",
      lg: "py-4 px-8 text-base uppercase tracking-wide"
    };

    // Variant variations
    const variants = {
      primary: `bg-primary text-white shadow-[0_4px_0_0_var(--color-primary-dark)] hover:shadow-[0_2px_0_0_var(--color-primary-dark)] ${button3DStyles}`,
      secondary: `bg-secondary text-white shadow-[0_4px_0_0_var(--color-secondary-dark)] hover:shadow-[0_2px_0_0_var(--color-secondary-dark)] ${button3DStyles}`,
      danger: `bg-danger text-white shadow-[0_4px_0_0_var(--color-danger-dark)] hover:shadow-[0_2px_0_0_var(--color-danger-dark)] ${button3DStyles}`,
      ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-gray-100 uppercase tracking-widest text-sm",
      outline: "bg-transparent text-text-primary border-2 border-border/60 hover:border-gray-300 hover:bg-gray-50 uppercase tracking-widest text-sm",
      link: "bg-transparent text-secondary hover:opacity-80 p-0 hover:underline uppercase tracking-wide text-sm",
      social: "bg-transparent text-text-primary border-2 border-border/60 hover:border-gray-300 hover:bg-gray-50 text-sm font-bold tracking-normal"
    };

    const currentSize = variant === 'social' || variant === 'link' || variant === 'ghost' || variant === 'outline' 
        ? (variant === 'social' ? 'py-3 px-6' : (variant === 'link' ? '' : 'py-3 px-6')) 
        : sizes[size];
        
    const currentVariant = variants[variant] || variants.primary;

    return (
      <button 
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${currentSize} ${currentVariant} ${widthStyles} ${blockStyles} ${className}`}
        {...props}
      >
        {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
