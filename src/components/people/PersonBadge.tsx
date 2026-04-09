import React from 'react';
import type { Person } from '../../types';

interface PersonBadgeProps {
  person: Person;
  onRemove?: () => void;
}

export const PersonBadge: React.FC<PersonBadgeProps> = ({ person, onRemove }) => {
  const initials = person.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: person.color }}
        title={person.name}
      >
        {initials}
      </div>
      <span className="text-sm font-medium text-gray-700">{person.name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Remover"
        >
          ✕
        </button>
      )}
    </div>
  );
};
