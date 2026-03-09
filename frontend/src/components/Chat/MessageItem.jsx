import React from 'react'

// Helper to format timestamp - ALWAYS shows device local time
const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    // No timestamp? Use current device time
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  try {
    // Parse the ISO timestamp
    const date = new Date(timestamp)
    
    // Check if valid
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit', 
        hour12: true
      })
    }
    
    // Format using browser's local timezone (device time)
    // This automatically converts UTC to local time
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
}

// Format response content with better structure
const formatContent = (content) => {
  if (!content) return content
  
  // Split by --- separator for closing message
  const parts = content.split(/\n*---\n*/)
  
  if (parts.length > 1) {
    // Has separator - main content + closing
    let mainContent = parts[0]
    const closing = parts.slice(1).join('')
    
    // Process main content paragraphs
    const paragraphs = mainContent.split(/\n\n+/).filter(p => p.trim())
    
    return (
      <div className="space-y-4">
        {/* Main content */}
        {paragraphs.map((para, idx) => {
          // Check if it's a numbered point
          const isNumbered = /^\d+\.\s/.test(para.trim())
          
          return (
            <p key={idx} className={isNumbered ? 'pl-2 border-l-2 border-arc-accent/30' : ''}>
              {renderWithBold(para.trim())}
            </p>
          )
        })}
        
        {/* Closing section */}
        <div className="mt-4 pt-3 border-t border-arc-border/30 text-sm">
          <span className="text-arc-text-muted">{renderWithBold(closing.trim())}</span>
        </div>
      </div>
    )
  }
  
  // No separator - split into paragraphs
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim())
  
  if (paragraphs.length > 1) {
    return (
      <div className="space-y-3">
        {paragraphs.map((para, idx) => {
          const isNumbered = /^\d+\.\s/.test(para.trim())
          return (
            <p key={idx} className={isNumbered ? 'pl-2 border-l-2 border-arc-accent/30' : ''}>
              {renderWithBold(para.trim())}
            </p>
          )
        })}
      </div>
    )
  }
  
  return renderWithBold(content)
}

// Render text with **bold** markdown support
const renderWithBold = (text) => {
  if (!text) return text
  
  // Split by **text** pattern
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-arc-accent font-semibold">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

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
        <div className="text-arc-text whitespace-pre-wrap leading-relaxed">
          {formatContent(message.content)}
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
        {formatTimestamp(message.created_at)}
      </div>
    </div>
  )
}

export default MessageItem
