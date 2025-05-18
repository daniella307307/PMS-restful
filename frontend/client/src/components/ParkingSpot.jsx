import { useEffect, useState } from 'react';
import { parkingSpotApi } from '../apis/spotapi';

function ParkingSpot({ lotId }) {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const data = await parkingSpotApi.getSpots({ parkingLotId: lotId });
        setSpots(data);
      } catch (err) {
        console.error('Failed to fetch spots:', err);
      }
    };

    fetchSpots();
  }, [lotId]);

  return (
    <div className='p-6 '>
      <h2 className='text-2xl text-gray-400'>Parking Spots</h2>
      <ul>
        {spots.map(spot => (
          <li key={spot.id}>
            {spot.spotNumber} - {spot.status} - {spot.spotType}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParkingSpot;
