import React from 'react';
import { ChartColumn, CircleDollarSign, Users, CreditCard, LogOut } from 'lucide-react';
import { useExpenseStore } from '../../store/expenseStore';
import { useAuth } from '../../contexts/AuthContext';

type ViewType = 'dashboard' | 'expenses' | 'people' | 'debts';
type IconType = ViewType;

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const VIEW_ICONS: Record<ViewType, IconType> = {
  dashboard: 'dashboard',
  expenses: 'expenses',
  people: 'people',
  debts: 'debts',
};

const getIcon = (view: IconType): React.ReactNode => {
  switch (view) {
    case 'dashboard':
      return <ChartColumn className="w-5 h-5" />;
    case 'expenses':
      return <CircleDollarSign className="w-5 h-5" />;
    case 'people':
      return <Users className="w-5 h-5" />;
    case 'debts':
      return <CreditCard className="w-5 h-5" />;
    default:
      return null;
  }
};

const VIEW_LABELS: Record<ViewType, string> = {
  dashboard: 'Dashboard',
  expenses: 'Gastos',
  people: 'Personas',
  debts: 'Deudas',
};

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const { activeGroupId, getGroupById, getPeopleByGroup } = useExpenseStore();
  const { user, logout } = useAuth();
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
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex gap-2 border-t border-gray-200 pt-4 -mx-6 px-6">
          {Object.entries(VIEW_LABELS).map(([view, label]) => (
            <button
              key={view}
              onClick={() => onViewChange(view as ViewType)}
              className={`
                flex items-center gap-2 px-4 py-2 transition-colors
                border-b-2 -mb-4 pb-4
                ${
                  activeView === view
                    ? 'text-indigo-600 border-indigo-600 font-semibold'
                    : 'text-gray-500 border-transparent hover:text-gray-900'
                }
              `}
            >
              {getIcon(VIEW_ICONS[view as ViewType])} {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
