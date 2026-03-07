// Dashboard components
export { default as DashboardGrid } from './components/DashboardGrid'

// Hero Metrics
export { 
  HealthScoreCard,
  TotalQueriesCard,
  AvgResponseTimeCard,
  ActiveSessionsCard 
} from './components/hero-metrics'

// Analytics
export {
  QueryTypesChart,
  ResponseTimeChart,
  DocumentUsageChart,
  AccuracyMetricsCard,
  TopTopicsCard
} from './components/analytics'

// Activity
export {
  ActivityTimeline,
  LiveFeed
} from './components/activity'

// Static Mock Data
export {
  staticDashboardData,
  heroMetricsData,
  queryTypesData,
  topTopicsData,
  dailyTrendsData,
  activityFeedData,
  systemLatencyData,
  documentUsageData,
  engagementHeatmapData,
  liveQueriesData
} from './data/mockDashboardData'

// Cursor Effects
export {
  useCursorPosition,
  useMagneticEffect,
  useParallaxMouse,
  useHoverTilt
} from './cursor-effects/hooks'