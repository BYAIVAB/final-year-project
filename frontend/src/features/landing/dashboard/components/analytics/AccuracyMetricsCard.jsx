import { motion } from 'framer-motion'
import CountUp from 'react-countup'

const metrics = [
  { label: 'Accuracy', value: 96.4, suffix: '%', color: 'text-arc-success' },
  { label: 'Confidence', value: 92.1, suffix: '%', color: 'text-arc-blue' },
  { label: 'Relevance', value: 88.7, suffix: '%', color: 'text-purple-400' },
]

function AccuracyMetricsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-xl p-6 h-full"
    >
      <h3 className="text-arc-text-muted text-sm font-medium mb-4">AI ACCURACY METRICS</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-arc-text-muted text-sm">{metric.label}</span>
              <span className={`text-lg font-bold ${metric.color}`}>
                <CountUp end={metric.value} decimals={1} duration={1.5} delay={index * 0.2} />
                {metric.suffix}
              </span>
            </div>
            <div className="h-2 bg-arc-border rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${metric.color === 'text-arc-success' ? 'bg-arc-success' : metric.color === 'text-arc-blue' ? 'bg-arc-blue' : 'bg-purple-400'} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${metric.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + index * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-arc-border">
        <p className="text-xs text-arc-text-muted">
          Based on 1,247 evaluated responses
        </p>
      </div>
    </motion.div>
  )
}

export default AccuracyMetricsCard
