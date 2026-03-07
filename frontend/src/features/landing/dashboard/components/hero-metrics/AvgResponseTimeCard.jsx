import { motion } from 'framer-motion'
import CountUp from 'react-countup'

function AvgResponseTimeCard() {
  const avgTime = 2.3
  const maxTime = 10
  const percentage = (avgTime / maxTime) * 100

  const getStatus = (time) => {
    if (time <= 3) return { text: 'FAST', color: 'text-arc-success', bgColor: 'bg-arc-success' }
    if (time <= 5) return { text: 'NORMAL', color: 'text-yellow-400', bgColor: 'bg-yellow-400' }
    return { text: 'SLOW', color: 'text-arc-error', bgColor: 'bg-arc-error' }
  }

  const status = getStatus(avgTime)

  return (
    <div className="bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-arc-text-muted text-sm font-medium">RESPONSE TIME</h3>
        <span className={`text-xs ${status.color} ${status.bgColor}/10 px-2 py-1 rounded`}>
          ✓ {status.text}
        </span>
      </div>
      
      <div className="text-4xl font-bold text-arc-text mb-4">
        <CountUp end={avgTime} decimals={1} duration={1.5} />s
      </div>
      
      {/* Gauge */}
      <div className="relative h-4 bg-arc-border rounded-full overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full ${status.bgColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Markers */}
        <div className="absolute top-0 left-[30%] w-0.5 h-full bg-arc-navy/50" />
        <div className="absolute top-0 left-[50%] w-0.5 h-full bg-arc-navy/50" />
      </div>
      
      <div className="flex justify-between text-xs text-arc-text-muted mt-2">
        <span>0s</span>
        <span>3s</span>
        <span>5s</span>
        <span>10s</span>
      </div>
    </div>
  )
}

export default AvgResponseTimeCard
