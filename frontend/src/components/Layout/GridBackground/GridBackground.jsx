import React from 'react';

const GridBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0E27]">
            {/* Dynamic Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #3B82F6 1px, transparent 1px),
            linear-gradient(to bottom, #3B82F6 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                }}
            />

            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default GridBackground;
