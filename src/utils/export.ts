import type { Expense, Person } from '../types';
import { CATEGORY_LABELS } from '../types';
import { formatDate } from './formatting';

export function exportExpensesToCSV(
  expenses: Expense[],
  people: Person[],
  groupName: string
): void {
  const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto', 'Pagado por', 'Participantes'];
  const rows = expenses.map((expense) => {
    const paidByPerson = people.find((p) => p.id === expense.paidBy);
    const participants = expense.participants
      .map((id) => people.find((p) => p.id === id)?.name || id)
      .join('; ');

    return [
      formatDate(expense.date),
      expense.description,
      CATEGORY_LABELS[expense.category],
      expense.amount,
      paidByPerson?.name || expense.paidBy,
      participants,
    ];
  });

  const csvContent = [
    `Gastos del grupo: ${groupName}`,
    `Fecha de exportación: ${formatDate(new Date().toISOString().split('T')[0])}`,
    '',
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell);
          return cellStr.includes(',') || cellStr.includes('"') ? `"${cellStr.replace(/"/g, '""')}"` : cellStr;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `gastos-${groupName}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
