import React, { useEffect, useState } from 'react';
import { parkingLotApi } from '../apis/parkingapi'; // Adjust path based on your file structure

function ParkingLots() {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const data = await parkingLotApi.getLots();
        console.log(data)
        setParkingLots(data.data); // Adjust depending on backend response structure
      } catch (err) {
        setError(err.message || 'Failed to fetch parking lots');
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLots();
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold text-gray-700 mb-4'>Available Parking Lots</h1>

      {loading && <p className='text-gray-500'>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {parkingLots.map((lot) => (
          <div
            key={lot.id}
            className='bg-white shadow-md rounded-xl p-4 border border-gray-200'
          >
            <h2 className='text-xl font-semibold text-blue-700'>{lot.name}</h2>
            <p className='text-gray-600'>City: {lot.city}</p>
            <p className='text-gray-600'>Rate/hr: ${lot.hourlyRate}</p>
            <p className='text-gray-600'>Available Spots: {lot.availableSpots}</p>
            <p className='text-sm text-gray-400'>Status: {lot.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingLots;
