export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'health'
  | 'other';

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Comida',
  transport: 'Transporte',
  utilities: 'Servicios',
  entertainment: 'Entretenimiento',
  health: 'Salud',
  other: 'Otro',
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#f97316',
  transport: '#3b82f6',
  utilities: '#8b5cf6',
  entertainment: '#ec4899',
  health: '#10b981',
  other: '#6b7280',
};

export interface Person {
  id: string;
  name: string;
  color: string;
}


export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string;
  participants: string[];
  date: string;
  createdAt: string;
  splits?: Record<string, number>;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: string;
}

export interface GroupWithUser extends Group {
  userId: string;
}

export interface Debt {
  from: string;
  to: string;
  amount: number;
}


export interface ExpenseFilters {
  category?: ExpenseCategory | 'all';
  personId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
}
