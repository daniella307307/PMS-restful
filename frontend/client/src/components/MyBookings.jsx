import React, { useEffect, useState } from 'react';
import { bookingApi } from '../apis/bookapi';
import { toast } from 'react-toastify';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await bookingApi.getMyBookings({ upcoming: 'true' });
      setBookings(response.data); // API should return data array
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      toast.success('Booking canceled');
      fetchBookings(); // refresh list
    } catch (error) {
      toast.error('Cancel failed');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            className="border border-gray-300 rounded-lg p-4 shadow-sm"
          >
            <p><strong>Spot:</strong> {b.parkingSpot?.spotNumber}</p>
            <p><strong>Start:</strong> {new Date(b.startTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {b.status}</p>
            {b.status === 'active' && (
              <button
                onClick={() => handleCancel(b.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;
