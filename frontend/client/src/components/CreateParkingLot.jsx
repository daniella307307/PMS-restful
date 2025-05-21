import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { parkingLotApi } from "../apis/parkingapi";
import { userProfileApi } from "../apis/userapi";

function CreateParkingLot() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    hourlyRate: "",
    totalSpots: "",
    availableSpots: "",
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfileApi.getMe();
        setUser(data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await parkingLotApi.createLot(formData);
      toast.success("Parking lot created successfully!");
      setFormData({
        name: "",
        city: "",
        address: "",
        hourlyRate: "",
        totalSpots: "",
        availableSpots: "",
      });
      window.location.href='/admin/dashboard'
    } catch (error) {
      toast.error(error.message || "Failed to create parking lot");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (user.role == "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          Create Parking Lot
        </h2>
        {["name", "city", "address", "hourlyRate", "totalSpots", "availableSpots"].map((field) => (
          <input
            key={field}
            type={["hourlyRate", "totalSpots", "availableSpots"].includes(field) ? "number" : "text"}
            value={formData[field]}
            onChange={handleChange(field)}
            placeholder={field.replace(/([A-Z])/g, " $1").trim()}
            className="mb-4 w-full p-3 border rounded-lg text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-[#8176AF] text-white py-3 rounded-full hover:bg-[#6c5ce7] transition"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateParkingLot;
