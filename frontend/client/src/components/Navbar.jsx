import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <div className='hidden md:flex justify-between items-center p-4 bg-white text-[#8176AF]'>
        <FontAwesomeIcon icon={faCar} size='2x' />
        <ul className='flex gap-6 font-medium'>
          <li><a href='#about' className='hover:underline'>ABOUT</a></li>
          <li><a href='#services' className='hover:underline'>SERVICES</a></li>
          <li><a href='#contact' className='hover:underline'>CONTACT US</a></li>
        </ul>
        <button
          type='submit'
          className='rounded-full border border-[#8176AF] px-4 py-2 hover:bg-[#8176AF] hover:text-white transition'
        >
          JOIN PMS
        </button>
      </div>

      {/* Mobile Header */}
      <div className='flex justify-between items-center p-4 bg-white text-[#8176AF] md:hidden'>
        <FontAwesomeIcon icon={faCar} size='2x' />
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={faBars} size='2x' />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className='flex flex-col gap-3 px-4 pb-4 bg-white text-[#8176AF] md:hidden z-50'>
          <a href='#about' className='hover:underline'>ABOUT</a>
          <hr className='border-[#8176AF] w-full' />
          <a href='#services' className='hover:underline'>SERVICES</a>
          <hr className='border-[#8176AF] w-full' />
          <a href='#contact' className='hover:underline'>CONTACT US</a>
          <hr className='border-[#8176AF] w-full' />
          <button
            type='submit'
            className='rounded-full border border-[#8176AF] px-4 py-2 hover:bg-[#8176AF] hover:text-white transition'
          >
            JOIN PMS
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;
