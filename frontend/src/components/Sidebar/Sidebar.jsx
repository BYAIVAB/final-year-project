import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useConversations } from '../../hooks/useConversations'

function Sidebar({ onUploadClick, onLogoClick }) {
  const {
    conversations,
    currentConversationId,
    loading,
    createConversation,
    selectConversation,
    deleteConversation
  } = useConversations()

  const [creatingChat, setCreatingChat] = useState(false)
  const [error, setError] = useState(null)

  const handleNewChat = async () => {
    try {
      setCreatingChat(true)
      setError(null)
      await createConversation()
    } catch (err) {
      console.error('Failed to create conversation:', err)
      setError('Failed to create chat. Is the backend running?')
    } finally {
      setCreatingChat(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (window.confirm('Delete this conversation?')) {
      try {
        await deleteConversation(id)
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }
  }

  return (
    <div className="w-64 h-full bg-arc-navy-light border-r border-arc-border flex flex-col">
      {/* Logo Header */}
      <div className="p-4 border-b border-arc-border">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-arc-blue rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-arc-text">MindEase</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2">
        <button
          onClick={handleNewChat}
          disabled={creatingChat}
          className="w-full btn btn-primary disabled:opacity-50"
        >
          {creatingChat ? 'Creating...' : '+ New Chat'}
        </button>
        <button
          onClick={onUploadClick}
          className="w-full btn btn-secondary"
        >
          📎 Upload PDF
        </button>
        {error && (
          <div className="text-xs text-red-400 p-2 bg-red-900/20 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Conversations List - Scrollbar always visible */}
      <div className="flex-1 overflow-y-scroll p-2 space-y-2" style={{ scrollbarGutter: 'stable' }}>
        {loading && (
          <div className="text-center text-arc-text-muted py-4">
            Loading...
          </div>
        )}
        
        {!loading && conversations.length === 0 && (
          <div className="text-center text-arc-text-muted py-4 text-sm">
            No conversations yet
          </div>
        )}

        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => selectConversation(conv._id)}
            className={`
              p-3 rounded cursor-pointer transition-colors group
              ${currentConversationId === conv._id
                ? 'bg-arc-surface border border-arc-blue'
                : 'bg-arc-surface hover:bg-arc-border'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-arc-text truncate">
                  {conv.title}
                </div>
                <div className="text-xs text-arc-text-muted mt-1">
                  {new Date(conv.last_active).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(e, conv._id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-arc-error hover:text-red-400"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
