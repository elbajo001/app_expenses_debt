import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';

export const WelcomeScreen: React.FC = () => {
  const { addGroup } = useExpenseStore();
  const { addToast } = useToast();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleCreateGroup = () => {
    if (!name.trim()) return;
    addGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      members: [],
    });
    addToast(`Grupo "${name}" creado correctamente`, 'success');
    setName('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-600">SplitEasy</h1>
        <p className="text-center text-gray-600 mb-8">Gestiona gastos compartidos de forma fácil</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Crea tu primer grupo</h2>
          <input
            type="text"
            placeholder="Nombre del grupo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
            className={`
              w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              mb-3
            `}
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`
              w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              resize-none
            `}
            rows={3}
          />
        </div>

        <Button
          onClick={handleCreateGroup}
          disabled={!name.trim()}
          className="w-full"
        >
          Crear grupo
        </Button>
      </div>
    </div>
  );
};
