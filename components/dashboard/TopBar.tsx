'use client'

import React from 'react'
import { usePathname } from 'next/navigation';

function TopBar() {

  const pathname = usePathname();

  return (
    <div className='widget_bg widget_border border-b h-12 lg:h-32 flex items-end py-2 px-6 lg:px-14 lg:py-6'>
      <h1 className='section_text text-xl lg:text-4xl font-medium'>{pathname === '/dashboard/home' ? 'Home' : ''}</h1>
      <h1 className='section_text text-xl lg:text-4xl font-medium'>{pathname === '/dashboard/settings' ? 'Settings' : ''}</h1>
      <h1 className='section_text text-xl lg:text-4xl font-medium'>{pathname === '/dashboard/employees' ? 'Employees' : ''}</h1>
      <h1 className='section_text text-xl lg:text-4xl font-medium'>{pathname === '/dashboard/schedule' ? 'Schedule' : ''}</h1>
      <h1 className='section_text text-xl lg:text-4xl font-medium'>{pathname === '/dashboard/dashboard' ? 'Dashboard' : ''}</h1>
      <h1 className='section_text text-xl lg:text-4xl font-medium'>{pathname === '/dashboard/reports' ? 'Reports' : ''}</h1>
    </div>
  )
}

export default TopBar