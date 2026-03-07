import React, { useRef, useState } from 'react';

export const useHoverTilt = (options = {}) => {
    const { maxTilt = 15, perspective = 1000, scale = 1.02 } = options;
    const [style, setStyle] = useState({ transform: `perspective(${perspective}px)` });
    const ref = useRef(null);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Mouse position relative to center of element
        const x = e.clientX - rect.left - width / 2;
        const y = e.clientY - rect.top - height / 2;

        const tiltX = (y / (height / 2)) * -maxTilt;
        const tiltY = (x / (width / 2)) * maxTilt;

        setStyle({
            transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
            transition: 'transform 0.5s ease-out'
        });
    };

    return { ref, style, handleMouseMove, handleMouseLeave };
};

export const TiltCard = ({ children, className = '', options }) => {
    const { ref, style, handleMouseMove, handleMouseLeave } = useHoverTilt(options);

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
            style={{ ...style, transformStyle: 'preserve-3d' }}
        >
            {/* Container for content that can pop out */}
            <div style={{ transform: 'translateZ(30px)' }}>
                {children}
            </div>
        </div>
    );
};
