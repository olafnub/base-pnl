'use client'

import Link from "next/link";
import React, { useState, useEffect } from "react";
import './assets/Navbar.css'
import LoadNav from './NavBarHelpers/LoadNav'

const Navbar = () => {
  
  const [openNavBar, setOpenNavBar] = useState(false);

  const toggleNavBar = () => {
    setOpenNavBar(!openNavBar)
  }

  useEffect(() => {
    if (openNavBar) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
  }, [openNavBar])

  return (
    <nav className="border-b-2 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">Wallet Finance</Link> { /* Will replace with image of our logo in the future */}
            </div>
          </div>
          <div className="hidden md:block">
              <LoadNav />
          </div>
          <div className="md:hidden flex items-center">
              <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white
              hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleNavBar}
              >
                {openNavBar ? (
                  <svg  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor" >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg  className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"/>
                  </svg>
                )}
              </button>
          </div>
        </div>
      </div>
      {openNavBar && (
        <div className="md:hidden h-screen">
              <LoadNav />
        </div>
      )}
    </nav>
    
  );
};

export default Navbar;