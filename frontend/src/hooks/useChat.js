import { useState, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import useAppointmentStore from '../store/appointmentStore'
import { chatService } from '../services/chatService'
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
    setError
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
        console.log('🎯 Booking intent detected:', response.metadata)
        
        // Start booking flow in appointment store
        startBooking(response.metadata.extracted_slots)
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
