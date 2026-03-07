import { motion } from 'framer-motion'

function FloatingChatButton({ onClick, isOpen }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-arc-blue to-purple-500 text-white shadow-lg shadow-arc-blue/30 flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
    >
      <motion.span
        className="text-2xl"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
      >
        💬
      </motion.span>
      <motion.span
        className="absolute text-2xl"
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      >
        ✕
      </motion.span>
      
      {/* Pulse ring */}
      {!isOpen && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-arc-blue"
          animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}

export default FloatingChatButton
