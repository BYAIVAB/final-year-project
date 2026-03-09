import { useState, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import useAppointmentStore from '../store/appointmentStore'
import { chatService } from '../services/chatService'
import { conversationService } from '../services/conversationService'
import { useSound } from './useSound'

export const useChat = (conversationId) => {
  const {
    messages,
    setMessages,
    addMessage,
    isLoading,
    setLoading,
    isTyping,
    setTyping,
    setError,
    setConversations
  } = useChatStore()
  
  const { startBooking } = useAppointmentStore()

  const { playTyping, stopTyping, playMessageSent } = useSound()

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadMessages()
    }
  }, [conversationId])

  const loadMessages = async () => {
    if (!conversationId) return

    try {
      setLoading(true)
      const data = await chatService.getMessages(conversationId)
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (message) => {
    if (!message.trim() || !conversationId) return

    try {
      setTyping(true)
      playTyping()

      // Add user message immediately
      addMessage({
        role: 'user',
        content: message,
        created_at: new Date().toISOString()
      })

      // Send to backend
      const response = await chatService.sendMessage(conversationId, message)

      // ============================================
      // CHECK FOR BOOKING INTENT
      // ============================================
      if (response.metadata?.intent === 'booking') {
        // Start booking flow in appointment store
        const slotsToPass = response.metadata.extracted_slots || { specialty: response.metadata.specialty }
        startBooking(slotsToPass)
      }

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response.response,
        created_at: new Date().toISOString(),
        metadata: {
          sources: response.sources,
          timing: response.timing,
          intent: response.metadata?.intent,
          extracted_slots: response.metadata?.extracted_slots
        }
      })

      // ============================================
      // LLM-BASED TITLE GENERATION (ChatGPT/Claude-style)
      // Generate title after first substantive message
      // ============================================
      const currentMessageCount = messages.length + 2 // +2 for user msg and assistant response just added
      if (currentMessageCount <= 4) {
        // Only generate title for new conversations (first few messages)
        try {
          await conversationService.generateTitle(conversationId)
        } catch (e) {
          console.warn('Failed to generate title:', e)
          // Non-critical, continue
        }
      }

      // Refresh conversations to show updated title in sidebar
      try {
        const updatedConversations = await conversationService.getAll()
        setConversations(updatedConversations || [])
      } catch (e) {
        console.warn('Failed to refresh conversations:', e)
      }

      playMessageSent()
    } catch (error) {
      console.error('Failed to send message:', error)
      setError(error.message)
    } finally {
      setTyping(false)
      stopTyping()
    }
  }

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    loadMessages
  }
}
