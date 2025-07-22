import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email.includes("@")) {
      setError("Email is not valid.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admin/signin/", {
        email,
        password
      });

      const token = response.data.token;
      sessionStorage.setItem("admin_token", token);

      // Redirect to Admin Create Event Page
      navigate("/admincreateevent");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black">
              Event <span style={{ color: '#8B5CF6' }}>Hive</span>
            </h2>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-black">Sign In to Event Hive</h1>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-medium text-lg transition-colors duration-200"
              style={{ backgroundColor: '#8B5CF6' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7C3AED')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8B5CF6')}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 relative">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/admin_signin_img.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      </div>
    </div>
  );
}
