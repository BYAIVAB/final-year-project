import React, { useEffect } from 'react'
import useAppointmentStore from '../../../store/appointmentStore'
import useBooking from '../../../hooks/useBooking'

/**
 * My Appointments Section for Landing Page
 * Displays user's upcoming appointments
 */
const MyAppointmentsSection = () => {
  const { appointments, loadingAppointments } = useAppointmentStore()
  const { loadAppointments, cancelAppointment } = useBooking()

  useEffect(() => {
    loadAppointments()
  }, [])

  const handleCancelAppointment = async (appointmentId, confirmationCode) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      await cancelAppointment(appointmentId, confirmationCode, 'User cancelled')
      alert('Appointment cancelled successfully')
    } catch (error) {
      alert(`Failed to cancel: ${error.message}`)
    }
  }

  // Don't show section if no appointments
  if (!loadingAppointments && appointments.length === 0) {
    return null
  }

  return (
    <section id="my-appointments" className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-arc-text mb-3">
              My Appointments
            </h2>
            <p className="text-arc-text-muted">
              Your upcoming doctor appointments
            </p>
          </div>

          {/* Loading State */}
          {loadingAppointments && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-arc-accent"></div>
              <p className="mt-4 text-arc-text-muted">Loading appointments...</p>
            </div>
          )}

          {/* Appointments Grid */}
          {!loadingAppointments && appointments.length > 0 && (
            <div className="grid gap-6">
              {appointments.map((apt) => (
                <AppointmentCard
                  key={apt.appointment_id}
                  appointment={apt}
                  onCancel={() => handleCancelAppointment(
                    apt.appointment_id,
                    apt.confirmation_code
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Appointment Card
 */
const AppointmentCard = ({ appointment, onCancel }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = new Date(appointment.datetime) > new Date()

  return (
    <div className={`bg-arc-surface rounded-xl shadow-lg p-6 border-l-4 ${
      isUpcoming ? 'border-arc-accent' : 'border-arc-border'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Status Badge */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              appointment.status === 'confirmed'
                ? 'bg-green-500/20 text-green-400'
                : appointment.status === 'cancelled'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {appointment.status.toUpperCase()}
            </span>
            <span className="text-sm text-arc-text-muted">
              Code: <span className="font-mono font-semibold text-arc-text">{appointment.confirmation_code}</span>
            </span>
          </div>

          {/* Provider Info */}
          <h3 className="text-xl font-bold text-arc-text mb-1">
            {appointment.provider_name}
          </h3>
          <p className="text-arc-text-muted mb-4">{appointment.specialty}</p>

          {/* Appointment Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-arc-text">
              <svg className="w-5 h-5 text-arc-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(appointment.datetime)}</span>
            </div>
            <div className="flex items-center gap-3 text-arc-text">
              <svg className="w-5 h-5 text-arc-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formatTime(appointment.datetime)}</span>
            </div>
            {appointment.address && (
              <div className="flex items-start gap-3 text-arc-text-muted">
                <svg className="w-5 h-5 text-arc-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{appointment.address}</span>
              </div>
            )}
          </div>

          {/* Warning for Past Appointments */}
          {!isUpcoming && appointment.status === 'confirmed' && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-yellow-400">
                This appointment has passed. Please contact the provider if you missed it.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {isUpcoming && appointment.status === 'confirmed' && (
          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-medium whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointmentsSection
