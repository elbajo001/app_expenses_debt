import type { Expense, Debt, Person, ExpenseCategory } from '../types';
import { CATEGORY_LABELS } from '../types';
import { typedEntries } from './helpers';

export function calculateDebts(expenses: Expense[]): Debt[] {
  const balances: Record<string, number> = {};

  expenses.forEach((expense) => {
    if (!balances[expense.paidBy]) {
      balances[expense.paidBy] = 0;
    }

    balances[expense.paidBy] += expense.amount;

    const splitAmount = expense.splits
      ? Object.values(expense.splits).reduce((a, b) => a + b, 0) / expense.participants.length
      : expense.amount / expense.participants.length;

    expense.participants.forEach((participantId) => {
      if (!balances[participantId]) {
        balances[participantId] = 0;
      }
      const amount = expense.splits ? (expense.splits[participantId] || splitAmount) : splitAmount;
      balances[participantId] -= amount;
    });
  });

  const debts: Debt[] = [];
  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < 0)
    .sort((a, b) => a[1] - b[1]);

  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0)
    .sort((a, b) => b[1] - a[1]);

  let debtorIdx = 0;
  let creditorIdx = 0;

  while (debtorIdx < debtors.length && creditorIdx < creditors.length) {
    const [debtorId, debtAmount] = debtors[debtorIdx];
    const [creditorId, creditAmount] = creditors[creditorIdx];

    const settlementAmount = Math.min(Math.abs(debtAmount), creditAmount);

    if (settlementAmount > 0.01) {
      debts.push({
        from: debtorId,
        to: creditorId,
        amount: Math.round(settlementAmount * 100) / 100,
      });
    }

    debtors[debtorIdx][1] += settlementAmount;
    creditors[creditorIdx][1] -= settlementAmount;

    if (Math.abs(debtors[debtorIdx][1]) < 0.01) {
      debtorIdx++;
    }
    if (creditors[creditorIdx][1] < 0.01) {
      creditorIdx++;
    }
  }

  return debts;
}

export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function calculateSpentByPerson(
  expenses: Expense[],
  people: Person[]
): Array<{ person: Person; amount: number }> {
  const spentMap: Record<string, number> = {};

  expenses.forEach((expense) => {
    spentMap[expense.paidBy] = (spentMap[expense.paidBy] || 0) + expense.amount;
  });

  return people
    .map((person) => ({
      person,
      amount: spentMap[person.id] || 0,
    }))
    .filter(({ amount }) => amount > 0);
}

export function calculateByCategory(
  expenses: Expense[]
): Array<{ category: ExpenseCategory; amount: number; label: string }> {
  const byCategory: Record<ExpenseCategory, number> = {
    food: 0,
    transport: 0,
    utilities: 0,
    entertainment: 0,
    health: 0,
    other: 0,
  };

  expenses.forEach((expense) => {
    byCategory[expense.category] += expense.amount;
  });

  return typedEntries(byCategory)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      category,
      amount,
      label: CATEGORY_LABELS[category],
    }));
}
