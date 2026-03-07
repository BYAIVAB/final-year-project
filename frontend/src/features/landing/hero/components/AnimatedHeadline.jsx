import { motion } from 'framer-motion';
import useTypewriter from '../hooks/useTypewriter';

const AnimatedHeadline = () => {
  const { displayedText } = useTypewriter('Answers', 60, 500);

  return (
    <motion.h1
      className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <span className="block mb-2">Instant Medical</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
        Knowledge &amp; {displayedText}
      </span>
      <span className="animate-pulse ml-1 text-blue-400">|</span>
    </motion.h1>
  );
};

export default AnimatedHeadline;
