import React, { useState } from "react";
import { authApi } from "../apis/userapi";
import { toast } from "react-toastify";
import { Link, Navigate, replace } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleTextChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call login with two separate params, as per your API definition
      await authApi.login(formData.identifier, formData.password);
      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.forgotPassword(forgotPasswordEmail);
      toast.success("Password reset link sent! Please check your email.");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error) {
      toast.error(error.message || "Failed to send reset link");
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[#f4f4f4]">
      <div className="flex flex-col gap-6 p-8 rounded-lg shadow-lg border border-gray-300 bg-white w-[90%] max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back!
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={formData.identifier}
            onChange={handleTextChange("identifier")}
            className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter your email or username"
            required
          />
          <input
            type="password"
            value={formData.password}
            onChange={handleTextChange("password")}
            className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter your password"
            required
          />
          <button
            type="submit"
            className="bg-[#8176AF] text-white px-6 py-3 rounded-full hover:bg-[#6c5ce7] transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between items-center">
          <Link
            to="/register"
            className="text-[#8176AF] text-right text-sm hover:underline"
          >
            SIGN UP
          </Link>
          <span
            onClick={() => setShowForgotPassword(true)}
            className="text-[#8176AF] text-right text-sm cursor-pointer hover:underline"
          >
            FORGOT PASSWORD?
          </span>
        </div>
        {/* Forgot Password Modal/Section */}
        {showForgotPassword && (
          <div className="mt-6 p-4">
            <h2 className="text-lg font-semibold mb-2 text-center">
              Reset Your Password
            </h2>
            <form
              onSubmit={handleForgotPasswordSubmit}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-[#8176AF] text-white px-4 py-2 rounded-full hover:bg-[#6c5ce7] transition duration-300"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
