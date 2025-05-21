import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [lots, setLots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState("users");

  const [userFilter, setUserFilter] = useState("all");
  const [slotStatusFilter, setSlotStatusFilter] = useState("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  const fetchAllDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [usersRes, vehiclesRes, lotsRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/users", config),
        axios.get("http://localhost:8080/api/vehicles/getall", config),
        axios.get("http://localhost:8080/api/parking-lots/", config),
        axios.get("http://localhost:8080/api/bookings/", config),
      ]);

      setUsers(usersRes.data.data);
      setVehicles(vehiclesRes.data.data);
      setLots(lotsRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };
  
  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const filteredUsers =
    userFilter === "all" ? users : users.filter((u) => u.role === userFilter);
  const filteredSlots =
    slotStatusFilter === "all"
      ? slots
      : slots.filter((s) => s.status === slotStatusFilter);
  const filteredBookings =
    bookingStatusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === bookingStatusFilter);

  const TabButton = ({ label, value }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 border-b-2 ${
        activeTab === value ? "border-blue-500 font-bold" : "border-transparent"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-gray-100">
          Total Users: {users.length}
        </div>
        <div className="p-4 border rounded bg-gray-100">
          Total Vehicles: {vehicles.length}
        </div>
        <div className="p-4 border rounded bg-gray-100">
          Parking Lots: {lots.length}
        </div>
        <div className="p-4 border rounded bg-gray-100">
          Parking Slots: {slots.length}
        </div>
        <div className="p-4 border rounded bg-gray-100">
          Bookings: {bookings.length}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <TabButton label="Users" value="users" />
        <TabButton label="Vehicles" value="vehicles" />
        <TabButton label="Lots" value="lots" />
        <TabButton label="Slots" value="slots" />
        <TabButton label="Bookings" value="bookings" />
      </div>

      {/* Tab Content */}
      {activeTab === "users" && (
        <>
          <select
            className="mb-4 p-2 border rounded"
            onChange={(e) => setUserFilter(e.target.value)}
            value={userFilter}
          >
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <ul className="space-y-2">
            {filteredUsers.map((user) => (
              <li key={user.id} className="p-2 border rounded">
                {user.name} - {user.email} ({user.role})
              </li>
            ))}
          </ul>
        </>
      )}

      {activeTab === "vehicles" && (
        <ul className="space-y-2">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="p-2 border rounded">
              {vehicle.plateNumber} - {vehicle.type} (Owner:{" "}
              {vehicle.owner?.name || "Unknown"})
            </li>
          ))}
        </ul>
      )}

      {activeTab === "lots" && (
        <ul className="space-y-2">
          {lots.map((lot) => (
            <li key={lot.id} className="p-2 border rounded">
              {lot.name} - {lot.location}
            </li>
          ))}
        </ul>
      )}

      {activeTab === "slots" && (
        <>
          <select
            className="mb-4 p-2 border rounded"
            onChange={(e) => setSlotStatusFilter(e.target.value)}
            value={slotStatusFilter}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
          <ul className="space-y-2">
            {filteredSlots.map((slot) => (
              <li key={slot.id} className="p-2 border rounded">
                Slot #{slot.slotNumber} - {slot.status}
              </li>
            ))}
          </ul>
        </>
      )}

      {activeTab === "bookings" && (
        <>
          <select
            className="mb-4 p-2 border rounded"
            onChange={(e) => setBookingStatusFilter(e.target.value)}
            value={bookingStatusFilter}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <ul className="space-y-2">
            {filteredBookings.map((booking) => (
              <li key={booking.id} className="p-2 border rounded">
                Booking #{booking.id} - {booking.status} (
                {booking.user?.name || "N/A"} - Slot #{booking.slot?.slotNumber}
                )
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="flex flex-wrap gap-6">
          <button className={`bg-[#8176AF] text-white px-6 py-3 rounded-full hover:bg-[#6c5ce7] transition duration-300 flex items-center justify-center`}><Link to='/admin/create-parking-lot'>Add a Parking Lot</Link></button>
          <button className={`bg-[#8176AF] text-white px-6 py-3 rounded-full hover:bg-[#6c5ce7] transition duration-300 flex items-center justify-center`}><Link to='/admin/create-vehicle'>Add a vehicle</Link></button>
      </div>
    </div>
  );
}
