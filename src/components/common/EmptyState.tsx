import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="
            px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white
            rounded-lg font-medium transition-colors duration-200
          "
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
