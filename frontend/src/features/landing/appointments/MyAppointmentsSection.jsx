import React, { useEffect, useState } from 'react'
import useAppointmentStore from '../../../store/appointmentStore'
import useBooking from '../../../hooks/useBooking'

/**
 * Production-Ready Appointments Tracker for Landing Page
 * Shows upcoming appointments with reminders and calendar integration
 */
const MyAppointmentsSection = () => {
  const { appointments, loadingAppointments } = useAppointmentStore()
  const { loadAppointments, cancelAppointment } = useBooking()
  const [cancellingId, setCancellingId] = useState(null)

  // Load appointments on mount
  useEffect(() => {
    loadAppointments()
  }, [])

  // Filter upcoming appointments (future confirmed appointments only)
  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.datetime || apt.appointment_details?.datetime)
    return apt.status === 'confirmed' && aptDate > new Date()
  })

  // Find next appointment for reminder
  const nextAppointment = upcomingAppointments.length > 0
    ? upcomingAppointments.sort((a, b) => {
        const dateA = new Date(a.datetime || a.appointment_details?.datetime)
        const dateB = new Date(b.datetime || b.appointment_details?.datetime)
        return dateA - dateB
      })[0]
    : null

  // Check if appointment is within 24 hours
  const isUpcomingSoon = nextAppointment && (
    new Date(nextAppointment.datetime || nextAppointment.appointment_details?.datetime) - new Date()
  ) < 24 * 60 * 60 * 1000

  const handleCancelAppointment = async (appointment) => {
    if (!confirm(`Cancel appointment with ${appointment.provider?.name || appointment.provider_name}?`)) {
      return
    }

    setCancellingId(appointment.appointment_id)
    try {
      await cancelAppointment(
        appointment.appointment_id,
        appointment.confirmation_code,
        'User cancelled from landing page'
      )
      alert('Appointment cancelled successfully')
    } catch (error) {
      alert(`Failed to cancel: ${error.message}`)
    } finally {
      setCancellingId(null)
    }
  }

  const downloadICS = (appointment) => {
    const aptDate = new Date(appointment.datetime || appointment.appointment_details?.datetime)
    const endDate = new Date(aptDate.getTime() + 30 * 60000) // 30 min duration
    
    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    const providerName = appointment.provider?.name || appointment.provider_name || 'Doctor'
    const specialty = appointment.provider?.specialty || appointment.specialty || 'General'
    const location = appointment.provider?.address || appointment.provider?.location || 'Virtual'
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Doctor Appointment - ${providerName}
DTSTART:${formatDate(aptDate)}
DTEND:${formatDate(endDate)}
DESCRIPTION:${specialty} appointment\\nConfirmation: ${appointment.confirmation_code}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `appointment-${appointment.confirmation_code}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Don't show section if no appointments
  if (!loadingAppointments && upcomingAppointments.length === 0) {
    return null
  }

  return (
    <section id="my-appointments" className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Urgent Reminder Banner */}
          {isUpcomingSoon && nextAppointment && (
            <div className="mb-8 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-l-4 border-yellow-500 rounded-xl p-6 shadow-lg animate-pulse">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-yellow-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-arc-text mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Upcoming Appointment Reminder
                  </h3>
                  <p className="text-arc-text mb-3">
                    You have an appointment with <strong className="text-arc-accent">{nextAppointment.provider?.name || nextAppointment.provider_name}</strong> soon!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-arc-text">
                      <svg className="w-4 h-4 text-arc-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">
                        {new Date(nextAppointment.datetime || nextAppointment.appointment_details?.datetime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-arc-text">
                      <svg className="w-4 h-4 text-arc-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">
                        {new Date(nextAppointment.datetime || nextAppointment.appointment_details?.datetime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-arc-text-muted">
                      <svg className="w-4 h-4 text-arc-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium truncate">
                        {nextAppointment.provider?.location || nextAppointment.provider?.address || 'Virtual'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-arc-text-muted font-mono bg-arc-surface/50 px-3 py-1 rounded inline-block">
                    Confirmation Code: <strong className="text-arc-accent">{nextAppointment.confirmation_code}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

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
          {!loadingAppointments && upcomingAppointments.length > 0 && (
            <div className="grid gap-6">
              {upcomingAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.appointment_id}
                  appointment={apt}
                  onCancel={handleCancelAppointment}
                  onDownload={downloadICS}
                  isCancelling={cancellingId === apt.appointment_id}
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
 * Individual Appointment Card with Calendar Integration
 */
const AppointmentCard = ({ appointment, onCancel, onDownload, isCancelling }) => {
  const aptDate = new Date(appointment.datetime || appointment.appointment_details?.datetime)
  const isUpcoming = aptDate > new Date()
  
  const providerName = appointment.provider?.name || appointment.provider_name || 'Unknown Provider'
  const specialty = appointment.provider?.specialty || appointment.specialty || 'General'
  const location = appointment.provider?.address || appointment.provider?.location || 'Virtual Clinic'

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-arc-surface rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border-l-4 ${
      isUpcoming ? 'border-green-500' : 'border-arc-border'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
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
                {(appointment.status || 'CONFIRMED').toUpperCase()}
              </span>
              <span className="text-sm text-arc-text-muted font-mono">
                {appointment.confirmation_code}
              </span>
            </div>

            {/* Provider Info */}
            <h3 className="text-xl font-bold text-arc-text mb-1">
              {providerName}
            </h3>
            <p className="text-arc-accent font-medium mb-4">{specialty}</p>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-arc-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-arc-text-muted font-medium">Date</p>
                  <p className="font-semibold text-arc-text">{formatDate(aptDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-arc-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-arc-text-muted font-medium">Time</p>
                  <p className="font-semibold text-arc-text">{formatTime(aptDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <svg className="w-5 h-5 text-arc-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs text-arc-text-muted font-medium">Location</p>
                  <p className="font-semibold text-arc-text">{location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isUpcoming && appointment.status === 'confirmed' && (
          <div className="flex gap-3 pt-4 border-t border-arc-border">
            <button
              onClick={() => onDownload(appointment)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-arc-accent text-white rounded-lg hover:bg-arc-accent/80 transition font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Add to Calendar
            </button>
            <button
              onClick={() => onCancel(appointment)}
              disabled={isCancelling}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointmentsSection
