import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { responseTimeData as defaultData } from '../../data/mockDashboardData';

export const ResponseTimeChart = ({ data, latency }) => {
  // Transform daily trends data to chart format or use mock data
  const chartData = data && data.length > 0 
    ? data.map(d => ({ time: d.name, ms: d.queries * 50 + 200, queries: d.queries }))
    : defaultData;

  // Determine status based on p95 latency
  const p95 = latency?.p95_ms || latency?.p95 || 0;
  const status = p95 < 1000 ? 'Optimal' : p95 < 2000 ? 'Normal' : 'Slow';
  
  // Status badge styles
  const statusStyles = {
    Optimal: 'bg-green-500/10 text-green-400 border-green-500/20',
    Normal: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Slow: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-200 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          System Latency
        </h3>
        <div className="flex items-center gap-2">
          {latency && (
            <span className="text-xs text-slate-400">
              P95: {latency.p95_ms || latency.p95 || 0}ms
            </span>
          )}
          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0A0E27', borderColor: '#1E293B', borderRadius: '8px' }}
              itemStyle={{ color: '#E2E8F0' }}
            />
            <Area
              type="monotone"
              dataKey="ms"
              stroke="#8B5CF6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMs)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
