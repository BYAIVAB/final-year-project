import { motion } from 'framer-motion';
import AnimatedHeadline from './AnimatedHeadline';
import FloatingElements from './FloatingElements';
import CTAButtons from './CTAButtons';
import HeroIllustration from './HeroIllustration';

const HeroSection = ({ onChatClick }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 flex flex-col-reverse items-center relative">

          {/* Text Content */}
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 lg:text-left text-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                MindEase Assistant 2.0 Now Live
              </div>
            </motion.div>

            <AnimatedHeadline />

            <motion.p
              className="mt-6 text-lg text-slate-300 sm:text-xl lg:max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Transform your medical research with our advanced RAG-powered AI.
              Get instant, cited answers from thousands of trusted medical documents
              with interactive real-time analytics.
            </motion.p>

            <CTAButtons onChatClick={onChatClick} />

            <motion.div
              className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0E27] bg-slate-700 flex items-center justify-center text-xs font-bold text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-500/40"></div>
                    <span className="relative z-10">U{i}</span>
                  </div>
                ))}
              </div>
              <span>Trusted by <strong>10,000+</strong> healthcare professionals</span>
            </motion.div>
          </div>

          {/* Illustration/Visuals */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none relative">
            <FloatingElements />
            <HeroIllustration />
          </div>

        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;
