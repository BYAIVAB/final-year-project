import React, { useState } from 'react'

/**
 * Location Permission Modal
 * Requests user location for provider search
 */
const LocationPermissionModal = ({ onAllowGeolocation, onManualEntry, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [manualCity, setManualCity] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)

  const handleGeolocation = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser')
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onAllowGeolocation({ lat: latitude, lng: longitude })
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          if (error.code === 1) {
            setError('Location access denied. Please enter your city manually.')
          } else {
            setError('Could not determine your location. Please enter manually.')
          }
          setShowManualInput(true)
        },
        { timeout: 10000, enableHighAccuracy: true }
      )
    } catch (err) {
      setLoading(false)
      setError(err.message)
      setShowManualInput(true)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualCity.trim()) {
      onManualEntry(manualCity.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Location Access</h3>
              <p className="text-sm text-gray-600">Find nearby doctors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6">
          We need your location to show you nearby healthcare providers. Your location is only used for this search and is <strong>not stored</strong>.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Manual Input Form */}
        {showManualInput ? (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="Enter your city (e.g., Boston, MA)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              disabled={!manualCity.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Find Doctors
            </button>
            <button
              type="button"
              onClick={() => setShowManualInput(false)}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition text-sm"
            >
              Try geolocation instead
            </button>
          </form>
        ) : (
          /* Action Buttons */
          <div className="space-y-3">
            <button
              onClick={handleGeolocation}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:bg-blue-400"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Location...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Share My Location
                </>
              )}
            </button>
            <button
              onClick={() => setShowManualInput(true)}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Enter City Manually
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationPermissionModal
