import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full h-12 px-4 rounded-xl border-2 border-border/60 bg-[#FAFAFA]
              focus:outline-none focus:border-primary focus:bg-white
              transition-colors duration-200 text-text-primary text-sm font-medium
              ${icon ? 'pl-11' : ''}
              ${rightElement ? 'pr-12' : ''}
              ${error ? 'border-danger focus:border-danger' : ''}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-bold text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
