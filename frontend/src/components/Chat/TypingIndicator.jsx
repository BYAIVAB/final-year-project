import React from 'react'

function TypingIndicator() {
  return (
    <div className="message-bubble message-assistant">
      <div className="text-xs text-arc-text-muted uppercase mb-2">
        🤖 ASSISTANT
      </div>
      <div className="typing-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  )
}

export default TypingIndicator
