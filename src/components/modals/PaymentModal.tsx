import React, { useState } from 'react';
import type { Debt, Person } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useExpenseStore } from '../../store/expenseStore';
import { formatCurrency } from '../../utils/formatting';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt | null;
  fromPerson: Person | null;
  toPerson: Person | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  debt,
  fromPerson,
  toPerson,
}) => {
  const { activeGroupId, addExpense } = useExpenseStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!debt || !fromPerson || !toPerson || !activeGroupId) return null;

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Crear un gasto de liquidación
      addExpense({
        groupId: activeGroupId,
        description: `Pago: ${fromPerson.name} → ${toPerson.name}`,
        amount: debt.amount,
        category: 'other',
        paidBy: fromPerson.id,
        participants: [fromPerson.id, toPerson.id],
        date: new Date().toISOString().split('T')[0],
        splits: {
          [toPerson.id]: debt.amount,
        },
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <div className="space-y-6 max-w-sm">
        <div>
          <p className="text-gray-600">Confirma el pago pendiente</p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: fromPerson.color }}
            >
              {fromPerson.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Paga:</p>
              <p className="font-semibold text-gray-900">{fromPerson.name}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Monto</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(debt.amount)}</p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: toPerson.color }}
            >
              {toPerson.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Recibe:</p>
              <p className="font-semibold text-gray-900">{toPerson.name}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          ⚠️ Se registrará un gasto de liquidación para mantener el historial completo. Los balances
          se recalcularán automáticamente.
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={isLoading}
            className="flex-1"
          >
            Confirmar Pago
          </Button>
        </div>
      </div>
    </Modal>
  );
};
