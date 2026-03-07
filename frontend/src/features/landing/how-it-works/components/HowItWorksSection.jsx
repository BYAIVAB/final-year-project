import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Upload Documents",
    description: "Securely drag and drop your clinical guidelines, research papers, or patient anonymized records. Supports PDF, TXT, and DOCX.",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    )
  },
  {
    number: "02",
    title: "Vector Processing",
    description: "The RAG engine parses, chunks, and creates high-dimensional vector embeddings using advanced medical embedding models.",
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Semantic Querying",
    description: "Ask complex medical questions in natural language. The system retrieves the most relevant semantic matches instantly.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    number: "04",
    title: "AI Synthesis",
    description: "The local LLM synthesizes the retrieved contexts into a coherent, highly accurate answer complete with citations.",
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

const HowItWorksSection = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How the RAG Engine Works
        </motion.h2>
        <p className="text-slate-400 text-lg">A seamless pipeline from unstructured data to clinical insights.</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent transform md:-translate-x-1/2"></div>

        <div className="space-y-12 relative">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                {/* Content Side */}
                <div className={`md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                  <div className="bg-[#0A0E27]/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:border-slate-500 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3 md:hidden">
                      <span className="text-slate-500 text-sm font-mono">{step.number}</span>
                      {step.title}
                    </h3>
                    <h3 className="hidden md:block text-xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 w-16 h-16 rounded-full bg-[#0A0E27] border-4 border-[#050814] flex items-center justify-center transform -translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.2)] z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2">
                  <div className={`text-6xl font-black text-white/5 ${isEven ? 'text-left pl-16' : 'text-right pr-16'}`}>
                    {step.number}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
