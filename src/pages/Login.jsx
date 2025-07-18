import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";

import UserIcon from "../assets/UserIcon.png";
import LockIcon from "../assets/password_icon.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successAnimation, setSuccessAnimation] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://url.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if ([400, 401, 404].includes(response.status)) {
          throw new Error(data.message || "Invalid credentials.");
        } else {
          throw new Error("Something went wrong. Please try again.");
        }
      }

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("✅ Login successful!");
      setSuccessAnimation(true); // Show check animation
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      if (err.name === "TypeError") {
        toast.error("🌐 Network error or CORS issue. Please try again.");
      } else {
        toast.error(`❌ ${err.message}`);
      }
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center px-4">
      {/* Background gradients */}
      <div className="absolute w-[362px] h-[362px] rounded-full bg-gradient-to-b from-[#8249F3] to-white -top-[58px] -left-[145px] rotate-[-33.88deg] z-0"></div>
      <div className="absolute w-[362px] h-[362px] rounded-full bg-gradient-to-b from-[#8249F3] to-white -bottom-[161.75px] right-[-136px] rotate-[-33.88deg] z-0"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm border border-[#8249F3] bg-white rounded-lg p-10 shadow-md">
        <div className="text-sm text-left text-black font-medium mb-4">
          <a href="/signup">Back</a>
        </div>

        <h2 className="text-3xl text-center font-bold text-black">Login</h2>
        <p className="text-sm text-gray-600 text-center mb-8 top-5 relative">
          Your hostel life starts here
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#8249F3] text-[#8249F3] placeholder-[#8249F3] px-4 py-3 rounded-lg pr-10 outline-none"
            />
            <img
              src={UserIcon}
              alt="email"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#8249F3] text-[#8249F3] placeholder-[#8249F3] px-4 py-3 rounded-lg pr-10 outline-none"
            />
            <img
              src={LockIcon}
              alt="password"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5"
            />
          </div>

          {/* Error Message */}
          <ErrorMessage message={error} />

          {/* Remember Me */}
          <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-[#8249F3]"
              />
              Remember me
            </label>
            <a href="#" className="text-gray-600 font-medium">
              Forgot Password
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#8249F3] text-white font-semibold rounded-lg hover:bg-[#6a3cd8] transition-all duration-200 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Loader /> : "Continue"}
          </button>

          {/* Sign up prompt */}
          <p className="text-sm text-gray-600 text-center mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#8249F3] font-medium">
              Sign up
            </a>
          </p>
        </form>
      </div>

      {/* Success Animation */}
      {successAnimation && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <svg
            className="w-20 h-20 text-green-500 animate-ping-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-600 mt-3 font-semibold">Redirecting...</p>
        </div>
      )}
    </div>
  );
} 