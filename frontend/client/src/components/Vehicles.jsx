import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { vehicleRoutesApi } from "../apis/vehicleApi";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleRoutesApi.getVehicle();
        setVehicles(data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch vehicles");
        toast.error("failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles;
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Available Vehicles
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white shadow-md rounded-xl p-4 border"
          >
            <div className="cursor-pointer">
              <h2 className="text-xl font-semibold text-blue-700">
                Plate Number:{vehicle.licensePlate}
              </h2>
              <p className="text-gray-600">Expected cost: {vehicle.expectedCost }</p>
              <p className="text-gray-600">startTime: {vehicle.startTime}</p>
              <p className="text-gray-600">startTime: {vehicle.endTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Vehicles;
