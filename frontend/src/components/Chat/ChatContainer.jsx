import React, { useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useChat } from '../../hooks/useChat'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'

function ChatContainer({ compactMode = false }) {
  const { currentConversationId, messages, isTyping, error } = useChatStore()
  const { sendMessage } = useChat(currentConversationId)
  const [input, setInput] = useState('')
  
  const scrollRef = useAutoScroll([messages, isTyping])

  const handleSend = async () => {
    if (!input.trim() || !currentConversationId) return
    
    const message = input
    setInput('')
    await sendMessage(message)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!currentConversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-arc-text-muted">
          <div className={compactMode ? "text-2xl mb-2" : "text-4xl mb-4"}>💬</div>
          <p className={compactMode ? "text-sm" : ""}>
            {compactMode ? "Create a new chat to start" : "Select a conversation or create a new one"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/20 border-b border-red-700 text-sm text-red-400">
          {error}
        </div>
      )}
      
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto ${compactMode ? 'p-3' : 'p-6'} space-y-4`}
      >
        <MessageList messages={messages} />
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        disabled={!currentConversationId || isTyping}
      />
    </div>
  )
}

export default ChatContainer
