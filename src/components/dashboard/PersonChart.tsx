import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { formatCurrency } from '../../utils/formatting';
import { PersonStanding } from 'lucide-react';

interface PersonChartDataItem {
  name: string;
  amount: number;
  color: string;
}

interface PersonChartProps {
  data: PersonChartDataItem[];
}

export const PersonChart: React.FC<PersonChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <EmptyState title="Sin personas" description="Agrega miembros para ver datos">
          <PersonStanding size={56} />
        </EmptyState>
      </Card>
    );
  }

  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Persona</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
