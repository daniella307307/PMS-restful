import React, { useState } from "react";
import { authApi } from "../apis/userapi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleTextChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await authApi.login(formData.identifier, formData.password);
      toast.success("Login successful!");
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role == "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email");
      return;
    }
    
    setIsSendingReset(true);
    try {
      await authApi.forgotPassword(forgotPasswordEmail);
      toast.success("If an account exists with this email, a reset link has been sent");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsSendingReset(false);
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
            disabled={isLoggingIn}
            className={`bg-[#8176AF] text-white px-6 py-3 rounded-full hover:bg-[#6c5ce7] transition duration-300 flex items-center justify-center ${
              isLoggingIn ? 'opacity-75' : ''
            }`}
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
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
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
                  disabled={isSendingReset}
                  className={`bg-[#8176AF] text-white px-4 py-2 rounded-full hover:bg-[#6c5ce7] transition duration-300 ${
                    isSendingReset ? 'opacity-75' : ''
                  }`}
                >
                  {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gray-600 hover:underline text-sm"
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