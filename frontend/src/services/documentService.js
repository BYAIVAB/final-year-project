import api from './api'

export const documentService = {
  /**
   * Upload document
   */
  upload: async (conversationId, file, onProgress) => {
    const formData = new FormData()
    formData.append('conversation_id', conversationId)
    formData.append('file', file)

    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      }
    })
    return response.data
  },

  /**
   * Get document status
   */
  getStatus: async (documentId) => {
    const response = await api.get(`/api/documents/${documentId}`)
    return response.data
  },

  /**
   * Get conversation documents
   */
  getByConversation: async (conversationId) => {
    const response = await api.get(`/api/documents/conversation/${conversationId}`)
    return response.data
  }
}
