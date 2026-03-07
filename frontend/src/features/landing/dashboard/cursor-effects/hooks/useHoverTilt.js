import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useHoverTilt - 3D tilt effect on hover
 * 
 * @param {React.RefObject} elementRef - Ref to the element
 * @param {number} maxTilt - Maximum rotation in degrees (default 10)
 * @returns {{ transform: string, isHovered: boolean }}
 */
export const useHoverTilt = (elementRef, maxTilt = 10) => {
    const [transform, setTransform] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const rafRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!elementRef.current) return;

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            const rect = elementRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate cursor position relative to card center (-1 to 1)
            const relativeX = (e.clientX - centerX) / (rect.width / 2);
            const relativeY = (e.clientY - centerY) / (rect.height / 2);

            // Calculate rotation (inverted so card tilts toward cursor)
            const rotateY = relativeX * maxTilt;
            const rotateX = -relativeY * maxTilt;

            // Calculate light position percentage for gradient
            const lightX = 50 + relativeX * 30;
            const lightY = 50 + relativeY * 30;

            setTransform(`
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.02)
            `);

            // Set CSS custom properties for light effect
            if (elementRef.current) {
                elementRef.current.style.setProperty('--mouse-x-percent', `${lightX}%`);
                elementRef.current.style.setProperty('--mouse-y-percent', `${lightY}%`);
            }
        });
    }, [maxTilt, elementRef]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setTransform('');
        
        if (elementRef.current) {
            elementRef.current.style.setProperty('--mouse-x-percent', '50%');
            elementRef.current.style.setProperty('--mouse-y-percent', '50%');
        }
    }, [elementRef]);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [handleMouseMove, handleMouseEnter, handleMouseLeave, elementRef]);

    return { transform, isHovered };
};

export default useHoverTilt;
