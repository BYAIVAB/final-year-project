import React, { useState, useEffect } from 'react'

/**
 * Appointment Slot Selector
 * Displays available time slots for booking
 */
const SlotSelector = ({ provider, slots, onSelectSlot, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [groupedSlots, setGroupedSlots] = useState({})

  useEffect(() => {
    // Group slots by date
    const groups = {}
    slots.forEach(slot => {
      const date = new Date(slot.datetime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(slot)
    })
    setGroupedSlots(groups)

    // Auto-select first available date
    const dates = Object.keys(groups).sort()
    if (dates.length > 0) {
      setSelectedDate(dates[0])
    }
  }, [slots])

  const dates = Object.keys(groupedSlots).sort()
  const currentDateSlots = selectedDate ? groupedSlots[selectedDate] : []

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (datetime) => {
    const date = new Date(datetime)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">Select Appointment Time</h3>
          <p className="text-sm text-gray-600">{provider.name} - {provider.specialty}</p>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Select Date</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {dates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                selectedDate === date
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Available Times</span>
        </div>
        {currentDateSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {currentDateSlots.map(slot => (
              <button
                key={slot.slot_id}
                onClick={() => onSelectSlot(slot)}
                className="py-3 px-4 bg-gray-100 hover:bg-blue-100 hover:border-blue-400 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:text-blue-700 transition"
              >
                {formatTime(slot.datetime)}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No available slots for this date
          </div>
        )}
      </div>
    </div>
  )
}

export default SlotSelector
