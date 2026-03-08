import axios from 'axios'

// In development with Vite proxy, use relative URL
// In production, use the full API URL
const API_URL = import.meta.env.VITE_API_URL || ''

// Generate or retrieve session fingerprint
const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Session-ID': getSessionId()
  },
  timeout: 120000 // 2 minutes for document processing
})

// Request interceptor - Update session ID on every request
api.interceptors.request.use(
  (config) => {
    config.headers['X-Session-ID'] = getSessionId()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
