import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { calculateDebts, calculateByCategory, calculateSpentByPerson } from '../../utils/calculations';
import { CATEGORY_COLORS } from '../../types';
import { SummaryCards } from './SummaryCards';
import { CategoryChart } from './CategoryChart';
import { PersonChart } from './PersonChart';
import { DebtsList } from './DebtsList';
import { GroupInfo } from './GroupInfo';

export const DashboardView: React.FC = () => {
  const { activeGroupId, getGroupById, getPeopleByGroup, getExpensesByGroup } = useExpenseStore();

  if (!activeGroupId) return null;

  const group = getGroupById(activeGroupId);
  const people = getPeopleByGroup(activeGroupId);
  const expenses = getExpensesByGroup(activeGroupId);

  // Cálculos
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const debts = calculateDebts(expenses);
  const pendingDebts = debts.reduce((sum, d) => sum + d.amount, 0);

  const categoryData = calculateByCategory(expenses);
  const personData = calculateSpentByPerson(expenses, people);

  const chartColors = categoryData.map((cat) => CATEGORY_COLORS[cat.category]);

  const personChartData = personData.map((pd) => ({
    name: pd.person.name,
    amount: pd.amount,
    color: pd.person.color,
  }));

  return (
    <div className="space-y-8">
      <SummaryCards
        totalSpent={totalSpent}
        expensesCount={expenses.length}
        thisMonthTotal={thisMonthTotal}
        thisMonthExpensesCount={thisMonthExpenses.length}
        pendingDebts={pendingDebts}
        debtsCount={debts.length}
        peopleCount={people.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={categoryData} colors={chartColors} />
        <PersonChart data={personChartData} />
      </div>

      <DebtsList debts={debts} people={people} />

      {group && <GroupInfo group={group} expensesCount={expenses.length} peopleCount={people.length} />}
    </div>
  );
};
