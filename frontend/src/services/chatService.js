import api from './api'

export const chatService = {
  /**
   * Send chat message
   */
  sendMessage: async (conversationId, message) => {
    const response = await api.post('/api/chat', {
      conversation_id: conversationId,
      message
    })
    return response.data
  },

  /**
   * Get conversation messages
   */
  getMessages: async (conversationId, limit = 50) => {
    const response = await api.get(`/api/conversations/${conversationId}/messages`, {
      params: { limit }
    })
    return response.data
  }
}
