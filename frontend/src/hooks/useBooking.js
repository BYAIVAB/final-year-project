import { useState } from 'react'
import appointmentService from '../services/appointmentService'
import useAppointmentStore from '../store/appointmentStore'

/**
 * Booking workflow hook
 * Manages the appointment booking flow
 */
const useBooking = (conversationId) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    setSearchedProviders,
    setAvailableSlots,
    addAppointment,
    setLocation
  } = useAppointmentStore()

  /**
   * Search for providers based on specialty and location
   */
  const searchProviders = async (specialty, location) => {
    setLoading(true)
    setError(null)

    try {
      const response = await appointmentService.searchProviders(
        conversationId,
        specialty,
        location
      )

      setSearchedProviders(response.providers)
      setLocation(location)
      return response.providers
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to search providers')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get available slots for a provider
   */
  const getProviderSlots = async (providerId) => {
    setLoading(true)
    setError(null)

    try {
      const startDate = new Date().toISOString().split('T')[0]
      const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      const response = await appointmentService.getProviderSlots(
        providerId,
        startDate,
        endDate
      )

      setAvailableSlots(response.slots)
      return response.slots
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get available slots')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Book an appointment
   */
  const bookAppointment = async (providerId, slotId, slotDatetime, patientInfo) => {
    setLoading(true)
    setError(null)

    try {
      const response = await appointmentService.bookAppointment(
        conversationId,
        providerId,
        slotId,
        slotDatetime,
        patientInfo
      )

      addAppointment(response)
      return response
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to book appointment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load user's appointments
   */
  const loadAppointments = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await appointmentService.getAppointments()
      useAppointmentStore.getState().setAppointments(response.appointments)
      return response.appointments
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load appointments')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cancel an appointment
   */
  const cancelAppointment = async (appointmentId, confirmationCode, reason) => {
    setLoading(true)
    setError(null)

    try {
      const response = await appointmentService.cancelAppointment(
        appointmentId,
        confirmationCode,
        reason
      )

      useAppointmentStore.getState().cancelAppointment(appointmentId)
      return response
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to cancel appointment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    searchProviders,
    getProviderSlots,
    bookAppointment,
    loadAppointments,
    cancelAppointment
  }
}

export default useBooking
