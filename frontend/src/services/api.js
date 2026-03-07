import axios from 'axios'

// In development with Vite proxy, use relative URL
// In production, use the full API URL
const API_URL = import.meta.env.VITE_API_URL || ''

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000 // 2 minutes for document processing
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
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
