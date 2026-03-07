import React, { useState, useEffect, useCallback } from 'react';
import { activityFeedData as defaultData } from '../../data/mockDashboardData';
import { motion, AnimatePresence } from 'framer-motion';
import { generateActivity } from '../../hooks/useRealTimeData';

// Helper function to format timestamp to relative time
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return time.toLocaleDateString();
};

export const ActivityTimeline = ({ data }) => {
  // Use provided data or fallback to mock data
  const initialData = data && data.length > 0 
    ? data.map(item => ({
        id: item.id || Math.random().toString(36),
        type: item.type || 'query',
        message: item.title || item.description || 'Activity',
        status: 'success',
        time: formatTimestamp(item.timestamp)
      }))
    : defaultData;

  const [activities, setActivities] = useState(initialData);
  const [isLive, setIsLive] = useState(true);

  // Update activities when data prop changes
  useEffect(() => {
    if (data && data.length > 0) {
      const formattedData = data.map(item => ({
        id: item.id || Math.random().toString(36),
        type: item.type || 'query',
        message: item.title || item.description || 'Activity',
        status: 'success',
        time: formatTimestamp(item.timestamp)
      }));
      setActivities(formattedData);
    }
  }, [data]);

  // Add new activities periodically
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => {
        // Update "Just now" items to relative time
        const updated = prev.map((item, idx) => {
          if (item.time === 'Just now') {
            return { ...item, time: `${idx + 1} min${idx > 0 ? 's' : ''} ago` };
          }
          return item;
        });
        return [newActivity, ...updated].slice(0, 8);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);
  const getIcon = (type) => {
    switch (type) {
      case 'query':
        return <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
      case 'system':
        return <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      case 'alert':
        return <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
      case 'user':
        return <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-200 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          System Activity Log
        </h3>
        <button 
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-slate-700 hover:bg-slate-800/50 transition-colors"
        >
          <span className="flex h-2 w-2 relative">
            {isLive && <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-green-500' : 'bg-slate-500'}`}></span>
          </span>
          <span className={isLive ? 'text-green-400' : 'text-slate-400'}>{isLive ? 'Live' : 'Paused'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* Fading overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0A0E27] to-transparent z-10 pointer-events-none"></div>

        <div className="relative border-l border-slate-700/50 ml-3 space-y-6 pb-6 overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <AnimatePresence mode="popLayout">
            {activities.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative pl-6"
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: index === 0 ? 0 : 0 }}
                layout
              >
                {/* Activity Dot */}
                <div className={`absolute top-1 -left-3.5 w-7 h-7 rounded-full bg-[#0A0E27] border border-slate-700/80 flex items-center justify-center z-10`}>
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-slate-800/50">
                    {getIcon(item.type)}
                  </div>
                  {item.time === 'Just now' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </div>

                <div className={`bg-slate-800/30 border rounded-lg p-3 hover:bg-slate-800/60 transition-colors ${item.time === 'Just now' ? 'border-blue-500/50' : 'border-slate-700/30'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium text-slate-200">
                      <span className="text-white mr-1">{item.user}</span>
                      <span className="text-slate-400">{item.action}</span>
                    </p>
                    <span className={`text-xs whitespace-nowrap ${item.time === 'Just now' ? 'text-blue-400' : 'text-slate-500'}`}>{item.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-mono truncate mr-2">{item.target}</p>
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
