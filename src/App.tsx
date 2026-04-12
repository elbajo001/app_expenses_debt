import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useExpenseStore } from './store/expenseStore';
import { Layout } from './components/layout/Layout';
import { WelcomeScreen } from './components/layout/WelcomeScreen';
import { LoginView } from './components/layout/LoginView';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import type { GroupWithUser } from './types';

export default function App() {
  const { user, isLoading } = useAuth();
  const currentUserId = useExpenseStore((state) => state.currentUserId);
  const allGroups = useExpenseStore((state) => state.groups);
  const activeGroupId = useExpenseStore((state) => state.activeGroupId);
  const setActiveGroup = useExpenseStore((state) => state.setActiveGroup);
  const setCurrentUserId = useExpenseStore((state) => state.setCurrentUserId);

  // Filter groups for current user
  const groups = allGroups.filter((group) => (group as GroupWithUser).userId === currentUserId);

  // Set current user in store when auth changes
  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
      // Also reset active group for this user
      setActiveGroup(null);
    }
  }, [user?.id, setCurrentUserId, setActiveGroup]);

  // Set active group when groups update (only if no active group)
  useEffect(() => {
    if (!activeGroupId && groups.length > 0) {
      setActiveGroup(groups[0].id);
    }
  }, [groups.length, activeGroupId, setActiveGroup]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const content = groups.length === 0 ? <WelcomeScreen /> : <Layout />;

  return (
    <ToastProvider>
      <div>{content}</div>
      <ToastContainer />
    </ToastProvider>
  );
}
