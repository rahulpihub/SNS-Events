import { useNavigate } from 'react-router-dom';     

export default function SignUpPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up form submitted');
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Welcome Section */}
      <div className="flex-1 relative">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-98pP0e1lXWP1sEW1NEFsWrhjQPoFXi.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white px-8 max-w-md">
            <h2 className="text-4xl font-bold mb-6">Welcome back</h2>
            <p className="text-lg mb-8 leading-relaxed">
              To keep connected with us provide us with your information
            </p>
            <button 
              className="px-8 py-3 bg-gray-600 bg-opacity-80 text-white rounded-md font-medium hover:bg-opacity-90 transition-all duration-200"
              onClick={() => window.location.href = '/signin'}
            >
              Signin
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Column - Sign Up Form */}
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
            <h1 className="text-3xl font-bold text-black">Sign Up to Event Hive</h1>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            
            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-medium text-lg transition-colors duration-200"
              style={{ 
                backgroundColor: '#8B5CF6'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#7C3AED'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#8B5CF6'}
            >
              Sign Up
            </button>
          </form>
          
          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a 
                href="/signin" 
                className="text-purple-600 hover:text-purple-700 font-medium underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}