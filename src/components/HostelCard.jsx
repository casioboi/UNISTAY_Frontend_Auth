import React from "react";

export default function HostelCard({ hostel, mode = "full", onViewDetails, onUnlock }) {
  const isPreview = mode === "preview";
  const isLocked = mode === "locked";

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${isLocked ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img
          src={hostel.image}
          alt={hostel.name}
          className={`w-full h-40 sm:h-48 object-cover ${isLocked ? 'blur-sm' : ''}`}
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-white font-medium text-sm sm:text-base">Locked</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{hostel.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{hostel.location}</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
          {isPreview || isLocked ? 'GHS ****/mo' : hostel.price}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
          {isLocked ? 'This property is locked. Unlock to view full details.' : isPreview ? hostel.description.slice(0, 60) + '...' : hostel.description}
        </p>
        
        {isLocked ? (
          <button
            className="w-full bg-gray-400 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-500 transition-colors"
            onClick={onUnlock}
          >
            Unlock to Access
          </button>
        ) : (
          <button
            className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              isPreview 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            onClick={() => !isPreview && onViewDetails?.(hostel.id)}
            disabled={isPreview}
          >
            {isPreview ? 'Preview Only' : 'View Details'}
          </button>
        )}
      </div>
    </div>
  );
} 