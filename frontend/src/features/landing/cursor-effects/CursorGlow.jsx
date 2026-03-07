import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

function CursorGlow({ enabled = true }) {
  const [isVisible, setIsVisible] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { stiffness: 500, damping: 50 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled, mouseX, mouseY])

  if (!enabled) return null

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Primary glow */}
      <motion.div
        className="absolute w-96 h-96 -translate-x-1/2 -translate-y-1/2"
        style={{ x, y }}
      >
        <div className="w-full h-full rounded-full bg-gradient-radial from-arc-blue/20 via-arc-blue/5 to-transparent blur-3xl" />
      </motion.div>
      
      {/* Secondary smaller glow */}
      <motion.div
        className="absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2"
        style={{ x, y }}
      >
        <div className="w-full h-full rounded-full bg-gradient-radial from-purple-500/15 to-transparent blur-2xl" />
      </motion.div>
    </motion.div>
  )
}

export default CursorGlow
