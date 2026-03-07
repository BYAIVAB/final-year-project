// Mock Activity Feed Data for Static Dashboard

export const activityFeed = [
  {
    id: 1,
    type: 'document_upload',
    icon: '📄',
    color: '#3B82F6',
    title: 'Document uploaded',
    description: 'Medical_guide.pdf',
    user: 'Dr. Sarah Chen',
    timestamp: Date.now() - 120000, // 2 min ago
    status: 'success'
  },
  {
    id: 2,
    type: 'query',
    icon: '💬',
    color: '#10B981',
    title: 'Query processed',
    description: '"What causes fever in patients with autoimmune disorders?"',
    user: 'Dr. James Wilson',
    timestamp: Date.now() - 300000, // 5 min ago
    status: 'success'
  },
  {
    id: 3,
    type: 'session',
    icon: '🟢',
    color: '#8B5CF6',
    title: 'Session started',
    description: 'New conversation initiated',
    user: 'Nurse Martinez',
    timestamp: Date.now() - 720000, // 12 min ago
    status: 'info'
  },
  {
    id: 4,
    type: 'analysis',
    icon: '⚙️',
    color: '#F59E0B',
    title: 'Document analyzed',
    description: '247 chunks created from Cardiology_Guide.pdf',
    user: 'System',
    timestamp: Date.now() - 1080000, // 18 min ago
    status: 'info'
  },
  {
    id: 5,
    type: 'query',
    icon: '💬',
    color: '#10B981',
    title: 'Query processed',
    description: '"Treatment options for Type 2 Diabetes"',
    user: 'Dr. Emily Santos',
    timestamp: Date.now() - 1500000, // 25 min ago
    status: 'success'
  },
  {
    id: 6,
    type: 'alert',
    icon: '⚠️',
    color: '#EF4444',
    title: 'High latency detected',
    description: 'Response time exceeded 3s threshold',
    user: 'System',
    timestamp: Date.now() - 2100000, // 35 min ago
    status: 'warning'
  },
  {
    id: 7,
    type: 'document_upload',
    icon: '📄',
    color: '#3B82F6',
    title: 'Document uploaded',
    description: 'Pharmacology_Reference_2024.pdf',
    user: 'Dr. Michael Lee',
    timestamp: Date.now() - 3000000, // 50 min ago
    status: 'success'
  },
  {
    id: 8,
    type: 'session',
    icon: '🟢',
    color: '#8B5CF6',
    title: 'Session ended',
    description: 'Conversation completed (15 exchanges)',
    user: 'Dr. Anna Kim',
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: 'info'
  }
];

// Activity type configurations
export const activityTypes = {
  document_upload: {
    icon: '📄',
    color: '#3B82F6',
    label: 'Document Upload'
  },
  query: {
    icon: '💬',
    color: '#10B981',
    label: 'Query'
  },
  session: {
    icon: '🟢',
    color: '#8B5CF6',
    label: 'Session'
  },
  analysis: {
    icon: '⚙️',
    color: '#F59E0B',
    label: 'Analysis'
  },
  alert: {
    icon: '⚠️',
    color: '#EF4444',
    label: 'Alert'
  }
};

// Helper function to format timestamp to relative time
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Generate a random activity for simulation
export function generateRandomActivity() {
  const types = Object.keys(activityTypes);
  const type = types[Math.floor(Math.random() * types.length)];
  const config = activityTypes[type];
  
  const users = ['Dr. Smith', 'Dr. Wilson', 'Nurse Joy', 'Dr. House', 'System'];
  const user = users[Math.floor(Math.random() * users.length)];
  
  const descriptions = {
    document_upload: ['Clinical_Notes.pdf', 'Research_Paper.pdf', 'Lab_Results.pdf'],
    query: [
      '"What are symptoms of hypertension?"',
      '"Treatment for migraine headaches"',
      '"Drug interactions with warfarin"'
    ],
    session: ['New conversation', 'Session resumed', 'Emergency consultation'],
    analysis: ['156 chunks processed', '89 embeddings created', 'Vector index updated'],
    alert: ['High memory usage', 'Slow response detected', 'API rate limit approaching']
  };
  
  const descList = descriptions[type] || ['Activity logged'];
  const description = descList[Math.floor(Math.random() * descList.length)];
  
  return {
    id: Date.now(),
    type,
    icon: config.icon,
    color: config.color,
    title: config.label,
    description,
    user,
    timestamp: Date.now(),
    status: type === 'alert' ? 'warning' : 'success'
  };
}

export default activityFeed;
