import React, { useState } from 'react'
import { useDocuments } from '../../hooks/useDocuments'
import { useConversations } from '../../hooks/useConversations'

function UploadModal({ conversationId, onClose }) {
  const [file, setFile] = useState(null)
  const { uploading, progress, error, uploadDocument } = useDocuments()
  const { createConversation } = useConversations()
  const [result, setResult] = useState(null)
  const [creatingConv, setCreatingConv] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setResult(null)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      let convId = conversationId
      
      // Create conversation if none exists
      if (!convId) {
        setCreatingConv(true)
        const newConv = await createConversation('Document Upload')
        convId = newConv._id
        setCreatingConv(false)
      }

      const res = await uploadDocument(convId, file)
      setResult(res)
      setFile(null)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Upload failed:', err)
      setCreatingConv(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-arc-text">
            Upload PDF Document
          </h2>
          <button
            onClick={onClose}
            className="text-arc-text-muted hover:text-arc-text"
          >
            ✕
          </button>
        </div>

        {!result && (
          <>
            <div className="mb-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="input"
                disabled={uploading}
              />
              {file && (
                <div className="mt-2 text-sm text-arc-text-muted">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {(uploading || creatingConv) && (
              <div className="mb-4">
                <div className="text-sm text-arc-text-muted mb-2">
                  {creatingConv ? 'Creating conversation...' : `Processing... ${progress}%`}
                </div>
                <div className="w-full bg-arc-border rounded-full h-2">
                  <div
                    className="bg-arc-blue h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={handleUpload}
                disabled={!file || uploading || creatingConv}
                className="btn btn-primary flex-1"
              >
                {creatingConv ? 'Creating...' : 'Upload'}
              </button>
              <button
                onClick={onClose}
                className="btn btn-secondary"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {result && (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-arc-success mb-2">Upload successful!</div>
            <div className="text-sm text-arc-text-muted">
              {result.page_count} pages, {result.chunk_count} chunks processed
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadModal
