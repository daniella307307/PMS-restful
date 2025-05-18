import React, { useState } from 'react';
import { bookingApi } from '../apis/bookapi'; // Assuming you have this API helper
import { toast } from 'react-toastify';

function CreateBookingForm() {
  const [newBookingData, setNewBookingData] = useState({
    parkingLotId: '',
    parkingSpotId: '',
    vehicleId: '',
    startTime: '',
    endTime: '',
  });

  const [loading, setLoading] = useState(false);

  const handleCreateBooking = async () => {
    setLoading(true);
    try {
      // Prepare payload converting numbers explicitly if needed
      const payload = {
        parkingLotId: Number(newBookingData.parkingLotId),
        parkingSpotId: newBookingData.parkingSpotId
          ? Number(newBookingData.parkingSpotId)
          : undefined, // optional field
        vehicleId: Number(newBookingData.vehicleId),
        startTime: newBookingData.startTime,
        endTime: newBookingData.endTime,
      };

      await bookingApi.createBooking(payload); // Your API call

      toast.success('Booking created successfully!');
      // Optionally reset form
      setNewBookingData({
        parkingLotId: '',
        parkingSpotId: '',
        vehicleId: '',
        startTime: '',
        endTime: '',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <section className="mb-10 bg-white p-6 rounded-xl shadow-md max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Create New Booking
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateBooking();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="number"
            placeholder="Parking Lot ID"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={newBookingData.parkingLotId}
            onChange={(e) =>
              setNewBookingData({
                ...newBookingData,
                parkingLotId: e.target.value,
              })
            }
            required
            min={1}
          />

          <input
            type="number"
            placeholder="Parking Spot ID (optional)"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={newBookingData.parkingSpotId}
            onChange={(e) =>
              setNewBookingData({
                ...newBookingData,
                parkingSpotId: e.target.value,
              })
            }
            min={1}
          />

          <input
            type="number"
            placeholder="Vehicle ID"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={newBookingData.vehicleId}
            onChange={(e) =>
              setNewBookingData({
                ...newBookingData,
                vehicleId: e.target.value,
              })
            }
            required
            min={1}
          />

          <label className="text-sm font-medium text-gray-600">Start Time</label>
          <input
            type="datetime-local"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={newBookingData.startTime}
            onChange={(e) =>
              setNewBookingData({
                ...newBookingData,
                startTime: e.target.value,
              })
            }
            required
          />

          <label className="text-sm font-medium text-gray-600">End Time</label>
          <input
            type="datetime-local"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={newBookingData.endTime}
            onChange={(e) =>
              setNewBookingData({
                ...newBookingData,
                endTime: e.target.value,
              })
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            } text-white py-3 rounded-full font-semibold transition`}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateBookingForm;
