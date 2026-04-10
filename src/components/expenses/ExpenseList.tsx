import React from 'react';
import type { Expense, Person } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { ExpenseCard } from './ExpenseCard';
import { Banknote } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  people,
  onEdit,
  onDelete,
}) => {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="Sin gastos"
        description="No hay gastos registrados. Crea uno para comenzar."
      >
        <Banknote size={56} />
      </EmptyState>
    );
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedExpenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          people={people}
          onEdit={() => onEdit(expense)}
          onDelete={() => onDelete(expense.id)}
        />
      ))}
    </div>
  );
};
