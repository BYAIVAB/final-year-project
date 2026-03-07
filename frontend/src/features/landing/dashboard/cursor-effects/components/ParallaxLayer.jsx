import React from 'react';
import { useParallaxMouse } from '../hooks/useParallaxMouse';

export const ParallaxLayer = ({
    children,
    speed = 0.5,
    axis = 'both',
    className = ''
}) => {
    const { transform } = useParallaxMouse(speed, axis);

    return (
        <div
            className={`parallax-layer ${className}`}
            style={{
                transform,
            }}
        >
            {children}
        </div>
    );
};
