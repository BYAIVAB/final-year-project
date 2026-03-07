import { useState, useEffect, useRef } from 'react';
import { useCursorPosition } from './useCursorPosition';

export const useMagneticEffect = (elementRef, options = {}) => {
    const {
        strength = 'medium',
        maxDistance = 200,
        maxDisplacement = 20
    } = options;

    const { x: cursorX, y: cursorY, isInViewport } = useCursorPosition();
    const [transform, setTransform] = useState({ x: 0, y: 0 });
    const rafRef = useRef(null);

    const strengthMultiplier = {
        subtle: 0.15,
        medium: 0.3,
        strong: 0.5
    }[strength];

    useEffect(() => {
        if (!elementRef.current || !isInViewport) return;

        const updateTransform = () => {
            const rect = elementRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = cursorX - centerX;
            const deltaY = cursorY - centerY;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            if (distance < maxDistance) {
                const pullStrength = (1 - distance / maxDistance) * strengthMultiplier;

                const displaceX = Math.min(deltaX * pullStrength, maxDisplacement);
                const displaceY = Math.min(deltaY * pullStrength, maxDisplacement);

                setTransform({ x: displaceX, y: displaceY });
            } else {
                setTransform({ x: 0, y: 0 });
            }
        };

        rafRef.current = requestAnimationFrame(updateTransform);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [cursorX, cursorY, isInViewport, maxDistance, strengthMultiplier, elementRef]);

    return {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        isActive: Math.abs(transform.x) > 0.1 || Math.abs(transform.y) > 0.1
    };
};
