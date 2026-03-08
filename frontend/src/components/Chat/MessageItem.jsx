import React from 'react'

function MessageItem({ message }) {
  const isUser = message.role === 'user'
  const sources = message.metadata?.sources || []
  const timing = message.metadata?.timing
  const isBookingConfirmation = message.metadata?.type === 'booking_confirmation'

  return (
    <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
      {/* Role Badge */}
      <div className="text-xs text-arc-text-muted uppercase mb-2">
        {isUser ? '👤 USER' : '🤖 ASSISTANT'}
      </div>

      {/* Content - Special rendering for booking confirmations */}
      {isBookingConfirmation ? (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-lg text-green-400 mb-3">Appointment Confirmed!</div>
          <div className="space-y-2 text-arc-text">
            {message.content.split('\n').filter(line => line.trim()).map((line, idx) => {
              // Skip the header line and empty lines
              if (line.includes('Appointment Confirmed') || line.includes('Please save')) return null
              
              // Parse key: value lines
              const colonIndex = line.indexOf(':')
              if (colonIndex > -1) {
                const key = line.substring(0, colonIndex).trim()
                const value = line.substring(colonIndex + 1).trim()
                
                if (key === 'Confirmation Code') {
                  return (
                    <div key={idx} className="mt-3 p-2 bg-arc-surface-secondary rounded">
                      <span className="text-arc-text-muted text-sm">{key}:</span>
                      <div className="font-mono text-lg text-arc-accent font-bold">{value}</div>
                    </div>
                  )
                }
                
                return (
                  <div key={idx}>
                    <span className="text-arc-text-muted">{key}:</span>{' '}
                    <span className="text-arc-text">{value}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
          <div className="mt-3 text-xs text-arc-text-muted">
            Please save your confirmation code for your records.
          </div>
        </div>
      ) : (
        <div className="text-arc-text whitespace-pre-wrap">
          {message.content}
        </div>
      )}

      {/* Sources */}
      {!isUser && sources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-arc-border">
          <div className="text-xs text-arc-text-muted mb-2 uppercase">
            Sources:
          </div>
          {sources.map((source, idx) => (
            <div key={idx} className="source-citation mb-2">
              📄 {source.type === 'document' ? `Page ${source.page}` : 'Chat History'} • 
              Similarity: {(source.similarity * 100).toFixed(0)}%
              {source.snippet && (
                <div className="text-arc-text-muted mt-1 text-xs">
                  {source.snippet.substring(0, 100)}...
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Timing */}
      {!isUser && timing && (
        <div className="mt-2 text-xs text-arc-text-muted">
          ⏱️ {timing.total ? `${timing.total.toFixed(0)}ms total` : ''}
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs text-arc-text-muted mt-2">
        {new Date(message.created_at).toLocaleTimeString()}
      </div>
    </div>
  )
}

export default MessageItem
