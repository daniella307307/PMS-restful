import React, { useEffect, useState } from "react";
import { userProfileApi } from "../apis/userapi";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { bookingApi } from "../apis/bookapi";
import { Card, CardContent, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";
import MyBookings from "../components/MyBookings";
import ParkingLots from "../components/ParkingLots";
import ErrorBoundary from "../errors/ErrorBoundary";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBookingData, setNewBookingData] = useState({
    parkingLotId: "",
    parkingSpotId: "",
    vehicleId: "",
    startTime: "",
    endTime: "",
  });

  const handleCreateBooking = async () => {
    // Basic frontend validation for date order
    if (
      new Date(newBookingData.endTime) <= new Date(newBookingData.startTime)
    ) {
      toast.error("End time must be after start time");
      return;
    }
    try {
      // Convert IDs to numbers (since inputs return strings)
      const payload = {
        parkingLotId: Number(newBookingData.parkingLotId),
        vehicleId: Number(newBookingData.vehicleId),
        startTime: newBookingData.startTime,
        endTime: newBookingData.endTime,
      };
      if (newBookingData.parkingSpotId) {
        payload.parkingSpotId = Number(newBookingData.parkingSpotId);
      }
      await bookingApi.createBooking(payload);
      toast.success("Booking created");
      setNewBookingData({
        parkingLotId: "",
        parkingSpotId: "",
        vehicleId: "",
        startTime: "",
        endTime: "",
      }); // reset
    } catch (err) {
      toast.error("Booking creation failed");
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfileApi.getMe();
        setUser(data.data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className='hidden'/>
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">
            Welcome, {user?.username || "User"}
          </h1>

          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search for anything"
              className="border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FontAwesomeIcon
              icon={faBell}
              className="text-indigo-500 text-xl cursor-pointer"
              aria-label="Notifications"
            />
            <img
              src={user?.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-indigo-700 text-white shadow-md">
            <CardContent>
              <Typography variant="subtitle1" className="text-gray-500">
                Total Bookings
              </Typography>
              <Typography variant="h5" className="font-bold">
                
              </Typography>
            </CardContent>
          </Card>

          <Card className="bg-indigo-700 text-white shadow-md">
            <CardContent>
              <Typography variant="subtitle1" className="text-gray-500">
                Active Booking
              </Typography>
              <Typography variant="h5" className="font-bold">
                
              </Typography>
            </CardContent>
          </Card>

          <Card className="bg-indigo-700 text-white shadow-md">
            <CardContent>
              <Typography variant="subtitle1" className="text-gray-500">
                Upcoming Bookings
              </Typography>
              <Typography variant="h5" className="font-bold">
                
              </Typography>
            </CardContent>
          </Card>
        </div>
        {/* Render MyBookings component */}
        <ErrorBoundary>
          <MyBookings />
        </ErrorBoundary>
      </div>
      <ErrorBoundary>
        <ParkingLots />
      </ErrorBoundary>
    </div>
  );
}

export default Dashboard;
