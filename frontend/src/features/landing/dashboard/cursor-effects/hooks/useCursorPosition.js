import { useState, useEffect, useRef } from 'react';

export const useCursorPosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isInViewport, setIsInViewport] = useState(true);
    const rafRef = useRef(null);
    const lastPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = (e) => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                lastPosition.current = { x: e.clientX, y: e.clientY };
                setPosition({ x: e.clientX, y: e.clientY });
            });
        };

        const handleMouseEnter = () => setIsInViewport(true);
        const handleMouseLeave = () => setIsInViewport(false);

        window.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return { x: position.x, y: position.y, isInViewport };
};
