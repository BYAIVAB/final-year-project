import { create } from 'zustand'

/**
 * Appointment Booking State Management
 */
const useAppointmentStore = create((set, get) => ({
  // ============================================
  // Current Booking Flow State
  // ============================================
  bookingInProgress: false,
  bookingStep: null, // 'intent' | 'location' | 'provider' | 'slot' | 'info' | 'confirm'
  
  extractedSlots: {
    specialty: null,
    symptoms: null,
    timeframe: null,
    location: null,
    preferred_time: null,
    urgency: null
  },
  
  searchedProviders: [],
  selectedProvider: null,
  availableSlots: [],
  selectedSlot: null,
  patientInfo: {
    name: '',
    phone: '',
    email: '',
    reason: ''
  },
  
  // ============================================
  // Confirmed Appointments
  // ============================================
  appointments: [],
  loadingAppointments: false,
  
  // ============================================
  // Actions
  // ============================================
  
  startBooking: (slots) => {
    set({
      bookingInProgress: true,
      bookingStep: 'location',
      extractedSlots: { ...get().extractedSlots, ...slots }
    })
  },
  
  setBookingStep: (step) => set({ bookingStep: step }),
  
  setLocation: (location) => {
    set(state => ({
      extractedSlots: { ...state.extractedSlots, location }
    }))
  },
  
  setSearchedProviders: (providers) => {
    set({
      searchedProviders: providers,
      bookingStep: 'provider'
    })
  },
  
  selectProvider: (provider) => {
    set({
      selectedProvider: provider,
      bookingStep: 'slot'
    })
  },
  
  setAvailableSlots: (slots) => {
    set({ availableSlots: slots })
  },
  
  selectSlot: (slot) => {
    set({
      selectedSlot: slot,
      bookingStep: 'info'
    })
  },
  
  updatePatientInfo: (info) => {
    set(state => ({
      patientInfo: { ...state.patientInfo, ...info }
    }))
  },
  
  addAppointment: (appointment) => {
    set(state => ({
      appointments: [appointment, ...state.appointments],
      bookingInProgress: false,
      bookingStep: null,
      selectedProvider: null,
      selectedSlot: null,
      patientInfo: { name: '', phone: '', email: '', reason: '' }
    }))
  },
  
  setAppointments: (appointments) => {
    set({ appointments, loadingAppointments: false })
  },
  
  setLoadingAppointments: (loading) => {
    set({ loadingAppointments: loading })
  },
  
  cancelAppointment: (appointmentId) => {
    set(state => ({
      appointments: state.appointments.filter(apt => apt.appointment_id !== appointmentId)
    }))
  },
  
  resetBooking: () => {
    set({
      bookingInProgress: false,
      bookingStep: null,
      extractedSlots: {
        specialty: null,
        symptoms: null,
        timeframe: null,
        location: null,
        preferred_time: null,
        urgency: null
      },
      searchedProviders: [],
      selectedProvider: null,
      availableSlots: [],
      selectedSlot: null,
      patientInfo: { name: '', phone: '', email: '', reason: '' }
    })
  }
}))

export default useAppointmentStore
