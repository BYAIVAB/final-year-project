import { motion } from 'framer-motion';

const HeroIllustration = () => {
    return (
        <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center">
            <motion.div
                className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Central glowing orb */}
            <motion.div
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-400 p-1 relative z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <div className="w-full h-full bg-[#0A0E27] rounded-full flex items-center justify-center border-4 border-[#0A0E27]">
                    <div className="w-3/4 h-3/4 bg-blue-500/20 rounded-full blur-md"></div>
                    <svg className="w-20 h-20 text-blue-400 absolute opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
            </motion.div>

            {/* Orbiting rings */}
            <motion.div
                className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] border border-blue-500/20 rounded-full"
                style={{ rotateX: 60, rotateY: 20 }}
                animate={{ rotateZ: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] border border-purple-500/10 rounded-full"
                style={{ rotateX: 60, rotateZ: 45 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            />
        </div>
    );
};

export default HeroIllustration;
