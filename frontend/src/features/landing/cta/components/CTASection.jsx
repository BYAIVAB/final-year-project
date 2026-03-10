import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 relative z-10 w-full">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/40 via-[#0A0E27] to-purple-900/40 border border-slate-700/50 p-10 md:p-16 text-center">

        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            Enterprise Ready
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to elevate your <br className="hidden md:block" /> clinical data search?
          </h2>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of medical professionals using MindEase Assistant to extract insights, verify information, and improve patient outcomes through the power of RAG architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1"
            >
              Launch Chat Application
            </button>
            <button
              onClick={() => window.open('https://github.com/byaiv/medical-rag-chatbot-complete', '_blank')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm border border-slate-600 transition-all hover:border-slate-400 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View Documentation
            </button>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            No credit card required. Connects to your local Ollama instance securely.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;
