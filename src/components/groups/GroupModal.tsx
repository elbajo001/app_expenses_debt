import React from 'react';
import { useExpenseStore } from '../../store/expenseStore';
import { Modal } from '../common/Modal';
import { GroupForm } from './GroupForm';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose }) => {
  const { addGroup } = useExpenseStore();

  const handleSubmit = (data: { name: string; description?: string }) => {
    addGroup({ ...data, members: [] });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear nuevo grupo">
      <GroupForm
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};
