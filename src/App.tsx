import { useEffect } from 'react';
import { useExpenseStore } from './store/expenseStore';
import { Layout } from './components/layout/Layout';
import { WelcomeScreen } from './components/layout/WelcomeScreen';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  const { groups, activeGroupId, setActiveGroup } = useExpenseStore();

  useEffect(() => {
    if (!activeGroupId && groups.length > 0) 
      setActiveGroup(groups[0].id);
  }, [groups, activeGroupId, setActiveGroup]);

  const content = groups.length === 0 ? <WelcomeScreen /> : <Layout />;

  return (
    <ToastProvider>
      <div>{content}</div>
      <ToastContainer />
    </ToastProvider>
  );
}
