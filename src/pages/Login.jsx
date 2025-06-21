import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../services/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Login successful!");
      navigate("/dashboard"); // change to your post-login page
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <h2 className="text-3xl font-extrabold text-purple-700 text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl focus-within:ring-2 ring-purple-300">
            <FaEnvelope className="text-purple-500 text-lg" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl focus-within:ring-2 ring-purple-300">
            <FaLock className="text-purple-500 text-lg" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg rounded-xl shadow-md hover:from-purple-700 hover:to-blue-600 transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 text-center text-sm text-gray-400">or</div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 text-gray-700 rounded-xl shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
        >
          <FaGoogle className="text-red-500" />
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-purple-700 hover:underline font-medium cursor-pointer"
          >
            Register here
          </span>
        </p>
        <p className="text-center text-sm text-gray-500 mt-2">
          <span
            onClick={() => navigate("/")}
            className="hover:underline cursor-pointer"
          >
            ← Back to Home
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
