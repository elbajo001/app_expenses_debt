import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';

type ViewType = 'dashboard' | 'expenses' | 'people' | 'debts';

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const VIEW_ICONS: Record<ViewType, string> = {
  dashboard: '📊',
  expenses: '💸',
  people: '👥',
  debts: '💳',
};

const VIEW_LABELS: Record<ViewType, string> = {
  dashboard: 'Dashboard',
  expenses: 'Gastos',
  people: 'Personas',
  debts: 'Deudas',
};

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const { activeGroupId, getGroupById, getPeopleByGroup } = useExpenseStore();
  const group = activeGroupId ? getGroupById(activeGroupId) : null;
  const members = group ? getPeopleByGroup(group.id) : [];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{group?.name}</h2>
            <p className="text-sm text-gray-600">{members.length} miembros</p>
          </div>
        </div>

        <nav className="flex gap-2 border-t border-gray-200 pt-4 -mx-6 px-6">
          {Object.entries(VIEW_LABELS).map(([view, label]) => (
            <button
              key={view}
              onClick={() => onViewChange(view as ViewType)}
              className={`
                flex items-center gap-2 px-4 py-2 font-medium transition-colors
                border-b-2 -mb-4 pb-4
                ${
                  activeView === view
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }
              `}
            >
              {VIEW_ICONS[view as ViewType]} {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
