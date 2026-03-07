import React from 'react';
import { motion } from 'framer-motion';

const featuresData = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Retrieval",
    description: "Lightning-fast answers extracted from thousands of medical documents using advanced vector search."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Evidence-Based",
    description: "Every response is rigorously grounded in your provided literature with exact citations and page references."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "HIPAA Compliant",
    description: "Enterprise-grade security with local LLM processing options ensuring patient data never leaves your infrastructure."
  }
];

const FeaturesSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Supercharge your Clinical Workflows
        </motion.h2>
        <motion.p
          className="text-lg text-slate-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A powerful suite of AI tools designed specifically for the rigorous demands of healthcare professionals and medical researchers.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            className="group relative p-8 rounded-2xl bg-[#0A0E27]/50 border border-slate-700/50 backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
