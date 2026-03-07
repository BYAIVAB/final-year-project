// Mock Analytics Data for Static Dashboard

export const mockAnalytics = {
  // Query types distribution for donut chart
  queryTypes: [
    { name: 'Symptoms', value: 42, color: '#3B82F6' },
    { name: 'Diagnosis', value: 28, color: '#8B5CF6' },
    { name: 'Treatment', value: 18, color: '#10B981' },
    { name: 'General', value: 12, color: '#F59E0B' }
  ],

  // Response timeline for line chart (24 hours of data)
  responseTimeline: Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    avgTime: parseFloat((2.0 + Math.sin(i / 4) * 1.5 + Math.random() * 0.5).toFixed(2)),
    queries: Math.floor(30 + Math.sin(i / 3) * 20 + Math.random() * 10)
  })),

  // Document usage statistics for bar chart
  documentUsage: [
    { doc: 'Medical_Guidelines_2024.pdf', references: 248, percentage: 45 },
    { doc: 'Cardiology_Handbook.pdf', references: 156, percentage: 28 },
    { doc: 'Diabetes_Management.pdf', references: 98, percentage: 18 },
    { doc: 'General_Medicine.pdf', references: 67, percentage: 12 },
    { doc: 'Pharmacology_Reference.pdf', references: 45, percentage: 8 }
  ],

  // Top trending topics
  topTopics: [
    { topic: 'Cardiovascular', icon: '🫀', percentage: 89, trend: '+12%', color: '#EF4444' },
    { topic: 'Neurology', icon: '🧠', percentage: 76, trend: '+8%', color: '#8B5CF6' },
    { topic: 'Diabetes', icon: '🩺', percentage: 64, trend: '-3%', color: '#3B82F6' },
    { topic: 'Orthopedics', icon: '🦴', percentage: 52, trend: '+15%', color: '#F59E0B' },
    { topic: 'Pharmacology', icon: '💊', percentage: 41, trend: '+5%', color: '#10B981' }
  ],

  // Engagement heatmap data (past 30 days)
  engagementHeatmap: generateHeatmapData(),

  // Accuracy metrics
  accuracyMetrics: {
    score: 94,
    correct: 2847,
    partial: 156,
    missed: 42,
    confidence: 87,
    label: 'Highly Confident'
  },

  // System latency
  systemLatency: {
    p50: 450,
    p95: 1200,
    p99: 2100,
    current: 520
  }
};

// Generate 30 days of heatmap data
function generateHeatmapData() {
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate activity patterns - weekdays higher than weekends
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

export default mockAnalytics;
