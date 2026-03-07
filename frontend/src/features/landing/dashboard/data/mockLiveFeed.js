// Mock Live Feed Data for Static Dashboard

export const liveQueries = [
  {
    id: 1,
    query: "What are the symptoms of hypertension?",
    category: "Symptoms",
    timestamp: Date.now() - 5000
  },
  {
    id: 2,
    query: "Explain diabetes management strategies for elderly patients",
    category: "Treatment",
    timestamp: Date.now() - 8000
  },
  {
    id: 3,
    query: "Side effects of aspirin in patients with kidney disease",
    category: "Pharmacology",
    timestamp: Date.now() - 12000
  },
  {
    id: 4,
    query: "How to lower cholesterol naturally without medication?",
    category: "Prevention",
    timestamp: Date.now() - 18000
  },
  {
    id: 5,
    query: "Treatment options for chronic migraine headaches",
    category: "Treatment",
    timestamp: Date.now() - 25000
  },
  {
    id: 6,
    query: "Difference between Type 1 and Type 2 diabetes",
    category: "Diagnosis",
    timestamp: Date.now() - 32000
  },
  {
    id: 7,
    query: "What causes high blood pressure in young adults?",
    category: "Symptoms",
    timestamp: Date.now() - 40000
  },
  {
    id: 8,
    query: "Symptoms of heart disease in women over 50",
    category: "Symptoms",
    timestamp: Date.now() - 48000
  },
  {
    id: 9,
    query: "Drug interactions between metformin and alcohol",
    category: "Pharmacology",
    timestamp: Date.now() - 55000
  },
  {
    id: 10,
    query: "Best exercises for patients recovering from knee surgery",
    category: "Treatment",
    timestamp: Date.now() - 62000
  }
];

// Additional queries for rotation
export const additionalQueries = [
  "Early signs of Alzheimer's disease",
  "Managing anxiety without medication",
  "Post-operative care for appendectomy",
  "Nutritional requirements during pregnancy",
  "Symptoms of vitamin D deficiency",
  "Treatment for chronic back pain",
  "Managing asthma during exercise",
  "Signs of dehydration in elderly patients",
  "Prevention strategies for stroke",
  "Managing chronic fatigue syndrome",
  "Treatment options for rheumatoid arthritis",
  "Symptoms of thyroid dysfunction",
  "Managing insomnia naturally",
  "Early detection of skin cancer",
  "Treatment for peptic ulcer disease"
];

// Category colors for live feed items
export const categoryColors = {
  Symptoms: '#3B82F6',
  Diagnosis: '#8B5CF6',
  Treatment: '#10B981',
  Prevention: '#F59E0B',
  Pharmacology: '#EC4899',
  General: '#6B7280'
};

// Get next live query (simulates real-time updates)
let queryIndex = 0;
export function getNextLiveQuery() {
  const categories = Object.keys(categoryColors);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const query = additionalQueries[queryIndex % additionalQueries.length];
  queryIndex++;
  
  return {
    id: Date.now(),
    query,
    category,
    timestamp: Date.now()
  };
}

// Get initial batch of live queries
export function getInitialLiveQueries(count = 5) {
  return liveQueries.slice(0, count);
}

export default liveQueries;
