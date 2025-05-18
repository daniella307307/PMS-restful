import React, { useEffect, useState } from 'react';
import { parkingLotApi } from '../apis/parkingapi';
import { parkingSpotApi } from '../apis/spotapi';
import { bookingApi } from '../apis/bookapi';
import { toast } from 'react-toastify';

function ParkingLots() {
  const [parkingLots, setParkingLots] = useState([]);
  const [expandedLotId, setExpandedLotId] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loadingSpots, setLoadingSpots] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For booking details (placeholder example)
  const [selectedVehicleId, setSelectedVehicleId] = useState(1); // TODO: replace with actual vehicle selection
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0,16)); // "YYYY-MM-DDTHH:mm"
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600 * 1000).toISOString().slice(0,16)); // +1 hour

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const data = await parkingLotApi.getLots();
        setParkingLots(data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch parking lots');
      } finally {
        setLoading(false);
      }
    };
    fetchParkingLots();
  }, []);

  const toggleSpots = async (lot) => {
    if (expandedLotId === lot.id) {
      setExpandedLotId(null);
      setSpots([]);
      return;
    }
    setExpandedLotId(lot.id);
    setLoadingSpots(true);
    try {
      const res = await parkingSpotApi.getSpotsForLot(lot.id);
      setSpots(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch spots');
      setSpots([]);
    } finally {
      setLoadingSpots(false);
    }
  };

  const bookSpot = async (spot) => {
    if (spot.status !== 'available') {
      toast.error('This spot is not available for booking.');
      return;
    }

    // Validate time inputs
    if (new Date(startTime) >= new Date(endTime)) {
      toast.error('End time must be after start time.');
      return;
    }

    try {
      const bookingData = {
        parkingLotId: expandedLotId,
        parkingSpotId: spot.id,
        vehicleId: selectedVehicleId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      };

      await bookingApi.createBooking(bookingData);
      toast.success(`Spot ${spot.spotNumber} booked successfully!`);

      setSpots((prevSpots) =>
        prevSpots.map((s) =>
          s.id === spot.id ? { ...s, status: 'booked' } : s
        )
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to book spot. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Available Parking Lots</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        {parkingLots.map((lot) => (
          <div key={lot.id} className="bg-white shadow-md rounded-xl p-4 border">
            <div
              onClick={() => toggleSpots(lot)}
              className="cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-blue-700">{lot.name}</h2>
              <p className="text-gray-600">City: {lot.city}</p>
              <p className="text-gray-600">Rate/hr: ${lot.hourlyRate}</p>
              <p className="text-gray-600">Available Spots: {lot.availableSpots}</p>
              <p className="text-sm text-gray-400">Status: {lot.status}</p>
            </div>

            {expandedLotId === lot.id && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Spots</h3>

                {/* Booking time inputs */}
                <div className="mb-4 space-x-4">
                  <label>
                    Start Time:{' '}
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border p-1 rounded"
                    />
                  </label>
                  <label>
                    End Time:{' '}
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border p-1 rounded"
                    />
                  </label>
                </div>

                {/* TODO: Replace with real vehicle selector */}
                <div className="mb-4">
                  <label>
                    Vehicle ID:{' '}
                    <input
                      type="number"
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                      className="border p-1 rounded w-20"
                      min={1}
                    />
                  </label>
                  <p className="text-sm text-gray-500">Replace with vehicle dropdown later.</p>
                </div>

                {loadingSpots ? (
                  <p>Loading spots...</p>
                ) : spots.length === 0 ? (
                  <p className="text-gray-500">No spots found.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {spots.map((spot) => (
                      <div
                        key={spot.id}
                        onClick={() => bookSpot(spot)}
                        className={`p-2 border rounded text-center cursor-pointer ${
                          spot.status === 'available'
                            ? 'bg-green-200 hover:bg-green-300'
                            : 'bg-red-200 cursor-not-allowed'
                        }`}
                        title={
                          spot.status === 'available'
                            ? 'Click to book this spot'
                            : 'Not available'
                        }
                      >
                        {spot.spotNumber}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingLots;
