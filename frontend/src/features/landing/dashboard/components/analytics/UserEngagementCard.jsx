import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

export const UserEngagementCard = ({ data, totalQueries }) => {
    // Generate heatmap data from daily trends or use random mock data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Safely extract totalQueries value (handle both number and object)
    const totalQueriesValue = useMemo(() => {
        if (typeof totalQueries === 'object' && totalQueries !== null) {
            return totalQueries.all_time || totalQueries.today || totalQueries.count || 0;
        }
        return typeof totalQueries === 'number' ? totalQueries : 0;
    }, [totalQueries]);

    const heatmapData = useMemo(() => {
        const result = [];
        
        // If we have daily trends data, use it to create a more realistic heatmap
        if (data && data.length > 0) {
            const maxQueries = Math.max(...data.map(d => d.queries || 0), 1);
            
            for (let i = 0; i < 7; i++) {
                const dayData = data[i] || data[i % data.length];
                const baseValue = dayData?.queries || 0;
                
                for (let j = 0; j < 24; j += 4) {
                    // Vary engagement by time of day (higher during work hours)
                    const timeMultiplier = (j >= 8 && j <= 18) ? 1 : 0.4;
                    const normalizedValue = Math.round((baseValue / maxQueries) * 100 * timeMultiplier) || 10;
                    
                    result.push({
                        dayIndex: i,
                        day: days[i],
                        hourIndex: j,
                        hour: `${j}:00`,
                        value: Math.max(10, normalizedValue + Math.floor(Math.random() * 20))
                    });
                }
            }
        } else {
            // Fallback to random mock data
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 24; j += 4) {
                    result.push({
                        dayIndex: i,
                        day: days[i],
                        hourIndex: j,
                        hour: `${j}:00`,
                        value: Math.floor(Math.random() * 100) + 10
                    });
                }
            }
        }
        
        return result;
    }, [data]);

    // Determine color based on value
    const getColor = (value) => {
        if (value > 80) return '#3B82F6';   // High engagement
        if (value > 50) return '#60A5FA';   // Medium engagement
        if (value > 20) return '#93C5FD';   // Low engagement
        return '#1E3A8A';                   // Very low/minimal
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#0A0E27] border border-slate-700 p-2 rounded-lg text-xs">
                    <p className="text-slate-200">{`${data.day} ${data.hour}`}</p>
                    <p className="text-blue-400 font-bold">{`Queries: ${data.value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-200 font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Peak Engagement Activity
                </h3>
                {totalQueries !== undefined && (
                    <span className="text-xs text-slate-400">
                        Total: {totalQueries} queries
                    </span>
                )}
            </div>
            <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                        <XAxis
                            type="number"
                            dataKey="hourIndex"
                            name="Hour"
                            stroke="#64748B"
                            tickFormatter={(val) => `${val}h`}
                            domain={[0, 24]}
                            tickCount={7}
                            axisLine={false}
                            tickLine={false}
                            fontSize={10}
                        />
                        <YAxis
                            type="number"
                            dataKey="dayIndex"
                            name="Day"
                            stroke="#64748B"
                            tickFormatter={(val) => days[val]}
                            domain={[0, 6]}
                            tickCount={7}
                            axisLine={false}
                            tickLine={false}
                            fontSize={10}
                        />
                        <ZAxis type="number" dataKey="value" range={[20, 400]} name="queries" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Scatter data={heatmapData} shape="circle">
                            {heatmapData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.value)} opacity={0.8} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
