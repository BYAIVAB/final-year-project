import { useState, useCallback } from 'react';
import appointmentService from '../services/appointmentService';
import useAppointmentStore from '../store/appointmentStore';

/**
 * Booking workflow hook with persistence
 */
const useBooking = (conversationId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    setSearchedProviders,
    setAvailableSlots,
    addAppointment,
    setAppointments,
    setLocation,
    removeAppointment
  } = useAppointmentStore();

  /**
   * Search providers by specialty and location
   */
  const searchProviders = useCallback(async (specialty, location) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Searching providers:', { specialty, location });
      
      const response = await appointmentService.searchProviders({
        conversation_id: conversationId,
        specialty: specialty || 'general',
        city: location.city,
        latitude: location.lat,
        longitude: location.lng
      });
      
      console.log('✅ Providers found:', response.providers?.length || 0);
      
      if (!response.providers || response.providers.length === 0) {
        throw new Error('No providers found for this specialty');
      }

      setSearchedProviders(response.providers);
      setLocation(location);
      
      return response.providers;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to search providers';
      console.error('❌ Provider search error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [conversationId, setSearchedProviders, setLocation]);

  /**
   * Get available slots for a provider
   */
  const getProviderSlots = useCallback(async (providerId) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📅 Fetching slots for provider:', providerId);
      
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const response = await appointmentService.getProviderSlots(
        providerId,
        startDate,
        endDate
      );

      console.log('✅ Slots found:', response.slots?.length || 0);
      
      if (!response.slots || response.slots.length === 0) {
        throw new Error('No available slots');
      }

      setAvailableSlots(response.slots);
      return response.slots;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to get slots';
      console.error('❌ Slots fetch error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAvailableSlots]);

  /**
   * Book an appointment
   * CRITICAL: Adds to persisted store
   */
  const bookAppointment = useCallback(async (providerId, slotId, slotDatetime, patientInfo) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📝 Booking appointment:', { providerId, slotId, slotDatetime });

      const response = await appointmentService.bookAppointment({
        conversation_id: conversationId,
        provider_id: providerId,
        slot_id: slotId,
        slot_datetime: slotDatetime,
        patient_info: patientInfo
      });

      console.log('✅ Appointment booked:', response);

      // Add to persisted store
      addAppointment(response);
      
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Booking failed';
      console.error('❌ Booking error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [conversationId, addAppointment]);

  /**
   * Load all appointments from backend
   */
  const loadAppointments = useCallback(async () => {
    try {
      console.log('📋 Loading appointments from backend...');
      
      const response = await appointmentService.getAppointments();
      
      console.log('✅ Appointments loaded:', response.appointments?.length || 0);
      
      setAppointments(response.appointments || []);
      return response.appointments || [];
    } catch (err) {
      console.error('❌ Load appointments error:', err);
      return [];
    }
  }, [setAppointments]);

  /**
   * Cancel an appointment
   */
  const cancelAppointment = useCallback(async (appointmentId, confirmationCode, reason) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🗑️ Cancelling appointment:', appointmentId);
      
      await appointmentService.cancelAppointment(appointmentId, {
        confirmation_code: confirmationCode,
        reason: reason || 'User cancelled'
      });

      console.log('✅ Appointment cancelled');
      
      // Remove from persisted store
      removeAppointment(appointmentId);
      
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Cancellation failed';
      console.error('❌ Cancellation error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [removeAppointment]);

  return {
    loading,
    error,
    searchProviders,
    getProviderSlots,
    bookAppointment,
    loadAppointments,
    cancelAppointment
  };
};

export default useBooking;
