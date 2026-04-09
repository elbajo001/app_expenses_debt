import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { formatCurrency } from '../../utils/formatting';

interface CategoryChartProps {
  data: Array<{ category: string; label: string; amount: number }>;
  colors: string[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, colors }) => {
  if (data.length === 0) {
    return (
      <Card>
        <EmptyState icon="📊" title="Sin categorías" description="Registra gastos para ver datos" />
      </Card>
    );
  }

  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={80}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
