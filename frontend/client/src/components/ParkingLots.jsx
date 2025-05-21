import React, { useEffect, useState } from 'react';
import { parkingLotApi } from '../apis/parkingapi';
import { parkingSpotApi } from '../apis/spotapi';
import { bookingApi } from '../apis/bookapi';
import { vehicleRoutesApi } from '../apis/vehicleApi';
import { toast } from 'react-toastify';

function ParkingLots() {
  const [parkingLots, setParkingLots] = useState([]);
  const [expandedLotId, setExpandedLotId] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loadingSpots, setLoadingSpots] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const [startTime, setStartTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16)
  );

  useEffect(() => {
    // Fetch lots and user vehicles in parallel
    const fetchData = async () => {
      try {
        const [lotsRes, vehiclesRes] = await Promise.all([
          parkingLotApi.getLots(),
          vehicleRoutesApi.getMyVehicle(),
        ]);
        setParkingLots(lotsRes.data || []);
        setVehicles(vehiclesRes.data || []);
        // Set default selected vehicle
        if (vehiclesRes.data && vehiclesRes.data.length > 0) {
          setSelectedVehicleId(vehiclesRes.data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSpots = async (lot) => {
    if (expandedLotId === lot.id) {
      setExpandedLotId(null);
      setSpots([]);
      return;
    }

    if (!vehicles.length) {
      toast.info('Please add a vehicle first to make a booking.');
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

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Your Vehicles</h2>
        {vehicles.length ? (
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plateNumber} - {v.type}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500">
            You have no vehicles. <a href="/create-vehicle" className="text-blue-500 underline">Add a vehicle</a> to start booking.
          </p>
        )}
      </div>

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

            {expandedLotId === lot.id && !loadingSpots && spots.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Spots</h3>
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
              </div>
            )}

            {expandedLotId === lot.id && loadingSpots && <p>Loading spots...</p>}
            {expandedLotId === lot.id && !loadingSpots && spots.length === 0 && (
              <p className="text-gray-500 mt-4">No spots found.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingLots;
