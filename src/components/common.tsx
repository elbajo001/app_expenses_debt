// src/components/common/index.tsx

import React from 'react';

/**
 * BUTTON COMPONENT
 */
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

    const variantStyles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-200',
      danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400',
      success: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        {...props}
      >
        {isLoading && <span className="animate-spin">⟳</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

/**
 * CARD COMPONENT
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: 'default' | 'highlight' | 'subtle';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, variant = 'default', className = '', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border border-gray-200',
      highlight: 'bg-blue-50 border border-blue-200',
      subtle: 'bg-gray-50 border border-gray-100',
    };

    return (
      <div
        ref={ref}
        className={`
          ${variantStyles[variant]}
          rounded-lg shadow-sm p-4
          ${hoverable ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

/**
 * BADGE COMPONENT
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className = '', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-gray-200 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center rounded-full font-medium
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

/**
 * MODAL COMPONENT
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeButton = true,
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={`
          bg-white rounded-lg shadow-xl
          ${sizeStyles[size]}
          w-full mx-4
          max-h-[90vh] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
          {closeButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

/**
 * INPUT COMPONENT
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg
            placeholder-gray-400 text-gray-900
            transition-colors duration-200
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/**
 * SELECT COMPONENT
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg
            placeholder-gray-400 text-gray-900 bg-white
            transition-colors duration-200
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

/**
 * TEXTAREA COMPONENT
 */
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg
            placeholder-gray-400 text-gray-900 bg-white
            transition-colors duration-200
            resize-vertical
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

/**
 * LOADING SPINNER COMPONENT
 */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeStyles[size]} animate-spin`}>
      <svg
        className="w-full h-full text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

/**
 * ALERT COMPONENT
 */
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
}) => {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <p className="text-sm">{children}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg leading-none opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
