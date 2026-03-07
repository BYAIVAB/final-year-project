import { motion } from 'framer-motion'

function FeatureCard({ feature, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-2xl p-6 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />
      
      {/* Icon */}
      <motion.div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {feature.icon}
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-arc-text mb-2 group-hover:text-arc-blue transition-colors">
        {feature.title}
      </h3>
      <p className="text-arc-text-muted text-sm leading-relaxed">
        {feature.description}
      </p>

      {/* Arrow indicator */}
      <motion.div
        className="absolute bottom-6 right-6 text-arc-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        →
      </motion.div>
    </motion.div>
  )
}

export default FeatureCard
