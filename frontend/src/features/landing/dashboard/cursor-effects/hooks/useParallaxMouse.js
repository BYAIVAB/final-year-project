import { useMemo } from 'react';
import { useCursorPosition } from './useCursorPosition';

export const useParallaxMouse = (speed = 0.5, axis = 'both') => {
    const { x, y } = useCursorPosition();

    const transform = useMemo(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const offsetX = (x - centerX) * speed;
        const offsetY = (y - centerY) * speed;

        const translateX = axis === 'y' ? 0 : offsetX;
        const translateY = axis === 'x' ? 0 : offsetY;

        return `translate3d(${translateX}px, ${translateY}px, 0)`;
    }, [x, y, speed, axis]);

    return { transform };
};
