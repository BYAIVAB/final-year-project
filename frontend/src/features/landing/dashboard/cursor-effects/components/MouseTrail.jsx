import React, { useEffect, useRef } from 'react';
import { useCursorPosition } from '../hooks/useCursorPosition';

export const MouseTrail = ({
    enabled = true,
    dots = 12,
    color = 'rgba(59, 130, 246, 0.5)'
}) => {
    const { x, y, isInViewport } = useCursorPosition();
    const canvasRef = useRef(null);
    const pointsRef = useRef(Array(dots).fill({ x: 0, y: 0 }));
    const rafRef = useRef(null);

    useEffect(() => {
        if (!enabled || !canvasRef.current || !isInViewport) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const points = pointsRef.current;

            // Update first point to cursor
            points[0] = { x, y };

            // Update following points
            for (let i = 1; i < dots; i++) {
                const prev = points[i - 1];
                const current = points[i];

                // Physics logic: move towards previous point
                const dx = prev.x - current.x;
                const dy = prev.y - current.y;

                points[i] = {
                    x: current.x + dx * 0.3,
                    y: current.y + dy * 0.3
                };
            }

            // Draw trail
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < dots; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', updateSize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [x, y, enabled, dots, color, isInViewport]);

    if (!enabled || !isInViewport) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9998,
                mixBlendMode: 'screen',
            }}
        />
    );
};
