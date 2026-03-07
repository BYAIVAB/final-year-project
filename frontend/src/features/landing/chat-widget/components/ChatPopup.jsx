import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const quickQuestions = [
  'What are common drug interactions?',
  'Explain hypertension treatment options',
  'Side effects of Metformin',
]

function ChatPopup({ isOpen, onClose }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your medical AI assistant. Ask me anything about medical topics, or try one of the quick questions below.',
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return
    
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'user', content: message },
      { id: Date.now() + 1, type: 'bot', content: 'For a full experience with document upload and conversation history, please use the main chat application.' },
    ])
    setMessage('')
  }

  const handleQuickQuestion = (question) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'user', content: question },
      { id: Date.now() + 1, type: 'bot', content: 'Great question! For detailed answers with source references, please open the full chat application.' },
    ])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 z-50 w-96 max-h-[500px] bg-arc-surface border border-arc-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-arc-blue to-purple-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                🤖
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Medical AI Assistant</h3>
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full" /> Online
                </span>
              </div>
            </div>
            <Link
              to="/chat"
              className="text-white/80 hover:text-white text-xs underline"
            >
              Open Full Chat →
            </Link>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.type === 'user'
                      ? 'bg-arc-blue text-white'
                      : 'bg-arc-navy text-arc-text'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick questions */}
          <div className="px-4 py-2 border-t border-arc-border">
            <p className="text-xs text-arc-text-muted mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs bg-arc-navy hover:bg-arc-blue/20 text-arc-text-muted hover:text-arc-blue px-2 py-1 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-arc-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-arc-navy border border-arc-border rounded-lg px-3 py-2 text-sm text-arc-text placeholder-arc-text-muted focus:outline-none focus:border-arc-blue"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="px-4 py-2 bg-arc-blue text-white rounded-lg text-sm font-medium"
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ChatPopup
