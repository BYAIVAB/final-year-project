import { motion } from 'framer-motion'
import CountUp from 'react-countup'

function TotalQueriesCard() {
  const data = {
    total: 1247,
    change: 12,
    sparkline: [120, 145, 167, 189, 210, 198, 176, 155, 142, 167, 189, 210],
  }

  const maxVal = Math.max(...data.sparkline)
  const minVal = Math.min(...data.sparkline)

  return (
    <div className="bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-arc-text-muted text-sm font-medium">TOTAL QUERIES</h3>
        <span className={`text-xs px-2 py-1 rounded ${data.change >= 0 ? 'text-arc-success bg-arc-success/10' : 'text-arc-error bg-arc-error/10'}`}>
          {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change)}%
        </span>
      </div>
      
      <div className="text-4xl font-bold text-arc-text mb-4">
        <CountUp end={data.total} duration={1.5} separator="," />
      </div>
      
      {/* Sparkline */}
      <div className="h-12 flex items-end gap-1">
        {data.sparkline.map((val, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-arc-blue/60 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${((val - minVal) / (maxVal - minVal)) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            style={{ minHeight: '4px' }}
          />
        ))}
      </div>
      
      <p className="text-xs text-arc-text-muted mt-2">vs yesterday</p>
    </div>
  )
}

export default TotalQueriesCard
