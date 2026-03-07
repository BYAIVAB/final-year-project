import React, { useRef } from 'react';
import { useMagneticEffect } from '../hooks/useMagneticEffect';

export const MagneticCard = ({
    children,
    strength = 'medium',
    className = ''
}) => {
    const cardRef = useRef(null);
    const { transform, isActive } = useMagneticEffect(cardRef, { strength });

    return (
        <div
            ref={cardRef}
            className={`magnetic-card ${isActive ? 'magnetic-card--active' : ''} ${className}`}
            style={{
                transform,
            }}
        >
            {children}
        </div>
    );
};
