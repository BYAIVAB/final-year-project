import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RippleEffect - Adds Material-style click ripples to any wrapped element
 * 
 * @param {React.ReactNode} children - Child elements to wrap
 * @param {string} className - Additional CSS classes
 * @param {string} rippleColor - Color of the ripple (default: white with opacity)
 * @param {number} duration - Ripple animation duration in seconds
 */
export const RippleEffect = ({ 
  children, 
  className = '', 
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  duration = 0.6 
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, duration * 1000);
  }, [duration]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor
            }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
