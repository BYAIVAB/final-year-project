import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroMetricCard } from './hero-metrics/HeroMetricCard';
import { QueryTypesChart } from './analytics/QueryTypesChart';
import { ResponseTimeChart } from './analytics/ResponseTimeChart';
import { DocumentUsageChart } from './analytics/DocumentUsageChart';
import { TopTopicsCard } from './analytics/TopTopicsCard';
import { UserEngagementCard } from './analytics/UserEngagementCard';
import AccuracyGauge from './analytics/AccuracyGauge';
import { ActivityTimeline } from './activity/ActivityTimeline';
import { LiveFeed } from './live-feed/LiveFeed';

import { MagneticCard, SpotlightEffect, TiltCard, RippleEffect, MouseTrail } from '../../cursor-effects';

// Import dashboard data hook for real-time API data
import { useDashboardData } from '../../../../hooks/useDashboardData';

const DashboardGrid = () => {
  const [mouseTrailEnabled, setMouseTrailEnabled] = useState(false);

  // Fetch real-time data from backend API with 30s refresh interval
  const { data, loading, error, lastUpdated, refresh, isStale } = useDashboardData(30000);

  // Extract data from hook with fallback to empty defaults
  const heroMetrics = data?.heroMetrics || { totalQueries: 0, documentsProcessed: 0, activeSessions: 0, accuracyRate: 0, queryGrowth: 0, documentGrowth: 0, sessionGrowth: 0 };
  const queryCategories = data?.queryCategories || [];
  const topicDistribution = data?.topicDistribution || [];
  const dailyTrends = data?.dailyTrends || [];
  const activityFeed = data?.activityFeed || [];
  const systemLatency = data?.systemLatency || { p50: 0, p95: 0, p99: 0 };
  const docUsage = data?.raw?.analytics?.document_usage || [];

  return (
    <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
      {/* Optional Mouse Trail Effect */}
      <MouseTrail enabled={mouseTrailEnabled} trailLength={6} color="#3B82F6" />

      {/* Dashboard Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white">System Analytics & Monitoring</h2>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              loading ? 'bg-yellow-500/20 text-yellow-400' :
              error ? 'bg-red-500/20 text-red-400' :
              isStale ? 'bg-orange-500/20 text-orange-400' :
              'bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-pulse'
            }`}>
              {loading ? 'LOADING' : error ? 'ERROR' : isStale ? 'STALE' : 'LIVE'}
            </span>
          </div>
          <p className="text-slate-400">
            Real-time performance and usage metrics of the MedAI Assistant
            {lastUpdated && !loading && (
              <span className="text-slate-500 ml-2 text-sm">
                • Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </p>
          {error && (
            <p className="text-red-400 text-sm mt-1">
              ⚠️ {error} - Showing cached data
            </p>
          )}
        </motion.div>
        <div className="flex items-center gap-3">
          {/* Manual Refresh Button */}
          <button
            onClick={refresh}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
              loading
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
            }`}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs font-medium">{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          {/* Mouse Trail Toggle */}
          <button
            onClick={() => setMouseTrailEnabled(!mouseTrailEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
              mouseTrailEnabled 
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="text-xs font-medium">Cursor Effects</span>
          </button>
          
          {/* Live Status */}
          <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 backdrop-blur-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${
              loading ? 'bg-yellow-500' :
              error ? 'bg-red-500' :
              'bg-green-500 animate-pulse'
            }`}></div>
            <span className="text-sm font-medium text-slate-300">
              {loading ? 'Syncing...' : error ? 'Connection Error' : 'Live Data Sync Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <RippleEffect className="cursor-pointer">
          <MagneticCard strength="low">
            <HeroMetricCard
              title="Accuracy Rate"
              value={heroMetrics.accuracyRate || 0}
              suffix="%"
              trend={0}
              color="#10B981"
              icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </MagneticCard>
        </RippleEffect>

        <RippleEffect className="cursor-pointer">
          <MagneticCard strength="low">
            <HeroMetricCard
              title="Total Queries"
              value={heroMetrics.totalQueries || 0}
              trend={heroMetrics.queryGrowth || 0}
              color="#3B82F6"
              icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
            />
          </MagneticCard>
        </RippleEffect>

        <RippleEffect className="cursor-pointer">
          <MagneticCard strength="low">
            <HeroMetricCard
              title="Documents Processed"
              value={heroMetrics.documentsProcessed || 0}
              trend={heroMetrics.documentGrowth || 0}
              color="#8B5CF6"
              icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
          </MagneticCard>
        </RippleEffect>

        <RippleEffect className="cursor-pointer">
          <MagneticCard strength="low">
            <HeroMetricCard
              title="Active Sessions"
              value={heroMetrics.activeSessions || 0}
              trend={heroMetrics.sessionGrowth || 0}
              color="#F59E0B"
              icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
          </MagneticCard>
        </RippleEffect>
      </div>

      {/* Main Analytics Grid - Bento Box Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Main Charts) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SpotlightEffect radius={400} intensity={0.5}>
            <TiltCard options={{ maxTilt: 3, scale: 1 }}>
              <div className="glass-card p-6 rounded-2xl h-[350px]">
                <ResponseTimeChart data={dailyTrends} latency={systemLatency} />
              </div>
            </TiltCard>
          </SpotlightEffect>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[350px]">
            <SpotlightEffect radius={300} intensity={0.6}>
              <TiltCard options={{ maxTilt: 5, scale: 1 }}>
                <div className="glass-card p-6 border border-slate-700/50 bg-[#0A0E27]/80 rounded-2xl h-full flex flex-col justify-center items-center">
                  <QueryTypesChart data={queryCategories} />
                </div>
              </TiltCard>
            </SpotlightEffect>

            <SpotlightEffect radius={300} intensity={0.6}>
              <TiltCard options={{ maxTilt: 5, scale: 1 }}>
                <div className="glass-card p-6 border border-slate-700/50 bg-[#0A0E27]/80 rounded-2xl h-full">
                  <DocumentUsageChart data={docUsage} totalDocuments={heroMetrics.documentsProcessed} />
                </div>
              </TiltCard>
            </SpotlightEffect>
          </div>

          <SpotlightEffect radius={400} intensity={0.5}>
            <div className="glass-card p-6 border border-slate-700/50 bg-[#0A0E27]/80 rounded-2xl h-[350px]">
              <UserEngagementCard data={dailyTrends} totalQueries={heroMetrics.totalQueries} />
            </div>
          </SpotlightEffect>
        </div>

        {/* Right Column (Feeds & Summaries) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <SpotlightEffect radius={300} intensity={0.6}>
            <RippleEffect className="cursor-pointer h-full">
              <div className="glass-card p-6 border border-slate-700/50 bg-[#0A0E27]/80 rounded-2xl h-[350px]">
                <AccuracyGauge value={heroMetrics.accuracyRate} />
              </div>
            </RippleEffect>
          </SpotlightEffect>

          <SpotlightEffect radius={300} intensity={0.6}>
            <div className="glass-card p-6 border border-slate-700/50 bg-[#0A0E27]/80 rounded-2xl h-[350px]">
              <TopTopicsCard data={topicDistribution} />
            </div>
          </SpotlightEffect>

          <SpotlightEffect radius={300} intensity={0.6}>
            <div className="glass-card p-6 border border-slate-700/50 bg-[#0A0E27]/80 rounded-2xl h-[450px]">
              <ActivityTimeline data={activityFeed} />
            </div>
          </SpotlightEffect>

          <SpotlightEffect radius={300} intensity={0.6}>
            <div className="glass-card p-6 border border-slate-700/50 bg-[#0A0E27]/80 rounded-2xl h-[300px]">
              <LiveFeed data={activityFeed} />
            </div>
          </SpotlightEffect>
        </div>

      </div>
    </div>
  );
};

export default DashboardGrid;
