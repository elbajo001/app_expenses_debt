import React, { useState } from 'react';
import { Button } from '../common/Button';

interface PersonFormProps {
  onSubmit: (name: string) => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (name.length > 50) {
      setError('El nombre no puede exceder 50 caracteres');
      return;
    }

    onSubmit(name.trim());
    setName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        placeholder="Nombre de la persona"
        maxLength={50}
        className={`
          flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500'
          }
        `}
      />
      <Button type="submit" size="md">
        Agregar
      </Button>
      {error && <p className="text-red-600 text-sm absolute top-full mt-1">{error}</p>}
    </form>
  );
};
