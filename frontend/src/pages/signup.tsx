import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import signUpImage from "../assets/signup_img.png"; // Import the image


export default function SignUpPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!/^[A-Za-z]+$/.test(name)) {
      setError("Name should contain alphabets only.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/signup/", {
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });

      setSuccess("User registered successfully!");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column */}
      <div className="flex-1 relative">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage: `url(${signUpImage})`,
          }}
        >
          <div className="relative z-10 text-center text-white px-8 max-w-md">
            <h2 className="text-4xl font-bold mb-6">Welcome back</h2>
            <p className="text-lg mb-8 leading-relaxed">
              To keep connected with us provide us with your information
            </p>
            <button
              className="px-8 py-3 bg-gray-600 bg-opacity-80 text-white rounded-md font-medium hover:bg-opacity-90 transition-all duration-200"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black">
              Event <span style={{ color: "#8B5CF6" }}>Hive</span>
            </h2>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-black">
              Sign Up to Event Hive
            </h1>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Password Field with Show/Hide */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
              <span
                className="absolute top-9 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Confirm Password Field with Show/Hide */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              />
              <span
                className="absolute top-9 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-medium text-lg transition-colors duration-200"
              style={{ backgroundColor: "#8B5CF6" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C3AED")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#8B5CF6")
              }
            >
              Sign Up
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
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
