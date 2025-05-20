import React from "react";
import Navbar from "../components/Navbar";
import TypingHeader from "../components/TypingHeader";
import ImageSlider from "../components/ImageSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Services from "../components/Services";
import { Navigate } from "react-router-dom";

function Home() {
  return (
    <div className="bg-[#fff] text-gray-400 min-h-screen w-full">
      <Navbar />
      <div className="flex flex-col px-6 py-8">
        <div className="flex flex-col md:flex-row  justify-between w-full max-w-6xl gap-8">
          {/* Text Section */}
          <div className="w-full md:w-1/2 mt-8">
            <TypingHeader />
            <p className="text-md md:text-sm mt-4">
              Discover a seamless, efficient, and intelligent way to manage your
              parking spaces. Our cutting-edge Parking Management System
              leverages technology to streamline operations, reduce stress, and
              enhance user experience — all in one smart platform.
            </p>
            <div className="w-full items-center justify-center">
              <button
                className="px-6 py-2 rounded-full border-2 border-[#C0B7E8] text-[#C0B7E8] mt-4 
            hover:bg-[#C0B7E8] hover:text-[#302C42] transition-all 
            flex gap-2 items-center animate-pulse" // Less aggressive than bounce
              >
               <Navigate to='/register'/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
      <h1 className='text-center text-xl font-bold'>Process</h1>
        <Services/>
      </div>
    </div>
  );
}

export default Home;
