import api from './api'

export const conversationService = {
  /**
   * Get all conversations
   */
  getAll: async (limit = 50) => {
    const response = await api.get('/api/conversations', {
      params: { limit }
    })
    return response.data
  },

  /**
   * Get single conversation
   */
  getById: async (id) => {
    const response = await api.get(`/api/conversations/${id}`)
    return response.data
  },

  /**
   * Create new conversation
   */
  create: async (title = 'New Chat') => {
    const response = await api.post('/api/conversations', { title })
    return response.data
  },

  /**
   * Delete conversation
   */
  delete: async (id) => {
    await api.delete(`/api/conversations/${id}`)
  }
}
