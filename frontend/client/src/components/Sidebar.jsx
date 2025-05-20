import React from 'react';
import { NavLink } from 'react-router-dom';
import { faCar, faParking, faClipboardList, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sidebar() {
  const linkClass =
    'flex items-center gap-2 p-2 rounded hover:bg-indigo-100 text-gray-700';
  const activeClass = 'bg-indigo-200 font-semibold';

  return (
    <aside className="hidden md:w-64 md:h-screen md:bg-white md:shadow-md md:p-4 md:flex md:flex-col">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">PMS Dashboard</h1>

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
        to="/vehicle"
        className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
      >
        <FontAwesomeIcon icon={faCar}/>Vehicle
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
