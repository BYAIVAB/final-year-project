// Comprehensive Static Mock Data for Dashboard
// This provides all the data needed for the static dashboard display

import { mockAnalytics } from './mockAnalytics';
import { activityFeed } from './mockActivityFeed';
import { liveQueries } from './mockLiveFeed';

// ============================================
// HERO METRICS DATA
// ============================================
export const heroMetricsData = {
  accuracyRate: 94,
  totalQueries: 1247,
  documentsProcessed: 156,
  activeSessions: 24,
  avgResponseTime: '2.3s',
  avgResponseTimeMs: 2300,
  systemHealth: 99.8,
  queryGrowth: 12,
  documentGrowth: 8,
  sessionGrowth: 15,
  // Sparkline data for mini trends
  sparklineData: {
    queries: [120, 145, 167, 189, 210, 198, 176, 155, 142, 168, 195, 220],
    documents: [45, 52, 48, 61, 58, 72, 68, 75, 82, 78, 85, 92],
    sessions: [18, 22, 19, 25, 28, 24, 31, 27, 33, 29, 35, 32]
  }
};

// ============================================
// QUERY TYPES (PIE/DONUT CHART)
// ============================================
export const queryTypesData = [
  { name: 'Symptoms', value: 42, color: '#3B82F6' },
  { name: 'Diagnosis', value: 28, color: '#8B5CF6' },
  { name: 'Treatment', value: 18, color: '#10B981' },
  { name: 'General', value: 12, color: '#F59E0B' }
];

// ============================================
// RESPONSE TIME (LINE/AREA CHART)
// ============================================
export const responseTimeData = [
  { time: '00:00', ms: 850, queries: 45 },
  { time: '04:00', ms: 720, queries: 32 },
  { time: '08:00', ms: 950, queries: 78 },
  { time: '12:00', ms: 1200, queries: 125 },
  { time: '16:00', ms: 1050, queries: 156 },
  { time: '20:00', ms: 880, queries: 98 },
  { time: '24:00', ms: 800, queries: 67 }
];

// ============================================
// DOCUMENT USAGE (BAR CHART)
// ============================================
export const documentUsageData = [
  { name: 'Medical Guidelines 2024', queries: 248, percentage: 45 },
  { name: 'Cardiology Handbook', queries: 156, percentage: 28 },
  { name: 'Diabetes Management', queries: 98, percentage: 18 },
  { name: 'General Medicine', queries: 67, percentage: 12 },
  { name: 'Pharmacology Ref', queries: 45, percentage: 8 }
];

// ============================================
// TOP TOPICS (PROGRESS BARS)
// ============================================
export const topTopicsData = [
  { topic: 'Cardiovascular', icon: '🫀', score: 89, trend: '+12%', color: '#EF4444' },
  { topic: 'Neurology', icon: '🧠', score: 76, trend: '+8%', color: '#8B5CF6' },
  { topic: 'Diabetes', icon: '🩺', score: 64, trend: '-3%', color: '#3B82F6' },
  { topic: 'Orthopedics', icon: '🦴', score: 52, trend: '+15%', color: '#F59E0B' },
  { topic: 'Pharmacology', icon: '💊', score: 41, trend: '+5%', color: '#10B981' }
];

// ============================================
// ACTIVITY FEED (TIMELINE)
// ============================================
export const activityFeedData = [
  { id: 1, type: 'query', user: 'Dr. Smith', action: 'queried', target: 'vaccine efficacy', time: '2 mins ago', status: 'success' },
  { id: 2, type: 'system', user: 'System', action: 'updated', target: 'Pinecone Vector Index', time: '15 mins ago', status: 'info' },
  { id: 3, type: 'alert', user: 'System', action: 'detected', target: 'High latency spike', time: '1 hour ago', status: 'warning' },
  { id: 4, type: 'user', user: 'Nurse Joy', action: 'logged in', target: 'from IP 192.168.1.5', time: '2 hours ago', status: 'success' },
  { id: 5, type: 'query', user: 'Dr. House', action: 'queried', target: 'lupus diagnosis criteria', time: '3 hours ago', status: 'success' },
  { id: 6, type: 'system', user: 'System', action: 'processed', target: '247 document chunks', time: '4 hours ago', status: 'info' },
  { id: 7, type: 'query', user: 'Dr. Wilson', action: 'queried', target: 'drug interactions', time: '5 hours ago', status: 'success' },
  { id: 8, type: 'user', user: 'Dr. Chen', action: 'uploaded', target: 'Clinical_Notes.pdf', time: '6 hours ago', status: 'success' }
];

// ============================================
// LIVE QUERIES (SCROLLING FEED)
// ============================================
export const liveQueriesData = [
  "What are the contraindications for Amiodarone?",
  "Latest guidelines on managing hypertension in elderly patients.",
  "Dosing for pediatric amoxicillin for otitis media.",
  "Side effects of long-term statin use.",
  "Compare efficacy of SSRIs vs SNRIs.",
  "Management of acute severe asthma exacerbation.",
  "Diagnosis criteria for systemic lupus erythematosus (SLE).",
  "Treatment options for drug-resistant tuberculosis.",
  "Post-operative care for total knee arthroplasty.",
  "Interactions between warfarin and grapefruit juice."
];

// ============================================
// ENGAGEMENT HEATMAP (CALENDAR)
// ============================================
export const engagementHeatmapData = generateHeatmapData();

function generateHeatmapData() {
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseCount = isWeekend ? 20 : 60;
    const variance = Math.floor(Math.random() * 40);
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: baseCount + variance,
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]
    });
  }
  
  return data;
}

// ============================================
// DAILY TRENDS (7-DAY CHART)
// ============================================
export const dailyTrendsData = [
  { name: 'Mon', queries: 145, documents: 12, latency: 890 },
  { name: 'Tue', queries: 167, documents: 18, latency: 920 },
  { name: 'Wed', queries: 189, documents: 15, latency: 850 },
  { name: 'Thu', queries: 210, documents: 22, latency: 1100 },
  { name: 'Fri', queries: 198, documents: 19, latency: 980 },
  { name: 'Sat', queries: 142, documents: 8, latency: 750 },
  { name: 'Sun', queries: 125, documents: 6, latency: 680 }
];

// ============================================
// SYSTEM LATENCY METRICS
// ============================================
export const systemLatencyData = {
  p50: 450,
  p95: 1200,
  p99: 2100,
  current: 520,
  status: 'Optimal'
};

// ============================================
// ACCURACY BREAKDOWN
// ============================================
export const accuracyBreakdownData = {
  score: 94,
  correct: 2847,
  partial: 156,
  missed: 42,
  confidence: 87,
  label: 'Excellent'
};

// ============================================
// COMPLETE STATIC DASHBOARD DATA
// ============================================
export const staticDashboardData = {
  heroMetrics: heroMetricsData,
  queryCategories: queryTypesData,
  topicDistribution: topTopicsData,
  dailyTrends: dailyTrendsData,
  activityFeed: activityFeedData,
  systemLatency: systemLatencyData,
  documentUsage: documentUsageData,
  engagementHeatmap: engagementHeatmapData,
  accuracyBreakdown: accuracyBreakdownData,
  liveQueries: liveQueriesData,
  responseTimeline: responseTimeData
};

// Re-export from other mock files
export { mockAnalytics, activityFeed, liveQueries };

export default staticDashboardData;
