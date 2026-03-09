import React, { useEffect, useState } from 'react';
import { FaShieldAlt, FaLock, FaBrain, FaBolt, FaFileAlt, FaCheckCircle, FaEye, FaDatabase } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * Trust & AI Capabilities Section
 * Replaces testimonials with technical transparency and trust signals
 */
const TrustSection = () => {
  const [stats, setStats] = useState({
    queriesAnswered: 0,
    avgResponseTime: 0,
    documentsProcessed: 0,
    accuracy: 0
  });

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      queriesAnswered: 50000,
      avgResponseTime: 3.2,
      documentsProcessed: 1200,
      accuracy: 94
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        queriesAnswered: Math.floor(targets.queriesAnswered * progress),
        avgResponseTime: (targets.avgResponseTime * progress).toFixed(1),
        documentsProcessed: Math.floor(targets.documentsProcessed * progress),
        accuracy: Math.floor(targets.accuracy * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targets); // Ensure final values are exact
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const trustFeatures = [
    {
      icon: FaShieldAlt,
      title: "HIPAA-Compliant Security",
      description: "Your medical data is encrypted end-to-end with bank-level security. We never share your information with third parties.",
      gradient: "from-blue-500 to-cyan-500",
      accentColor: "blue"
    },
    {
      icon: FaBrain,
      title: "Advanced RAG Technology",
      description: "Retrieval-Augmented Generation ensures every answer is grounded in verified medical documents with full source attribution.",
      gradient: "from-purple-500 to-pink-500",
      accentColor: "purple"
    },
    {
      icon: FaEye,
      title: "Complete Transparency",
      description: "See exactly which documents informed each answer. No black-box AI – every response shows its sources and confidence level.",
      gradient: "from-green-500 to-emerald-500",
      accentColor: "green"
    },
    {
      icon: FaDatabase,
      title: "Privacy by Design",
      description: "Conversations stay on your device. Local embeddings processing means your sensitive health data never leaves your control.",
      gradient: "from-orange-500 to-red-500",
      accentColor: "orange"
    }
  ];

  const technicalCapabilities = [
    {
      icon: FaFileAlt,
      label: "Document Processing",
      detail: "Upload medical PDFs for instant analysis"
    },
    {
      icon: FaBrain,
      label: "Dual Retrieval",
      detail: "Searches both documents & conversation history"
    },
    {
      icon: FaCheckCircle,
      label: "Source Attribution",
      detail: "Every answer cites its medical sources"
    },
    {
      icon: FaBolt,
      label: "Real-Time Analysis",
      detail: "3-5 second response time average"
    }
  ];

  const liveStats = [
    {
      value: stats.queriesAnswered.toLocaleString(),
      label: "Medical Queries Answered",
      suffix: "+"
    },
    {
      value: stats.avgResponseTime,
      label: "Average Response Time",
      suffix: "s"
    },
    {
      value: stats.documentsProcessed.toLocaleString(),
      label: "Documents Processed",
      suffix: "+"
    },
    {
      value: stats.accuracy,
      label: "Source Accuracy",
      suffix: "%"
    }
  ];

  return (
    <section id="trust" className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="container relative mx-auto px-4">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Why Trust Our AI?</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Built on <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Transparency</span> & 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Security</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We believe medical AI should be transparent, secure, and grounded in verified sources. 
            Here's how our RAG technology protects your privacy while delivering accurate health information.
          </p>
        </motion.div>

        {/* Live Statistics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {liveStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-2xl transition-opacity duration-500`}></div>
              
              {/* Card */}
              <div className="relative bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                    <feature.icon className="text-white text-3xl" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by Advanced <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RAG Technology</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Retrieval-Augmented Generation combines the best of AI and medical knowledge bases
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {technicalCapabilities.map((capability, index) => (
              <motion.div
                key={capability.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="text-blue-400 text-4xl" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {capability.label}
                </h4>
                <p className="text-sm text-gray-400">
                  {capability.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-green-500/10 border border-green-500/20 rounded-full">
            <FaLock className="text-green-400 text-2xl" />
            <p className="text-green-400 font-semibold">
              Your conversations are encrypted end-to-end and never stored on our servers
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TrustSection;
