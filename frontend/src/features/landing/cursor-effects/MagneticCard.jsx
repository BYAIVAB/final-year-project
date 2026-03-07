import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

function MagneticCard({ children, className = '', strength = 20 }) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)
  
  // Subtle rotation based on position
  const rotateX = useTransform(springY, [-strength, strength], [2, -2])
  const rotateY = useTransform(springX, [-strength, strength], [-2, 2])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2) * strength
    const deltaY = (e.clientY - centerY) / (rect.height / 2) * strength
    
    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className={`transition-shadow duration-300 hover:shadow-xl hover:shadow-arc-blue/10 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default MagneticCard
