import { motion } from 'framer-motion'

function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-arc-surface/60 backdrop-blur-sm border border-arc-border rounded-2xl p-6 h-full"
    >
      {/* Rating stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-arc-text leading-relaxed mb-6">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-arc-blue to-purple-500 flex items-center justify-center text-white font-semibold">
          {testimonial.avatar}
        </div>
        <div>
          <h4 className="text-arc-text font-semibold">{testimonial.name}</h4>
          <p className="text-arc-text-muted text-sm">{testimonial.role}</p>
          <p className="text-arc-blue text-xs">{testimonial.organization}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default TestimonialCard
