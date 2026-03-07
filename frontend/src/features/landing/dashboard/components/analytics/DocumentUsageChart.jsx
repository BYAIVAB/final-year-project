import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { documentUsageData as defaultData } from '../../data/mockDashboardData';

export const DocumentUsageChart = ({ data, totalDocuments }) => {
  // Use provided data or fallback to static mock data
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-200 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Document Usage
        </h3>
        {totalDocuments !== undefined && (
          <span className="text-xs text-slate-400">
            Total: {totalDocuments}
          </span>
        )}
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
            <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip
              cursor={{ fill: '#1E293B', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#0A0E27', borderColor: '#1E293B', borderRadius: '8px' }}
              itemStyle={{ color: '#E2E8F0' }}
            />
            <Bar dataKey="queries" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
