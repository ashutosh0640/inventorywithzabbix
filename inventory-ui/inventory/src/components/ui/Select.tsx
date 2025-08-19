import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label,
    options, 
    error, 
    helpText,
    fullWidth = false,
    className = '',
    id,
    onChange,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!error;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={`
            block w-full px-3 py-2 border ${hasError ? 'border-red-300' : 'border-gray-300'} 
            rounded-md shadow-sm 
            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
            sm:text-sm
          `}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {hasError && (
          <p className="mt-1 text-sm text-red-600" id={`${selectId}-error`}>
            {error}
          </p>
        )}
        
        {helpText && !hasError && (
          <p className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';