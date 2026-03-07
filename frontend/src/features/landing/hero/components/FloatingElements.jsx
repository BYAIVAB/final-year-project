import { motion } from 'framer-motion';

const FloatingElements = () => {
  const elements = [
    {
      id: 1,
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "bg-blue-500/20 border-blue-500/30",
      position: "-left-4 top-1/4",
      delay: 0,
      duration: 4
    },
    {
      id: 2,
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: "bg-purple-500/20 border-purple-500/30",
      position: "-right-4 top-1/3",
      delay: 1.5,
      duration: 5
    },
    {
      id: 3,
      icon: (
        <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: "bg-teal-500/20 border-teal-500/30",
      position: "left-12 bottom-1/4",
      delay: 2.2,
      duration: 4.5
    }
  ];

  return (
    <>
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute z-20 w-16 h-16 rounded-2xl border backdrop-blur-md flex items-center justify-center ${el.color} ${el.position}`}
          animate={{
            y: [-15, 15, -15],
            rotate: [-5, 5, -5]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut"
          }}
        >
          {el.icon}
        </motion.div>
      ))}
    </>
  );
};

export default FloatingElements;
