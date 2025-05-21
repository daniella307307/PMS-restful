import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { vehicleRoutesApi } from "../apis/vehicleApi";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await vehicleRoutesApi.getVehicle({}, page, 5); // 5 per page
        setVehicles(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError(err.message || "Failed to fetch vehicles");
        toast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [page]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Available Vehicles</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white shadow-md rounded-xl p-4 border">
            <h2 className="text-xl font-semibold text-blue-700">
              Plate Number: {vehicle.licensePlate}
            </h2>
            {/* other vehicle info */}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Vehicles;
