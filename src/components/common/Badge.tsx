import React from 'react';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, color = '#6b7280', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        text-white ${sizeClasses[size]}
      `}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
};
