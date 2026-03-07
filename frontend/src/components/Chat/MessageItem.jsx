import React from 'react'

function MessageItem({ message }) {
  const isUser = message.role === 'user'
  const sources = message.metadata?.sources || []
  const timing = message.metadata?.timing

  return (
    <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
      {/* Role Badge */}
      <div className="text-xs text-arc-text-muted uppercase mb-2">
        {isUser ? '👤 USER' : '🤖 ASSISTANT'}
      </div>

      {/* Content */}
      <div className="text-arc-text whitespace-pre-wrap">
        {message.content}
      </div>

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
