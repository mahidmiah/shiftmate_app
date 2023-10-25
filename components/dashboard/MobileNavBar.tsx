'use client'

import useShiftStore from '@/store/shiftStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineFolder, AiOutlineSetting } from 'react-icons/ai';
import { BiHome } from 'react-icons/bi';
import { BsCalendarRange, BsPeople } from 'react-icons/bs';
import { TbLayoutDashboard } from 'react-icons/tb';
import ToggleDarkMode from './ToggleDarkMode';
import LogoutButton from './LogoutButton';

export default function MobileNavBar() {

  const isMenuOpen = useShiftStore((state) => state.isMobileMenuOpen);
  const closeMenu = useShiftStore((state) => state.closeMobileMenu);

  const hide = 'transition-transform duration-300 ease-in-out transform-gpu -translate-x-full';
  const show = 'transition-transform duration-300 ease-in-out transform-gpu translate-x-0'; 

  const darkMode = useShiftStore((state) => state.darkMode)
  const setDarkMode = useShiftStore((state) => state.setDark);
  const setLightMode = useShiftStore((state) => state.setLight);

  const pathname = usePathname()

  const active = 'bg-[#1188EC] hover:bg-[#1170ec] rounded-md flex items-center justify-start gap-2 px-4 py-3 w-full text-white text-md mb-4 shadow-md'
  const nonActive = 'hover:bg-[#1170ec] hover:text-white rounded-md flex items-center justify-start gap-2 px-4 py-3 w-full text-[#8C9195] text-md mb-4'
  
  return (
    <div className={`z-50 flex-col lg:hidden fixed top-0 left-0 h-full w-56 widget_bg widget_border border-r text-white ${isMenuOpen ? show : hide}`}>
      
      <div className='flex justify-end pt-5 pr-3'>
        <button
          className="section_text focus:outline-none"
          onClick={closeMenu}
          disabled={false}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className='flex h-full w-full flex-col items-center justify-between pt-2 gap-8'>

        <div className='w-fit'>

          <div className='flex flex-col items-center justify-center text-center mb-8'>
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="#0074D9" />
              <polygon points="50,30 60,50 50,70 40,50" fill="#FFF" />
            </svg>
          </div>

          <hr className='mb-8 widget_border' />

          <Link 
            href={'/dashboard/home'}
            onClick={closeMenu}
            className={(pathname === '/dashboard/home' ? active : nonActive)}
          > 
            <BiHome size={15} /> Home 
          </Link>

          <Link 
            href={'/dashboard/dashboard'}
            onClick={closeMenu}
            className={(pathname === '/dashboard/dashboard' ? active : nonActive)}
          > 
            <TbLayoutDashboard size={15} className="transition-none duration-0" /> Dashboard 
          </Link>

          <Link 
            href={'/dashboard/schedule'}
            onClick={closeMenu}
            className={(pathname === '/dashboard/schedule' ? active : nonActive)}
          > 
            <BsCalendarRange size={15} /> Schedule 
          </Link>

          <Link 
            href={'/dashboard/employees'}
            onClick={closeMenu}
            className={(pathname === '/dashboard/employees' ? active : nonActive)}
          > 
            <BsPeople size={15} className="transition-none duration-0" /> Employees 
          </Link>

          <Link 
            href={'/dashboard/reports'}
            onClick={closeMenu}
            className={(pathname === '/dashboard/reports' ? active : nonActive)}
          > 
            <AiOutlineFolder size={15} className="transition-none duration-0" /> Reports 
          </Link>

          <Link 
            href={'/dashboard/settings'}
            onClick={closeMenu}
            className={pathname === '/dashboard/settings' ? active : nonActive}
          > 
            <AiOutlineSetting size={15} className="transition-none duration-0" /> Settings 
          </Link>
        </div>

        <ToggleDarkMode 
          darkMode={darkMode}
          setLightMode={setLightMode}
          setDarkMode={setDarkMode}
        />

        <LogoutButton />
        
      </div>
      
    </div>
  );
}
