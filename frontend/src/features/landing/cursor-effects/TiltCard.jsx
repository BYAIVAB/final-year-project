import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function TiltCard({ 
  children, 
  className = '', 
  options = {} 
}) {
  const {
    maxTilt = 10,
    scale = 1.02,
    speed = 500,
    glare = false,
    glareMaxOpacity = 0.3,
  } = options

  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 20 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)
  const scaleValue = useSpring(1, springConfig)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseEnter = () => {
    scaleValue.set(scale)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    scaleValue.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale: scaleValue,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default TiltCard
