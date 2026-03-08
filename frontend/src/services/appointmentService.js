import api from './api'

/**
 * Appointment Service API Client
 * Handles all appointment-related API calls
 */
const appointmentService = {
  /**
   * Search for providers by specialty and location
   */
  searchProviders: async (params) => {
    const response = await api.post('/api/appointments/providers/search', params)
    return response.data
  },

  /**
   * Get available slots for a provider
   */
  getProviderSlots: async (providerId, startDate, endDate) => {
    const response = await api.get(`/api/appointments/providers/${providerId}/slots`, {
      params: { start_date: startDate, end_date: endDate }
    })
    return response.data
  },

  /**
   * Book an appointment
   */
  bookAppointment: async (bookingData) => {
    const response = await api.post('/api/appointments/book', bookingData)
    return response.data
  },

  /**
   * Get all appointments for current session
   */
  getAppointments: async () => {
    const response = await api.get('/api/appointments')
    return response.data
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (appointmentId, cancelData) => {
    const response = await api.delete(`/api/appointments/${appointmentId}`, {
      data: cancelData
    })
    return response.data
  }
}

export default appointmentService
