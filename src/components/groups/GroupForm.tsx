import React, { useState } from 'react';
import type { Group } from '../../types';
import { Button } from '../common/Button';

interface GroupFormProps {
  initialData?: Group;
  onSubmit: (data: Omit<Group, 'id' | 'createdAt' | 'members'>) => void;
  onCancel: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push('El nombre es requerido');
    } else if (name.length > 50) {
      newErrors.push('El nombre no puede exceder 50 caracteres');
    }

    if (description && description.length > 200) {
      newErrors.push('La descripción no puede exceder 200 caracteres');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((error, i) => (
            <p key={i} className="text-red-700 text-sm">{error}</p>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del grupo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors([]);
          }}
          className={`
            w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
            ${
              errors.some(e => e.includes('nombre'))
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }
          `}
          placeholder="Ej: Mi Hogar"
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors([]);
          }}
          className={`
            w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
            resize-none
            ${
              errors.some(e => e.includes('descripción'))
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }
          `}
          placeholder="Ej: Gastos compartidos de la casa"
          rows={3}
          maxLength={200}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Actualizar' : 'Crear grupo'}
        </Button>
      </div>
    </form>
  );
};
