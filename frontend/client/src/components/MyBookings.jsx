import React, { useEffect, useState } from "react";
import { bookingApi } from "../apis/bookapi";
import { toast } from "react-toastify";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const fetchBookings = async () => {
    try {
      const response = await bookingApi.getMyBookings();
      console.log("API response:", response);
      setBookings(response.data || []);
      setCount(response.count || 0);
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to fetch bookings");
      setBookings([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      toast.success("Booking canceled");
      fetchBookings();
    } catch (error) {
      toast.error("Cancel failed");
    }
  };
  const handleEntry = async (bookingId) => {
    try {
      const response =await axios.post('http://localhost:8080/api/booking/entry', { bookingId });
      console.log(response);
      toast.success("Car entry recorded");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to record car entry");
    }
  };

  const handleExit = async (bookingId) => {
    try {
      const response =await axios.post('http://localhost:8080/api/booking/exit', { bookingId });
      console.log(response)
      toast.success("Car exit recorded");
      fetchBookings();
    } catch (error) {
      console.log(error);
      toast.error("Failed to record car exit");
      
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  if (count === 0)
    return <p>No bookings found.</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <a href="/create-booking-form" className="bg-[#8176AF] text-white px-6 py-3 rounded-full hover:bg-[#6c5ce7] transition duration-300">Book a new Spot</a>

      </div>
      {bookings.map((b) => (
        <div
          key={b.id}
          className="border border-gray-300 rounded-lg p-4 shadow-sm"
        >
          <p>
            <strong>Parking Lot:</strong>{" "}
            {b.parkingLot?.name || "Unknown"} — {b.parkingLot?.address || "N/A"}
          </p>
          <p>
            <strong>Spot:</strong>{" "}
            {b.parkingSpot?.spotNumber || b.parkingSpotId || "N/A"}{" "}
            {b.parkingSpot?.spotType && `(${b.parkingSpot.spotType})`}
          </p>
          <p>
            <strong>Vehicle:</strong>{" "}
            {b.vehicle?.licensePlate || b.vehicleId || "N/A"} —{" "}
            {b.vehicle?.make} {b.vehicle?.model}
          </p>
          <p>
            <strong>Start Time:</strong>{" "}
            {b.startTime ? new Date(b.startTime).toLocaleString() : "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {b.status || "N/A"}
          </p>

          {b.status === "active" && (
            <button
              onClick={() => handleCancel(b.id)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel Booking
            </button>
          )}
          {
            b.status === 'confirmed' && (
              <button type="click" onClick={()=>handleEntry(b.id)} className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Enter</button>
            )
          }
                    {
            b.status === 'pending_payment' && (
              <button type="click" onClick={()=>handleExit(b.id)} className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Exit</button>
            )
          }
        </div>
      ))}
    </div>
  );
}

export default MyBookings;
