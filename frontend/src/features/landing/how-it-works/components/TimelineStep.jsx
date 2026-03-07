import { motion } from 'framer-motion'

function TimelineStep({ step, index, isLeft, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Content card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`flex-1 bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-2xl p-6 relative ${
          isLeft ? 'md:text-right' : 'md:text-left'
        }`}
      >
        {/* Step number badge */}
        <div
          className={`absolute -top-3 ${
            isLeft ? 'md:right-6' : 'md:left-6'
          } left-6 bg-gradient-to-r from-arc-blue to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full`}
        >
          STEP {step.number}
        </div>

        <div className={`flex items-center gap-4 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
          <span className="text-3xl">{step.icon}</span>
          <h3 className="text-xl font-semibold text-arc-text">{step.title}</h3>
        </div>
        
        <p className="text-arc-text-muted">{step.description}</p>
      </motion.div>

      {/* Center dot - hidden on mobile */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
        className="hidden md:flex w-16 h-16 rounded-full bg-arc-navy border-4 border-arc-blue items-center justify-center flex-shrink-0 z-10"
      >
        <span className="text-2xl">{step.icon}</span>
      </motion.div>

      {/* Spacer for alignment - hidden on mobile */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  )
}

export default TimelineStep
