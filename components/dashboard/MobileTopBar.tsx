'use client'

import React, { useState } from 'react'
import useShiftStore from '@/store/shiftStore';

function MobileTopBar() {

  const isMenuOpen = useShiftStore((state) => state.isMobileMenuOpen);
  const openMenu = useShiftStore((state) => state.openMobileMenu);
  const closeMenu = useShiftStore((state) => state.closeMobileMenu);
  
  return (
    <>
    <div className='lg:hidden widget_bg widget_border border-b h-16 flex '>
      {/* Logo */}
      <div className='flex flex-row items-center justify-between text-center mx-6 h-full w-full'>
        <div className='flex items-center gap-x-2'>
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#0074D9" />
          <polygon points="50,30 60,50 50,70 40,50" fill="#FFF" />
        </svg>
          {/* <h1 className='text-lg font-semibold italic text-white'>ShiftMate</h1> */}
        </div>

        <button
        className="section_text focus:outline-none"
        onClick={isMenuOpen ? closeMenu : openMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
    </>
  )
}

export default MobileTopBar