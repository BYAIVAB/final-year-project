import React, { useState, useEffect } from 'react'

function TypingIndicator() {
  const [dots, setDots] = useState('')
  const [phase, setPhase] = useState('thinking')
  
  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])
  
  // Cycle through phases like ChatGPT
  useEffect(() => {
    const phases = ['thinking', 'analyzing', 'generating']
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length
      setPhase(phases[idx])
    }, 2500)
    return () => clearInterval(interval)
  }, [])
  
  const phaseText = {
    thinking: '🧠 Thinking',
    analyzing: '🔍 Analyzing your query',
    generating: '✨ Generating response'
  }

  return (
    <div className="message-bubble message-assistant">
      <div className="flex items-center gap-2">
        <div className="typing-indicator-wrapper">
          {/* Animated brain/thinking icon */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-arc-accent rounded-full animate-pulse"></div>
            <span className="text-arc-text-muted text-sm">
              {phaseText[phase]}{dots}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 h-1 bg-arc-surface-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-arc-accent to-blue-400 animate-thinking-bar"></div>
      </div>
    </div>
  )
}

export default TypingIndicator
