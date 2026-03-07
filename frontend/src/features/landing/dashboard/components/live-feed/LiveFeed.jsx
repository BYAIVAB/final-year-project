import React, { useState, useEffect, useRef } from 'react';
import { liveQueriesData as defaultData } from '../../data/mockDashboardData';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuery } from '../../hooks/useRealTimeData';

export const LiveFeed = ({ data }) => {
    // Transform activity feed data to queries or use mock data
    const initialQueries = data && data.length > 0
        ? data.filter(item => item.type === 'query').map((item, i) => ({
            id: item.id || i,
            text: item.title?.replace('Query: "', '').replace('"', '') || item.description || 'Medical question',
            timestamp: new Date(item.timestamp).getTime() || Date.now() - i * 1000
        }))
        : defaultData.map((q, i) => ({ id: i, text: q, timestamp: Date.now() - i * 1000 }));

    const [queries, setQueries] = useState(initialQueries);
    const [isLive, setIsLive] = useState(true);
    const containerRef = useRef(null);

    // Update queries when data prop changes
    useEffect(() => {
        if (data && data.length > 0) {
            const formattedQueries = data
                .filter(item => item.type === 'query')
                .map((item, i) => ({
                    id: item.id || i,
                    text: item.title?.replace('Query: "', '').replace('"', '') || item.description || 'Medical question',
                    timestamp: new Date(item.timestamp).getTime() || Date.now() - i * 1000
                }));
            if (formattedQueries.length > 0) {
                setQueries(prev => {
                    // Add new queries that don't exist
                    const newQueries = formattedQueries.filter(nq => !prev.some(pq => pq.id === nq.id));
                    if (newQueries.length > 0) {
                        return [...newQueries.map(q => ({ ...q, isNew: true })), ...prev].slice(0, 15);
                    }
                    return prev;
                });
            }
        }
    }, [data]);

    // Add new queries periodically
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            const newQuery = {
                id: Date.now(),
                text: generateQuery(),
                timestamp: Date.now(),
                isNew: true
            };
            
            setQueries(prev => {
                const updated = prev.map(q => ({ ...q, isNew: false }));
                return [newQuery, ...updated].slice(0, 15);
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isLive]);

    // Auto-scroll effect
    useEffect(() => {
        if (!containerRef.current || !isLive) return;
        containerRef.current.scrollTop = 0;
    }, [queries, isLive]);

    return (
        <div className="h-full w-full flex flex-col overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-900/10 blur-[50px] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <svg className={`w-5 h-5 ${isLive ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <h3 className="text-slate-200 font-semibold">
                        Live Clinical Queries
                    </h3>
                </div>
                <button 
                    onClick={() => setIsLive(!isLive)}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${isLive ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-slate-700 text-slate-400 hover:bg-slate-800/50'}`}
                >
                    {isLive ? 'Pause' : 'Resume'}
                </button>
            </div>

            <div 
                ref={containerRef}
                className="flex-1 relative overflow-y-auto backdrop-blur-sm rounded-xl scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
                {/* Top and bottom gradient fades */}
                <div className="sticky top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#0A0E27] to-transparent z-10 pointer-events-none"></div>
                
                <div className="space-y-3 px-1">
                    <AnimatePresence mode="popLayout">
                        {queries.map((query, index) => (
                            <motion.div
                                key={query.id}
                                className={`flex text-sm p-3 rounded-lg border items-center justify-between group transition-colors ${query.isNew ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-700/50 bg-[#0A0E27]/80 hover:bg-slate-800/50'}`}
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                layout
                            >
                                <div className="flex items-center gap-3 overflow-hidden flex-1">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${query.isNew ? 'bg-blue-500/30 text-blue-300 border-blue-400/50' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-300 truncate font-mono text-xs">{query.text}</p>
                                </div>
                                {query.isNew && (
                                    <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 whitespace-nowrap">
                                        NEW
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                
                <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0A0E27] to-transparent pointer-events-none"></div>
            </div>
            
            {/* Query count indicator */}
            <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
                <span>{queries.length} queries in feed</span>
                <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
                    {isLive ? 'Streaming' : 'Paused'}
                </span>
            </div>
        </div>
    );
};
