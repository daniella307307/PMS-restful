import React, { useEffect, useState } from 'react';
import { userProfileApi } from '../apis/userapi';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { bookingApi } from '../apis/bookapi';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import MyBookings from '../components/MyBookings';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const [newBookingData, setNewBookingData] = useState({ parkingSpotId: '', startTime: '' });

  const handleCreateBooking = async () => {
    try {
      await bookingApi.createBooking(newBookingData);
      toast.success('Booking created');
      setNewBookingData({ parkingSpotId: '', startTime: '' }); // reset
    } catch (err) {
      toast.error('Booking creation failed');
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfileApi.getMe();
        setUser(data);
      } catch (error) {
        toast.error('Failed to load profile');
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
  <div className='flex flex-col md:flex-row min-h-screen'>
  <Sidebar/>
    <div className="p-6">
    <div className="flex flex-wrap justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-700">
        Welcome, {user?.username || 'User'}
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search for anything"
          className="border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <FontAwesomeIcon
          icon={faBell}
          className="text-purple-500 text-xl cursor-pointer"
          aria-label="Notifications"
        />
        <img
          src={user?.profileImage || '/default-avatar.png'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
      </div>
    </div>

    {/* Dashboard Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <Card className="bg-purple-700 text-white shadow-md">
        <CardContent>
          <Typography variant="subtitle1" className="text-white">
            Total Bookings
          </Typography>
          <Typography variant="h5" className="font-bold">
            {user?.bookings?.length || 0}
          </Typography>
        </CardContent>
      </Card>

      <Card className="bg-purple-700 text-white shadow-md">
        <CardContent>
          <Typography variant="subtitle1" className="text-white">
            Active Booking
          </Typography>
          <Typography variant="h5" className="font-bold">
            {user?.activeBooking ? '1' : '0'}
          </Typography>
        </CardContent>
      </Card>

      <Card className="bg-purple-700 text-white shadow-md">
        <CardContent>
          <Typography variant="subtitle1" className="text-white">
            Upcoming Bookings
          </Typography>
          <Typography variant="h5" className="font-bold">
            {/* Could also be dynamic or static here */}
            1
          </Typography>
        </CardContent>
      </Card>
    </div>
    {/* Existing Dashboard code... */}

      {/* Booking creation form */}
      <div className="mb-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-400">Create New Booking</h2>
        <input
          type="text"
          placeholder="Parking Spot ID"
                    className="border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 mx-4"

          value={newBookingData.parkingSpotId}
          onChange={(e) => setNewBookingData({ ...newBookingData, parkingSpotId: e.target.value })}
        />
        <input
          type="datetime-local"
                    className="border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 mx-4"

          value={newBookingData.startTime}
          onChange={(e) => setNewBookingData({ ...newBookingData, startTime: e.target.value })}
        />
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-full"
          onClick={handleCreateBooking}
        >
          Book Now
        </button>
      </div>
    {/* Render MyBookings component */}
    <MyBookings/>
  </div>
  </div>
);
}

export default Dashboard;
