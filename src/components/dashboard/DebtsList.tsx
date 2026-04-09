import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatting';

interface Debt {
  from: string;
  to: string;
  amount: number;
}

interface Person {
  id: string;
  name: string;
  color: string;
}

interface DebtsListProps {
  debts: Debt[];
  people: Person[];
}

export const DebtsList: React.FC<DebtsListProps> = ({ debts, people }) => {
  if (debts.length === 0) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Deudas Recientes</h3>
      <div className="space-y-2">
        {debts.slice(0, 3).map((debt, idx) => {
          const fromPerson = people.find((p) => p.id === debt.from);
          const toPerson = people.find((p) => p.id === debt.to);

          return (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: fromPerson?.color }}
                >
                  {fromPerson?.name[0]}
                </div>
                <span className="text-sm font-medium text-gray-900">{fromPerson?.name}</span>
                <span className="text-xs text-gray-500">debe</span>
              </div>
              <span className="font-semibold text-red-600 text-sm">{formatCurrency(debt.amount)}</span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-xs text-gray-500">a</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: toPerson?.color }}
                >
                  {toPerson?.name[0]}
                </div>
                <span className="text-sm font-medium text-gray-900">{toPerson?.name}</span>
              </div>
            </div>
          );
        })}
        {debts.length > 3 && (
          <div className="text-center pt-2">
            <a href="#debts" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Ver todas las deudas ({debts.length})
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
