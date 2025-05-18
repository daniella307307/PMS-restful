import React from 'react';
import { NavLink } from 'react-router-dom';
import { faCar, faParking, faClipboardList, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sidebar() {
  const linkClass =
    'flex items-center gap-2 p-2 rounded hover:bg-purple-100 text-gray-700';
  const activeClass = 'bg-purple-200 font-semibold';

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">PMS Dashboard</h1>

      <NavLink
        to="/dashboard"
        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
      >
        <FontAwesomeIcon icon={faHome}/> Dashboard
      </NavLink>

      <NavLink
        to="/bookings"
        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
      >
        <FontAwesomeIcon icon={faClipboardList}/>Bookings
      </NavLink>

      <NavLink
        to="/parking-lots"
        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
      >
        <FontAwesomeIcon icon={faParking}/>Parking Lots
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
      >
        <FontAwesomeIcon icon={faUser}/> Profile
      </NavLink>
    </aside>
  );
}

export default Sidebar;
