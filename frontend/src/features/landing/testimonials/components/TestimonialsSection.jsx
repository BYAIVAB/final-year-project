import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "The Retrieval-Augmented Generation capabilities have completely transformed how our research team synthesizes past clinical trial data. It's simply unprecedented.",
    author: "Dr. Elena Rodriguez",
    role: "Chief of Oncology Research",
    institution: "Metro Health Systems"
  },
  {
    quote: "MindEase Assistant cuts through the noise. When I need specific interactions for rare drugs on call, it provides exact citations in seconds.",
    author: "James Chen, MD",
    role: "Attending Physician",
    institution: "St. Jude's Medical Center"
  },
  {
    quote: "The ability to run local LLMs keeps us fully HIPAA compliant without sacrificing the power of generative AI. It's the perfect enterprise solution.",
    author: "Sarah Jenkins",
    role: "Director of Health Informatics",
    institution: "National Care Providers"
  },
  {
    quote: "The interactive dashboard gives me real-time insights into what our residents are querying, allowing us to adjust our educational curriculum on the fly.",
    author: "Dr. Marcus Thorne",
    role: "Residency Program Director",
    institution: "University Hospital"
  }
];

const TestimonialsSection = () => {
  // Duplicate for seamless infinite scroll
  const scrollData = [...testimonials, ...testimonials];

  return (
    <div className="max-w-[100vw] overflow-hidden relative z-10 py-10">
      <div className="text-center mb-16 max-w-2xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trusted by the Medical Community
        </h2>
        <p className="text-lg text-slate-400">
          See how leading professionals are integrating MindEase into their daily clinical workflows.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">

        {/* Gradient Masks for smooth fade at edges */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-arc-navy to-transparent z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-arc-navy to-transparent z-10"></div>

        <motion.div
          className="flex space-x-6 py-4 px-6 min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40
          }}
          // Pause on hover
          whileHover={{ animationPlayState: "paused" }}
        >
          {scrollData.map((item, index) => (
            <div
              key={index}
              className="w-[350px] md:w-[450px] bg-[#0A0E27]/80 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-500 transition-colors"
            >
              <div>
                <svg className="w-8 h-8 text-blue-500/50 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">"{item.quote}"</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 font-bold">
                  {item.author.split(' ')[0][0]}{item.author.split(' ')[1]?.[0] || ''}
                </div>
                <div>
                  <h4 className="font-bold text-white">{item.author}</h4>
                  <p className="text-sm text-slate-400">{item.role}</p>
                  <p className="text-xs text-blue-400">{item.institution}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
