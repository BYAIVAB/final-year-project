import api from './api'

/**
 * Appointment Booking API Service
 */
const appointmentService = {
  /**
   * Search for healthcare providers
   */
  async searchProviders(conversationId, specialty, location = null) {
    const response = await api.post('/api/appointments/providers/search', {
      conversation_id: conversationId,
      specialty,
      location,
      radius_miles: 10
    })
    return response.data
  },

  /**
   * Get available slots for a provider
   */
  async getProviderSlots(providerId, startDate, endDate) {
    const response = await api.get(`/api/appointments/providers/${providerId}/slots`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    })
    return response.data
  },

  /**
   * Book an appointment
   */
  async bookAppointment(conversationId, providerId, slotId, slotDatetime, patientInfo) {
    const response = await api.post('/api/appointments/book', {
      conversation_id: conversationId,
      provider_id: providerId,
      slot_id: slotId,
      slot_datetime: slotDatetime,
      patient_info: patientInfo
    })
    return response.data
  },

  /**
   * Get user's appointments
   */
  async getAppointments(status = null) {
    const response = await api.get('/api/appointments', {
      params: { status, limit: 10 }
    })
    return response.data
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId, confirmationCode, reason = null) {
    const response = await api.delete(`/api/appointments/${appointmentId}`, {
      data: {
        confirmation_code: confirmationCode,
        reason
      }
    })
    return response.data
  }
}

export default appointmentService
