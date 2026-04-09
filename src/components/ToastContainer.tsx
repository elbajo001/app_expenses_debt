import React from 'react';
import { useToast, type ToastType } from '../contexts/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} rounded-lg shadow-lg p-4 flex items-center gap-3 animate-fade-in pointer-events-auto cursor-pointer`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="text-lg font-bold">{getIcon(toast.type)}</span>
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            className="ml-2 opacity-80 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
