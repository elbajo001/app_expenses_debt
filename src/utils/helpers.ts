// src/utils/helpers.ts

// src/utils/helpers.ts
import type { Expense, Person, ExpenseCategory } from '../types';

/**
 * FORMATEO
 */

export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
};

/**
 * VALIDACIÓN
 */

export const validateExpenseName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'El nombre del gasto es requerido' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'El nombre no puede exceder 100 caracteres' };
  }
  return { valid: true };
};

export const validateAmount = (amount: unknown): { valid: boolean; error?: string } => {
  const num = parseFloat(amount as string);
  if (isNaN(num)) {
    return { valid: false, error: 'El monto debe ser un número válido' };
  }
  if (num <= 0) {
    return { valid: false, error: 'El monto debe ser mayor a 0' };
  }
  if (num > 999999999) {
    return { valid: false, error: 'El monto es demasiado grande' };
  }
  return { valid: true };
};

export const validatePersonName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'El nombre de la persona es requerido' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'El nombre no puede exceder 50 caracteres' };
  }
  return { valid: true };
};

export const validateGroupName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'El nombre del grupo es requerido' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'El nombre no puede exceder 50 caracteres' };
  }
  return { valid: true };
};

/**
 * GENERACIÓN DE IDs Y COLORES
 */

export const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA502', // Orange
    '#FF69B4', // Pink
    '#95E1D3', // Mint
    '#9B59B6', // Purple
    '#3498DB', // Sky Blue
    '#E74C3C', // Crimson
    '#1ABC9C', // Turquoise
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * CÁLCULOS
 */

export const calculatePerPersonAmount = (total: number, participants: number): number => {
  return Math.round((total / participants) * 100) / 100;
};

export const calculateTotalSpent = (expenses: Expense[]): number => {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

export const calculateSpentByCategory = (
  expenses: Expense[]
): Record<ExpenseCategory, number> => {
  const result: Record<string, number> = {};

  expenses.forEach((expense) => {
    result[expense.category] = (result[expense.category] || 0) + expense.amount;
  });

  return result as Record<ExpenseCategory, number>;
};

export const calculateSpentByPerson = (expenses: Expense[]): Record<string, number> => {
  const result: Record<string, number> = {};

  expenses.forEach((expense) => {
    result[expense.paidBy] = (result[expense.paidBy] || 0) + expense.amount;
  });

  return result;
};

export const calculateParticipationByPerson = (
  expenses: Expense[]
): Record<string, number> => {
  const result: Record<string, number> = {};

  expenses.forEach((expense) => {
    const perPerson = expense.amount / expense.participants.length;
    expense.participants.forEach((personId) => {
      result[personId] = (result[personId] || 0) + perPerson;
    });
  });

  return result;
};

/**
 * BÚSQUEDA Y FILTRADO
 */

export const searchExpenses = (
  expenses: Expense[],
  query: string
): Expense[] => {
  const lowerQuery = query.toLowerCase();
  return expenses.filter(
    (exp) =>
      exp.description.toLowerCase().includes(lowerQuery)
  );
};

export const filterExpensesByDateRange = (
  expenses: Expense[],
  startDate: string,
  endDate: string
): Expense[] => {
  return expenses.filter((exp) => exp.date >= startDate && exp.date <= endDate);
};

export const filterExpensesByCategory = (
  expenses: Expense[],
  category: ExpenseCategory
): Expense[] => {
  return expenses.filter((exp) => exp.category === category);
};

export const filterExpensesByPerson = (
  expenses: Expense[],
  personId: string
): Expense[] => {
  return expenses.filter(
    (exp) => exp.paidBy === personId || exp.participants.includes(personId)
  );
};

/**
 * SORTING
 */

export const sortExpensesByDate = (
  expenses: Expense[],
  order: 'asc' | 'desc' = 'desc'
): Expense[] => {
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

export const sortExpensesByAmount = (
  expenses: Expense[],
  order: 'asc' | 'desc' = 'desc'
): Expense[] => {
  return [...expenses].sort((a, b) =>
    order === 'asc' ? a.amount - b.amount : b.amount - a.amount
  );
};

/**
 * EXPORTACIÓN
 */

export const generateCSV = (
  expenses: Expense[],
  people: Person[]
): string => {
  const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto', 'Pagó', 'Participantes'];
  const rows = expenses.map((exp) => {
    const payer = people.find((p) => p.id === exp.paidBy)?.name || 'N/A';
    const participants = exp.participants
      .map((pId) => people.find((p) => p.id === pId)?.name)
      .join(', ');

    return [
      exp.date,
      exp.description,
      exp.category,
      exp.amount,
      payer,
      participants,
    ];
  });

  const csvContent = [
    headers,
    ...rows.map((row) =>
      row.map((cell) => `"${cell}"`).join(',')
    ),
  ]
    .map((row) => Array.isArray(row) ? row.join(',') : row)
    .join('\n');

  return csvContent;
};

export const downloadCSV = (csv: string, filename: string = 'gastos.csv') => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const typedEntries = <T extends Record<string, unknown>>(
  obj: T
): Array<[keyof T, T[keyof T]]> =>
  Object.entries(obj) as Array<[keyof T, T[keyof T]]>;