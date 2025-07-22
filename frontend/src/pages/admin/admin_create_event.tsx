import { useState } from 'react';

export default function AdminCreateEventPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedImage(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-8">
            Event <span style={{ color: '#8B5CF6' }}>Hive</span>
          </h2>
          <h1 className="text-4xl font-bold text-black">Create Event</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-8">
            {/* Event Title */}
            <div>
              <label htmlFor="eventTitle" className="block text-lg font-semibold text-black mb-3">
                Event Title
              </label>
              <input
                id="eventTitle"
                type="text"
                placeholder="Enter event title"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Event Venue */}
            <div>
              <label htmlFor="eventVenue" className="block text-lg font-semibold text-black mb-3">
                Event Venue
              </label>
              <input
                id="eventVenue"
                type="text"
                placeholder="Enter venue address"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Start Time and End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-lg font-semibold text-black mb-3">
                  Start time
                </label>
                <input
                  id="startTime"
                  type="time"
                  placeholder="Enter start time"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-lg font-semibold text-black mb-3">
                  End time
                </label>
                <input
                  id="endTime"
                  type="time"
                  placeholder="Enter end time"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-lg font-semibold text-black mb-3">
                  Start date
                </label>
                <input
                  id="startDate"
                  type="date"
                  placeholder="Enter start date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-lg font-semibold text-black mb-3">
                  End date
                </label>
                <input
                  id="endDate"
                  type="date"
                  placeholder="Enter end date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Event Cost */}
            <div>
              <label htmlFor="eventCost" className="block text-lg font-semibold text-black mb-3">
                Event Cost
              </label>
              <input
                id="eventCost"
                type="number"
                placeholder="Enter the cost of the event in INR"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Event Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-black mb-3">
                Event Image
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={selectedImage || "/placeholder.svg"} 
                      alt="Selected event" 
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600">Click or drag to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <svg 
                        className="w-12 h-12 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">Upload Here</p>
                      <p className="text-sm text-gray-500 mt-1">Click or drag and drop your image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Description */}
            <div>
              <label htmlFor="eventDescription" className="block text-lg font-semibold text-black mb-3">
                Event Description
              </label>
              <textarea
                id="eventDescription"
                rows={6}
                placeholder="Type here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-vertical"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-md text-white font-semibold text-lg transition-colors duration-200"
                style={{ 
                  backgroundColor: '#8B5CF6'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7C3AED'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#8B5CF6'}
              >
                Create event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}