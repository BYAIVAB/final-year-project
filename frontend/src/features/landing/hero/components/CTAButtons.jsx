import { motion } from 'framer-motion';

const CTAButtons = ({ onChatClick }) => {
  return (
    <motion.div
      className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <button
        onClick={onChatClick}
        className="px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:-translate-y-1 flex items-center justify-center gap-2"
      >
        <span>Start Conversation</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      <button className="px-8 py-4 rounded-xl font-semibold text-white bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-700 transition-all hover:border-slate-500 flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Watch Demo</span>
      </button>
    </motion.div>
  );
};

export default CTAButtons;
