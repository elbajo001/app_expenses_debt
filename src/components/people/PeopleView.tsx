import React, { useState } from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { useToast } from '../../contexts/ToastContext';
import { PersonBadge } from './PersonBadge';
import { PersonForm } from './PersonForm';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Users } from 'lucide-react';

export const PeopleView: React.FC = () => {
  // const {
  //   activeGroupId,
  //   getPeopleByGroup,
  //   addPerson,
  //   removePerson,
  // } = useExpenseStore(); No hacer esto ya que no se renderiza al cambiar el estado (no es un hook)
  const activeGroupId = useExpenseStore(state => state.activeGroupId);
  const groups = useExpenseStore(state => state.groups);
  const peopleInit = useExpenseStore(state => state.people);
  const addPerson = useExpenseStore(state => state.addPerson);
  const removePerson = useExpenseStore(state => state.removePerson);

  const group = groups.find(g => g.id === activeGroupId);

  const people = group
    ? peopleInit.filter(p => group.members.includes(p.id))
    : [];
  const { addToast } = useToast();

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; personId?: string }>({
    open: false,
  });

  if (!activeGroupId) return null;
  
  // const people = getPeopleByGroup(activeGroupId); No hacer ya que esto es un getter imperativo (getPeopleByGroup) durante el render, y eso no dispara re-render cuando people cambia.

  const handleAddPerson = (name: string) => {
    addPerson(activeGroupId, name);
    addToast(`${name} agregado correctamente`, 'success');
  };

  const handleRemovePerson = (personId: string) => {
    setConfirmDelete({ open: true, personId });
  };

  const confirmRemove = () => {
    if (confirmDelete.personId) {
      const person = people.find((p) => p.id === confirmDelete.personId);
      removePerson(activeGroupId, confirmDelete.personId);
      addToast(`${person?.name} removido del grupo`, 'success');
      setConfirmDelete({ open: false });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar persona</h3>
        <PersonForm onSubmit={handleAddPerson} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Miembros del grupo ({people.length})
        </h3>
        {people.length === 0 ? (
          <EmptyState
            title="Sin miembros"
            description="Agrega personas al grupo para comenzar a registrar gastos"
          >
            <Users size={56} />
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {people.map((person) => (
              <PersonBadge
                key={person.id}
                person={person}
                onRemove={() => handleRemovePerson(person.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false })}
        onConfirm={confirmRemove}
        title="Remover persona"
        message="¿Estás seguro de que quieres remover esta persona del grupo? Los gastos anteriores se conservarán."
        confirmLabel="Remover"
        danger
      />
    </div>
  );
};
