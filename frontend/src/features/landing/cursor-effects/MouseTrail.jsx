import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MouseTrail - Creates a trailing effect following the cursor
 * 
 * @param {number} trailLength - Number of trail dots
 * @param {string} color - Trail color
 * @param {boolean} enabled - Toggle trail on/off
 */
export const MouseTrail = ({ 
  trailLength = 8, 
  color = '#3B82F6',
  enabled = true 
}) => {
  const [trail, setTrail] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      const newPoint = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };

      setTrail(prev => {
        const updated = [newPoint, ...prev].slice(0, trailLength);
        return updated;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, trailLength]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50" ref={containerRef}>
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              backgroundColor: color,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ 
              scale: 1 - (index * 0.1),
              opacity: 0.6 - (index * 0.07),
              width: 12 - (index * 1.2),
              height: 12 - (index * 1.2)
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * ParallaxContainer - Adds subtle parallax movement to children based on mouse position
 * 
 * @param {React.ReactNode} children - Child elements
 * @param {number} intensity - How much parallax effect (1-20 recommended)
 * @param {string} className - Additional CSS classes
 */
export const ParallaxContainer = ({ 
  children, 
  intensity = 10,
  className = '' 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / rect.width * intensity;
      const y = (e.clientY - centerY) / rect.height * intensity;
      
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
};
