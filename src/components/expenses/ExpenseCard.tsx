import React from 'react';
import type { Expense, Person } from '../../types';
import { CATEGORY_LABELS } from '../../types';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate, truncate } from '../../utils/formatting';
import { CATEGORY_COLORS } from '../../types';

interface ExpenseCardProps {
  expense: Expense;
  people: Person[];
  onEdit: () => void;
  onDelete: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  people,
  onEdit,
  onDelete,
}) => {
  const paidByPerson = people.find((p) => p.id === expense.paidBy);
  const participantPeople = people.filter((p) => expense.participants.includes(p.id));

  const paidByInitials = paidByPerson
    ? paidByPerson.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{truncate(expense.description, 40)}</h4>
          <p className="text-xs text-gray-600 mt-1">{formatDate(expense.date)}</p>
        </div>
        <Badge
          label={CATEGORY_LABELS[expense.category]}
          color={CATEGORY_COLORS[expense.category]}
          size="sm"
        />
      </div>

      <p className="text-2xl font-bold text-indigo-600 mb-3">
        {formatCurrency(expense.amount)}
      </p>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Pagó:</span>
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: paidByPerson?.color }}
          >
            {paidByInitials}
          </div>
          <span className="text-sm text-gray-700">{paidByPerson?.name}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600">Participantes:</span>
          {participantPeople.map((person) => {
            const initials = person.name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            return (
              <div
                key={person.id}
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: person.color }}
                title={person.name}
              >
                {initials}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
