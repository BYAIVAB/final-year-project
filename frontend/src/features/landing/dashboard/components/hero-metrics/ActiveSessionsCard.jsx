import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

function ActiveSessionsCard() {
  const [sessions, setSessions] = useState(24)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-arc-text-muted text-sm font-medium">ACTIVE SESSIONS</h3>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs text-arc-success bg-arc-success/10 px-2 py-1 rounded flex items-center gap-1"
        >
          <span className="w-2 h-2 bg-arc-success rounded-full"></span>
          LIVE
        </motion.span>
      </div>
      
      <div className="text-4xl font-bold text-arc-text mb-4">
        <CountUp end={sessions} duration={0.5} />
      </div>
      
      {/* Avatar Stack */}
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-arc-blue to-purple-500 border-2 border-arc-surface flex items-center justify-center text-white text-xs font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
            >
              {String.fromCharCode(65 + i)}
            </motion.div>
          ))}
        </div>
        <span className="ml-3 text-sm text-arc-text-muted">+{Math.max(0, sessions - 5)} more</span>
      </div>
    </div>
  )
}

export default ActiveSessionsCard
