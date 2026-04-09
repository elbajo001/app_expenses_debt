import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardView } from '../dashboard/DashboardView';
import { ExpensesView } from '../expenses/ExpensesView';
import { PeopleView } from '../people/PeopleView';
import { DebtsView } from '../dashboard/DebtsView';

type ViewType = 'dashboard' | 'expenses' | 'people' | 'debts';

export const Layout: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isViewportMobile = window.innerWidth < 768;
      setIsMobile(isViewportMobile);
      if (isViewportMobile)
        setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    if (isMobile) 
      setSidebarOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'expenses':
        return <ExpensesView />;
      case 'people':
        return <PeopleView />;
      case 'debts':
        return <DebtsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} onViewChange={handleViewChange} />
        <main className="flex-1 overflow-auto p-6">{renderView()}</main>
      </div>
    </div>
  );
};
