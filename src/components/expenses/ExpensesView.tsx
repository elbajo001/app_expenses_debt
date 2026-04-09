import React, { useState, useMemo } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { useToast } from '../../contexts/ToastContext';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { ExpenseFilters } from './ExpenseFilters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportExpensesToCSV } from '../../utils/export';

export const ExpensesView: React.FC = () => {
  const {
    activeGroupId,
    getGroupById,
    getPeopleByGroup,
    getExpensesByGroup,
    deleteExpense,
  } = useExpenseStore();
  const { addToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; expenseId?: string }>({
    open: false,
  });
  const [filters, setFilters] = useState<{
    search: string;
    category: 'food' | 'transport' | 'utilities' | 'entertainment' | 'health' | 'other' | 'all';
    personId: string | 'all';
    dateFrom: string;
    dateTo: string;
  }>({
    search: '',
    category: 'all',
    personId: 'all',
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  });

  if (!activeGroupId) return null;

  const group = getGroupById(activeGroupId);
  const people = getPeopleByGroup(activeGroupId);
  const allExpenses = getExpensesByGroup(activeGroupId);

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((expense) => {
      if (filters.search && !expense.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.category !== 'all' && expense.category !== filters.category) {
        return false;
      }
      if (
        filters.personId !== 'all' &&
        !expense.participants.includes(filters.personId) &&
        expense.paidBy !== filters.personId
      ) {
        return false;
      }
      if (expense.date < filters.dateFrom || expense.date > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [allExpenses, filters]);

  const handleAddExpense = () => {
    setShowForm(false);
    setEditingExpense(null);
    addToast('Gasto guardado correctamente', 'success');
  };

  const handleExportCSV = () => {
    if (group) {
      exportExpensesToCSV(filteredExpenses, people, group.name);
      addToast(`Exportación completada: ${filteredExpenses.length} gastos`, 'success');
    }
  };

  const confirmDeleteExpense = () => {
    if (confirmDelete.expenseId) {
      deleteExpense(confirmDelete.expenseId);
      setConfirmDelete({ open: false });
      addToast('Gasto eliminado correctamente', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Gastos registrados</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            size="md"
          >
            📥 Exportar CSV
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            size="md"
          >
            + Nuevo Gasto
          </Button>
        </div>
      </div>

      <ExpenseFilters people={people} onFiltersChange={setFilters} />

      <ExpenseList
        expenses={filteredExpenses}
        people={people}
        onEdit={(expense) => {
          setEditingExpense(expense.id);
          setShowForm(true);
        }}
        onDelete={(expenseId) => setConfirmDelete({ open: true, expenseId })}
      />

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Editar gasto' : 'Nuevo gasto'}
        size="lg"
      >
        <ExpenseForm
          groupId={activeGroupId}
          onSubmit={() => {
            handleAddExpense();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false })}
        onConfirm={confirmDeleteExpense}
        title="Eliminar gasto"
        message="¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
};
