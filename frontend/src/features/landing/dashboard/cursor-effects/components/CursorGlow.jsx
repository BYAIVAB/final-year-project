import React, { useState, useEffect } from 'react';
import { useCursorPosition } from '../hooks/useCursorPosition';

export const CursorGlow = ({ enabled = true }) => {
    const { x, y, isInViewport } = useCursorPosition();
    const [glowState, setGlowState] = useState('default');

    useEffect(() => {
        const handleMouseOver = (e) => {
            const target = e.target;

            if (target.closest('.glass-card')) {
                setGlowState('card');
            } else if (target.closest('.recharts-wrapper')) {
                setGlowState('chart');
            } else if (target.closest('button')) {
                setGlowState('button');
            } else {
                setGlowState('default');
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        return () => document.removeEventListener('mouseover', handleMouseOver);
    }, []);

    if (!enabled || !isInViewport) return null;

    const glowStyles = {
        default: {
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
            filter: 'blur(10px)',
            transform: 'scale(1)'
        },
        card: {
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
            filter: 'blur(15px)',
            transform: 'scale(1.5)'
        },
        chart: {
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
            filter: 'blur(15px)',
            transform: 'scale(1.5)'
        },
        button: {
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
            filter: 'blur(12px)',
            transform: 'scale(1.3)'
        }
    };

    return (
        <div
            className="cursor-glow"
            style={{
                position: 'fixed',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'screen',
                left: `${x - 20}px`,
                top: `${y - 20}px`,
                transition: 'all 0.15s ease-out',
                ...glowStyles[glowState]
            }}
        />
    );
};
