export default function AdminSignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Sign In Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black">
              Event <span style={{ color: '#8B5CF6' }}>Hive</span>
            </h2>
          </div>
          
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-black">Sign In to Event Hive</h1>
          </div>
          
          {/* Form */}
          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your mail"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Forgot your password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            
            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-medium text-lg transition-colors duration-200"
              style={{ 
                backgroundColor: '#8B5CF6',
                ':hover': { backgroundColor: '#7C3AED' }
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#7C3AED'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#8B5CF6'}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Column - Background Image */}
      <div className="flex-1 relative">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6EClW3zxl6Bcbf9tZcwddANkiynn6O.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Optional overlay for better contrast */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      </div>
    </div>
  )
}