import React, { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../apis/userapi";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    birthday: "",
  });

  const handleTextChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { confirmPassword, ...submitData } = formData;

    try {
      await authApi.register(submitData);
      toast.success("Registration successful!");
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-[#f4f4f4]">
      <div className="flex flex-col gap-6 p-8 rounded-lg shadow-lg border border-gray-300 bg-white w-[90%] max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create a new Account!
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={formData.username}
            onChange={handleTextChange("username")}
            className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter your username"
          />
          <input
            type="email"
            value={formData.email}
            onChange={handleTextChange("email")}
            className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter your email"
          />
          <input
            type="date"
            value={formData.birthday}
            onChange={handleTextChange("birthday")}
            className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            value={formData.password}
            onChange={handleTextChange("password")}
            className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter your password"
          />
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={handleTextChange("confirmPassword")}
            className="bg-gray-100 text-sm px-4 py-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Confirm password"
          />
          <button
            type="submit"
            className="bg-[#8176AF] text-white px-6 py-3 rounded-full hover:bg-[#6c5ce7] transition duration-300"
          >
            Register
          </button>
          <Link
            to="/login"
            className="text-[#8176AF] text-right text-sm hover:underline"
          >
            ALREADY HAVE AN ACCOUNT? SIGN IN
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
