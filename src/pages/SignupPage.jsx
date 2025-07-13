import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "STUDENT",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    symbol: /[^A-Za-z0-9]/.test(formData.password),
  };

  const allValid =
    Object.values(passwordChecks).every(Boolean) &&
    /^[a-zA-Z ]+$/.test(formData.name) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    /^\d{9}$/.test(formData.phone) &&
    formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 9) return;
    }

    if (name === "name" && /[^a-zA-Z ]/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allValid) {
      toast.error("❌ Please fix form errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("phone", `+233${formData.phone}`);
      payload.append("userType", formData.userType);

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccessAnimation(true); // Trigger checkmark
      toast.success("✅ Account created successfully!");
      setTimeout(() => navigate("/login"), 2500); // Delay redirect
    } catch (err) {
      if (!navigator.onLine) {
        toast.error("📡 No internet connection. Try again.");
      } else if (err.message.includes("Failed to fetch")) {
        toast.error("🚫 Server unreachable. Check CORS or connection.");
      } else {
        toast.error(`❌ ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white flex items-center justify-center px-4 py-10 font-sans">
      {/* Background Circles */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-b from-[#8249F3] to-white -top-[60px] -left-[140px] z-0"></div>
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-b from-[#8249F3] to-white -bottom-[140px] -right-[120px] z-0"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md border border-[#8249F3] bg-white rounded-xl p-6 shadow-md">
        <div className="text-sm text-left text-black font-medium mb-3">
          <a href="/">← Back</a>
        </div>
        <h2 className="text-2xl font-bold text-center text-[#19191a] mb-1">Sign Up</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Join UNISTAY, your journey starts here</p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-[#8249F3] text-sm text-[#8249F3] px-4 py-2 rounded-lg pr-10 outline-none"
            />
            <FaUser className="absolute right-3 top-2.5 text-[#8249F3]" />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-[#8249F3] text-sm text-[#8249F3] px-4 py-2 rounded-lg pr-10 outline-none"
            />
            <FaEnvelope className="absolute right-3 top-2.5 text-[#8249F3]" />
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-[#8249F3] text-sm font-semibold">+233</div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full pl-16 border border-[#8249F3] text-sm text-[#8249F3] px-4 py-2 rounded-lg pr-4 outline-none"
            />
            <FaPhone className="absolute right-3 top-2.5 text-[#8249F3]" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setShowChecklist(true)}
              onBlur={() => setTimeout(() => setShowChecklist(false), 200)}
              placeholder="Password"
              className="w-full border border-[#8249F3] text-sm text-[#8249F3] px-4 py-2 rounded-lg pr-10 outline-none"
            />
            <FaLock
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-[#8249F3]"
            />

            {/* Password Popover */}
            {showChecklist && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-sm text-xs text-gray-600 p-3 z-20">
                <p className={passwordChecks.length ? "text-green-500" : "text-red-500"}>✔ At least 8 characters</p>
                <p className={passwordChecks.uppercase ? "text-green-500" : "text-red-500"}>✔ Uppercase letter</p>
                <p className={passwordChecks.lowercase ? "text-green-500" : "text-red-500"}>✔ Lowercase letter</p>
                <p className={passwordChecks.number ? "text-green-500" : "text-red-500"}>✔ Number</p>
                <p className={passwordChecks.symbol ? "text-green-500" : "text-red-500"}>✔ Special character</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border border-[#8249F3] text-sm text-[#8249F3] px-4 py-2 rounded-lg pr-10 outline-none"
            />
            <FaLock
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-[#8249F3]"
            />
          </div>

          {/* User Type */}
          <div className="flex justify-between text-sm text-[#8249F3]">
            <label>
              <input
                type="radio"
                value="STUDENT"
                checked={formData.userType === "STUDENT"}
                onChange={handleChange}
                name="userType"
                className="accent-[#8249F3] mr-1"
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="OWNER"
                checked={formData.userType === "OWNER"}
                onChange={handleChange}
                name="userType"
                className="accent-[#8249F3] mr-1"
              />
              Hostel Owner
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#8249F3] text-white text-sm font-semibold rounded-lg hover:bg-[#6a3cd8] transition"
          >
            Continue
          </button>
        </form>
      </div>

      {/* Fullscreen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <svg className="animate-spin h-8 w-8 text-[#8249F3] mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-[#8249F3] font-medium text-base">Creating account...</p>
        </div>
      )}

      {/* Success Check Animation */}
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
