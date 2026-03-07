import React, { useState } from 'react';

export const RippleEffect = ({ children }) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = {
            id: Date.now(),
            x,
            y
        };

        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 800);
    };

    return (
        <div
            onClick={handleClick}
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            {children}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                        position: 'absolute',
                        left: ripple.x,
                        top: ripple.y,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.4)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        animation: 'ripple-animation 0.8s ease-out forwards'
                    }}
                />
            ))}
        </div>
    );
};
