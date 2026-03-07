import { motion } from 'framer-motion'
import CountUp from 'react-countup'

function HealthScoreCard() {
  const score = 94

  return (
    <div className="bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-arc-text-muted text-sm font-medium">HEALTH SCORE</h3>
        <span className="text-xs text-arc-success bg-arc-success/10 px-2 py-1 rounded">● Excellent</span>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-arc-border"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-arc-success"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: '352',
                strokeDashoffset: '352',
              }}
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-arc-text">
              <CountUp end={score} duration={1.5} />%
            </span>
            <span className="text-xs text-arc-text-muted">Overall</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthScoreCard
