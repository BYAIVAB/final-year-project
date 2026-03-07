import { motion } from 'framer-motion';

const FloatingChatButton = ({ isOpen, onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 ${isOpen ? 'bg-slate-800 text-slate-400 rotate-90 scale-90' : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105'
                }`}
            animate={!isOpen ? {
                boxShadow: ['0 0 20px rgba(59,130,246,0.5)', '0 0 40px rgba(59,130,246,0.8)', '0 0 20px rgba(59,130,246,0.5)']
            } : {}}
            transition={!isOpen ? { duration: 2, repeat: Infinity } : {}}
        >
            {isOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <div className="relative">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </div>
            )}
        </motion.button>
    );
};

export default FloatingChatButton;
