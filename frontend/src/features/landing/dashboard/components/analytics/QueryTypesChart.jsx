import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { queryTypesData as defaultData } from '../../data/mockDashboardData';

export const QueryTypesChart = ({ data }) => {
  // Use provided data or fallback to mock data
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        Query Distribution
      </h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0A0E27', borderColor: '#1E293B', borderRadius: '8px' }}
              itemStyle={{ color: '#E2E8F0' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
