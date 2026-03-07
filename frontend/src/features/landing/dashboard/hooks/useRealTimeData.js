import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useRealTimeData - Simulates real-time data updates
 * 
 * @param {any} initialData - Initial data state
 * @param {Function} updateFn - Function that generates updated data
 * @param {number} interval - Update interval in milliseconds
 * @param {boolean} enabled - Toggle updates on/off
 */
export const useRealTimeData = (initialData, updateFn, interval = 3000, enabled = true) => {
  const [data, setData] = useState(initialData);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      setData(prev => updateFn(prev));
      setLastUpdate(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [updateFn, interval, enabled]);

  return { data, lastUpdate, setData };
};

/**
 * useAnimatedValue - Smoothly animates a numeric value on change
 * 
 * @param {number} targetValue - The target value to animate to
 * @param {number} duration - Animation duration in milliseconds
 */
export const useAnimatedValue = (targetValue, duration = 1000) => {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = currentValue;
    const startTime = performance.now();
    const diff = targetValue - startValue;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCurrentValue(startValue + diff * eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return Math.round(currentValue);
};

/**
 * useTypingSimulation - Simulates typing effect for text
 * 
 * @param {string[]} texts - Array of texts to cycle through
 * @param {number} typingSpeed - Milliseconds per character
 * @param {number} pauseDuration - Pause between texts
 */
export const useTypingSimulation = (texts, typingSpeed = 50, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, typingSpeed / 2);
      } else {
        setTextIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, textIndex, texts, typingSpeed, pauseDuration]);

  return { displayText, isTyping };
};

/**
 * usePulsingValue - Creates a pulsing numeric value effect
 * 
 * @param {number} baseValue - Base value to pulse around
 * @param {number} variance - Maximum deviation from base
 * @param {number} interval - Update interval in milliseconds
 */
export const usePulsingValue = (baseValue, variance = 5, interval = 1000) => {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    const timer = setInterval(() => {
      const change = (Math.random() - 0.5) * 2 * variance;
      setValue(Math.round(baseValue + change));
    }, interval);

    return () => clearInterval(timer);
  }, [baseValue, variance, interval]);

  return value;
};

/**
 * Activity Generator - Generates random new activity events
 */
const activityTypes = ['query', 'system', 'user', 'alert'];
const users = ['Dr. Smith', 'Dr. Johnson', 'Nurse Chen', 'Dr. Patel', 'System', 'Dr. Garcia', 'Nurse Kim'];
const actions = {
  query: ['queried', 'searched for', 'asked about'],
  system: ['updated', 'synchronized', 'refreshed', 'optimized'],
  user: ['logged in', 'accessed', 'reviewed'],
  alert: ['detected', 'flagged', 'reported']
};
const targets = {
  query: [
    'medication interactions',
    'treatment protocols',
    'diagnostic criteria',
    'patient history',
    'lab results interpretation',
    'dosage guidelines',
    'contraindications'
  ],
  system: [
    'Vector Index',
    'Knowledge Base',
    'Cache Layer',
    'Model Weights',
    'Embedding Store'
  ],
  user: [
    'patient records',
    'medical guidelines',
    'dashboard',
    'reports section'
  ],
  alert: [
    'unusual query pattern',
    'high latency',
    'memory usage spike',
    'rate limit threshold'
  ]
};

export const generateActivity = () => {
  const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  const user = type === 'system' || type === 'alert' 
    ? 'System' 
    : users[Math.floor(Math.random() * users.length)];
  const action = actions[type][Math.floor(Math.random() * actions[type].length)];
  const target = targets[type][Math.floor(Math.random() * targets[type].length)];
  const status = type === 'alert' ? 'warning' : (Math.random() > 0.1 ? 'success' : 'info');

  return {
    id: Date.now(),
    type,
    user,
    action,
    target,
    time: 'Just now',
    status
  };
};

/**
 * Query Generator - Generates random clinical queries
 */
const queryTemplates = [
  "What are the contraindications for {drug}?",
  "Latest guidelines on managing {condition} in {population}.",
  "Dosing for {drug} for {condition}.",
  "Side effects of long-term {drug} use.",
  "Compare efficacy of {drug1} vs {drug2}.",
  "Management of acute {condition} exacerbation.",
  "Diagnosis criteria for {condition}.",
  "Treatment options for drug-resistant {condition}.",
  "Post-operative care for {procedure}.",
  "Interactions between {drug1} and {drug2}."
];

const drugs = ['Amiodarone', 'Metformin', 'Lisinopril', 'Warfarin', 'Atorvastatin', 'Levothyroxine', 'Omeprazole'];
const conditions = ['hypertension', 'diabetes', 'asthma', 'COPD', 'heart failure', 'pneumonia', 'sepsis'];
const populations = ['elderly patients', 'pediatric patients', 'pregnant women', 'immunocompromised patients'];
const procedures = ['total knee arthroplasty', 'coronary bypass', 'appendectomy', 'hip replacement'];

export const generateQuery = () => {
  const template = queryTemplates[Math.floor(Math.random() * queryTemplates.length)];
  return template
    .replace('{drug}', drugs[Math.floor(Math.random() * drugs.length)])
    .replace('{drug1}', drugs[Math.floor(Math.random() * drugs.length)])
    .replace('{drug2}', drugs[Math.floor(Math.random() * drugs.length)])
    .replace('{condition}', conditions[Math.floor(Math.random() * conditions.length)])
    .replace('{population}', populations[Math.floor(Math.random() * populations.length)])
    .replace('{procedure}', procedures[Math.floor(Math.random() * procedures.length)]);
};
