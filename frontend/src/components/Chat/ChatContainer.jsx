import React, { useState, useEffect, useCallback } from 'react'
import { useChatStore } from '../../store/chatStore'
import useAppointmentStore from '../../store/appointmentStore'
import { useChat } from '../../hooks/useChat'
import useBooking from '../../hooks/useBooking'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'

// Booking components
import {
  LocationPermissionModal,
  ProviderCard,
  SlotSelector,
  PatientInfoForm,
  BookingCard
} from '../Booking'

function ChatContainer({ compactMode = false }) {
  const { currentConversationId, messages, isTyping, error, addMessage } = useChatStore()
  const { sendMessage } = useChat(currentConversationId)
  const [input, setInput] = useState('')
  
  const scrollRef = useAutoScroll([messages, isTyping])

  // ============================================
  // Booking State
  // ============================================
  const {
    bookingInProgress,
    bookingStep,
    extractedSlots,
    searchedProviders,
    selectedProvider,
    availableSlots,
    patientInfo,
    selectProvider,
    selectSlot,
    updatePatientInfo,
    setBookingStep,
    resetBooking
  } = useAppointmentStore()

  const {
    loading: bookingLoading,
    searchProviders,
    getProviderSlots,
    bookAppointment,
    loadAppointments
  } = useBooking(currentConversationId)

  const [confirmedAppointment, setConfirmedAppointment] = useState(null)

  // ============================================
  // Booking Flow Handlers
  // ============================================

  const handleLocationGranted = useCallback(async (location) => {
    console.log('📍 Location granted:', location)
    try {
      const specialty = extractedSlots?.specialty || 'general_practice'
      console.log(`🔍 Searching providers for: ${specialty}`)
      await searchProviders(specialty, location)
    } catch (error) {
      console.error('Provider search failed:', error)
      // Add error message to chat
      addMessage({
        role: 'assistant',
        content: `Sorry, I couldn't find providers for ${extractedSlots?.specialty || 'this specialty'}. Please try again later.`,
        created_at: new Date().toISOString()
      })
      resetBooking()
    }
  }, [extractedSlots, searchProviders, resetBooking, addMessage])

  const handleProviderSelected = useCallback(async (provider) => {
    console.log('👨‍⚕️ Provider selected:', provider.name)
    selectProvider(provider)
    try {
      await getProviderSlots(provider.provider_id)
    } catch (error) {
      console.error('Failed to get slots:', error)
      addMessage({
        role: 'assistant',
        content: `Sorry, I couldn't load available times for ${provider.name}. Please try again.`,
        created_at: new Date().toISOString()
      })
    }
  }, [selectProvider, getProviderSlots, addMessage])

  const handleSlotSelected = useCallback((slot) => {
    console.log('🕐 Slot selected:', slot)
    selectSlot(slot)
  }, [selectSlot])

  const handlePatientInfoSubmit = useCallback(async (info) => {
    console.log('✍️ Submitting patient info:', info)
    updatePatientInfo(info)
    
    try {
      const { selectedSlot, selectedProvider } = useAppointmentStore.getState()
      
      console.log('📅 Booking appointment:', { provider: selectedProvider?.name, slot: selectedSlot?.datetime })
      
      // Book the appointment
      const appointment = await bookAppointment(
        selectedProvider.provider_id,
        selectedSlot.slot_id || String(Date.now()),
        selectedSlot.datetime,
        info
      )

      console.log('✅ Appointment confirmed:', appointment)
      setConfirmedAppointment(appointment)
      setBookingStep('confirmed')
      
      // Add confirmation message to chat with markdown formatting
      const confirmationMsg = `🎉 **Appointment Confirmed!**\n\n` +
        `**Provider:** ${appointment.provider?.name || appointment.provider_name}\n` +
        `**Specialty:** ${appointment.provider?.specialty || appointment.specialty}\n` +
        `**Date & Time:** ${new Date(appointment.datetime || appointment.appointment_details?.datetime).toLocaleString()}\n` +
        `**Location:** ${appointment.provider?.address || appointment.provider?.location || 'Virtual Clinic'}\n\n` +
        `**Confirmation Code:** \`${appointment.confirmation_code}\`\n\n` +
        `✅ Your appointment has been saved. You can view all appointments on the home page.`
      
      addMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: confirmationMsg,
        metadata: {
          type: 'booking_confirmation',
          confirmation_code: appointment.confirmation_code,
          appointment_id: appointment.appointment_id
        },
        created_at: new Date().toISOString()
      })
      
      // Load appointments to sync with backend
      await loadAppointments()
      
    } catch (error) {
      console.error('❌ Booking failed:', error)
      addMessage({
        role: 'assistant',
        content: '❌ Sorry, the booking failed. Please try again.',
        created_at: new Date().toISOString()
      })
      resetBooking()
    }
  }, [updatePatientInfo, bookAppointment, setBookingStep, addMessage, resetBooking, loadAppointments])

  const handleCancelBooking = useCallback(() => {
    console.log('❌ Booking cancelled')
    resetBooking()
  }, [resetBooking])

  // ============================================
  // Chat Handlers
  // ============================================

  const handleSend = async () => {
    if (!input.trim() || !currentConversationId) return
    
    const message = input
    setInput('')
    await sendMessage(message)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ============================================
  // Render Booking UI Based on Step
  // ============================================
  const renderBookingUI = () => {
    if (!bookingInProgress) return null

    switch (bookingStep) {
      case 'location':
        // Always show location modal when in location step
        return (
          <LocationPermissionModal
            onAllowGeolocation={handleLocationGranted}
            onManualEntry={(city) => handleLocationGranted({ city })}
            onClose={handleCancelBooking}
          />
        )

      case 'provider':
        return (
          <div className="p-4 bg-arc-surface border-t border-arc-border">
            <h3 className="font-semibold text-lg mb-3 text-arc-text">Select a Provider</h3>
            {bookingLoading ? (
              <div className="text-center py-8 text-arc-text-muted">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-arc-accent border-t-transparent rounded-full mb-2"></div>
                <p>Searching for providers...</p>
              </div>
            ) : searchedProviders && searchedProviders.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchedProviders.map(provider => (
                  <ProviderCard
                    key={provider.provider_id}
                    provider={provider}
                    onSelect={handleProviderSelected}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-arc-text-muted">
                <p className="mb-2">😔 No providers found for this specialty.</p>
                <p className="text-sm">Try a different specialty or check back later.</p>
              </div>
            )}
            <button
              onClick={resetBooking}
              className="w-full mt-3 text-arc-text-muted py-2 hover:text-arc-text transition text-sm"
            >
              Cancel Booking
            </button>
          </div>
        )

      case 'slot':
        return (
          <div className="p-4 bg-arc-surface border-t border-arc-border">
            {bookingLoading ? (
              <div className="text-center py-8 text-arc-text-muted">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-arc-accent border-t-transparent rounded-full mb-2"></div>
                <p>Loading available times...</p>
              </div>
            ) : availableSlots && availableSlots.length > 0 ? (
              <SlotSelector
                provider={selectedProvider}
                slots={availableSlots}
                onSelectSlot={handleSlotSelected}
                onBack={() => setBookingStep('provider')}
              />
            ) : (
              <div className="text-center py-8 text-arc-text-muted">
                <p className="mb-2">😔 No available time slots found.</p>
                <button
                  onClick={() => setBookingStep('provider')}
                  className="text-arc-accent hover:underline"
                >
                  ← Choose another provider
                </button>
              </div>
            )}
          </div>
        )

      case 'info':
        return (
          <div className="p-4 bg-arc-surface border-t border-arc-border">
            <PatientInfoForm
              initialInfo={patientInfo}
              onSubmit={handlePatientInfoSubmit}
              onBack={() => setBookingStep('slot')}
            />
          </div>
        )

      case 'confirmed':
        return (
          <div className="p-4 bg-arc-surface border-t border-arc-border">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-semibold text-arc-text">Appointment Booked!</h3>
            </div>
            {confirmedAppointment && (
              <BookingCard
                appointment={confirmedAppointment}
                showActions={false}
              />
            )}
            <button
              onClick={() => {
                resetBooking()
                setConfirmedAppointment(null)
              }}
              className="w-full mt-3 bg-arc-accent text-white py-2 rounded-lg hover:bg-arc-accent/80 transition font-medium"
            >
              Done
            </button>
          </div>
        )

      default:
        return null
    }
  }

  if (!currentConversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-arc-text-muted">
          <div className={compactMode ? "text-2xl mb-2" : "text-4xl mb-4"}>💬</div>
          <p className={compactMode ? "text-sm" : ""}>
            {compactMode ? "Create a new chat to start" : "Select a conversation or create a new one"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/20 border-b border-red-700 text-sm text-red-400">
          {error}
        </div>
      )}
      
      {/* Messages Area - Scrollbar always visible */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-scroll ${compactMode ? 'p-3' : 'p-6'} space-y-4`}
        style={{ scrollbarGutter: 'stable' }}
      >
        <MessageList messages={messages} />
        {isTyping && <TypingIndicator />}
      </div>

      {/* Booking UI Overlay */}
      {renderBookingUI()}

      {/* Input Area */}
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        disabled={!currentConversationId || isTyping || bookingLoading}
      />
    </div>
  )
}

export default ChatContainer
