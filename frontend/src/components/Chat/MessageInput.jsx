import React from 'react'

function MessageInput({ value, onChange, onSend, onKeyPress, disabled }) {
  return (
    <div className="border-t border-arc-border bg-arc-navy-light p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          className="input flex-1"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="btn btn-primary px-8"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default MessageInput
