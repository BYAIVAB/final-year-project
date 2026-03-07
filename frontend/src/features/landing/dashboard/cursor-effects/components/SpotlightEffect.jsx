import React, { useEffect, useState } from 'react';
import { useCursorPosition } from '../hooks/useCursorPosition';

export const SpotlightEffect = ({
    children,
    radius = 300,
    intensity = 0.7,
    enabled = true
}) => {
    const { x, y, isInViewport } = useCursorPosition();
    const [laggedPosition, setLaggedPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Add slight lag for more natural feel
        const timeoutId = setTimeout(() => {
            setLaggedPosition({ x, y });
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [x, y]);

    if (!enabled || !isInViewport) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {children}
            <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 mix-blend-multiply"
                style={{
                    background: `radial-gradient(circle ${radius}px at ${laggedPosition.x}px ${laggedPosition.y}px, transparent 0%, rgba(10, 14, 39, ${intensity}) 100%)`
                }}
            />
        </div>
    );
};
