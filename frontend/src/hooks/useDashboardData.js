import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/api'

/**
 * Custom hook for fetching and managing dashboard data
 * Provides real-time updates with configurable refresh interval
 */
export function useDashboardData(refreshInterval = 30000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const intervalRef = useRef(null)

  // Fetch dashboard data from API
  const fetchDashboardData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true)
      }
      setError(null)

      const response = await api.get('/api/metrics/dashboard')
      const dashboardData = response.data

      // Transform API response to match component expectations
      const transformedData = transformDashboardData(dashboardData)
      
      setData(transformedData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to fetch dashboard data')
      
      // If no data exists yet, set fallback data
      if (!data) {
        setData(getFallbackData())
      }
    } finally {
      setLoading(false)
    }
  }, [data])

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchDashboardData(false)
  }, [fetchDashboardData])

  // Initial fetch and interval setup
  useEffect(() => {
    fetchDashboardData(true)

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchDashboardData(false)
      }, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval]) // Intentionally not including fetchDashboardData to avoid infinite loop

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated && (Date.now() - lastUpdated.getTime() > refreshInterval * 2)
  }
}

/**
 * Transform API response to match dashboard component expectations
 */
function transformDashboardData(apiData) {
  if (!apiData) return getFallbackData()

  const { hero_metrics, analytics, activity_feed, system_latency } = apiData

  // Extract values from nested hero_metrics structure
  const totalQueries = typeof hero_metrics?.total_queries === 'object'
    ? hero_metrics.total_queries.all_time || hero_metrics.total_queries.today || 0
    : hero_metrics?.total_queries || 0
  
  const avgResponseTime = typeof hero_metrics?.avg_response_time === 'object'
    ? hero_metrics.avg_response_time.current || 0
    : hero_metrics?.avg_response_time || 0
  
  const activeSessions = typeof hero_metrics?.active_sessions === 'object'
    ? hero_metrics.active_sessions.count || 0
    : hero_metrics?.active_sessions || 0
  
  const systemHealth = typeof hero_metrics?.system_health === 'object'
    ? hero_metrics.system_health.score || 99.8
    : hero_metrics?.system_health || 99.8

  const queryGrowth = typeof hero_metrics?.total_queries === 'object'
    ? hero_metrics.total_queries.percentage_change || 0
    : 0

  const accuracyRate = typeof analytics?.rag_accuracy === 'object'
    ? analytics.rag_accuracy.score || 94
    : analytics?.rag_accuracy || 94

  return {
    // Hero metrics for stat cards
    heroMetrics: {
      totalQueries: totalQueries,
      documentsProcessed: hero_metrics?.documents_processed || 0,
      activeSessions: activeSessions,
      avgResponseTime: avgResponseTime > 0 
        ? `${(avgResponseTime / 1000).toFixed(1)}s`
        : '0s',
      avgResponseTimeMs: avgResponseTime,
      systemHealth: systemHealth,
      accuracyRate: accuracyRate,
      queryGrowth: queryGrowth,
      documentGrowth: hero_metrics?.document_growth || 0,
      sessionGrowth: hero_metrics?.session_growth || 0
    },

    // Query categories for pie chart - handle both formats
    queryCategories: transformQueryCategories(analytics?.query_distribution || analytics?.query_categories),

    // Topic distribution for bar chart
    topicDistribution: transformTopicDistribution(analytics?.top_topics || analytics?.topic_distribution),

    // Daily trends for area chart - use response_timeline as fallback
    dailyTrends: transformDailyTrends(analytics?.daily_trends || analytics?.response_timeline),

    // Activity feed for timeline
    activityFeed: transformActivityFeed(activity_feed),

    // System latency metrics - handle both array and object formats
    systemLatency: transformSystemLatency(system_latency),

    // RAG accuracy breakdown
    accuracyBreakdown: analytics?.rag_accuracy?.breakdown || {
      correct: 0,
      partial: 0,
      missed: 0
    },

    // Raw data for custom processing
    raw: apiData
  }
}

/**
 * Transform system latency to consistent format
 */
function transformSystemLatency(latency) {
  if (!latency) {
    return { p50: 0, p95: 0, p99: 0 }
  }
  
  // If it's an array (response_timeline), calculate from it
  if (Array.isArray(latency)) {
    const times = latency.map(l => l.avg_time || l.latency || 0).filter(t => t > 0)
    if (times.length > 0) {
      times.sort((a, b) => a - b)
      return {
        p50: times[Math.floor(times.length * 0.5)] || 0,
        p95: times[Math.floor(times.length * 0.95)] || 0,
        p99: times[Math.floor(times.length * 0.99)] || 0
      }
    }
  }
  
  // If it's an object with p50, p95, p99
  return {
    p50: latency.p50_ms || latency.p50 || 0,
    p95: latency.p95_ms || latency.p95 || 0,
    p99: latency.p99_ms || latency.p99 || 0
  }
}

/**
 * Transform query categories for PieChart
 */
function transformQueryCategories(categories) {
  // Handle array format from query_distribution
  if (Array.isArray(categories) && categories.length > 0) {
    return categories.map(item => ({
      name: item.category || item.name || 'Unknown',
      value: item.count || item.percentage || item.value || 0,
      color: item.color || '#6B7280'
    }))
  }

  // Handle object format
  if (categories && typeof categories === 'object' && !Array.isArray(categories) && Object.keys(categories).length > 0) {
    const colorMap = {
      symptoms: '#3B82F6',
      diagnosis: '#10B981',
      treatment: '#F59E0B',
      prevention: '#8B5CF6',
      general: '#EC4899'
    }

    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value || 0,
      color: colorMap[name.toLowerCase()] || '#6B7280'
    }))
  }

  // Return default empty data
  return [
    { name: 'Symptoms', value: 0, color: '#3B82F6' },
    { name: 'Diagnosis', value: 0, color: '#10B981' },
    { name: 'Treatment', value: 0, color: '#F59E0B' },
    { name: 'Prevention', value: 0, color: '#8B5CF6' },
    { name: 'General', value: 0, color: '#EC4899' }
  ]
}

/**
 * Transform topic distribution for BarChart
 */
function transformTopicDistribution(topics) {
  // Handle array format from top_topics
  if (Array.isArray(topics) && topics.length > 0) {
    return topics.map(item => ({
      name: item.topic || item.name || 'Unknown',
      queries: item.count || item.queries || item.percentage || 0,
      trend: item.trend || '0%'
    })).slice(0, 8)
  }

  // Handle object format
  if (topics && typeof topics === 'object' && !Array.isArray(topics) && Object.keys(topics).length > 0) {
    return Object.entries(topics)
      .map(([name, queries]) => ({
        name,
        queries: queries || 0
      }))
      .sort((a, b) => b.queries - a.queries)
      .slice(0, 8)
  }

  // Return default empty data
  return [
    { name: 'Cardiovascular', queries: 0 },
    { name: 'Neurology', queries: 0 },
    { name: 'Diabetes', queries: 0 },
    { name: 'Respiratory', queries: 0 },
    { name: 'Mental Health', queries: 0 }
  ]
}

/**
 * Transform daily trends for AreaChart
 */
function transformDailyTrends(trends) {
  // Handle array of response timeline data
  if (Array.isArray(trends) && trends.length > 0) {
    // Check if it's response_timeline format (has hour field)
    if (trends[0].hour !== undefined) {
      // Group by taking every 4th item to create 6 data points
      const step = Math.max(1, Math.floor(trends.length / 7))
      return trends
        .filter((_, i) => i % step === 0)
        .slice(0, 7)
        .map(item => ({
          name: item.hour || item.name || '',
          queries: item.query_count || item.queries || 0,
          documents: item.documents || 0,
          latency: item.avg_time || item.latency || 0
        }))
    }
    
    // Standard daily trends format
    return trends.map(day => ({
      name: day.day_name || day.date?.slice(5) || day.name || '',
      queries: day.queries || day.query_count || 0,
      documents: day.documents || 0
    }))
  }

  // Generate placeholder data for last 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()
  
  return Array.from({ length: 7 }, (_, i) => ({
    name: days[(today - 6 + i + 7) % 7],
    queries: 0,
    documents: 0
  }))
}

/**
 * Transform activity feed for ActivityTimeline
 */
function transformActivityFeed(activities) {
  if (!activities || activities.length === 0) {
    return []
  }

  return activities.map(activity => ({
    id: activity._id || activity.id || Math.random().toString(36),
    type: activity.type || 'query',
    title: getActivityTitle(activity),
    description: activity.description || '',
    timestamp: activity.timestamp || new Date().toISOString(),
    icon: getActivityIcon(activity.type),
    color: getActivityColor(activity.type)
  }))
}

/**
 * Get activity title based on type
 */
function getActivityTitle(activity) {
  switch (activity.type) {
    case 'query':
      return `Query: "${truncateText(activity.query || 'Medical question', 40)}"`
    case 'document':
      return `Document uploaded: ${activity.filename || 'Unknown file'}`
    case 'session':
      return 'New session started'
    default:
      return activity.title || 'Activity'
  }
}

/**
 * Get icon for activity type
 */
function getActivityIcon(type) {
  switch (type) {
    case 'query': return '💬'
    case 'document': return '📄'
    case 'session': return '👤'
    default: return '📌'
  }
}

/**
 * Get color for activity type
 */
function getActivityColor(type) {
  switch (type) {
    case 'query': return '#3B82F6'
    case 'document': return '#10B981'
    case 'session': return '#8B5CF6'
    default: return '#6B7280'
  }
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get fallback data when API fails
 */
function getFallbackData() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()

  return {
    heroMetrics: {
      totalQueries: 0,
      documentsProcessed: 0,
      activeSessions: 0,
      avgResponseTime: '0s',
      accuracyRate: 0,
      queryGrowth: 0,
      documentGrowth: 0,
      sessionGrowth: 0
    },
    queryCategories: [
      { name: 'Symptoms', value: 0, color: '#3B82F6' },
      { name: 'Diagnosis', value: 0, color: '#10B981' },
      { name: 'Treatment', value: 0, color: '#F59E0B' },
      { name: 'Prevention', value: 0, color: '#8B5CF6' },
      { name: 'General', value: 0, color: '#EC4899' }
    ],
    topicDistribution: [
      { name: 'Cardiovascular', queries: 0 },
      { name: 'Neurology', queries: 0 },
      { name: 'Diabetes', queries: 0 },
      { name: 'Respiratory', queries: 0 },
      { name: 'Mental Health', queries: 0 }
    ],
    dailyTrends: Array.from({ length: 7 }, (_, i) => ({
      name: days[(today - 6 + i + 7) % 7],
      queries: 0,
      documents: 0
    })),
    activityFeed: [],
    systemLatency: { p50: 0, p95: 0, p99: 0 },
    raw: null
  }
}

export default useDashboardData
