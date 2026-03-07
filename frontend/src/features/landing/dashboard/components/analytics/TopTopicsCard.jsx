import React from 'react';
import { topTopicsData as defaultData } from '../../data/mockDashboardData';
import { motion } from 'framer-motion';

export const TopTopicsCard = ({ data }) => {
  // Use provided data or fallback to static mock data
  const topics = data && data.length > 0 ? data.slice(0, 5) : defaultData;

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Trending Topics
      </h3>
      <div className="flex-1 flex flex-col justify-center gap-4">
        {topics.map((item, index) => (
          <motion.div 
            key={index} 
            className="space-y-2 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                  {item.topic}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.trend && (
                  <span className={`text-xs ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend}
                  </span>
                )}
                <span style={{ color: item.color || '#F59E0B' }}>{item.score}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-2 rounded-full transition-all group-hover:brightness-110"
                style={{ backgroundColor: item.color || '#F59E0B' }}
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
