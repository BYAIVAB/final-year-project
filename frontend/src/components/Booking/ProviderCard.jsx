import React from 'react'

/**
 * Provider Selection Card
 * Displays provider information with booking action
 */
const ProviderCard = ({ provider, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(provider)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Provider Photo */}
        <img
          src={provider.photo_url || `https://i.pravatar.cc/80?u=${provider.provider_id}`}
          alt={provider.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gray-200 group-hover:border-blue-400 transition"
        />

        {/* Provider Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 text-base truncate">
              {provider.name}
            </h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">{provider.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{provider.specialty}</p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
            {provider.distance_miles && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{provider.distance_miles} mi</span>
              </div>
            )}
            {provider.next_slot && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Next: {new Date(provider.next_slot).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
            {provider.location && !provider.distance_miles && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{provider.location}</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(provider)
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-blue-700"
          >
            View Available Times
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProviderCard
