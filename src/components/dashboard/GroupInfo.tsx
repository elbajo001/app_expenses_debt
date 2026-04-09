import React from 'react';
import { Card } from '../common/Card';

interface Group {
  name: string;
  description?: string;
}

interface GroupInfoProps {
  group: Group;
  expensesCount: number;
  peopleCount: number;
}

export const GroupInfo: React.FC<GroupInfoProps> = ({ group, expensesCount, peopleCount }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del grupo</h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600">Nombre</p>
          <p className="font-semibold text-gray-900">{group?.name}</p>
        </div>
        {group?.description && (
          <div>
            <p className="text-sm text-gray-600">Descripción</p>
            <p className="text-gray-900">{group.description}</p>
          </div>
        )}
        <div className="pt-2 border-t border-gray-200 flex gap-6">
          <div>
            <p className="text-sm text-gray-600">Gastos</p>
            <p className="font-semibold text-gray-900">{expensesCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Miembros</p>
            <p className="font-semibold text-gray-900">{peopleCount}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
