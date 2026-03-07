import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const initialItems = [
  { id: 1, user: 'Dr. Smith', query: 'Drug interaction check for Warfarin', status: 'completed', time: 'now' },
  { id: 2, user: 'Nurse Johnson', query: 'Pediatric dosage calculation', status: 'processing', time: '1s ago' },
  { id: 3, user: 'Anonymous', query: 'Symptom checker for chest pain', status: 'completed', time: '5s ago' },
]

const newQueries = [
  { user: 'Dr. Chen', query: 'Side effects of Metformin', status: 'processing' },
  { user: 'Pharmacist Lee', query: 'Alternative to Aspirin', status: 'completed' },
  { user: 'Medical Student', query: 'Hypertension treatment guidelines', status: 'processing' },
]

function LiveFeed() {
  const [items, setItems] = useState(initialItems)
  const [nextQueryIndex, setNextQueryIndex] = useState(0)

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const newItem = {
          ...newQueries[nextQueryIndex % newQueries.length],
          id: Date.now(),
          time: 'now',
        }
        setNextQueryIndex((i) => i + 1)
        
        // Keep only last 5 items
        const updated = [newItem, ...prev.slice(0, 4)]
        return updated.map((item, index) => ({
          ...item,
          time: index === 0 ? 'now' : `${index * 2}s ago`,
          status: index === 0 ? 'processing' : 'completed',
        }))
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [nextQueryIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-arc-text-muted text-sm font-medium">LIVE QUERY FEED</h3>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1 text-xs text-arc-success"
        >
          <span className="w-2 h-2 bg-arc-success rounded-full" />
          Live
        </motion.span>
      </div>
      
      <div className="space-y-3 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              className="bg-arc-navy/50 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-arc-blue font-medium">{item.user}</span>
                <div className="flex items-center gap-2">
                  {item.status === 'processing' ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-3 h-3 border-2 border-arc-blue border-t-transparent rounded-full"
                    />
                  ) : (
                    <span className="text-arc-success text-xs">✓</span>
                  )}
                  <span className="text-xs text-arc-text-muted">{item.time}</span>
                </div>
              </div>
              <p className="text-sm text-arc-text truncate">{item.query}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default LiveFeed
