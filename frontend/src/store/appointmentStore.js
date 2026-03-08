import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Appointment Store with Persistence
 * This store persists appointments to localStorage so they survive page refresh
 */
const useAppointmentStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // PERSISTED STATE (saved to localStorage)
      // ==========================================
      appointments: [], // Array of confirmed appointments
      
      // ==========================================
      // TRANSIENT STATE (not persisted)
      // ==========================================
      bookingInProgress: false,
      bookingStep: 'idle', // 'idle' | 'location' | 'provider' | 'slot' | 'info' | 'confirmed'
      
      // Booking flow data
      extractedSlots: null,
      detectedSpecialty: null,
      location: null,
      searchedProviders: [],
      selectedProvider: null,
      availableSlots: [],
      selectedSlot: null,
      patientInfo: null,
      
      // UI state
      loading: false,
      loadingAppointments: false,
      error: null,
      
      // ==========================================
      // ACTIONS
      // ==========================================
      
      // Start booking flow
      startBooking: (data) => {
        const slots = data || {};
        set({
          bookingInProgress: true,
          bookingStep: 'location',
          detectedSpecialty: slots.specialty || null,
          extractedSlots: slots,
          error: null
        });
      },
      
      // Update booking step
      setBookingStep: (step) => {
        console.log('📍 Booking step:', step);
        set({ bookingStep: step });
      },
      
      // Set user location
      setLocation: (location) => {
        console.log('📍 Location set:', location);
        set({ location });
      },
      
      // Set searched providers
      setSearchedProviders: (providers) => {
        console.log('👨‍⚕️ Providers loaded:', providers.length);
        set({ 
          searchedProviders: providers,
          bookingStep: 'provider'
        });
      },
      
      // Select a provider
      selectProvider: (provider) => {
        console.log('✅ Provider selected:', provider.name);
        set({
          selectedProvider: provider,
          bookingStep: 'slot'
        });
      },
      
      // Set available slots
      setAvailableSlots: (slots) => {
        console.log('📅 Slots loaded:', slots.length);
        set({ availableSlots: slots });
      },
      
      // Select a slot
      selectSlot: (slot) => {
        console.log('🕒 Slot selected:', slot);
        set({
          selectedSlot: slot,
          bookingStep: 'info'
        });
      },
      
      // Update patient info
      updatePatientInfo: (info) => {
        console.log('👤 Patient info updated');
        set({ patientInfo: info });
      },
      
      // Add appointment (PERSISTED)
      addAppointment: (appointment) => {
        console.log('➕ Adding appointment:', appointment.confirmation_code);
        set(state => ({
          appointments: [appointment, ...state.appointments],
          bookingStep: 'confirmed',
          bookingInProgress: false
        }));
      },
      
      // Set all appointments (PERSISTED)
      setAppointments: (appointments) => {
        console.log('📋 Setting appointments:', appointments.length);
        set({ 
          appointments,
          loadingAppointments: false
        });
      },
      
      // Set loading appointments state
      setLoadingAppointments: (loading) => {
        set({ loadingAppointments: loading });
      },
      
      // Remove appointment (PERSISTED)
      removeAppointment: (appointmentId) => {
        console.log('🗑️ Removing appointment:', appointmentId);
        set(state => ({
          appointments: state.appointments.filter(
            apt => apt.appointment_id !== appointmentId
          )
        }));
      },
      
      // Reset booking flow
      resetBooking: () => {
        console.log('🔄 Resetting booking flow');
        set({
          bookingInProgress: false,
          bookingStep: 'idle',
          extractedSlots: null,
          detectedSpecialty: null,
          location: null,
          searchedProviders: [],
          selectedProvider: null,
          availableSlots: [],
          selectedSlot: null,
          patientInfo: null,
          error: null
        });
      },
      
      // Set loading state
      setLoading: (loading) => set({ loading }),
      
      // Set error
      setError: (error) => set({ error }),
      
      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'medical-appointments-storage', // localStorage key
      // Only persist appointments array
      partialize: (state) => ({
        appointments: state.appointments
      })
    }
  )
);

export default useAppointmentStore;
