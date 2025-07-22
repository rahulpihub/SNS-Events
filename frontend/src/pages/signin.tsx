import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import signInImage from "../assets/signin_img.png"; // Import the image

export default function AdminSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  interface SignInResponse {
    token: string;
    role: string;
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Email is not valid.");
      return;
    }

    try {
      const response = await axios.post<SignInResponse>("http://127.0.0.1:8000/api/signin/", {
        email,
        password,
      });

      const { token, role } = response.data;
      sessionStorage.setItem("auth_token", token);
      sessionStorage.setItem("role", role);

      if (role === "Admin") {
        navigate("/admindashboard");
      } else {
        navigate("/userdashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md  py-10 px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black">
              Event <span style={{ color: "#8B5CF6" }}>Hive</span>
            </h2>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-black">
              Sign In to Event Hive
            </h1>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
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

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <span
                className="absolute top-9 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-medium text-lg transition-colors duration-200"
              style={{ backgroundColor: "#8B5CF6" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C3AED")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#7C3AED")
              }
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 relative flex justify-end items-center">
        <div
          className="w-3/4 h-full bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"
          style={{
            backgroundImage: `url(${signInImage})`,
          }}
        ></div>
      </div>
    </div>
  );
}
