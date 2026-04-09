import React, { useState } from 'react';
import type { Expense, ExpenseCategory } from '../../types';
import { CATEGORY_LABELS } from '../../types';
import { useExpenseStore } from '../../store/expenseStore';
import { validateExpense } from '../../utils/validation';
import { Button } from '../common/Button';

interface ExpenseFormProps {
  groupId: string;
  initialData?: Expense;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  groupId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { getPeopleByGroup, addExpense, updateExpense } = useExpenseStore();
  const people = getPeopleByGroup(groupId);

  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<ExpenseCategory>(initialData?.category || 'food');
  const [paidBy, setPaidBy] = useState(initialData?.paidBy || people[0]?.id || '');
  const [participants, setParticipants] = useState<string[]>(
    initialData?.participants || people.map((p) => p.id)
  );
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validateExpense({
      description,
      amount: Number(amount),
      paidBy,
      participants,
      date,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const numAmount = Number(amount);

      if (initialData) {
        // Actualizar gasto existente
        updateExpense(initialData.id, {
          description,
          amount: numAmount,
          category,
          paidBy,
          participants,
          date,
        });
      } else {
        // Crear nuevo gasto
        addExpense({
          groupId,
          description,
          amount: numAmount,
          category,
          paidBy,
          participants,
          date,
        });
      }

      onSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleParticipant = (personId: string) => {
    setParticipants((prev) =>
      prev.includes(personId) ? prev.filter((p) => p !== personId) : [...prev, personId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((error, i) => (
            <p key={i} className="text-red-700 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors([]);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ej: Cena con amigos"
          maxLength={100}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors([]);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pagó</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Participantes</label>
        <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
          {people.map((person) => (
            <label key={person.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={participants.includes(person.id)}
                onChange={() => toggleParticipant(person.id)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{person.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de división</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={splitType === 'equal'}
              onChange={() => setSplitType('equal')}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Partes iguales</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={splitType === 'custom'}
              onChange={() => setSplitType('custom')}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Personalizado</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          {initialData ? 'Actualizar' : 'Guardar gasto'}
        </Button>
      </div>
    </form>
  );
};
