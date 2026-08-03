import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, label, id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substr(2, 9);
    
    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={generatedId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <input
            id={generatedId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-50",
              icon && "pl-10",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
