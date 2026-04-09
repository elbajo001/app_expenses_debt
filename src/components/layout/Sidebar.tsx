import React, { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { GroupModal } from '../groups/GroupModal';
import { Button } from '../common/Button';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const { groups, activeGroupId, setActiveGroup } = useExpenseStore();
  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <>
      <aside
        className={`
          bg-indigo-900 text-white transition-all duration-300
          ${open ? 'w-64' : 'w-16'}
          flex flex-col shrink-0
          md:relative absolute z-40 h-full
        `}
      >
        <div className="p-4 border-b border-indigo-800 flex items-center justify-between">
          {open && <h1 className="text-xl font-bold">SplitEasy</h1>}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-indigo-800 rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            {open ? '←' : '→'}
          </button>
        </div>

        <div className="flex-1 overflow-auto py-4 px-2">
          <div className="mb-6">
            {open && <p className="text-xs text-indigo-200 mb-2 font-semibold">GRUPOS</p>}
            <div className="space-y-2">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors
                    ${
                      activeGroupId === group.id
                        ? 'bg-indigo-700'
                        : 'hover:bg-indigo-800'
                    }
                  `}
                  title={group.name}
                >
                  {open ? (
                    <div className="truncate">
                      <p className="font-medium text-sm">{group.name}</p>
                      <p className="text-xs text-indigo-200">{group.members.length} miembros</p>
                    </div>
                  ) : (
                    <div className="text-center text-lg">👥</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setShowGroupModal(true)}
            variant="secondary"
            size="sm"
            className={`w-full ${!open ? 'px-1' : ''}`}
          >
            {open ? '+ Nuevo Grupo' : '+'}
          </Button>
        </div>

        <div className="p-4 border-t border-indigo-800">
          {open && (
            <p className="text-xs text-indigo-300">
              {new Date().toLocaleDateString('es-CO')}
            </p>
          )}
        </div>
      </aside>

      <GroupModal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)} />
    </>
  );
};
