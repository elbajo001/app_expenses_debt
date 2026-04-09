import React, { useState, useCallback } from 'react';
import type { Person, ExpenseCategory } from '../../types';
import { CATEGORY_LABELS } from '../../types';

interface ExpenseFiltersProps {
  people: Person[];
  onFiltersChange: (filters: {
    search: string;
    category: ExpenseCategory | 'all';
    personId: string | 'all';
    dateFrom: string;
    dateTo: string;
  }) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  people,
  onFiltersChange,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | 'all'>('all');
  const [personId, setPersonId] = useState<string | 'all'>('all');
  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(today);
  const [hasFilters, setHasFilters] = useState(false);

  const handleFilterChange = useCallback(() => {
    onFiltersChange({
      search,
      category,
      personId,
      dateFrom,
      dateTo,
    });
    setHasFilters(search !== '' || category !== 'all' || personId !== 'all');
  }, [search, category, personId, dateFrom, dateTo, onFiltersChange]);

  React.useEffect(() => {
    const timer = setTimeout(handleFilterChange, 300);
    return () => clearTimeout(timer);
  }, [search, category, personId, dateFrom, dateTo, handleFilterChange]);

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setPersonId('all');
    setDateFrom(thirtyDaysAgo);
    setDateTo(today);
    setHasFilters(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar descripción..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="all">Todas</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Persona</label>
          <select
            value={personId}
            onChange={(e) => setPersonId(e.target.value as string | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="all">Todas</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-end">
          {hasFilters && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};
