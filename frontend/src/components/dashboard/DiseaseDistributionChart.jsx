import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444', '#6366F1', '#14B8A6'];

export const DiseaseDistributionChart = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Tomato', value: 4 },
    { name: 'Potato', value: 2 },
    { name: 'Corn', value: 3 },
    { name: 'Apple', value: 1 },
    { name: 'Grape', value: 2 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-slate-textDark">
            Crop Category Breakdown
          </h4>
          <p className="text-xs text-slate-textMuted">
            Active diagnostic scans grouped by botanical family
          </p>
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DiseaseDistributionChart;
