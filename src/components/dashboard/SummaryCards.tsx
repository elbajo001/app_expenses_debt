import React from 'react';
import { Card } from '../common/Card';

interface SummaryCardsProps {
  totalSpent: number;
  thisMonthTotal: number;
  thisMonthExpensesCount: number;
  expensesCount: number;
  pendingDebts: number;
  debtsCount: number;
  peopleCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSpent,
  thisMonthTotal,
  thisMonthExpensesCount,
  expensesCount,
  pendingDebts,
  debtsCount,
  peopleCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">Total gastado</p>
          <p className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">{expensesCount} gastos</p>
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">Este mes</p>
          <p className="text-3xl font-bold text-indigo-600">${thisMonthTotal.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">{thisMonthExpensesCount} gastos</p>
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">Deudas pendientes</p>
          <p className="text-3xl font-bold text-red-600">${pendingDebts.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">{debtsCount} deudas activas</p>
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">Miembros</p>
          <p className="text-3xl font-bold text-green-600">{peopleCount}</p>
          <p className="text-xs text-gray-500 mt-1">En el grupo</p>
        </div>
      </Card>
    </div>
  );
};
