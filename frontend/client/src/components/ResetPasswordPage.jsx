import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link import
import { authApi } from '../apis/userapi';
import { toast } from 'react-toastify';

function ResetPasswordPage() {
  const { resetToken } = useParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isResetting, setIsResetting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsResetting(true);
    try {
      await authApi.resetPassword(resetToken, formData.newPassword);
      toast.success("Password reset successfully! You can now login with your new password.");
      // Redirect to login after successful reset
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[#f4f4f4]">
      <div className="flex flex-col gap-6 p-8 rounded-lg shadow-lg border border-gray-300 bg-white w-[90%] max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Reset Your Password
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter new password"
              required
              minLength="8"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Confirm new password"
              required
              minLength="8"
            />
          </div>
          <button
            type="submit"
            disabled={isResetting}
            className={`bg-[#8176AF] text-white px-6 py-3 rounded-full hover:bg-[#6c5ce7] transition duration-300 flex items-center justify-center ${
              isResetting ? 'opacity-75' : ''
            }`}
          >
            {isResetting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
        <div className="text-center">
          <Link
            to="/login"
            className="text-[#8176AF] text-sm hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;