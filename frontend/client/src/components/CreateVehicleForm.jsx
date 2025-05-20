import React, { useState } from "react";
import { bookingApi } from "../apis/bookapi"; // Assuming you have this API helper
import { toast } from "react-toastify";
import { vehicleRoutesApi } from "../apis/vehicleApi";

function CreateVehicleForm() {
  const [vehicleData, setVehicleData] = useState({
    licensePlate: "",
    make: "",
    model: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCreateVehicle = async () => {
    setLoading(true);
    try {
      await vehicleRoutesApi.createVehicle(vehicleData); // Your API call

      toast.success("Booking created successfully!");
      window.location.href = "/vehicle";
      // Optionally reset form
      setVehicleData({
        licensePlate: "",
        make: "",
        model: "",
        color: "",
      });
    } catch (error) {
      toast.error("Failed to create vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <section className="mb-10 bg-white p-6 rounded-xl shadow-md w-[50%]">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Create New Vehicle
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateVehicle();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="License Plate"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={vehicleData.licensePlate}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                licensePlate: e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Make"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={vehicleData.make}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                make: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Model"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={vehicleData.model}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                model: e.target.value,
              })
            }
            required
          />
          <input
            type="text"
            placeholder="Color"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={vehicleData.color}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                color: e.target.value,
              })
            }
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-800 hover:bg-indigo-700"
            } text-white py-3 rounded-full font-semibold transition`}
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateVehicleForm;
