import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardGrid from '../../features/landing/dashboard/components/DashboardGrid';
import GridBackground from '../../components/Layout/GridBackground';
import { CursorGlow } from '../../features/landing/cursor-effects';
import { useDashboardData } from '../../hooks/useDashboardData';

const DashboardPage = () => {
  const { data, loading, error, lastUpdated, refresh, isStale } = useDashboardData(30000);

  return (
    <div className="min-h-screen bg-arc-navy relative overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0">
        <GridBackground />
      </div>

      {/* Cursor Glow Effect */}
      <CursorGlow />

      {/* Dashboard Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E27]/90 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">MindEase</span>
          </Link>

          {/* Breadcrumb & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              <span className="text-slate-600">/</span>
              <span className="text-blue-400">Dashboard</span>
            </div>
            
            {/* Last Updated & Refresh */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {lastUpdated && (
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
              {isStale && (
                <span className="text-yellow-500">(Stale)</span>
              )}
              <button
                onClick={refresh}
                disabled={loading}
                className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <svg 
                  className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
            <Link 
              to="/chat" 
              className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Open Chat
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16">
        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 mb-4"
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-red-300">{error}</span>
              <button
                onClick={refresh}
                className="ml-auto text-xs text-red-400 hover:text-red-300 underline"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400">Loading dashboard data...</p>
          </motion.div>
        )}

        {/* Dashboard Grid */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardGrid data={data} onRefresh={refresh} loading={loading} />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
          MindEase Dashboard - Real-time Analytics & Monitoring
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
