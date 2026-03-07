import { useState, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { conversationService } from '../services/conversationService'

export const useConversations = () => {
  const {
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversation,
    setError
  } = useChatStore()

  const [loading, setLoading] = useState(false)

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await conversationService.getAll()
      setConversations(data || [])

      // Auto-select first conversation if none selected
      if (!currentConversationId && data && data.length > 0) {
        setCurrentConversation(data[0]._id)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
      // Don't set error for 404 or connection errors on initial load
      if (error.response?.status !== 404) {
        setError('Cannot connect to server. Make sure the backend is running.')
      }
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (title = 'New Chat') => {
    try {
      const conversation = await conversationService.create(title)
      await loadConversations()
      setCurrentConversation(conversation._id)
      return conversation
    } catch (error) {
      console.error('Failed to create conversation:', error)
      setError(error.message)
      throw error
    }
  }

  const deleteConversation = async (id) => {
    try {
      await conversationService.delete(id)
      await loadConversations()
      
      // If deleted current conversation, select another
      if (id === currentConversationId) {
        const remaining = conversations.filter(c => c._id !== id)
        if (remaining.length > 0) {
          setCurrentConversation(remaining[0]._id)
        } else {
          setCurrentConversation(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      setError(error.message)
      throw error
    }
  }

  const selectConversation = (id) => {
    setCurrentConversation(id)
  }

  return {
    conversations,
    currentConversationId,
    loading,
    loadConversations,
    createConversation,
    deleteConversation,
    selectConversation
  }
}
