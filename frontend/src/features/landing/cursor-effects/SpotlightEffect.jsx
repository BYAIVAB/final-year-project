import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function SpotlightEffect({ 
  children, 
  className = '', 
  radius = 300, 
  intensity = 0.5 
}) {
  const containerRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Spotlight overlay */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, ${intensity * 0.15}), transparent 70%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  )
}

export default SpotlightEffect
