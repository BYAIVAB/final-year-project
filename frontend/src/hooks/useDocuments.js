import { useState } from 'react'
import { documentService } from '../services/documentService'

export const useDocuments = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadDocument = async (conversationId, file) => {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)

      const result = await documentService.upload(
        conversationId,
        file,
        (percent) => setProgress(percent)
      )

      setProgress(100)
      return result
    } catch (err) {
      console.error('Upload failed:', err)
      setError(err.response?.data?.detail || err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  const getDocuments = async (conversationId) => {
    try {
      const documents = await documentService.getByConversation(conversationId)
      return documents
    } catch (err) {
      console.error('Failed to get documents:', err)
      throw err
    }
  }

  return {
    uploading,
    progress,
    error,
    uploadDocument,
    getDocuments
  }
}
