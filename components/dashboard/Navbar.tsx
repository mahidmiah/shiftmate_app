'use client'

import { usePathname } from 'next/navigation';
import React from 'react'
import { BiHome } from 'react-icons/bi';
import { TbLayoutDashboard } from 'react-icons/tb'
import { AiOutlineFolder, AiOutlineSetting } from 'react-icons/ai'
import Link from 'next/link';
import useShiftStore from '@/store/shiftStore';
import { BsCalendarRange, BsPeople } from 'react-icons/bs';
import ToggleDarkMode from './ToggleDarkMode';
import LogoutButton from './LogoutButton';

function Navbar() {

  const pathname = usePathname()

  const darkMode = useShiftStore((state) => state.darkMode);
  const setDarkMode = useShiftStore((state) => state.setDark);
  const setLightMode = useShiftStore((state) => state.setLight);

  const active = 'bg-custom_blue hover:bg-custom_blue_hover rounded-md flex gap-2 items-center justify-start px-4 py-3 w-full text-white text-sm mb-6 shadow-md transition-none'
  const nonActive = 'hover:bg-custom_blue_hover hover:text-white rounded-md flex gap-2 items-center justify-start px-4 py-3 w-full text-[#8C9195] text-sm mb-6 transition-none'
  
  return (
    <div className='navbar'>
      
      {/* LOGO */}
      <div className='flex flex-col items-center justify-center text-center h-48'>
        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#0074D9" />
          <polygon points="50,30 60,50 50,70 40,50" fill="#FFF" />
        </svg>
      </div>

      {/* MENU BUTTONS */}
      <div className='flex h-full w-fit border-t widget_border flex-col justify-between'>
        {/* NAV BUTTONS */}
        <div className='flex h-fit flex-col justify-between mt-6'>
          <Link 
            href={'/dashboard/home'}
            className={(pathname === '/dashboard/home' ? active : nonActive) + ' mt-6'}
          > 
            <BiHome size={20} className="transition-none" /> Home 
          </Link>

          <Link 
            href={'/dashboard/dashboard'}
            className={(pathname === '/dashboard/dashboard' ? active : nonActive)}
          > 
            <TbLayoutDashboard size={20} /> Dashboard 
          </Link>

          <Link 
            href={'/dashboard/schedule'}
            className={pathname === '/dashboard/schedule' ? active : nonActive}
          > 
            <BsCalendarRange size={20} /> Schedule 
          </Link>

          <Link 
            href={'/dashboard/employees'}
            className={pathname === '/dashboard/employees' ? active : nonActive}
          > 
            <BsPeople size={20} /> Employees 
          </Link>

          <Link 
            href={'/dashboard/reports'}
            className={pathname === '/dashboard/reports' ? active : nonActive}
          > 
            <AiOutlineFolder size={20} /> Reports 
          </Link>

          <Link 
            href={'/dashboard/settings'}
            className={pathname === '/dashboard/settings' ? active : nonActive}
          > 
            <AiOutlineSetting size={20} className="transition-none" /> Settings 
          </Link>
        </div>

        {/* LOGOUT / TOGGLE BUTTONS */}
        <div className='flex h-fit flex-col justify-between gap-16'>
          {/* TOGGLE BUTTON */}
          <ToggleDarkMode 
            darkMode={darkMode}
            setLightMode={setLightMode}
            setDarkMode={setDarkMode}
          />

          {/* LOGOUT BUTTON */}
          <LogoutButton />
        </div>
      </div>

    </div>
  )
}

export default Navbar