import React, { useState } from 'react';
import type { Debt } from '../../types';
import { useExpenseStore } from '../../store/expenseStore';
import { calculateDebts } from '../../utils/calculations';
import { EmptyState } from '../common/EmptyState';
import { formatCurrency } from '../../utils/formatting';
import { PaymentModal } from '../modals/PaymentModal';
import { PartyPopper } from 'lucide-react';

export const DebtsView: React.FC = () => {
  const { activeGroupId, getPeopleByGroup, getExpensesByGroup } = useExpenseStore();
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  if (!activeGroupId) return null;

  const expenses = getExpensesByGroup(activeGroupId);
  const people = getPeopleByGroup(activeGroupId);

  const debts = calculateDebts(expenses);

  if (debts.length === 0) {
    return (
      <EmptyState
        title="¡Todos al día!"
        description="No hay deudas pendientes. Todos los gastos han sido liquidados."
      >
        <PartyPopper size={56} />
      </EmptyState>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Deudas pendientes</h3>

        <div className="space-y-3">
          {debts.map((debt, index) => {
            const fromPerson = people.find((p) => p.id === debt.from);
            const toPerson = people.find((p) => p.id === debt.to);

            const fromInitials = fromPerson
              ? fromPerson.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : '?';

            const toInitials = toPerson
              ? toPerson.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : '?';

            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: fromPerson?.color }}
                  >
                    {fromInitials}
                  </div>
                  <span className="font-medium text-gray-900 truncate">{fromPerson?.name}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-gray-600 font-medium text-sm">→</span>
                  <span className="text-red-600 font-bold">{formatCurrency(debt.amount)}</span>
                </div>

                <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: toPerson?.color }}
                  >
                    {toInitials}
                  </div>
                  <span className="font-medium text-gray-900 truncate">{toPerson?.name}</span>
                </div>

                <button
                  onClick={() => setSelectedDebt(debt)}
                  className="px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex-shrink-0"
                >
                  Pagar
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <PaymentModal
        isOpen={selectedDebt !== null}
        onClose={() => setSelectedDebt(null)}
        debt={selectedDebt}
        fromPerson={selectedDebt ? people.find((p) => p.id === selectedDebt.from) || null : null}
        toPerson={selectedDebt ? people.find((p) => p.id === selectedDebt.to) || null : null}
      />
    </>
  );
};
