import React from 'react'
import MessageItem from './MessageItem'

function MessageList({ messages }) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-arc-text-muted py-8">
        <div className="text-2xl mb-2">👋</div>
        <p>Start a conversation</p>
      </div>
    )
  }

  return (
    <>
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </>
  )
}

export default MessageList
