import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePulsingValue } from '../../hooks/useRealTimeData';

const AccuracyGauge = ({ value = 94 }) => {
  const baseAccuracy = value || 94;
  const accuracy = usePulsingValue(baseAccuracy, 2, 2000);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // Calculate the stroke dash offset for the circular gauge
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  // Determine color based on accuracy
  const getColor = (value) => {
    if (value >= 90) return { main: '#10B981', bg: '#10B98120', label: 'Excellent' };
    if (value >= 75) return { main: '#F59E0B', bg: '#F59E0B20', label: 'Good' };
    if (value >= 60) return { main: '#F97316', bg: '#F9731620', label: 'Fair' };
    return { main: '#EF4444', bg: '#EF444420', label: 'Needs Improvement' };
  };

  const color = getColor(accuracy);

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        RAG Accuracy Score
      </h3>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Background circle */}
          <svg width="180" height="180" className="transform -rotate-90">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#1E293B"
              strokeWidth="12"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={color.main}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: isAnimated ? strokeDashoffset : circumference }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 8px ${color.main}50)`
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-bold"
              style={{ color: color.main }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {accuracy}%
            </motion.span>
            <span 
              className="text-xs font-medium mt-1 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: color.bg, color: color.main }}
            >
              {color.label}
            </span>
          </div>

          {/* Animated glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${color.main}10 0%, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Stats below gauge */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-400">2,847</p>
          <p className="text-xs text-slate-500">Correct</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-amber-400">156</p>
          <p className="text-xs text-slate-500">Partial</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-400">42</p>
          <p className="text-xs text-slate-500">Missed</p>
        </div>
      </div>
    </div>
  );
};

export default AccuracyGauge;
