'use client'

import SupportBox from '@/components/dashboard/SupportBox';
import Banner from '@/components/dashboard/home/Banner'
import useShiftStore from '@/store/shiftStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function Page() {

  const [isVisible, setIsVisible] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>();

  const getProfileData = async () => {
    try {
      const res = await axios.get('/api/business/profile/getprofiledata')
      const data: ProfileData = res.data.data;
      setProfileData(data);
    } catch (error: any) {
      toast.error('Failed to load prfile data!');
    }
  }
  
  useEffect(() => {
    getProfileData();
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} px-6 py-6 lg:px-14 lg:py-12`}>
  
      <Banner />
      <h1 className='mt-8 lg:mt-16 text-xl md:text-3xl section_text font-bold italic'>Welcome back, {profileData?.ownerFirstName} {profileData?.ownerLastName}</h1>
      
      <div className='flex flex-col lg:flex-row gap-y-12 gap-x-12 mt-8 max-w-7xl'>
        
        <div className='px-6 py-8 widget_bg widget_border border-[1.5px] h-fit w-full rounded-md section_text shadow-md'>
          <h1 className='text-xl font-semibold'>Welcome to ShiftMate - Your Ultimate Shift Management Solution</h1>
          <p className='mt-5 text-sm'>At ShiftMate, we understand the importance of efficient and organized shift management. Weve designed this platform with your scheduling needs in mind. Say goodbye to scheduling conflicts, last-minute changes, and communication chaos.</p>
          <p className='mt-4 text-sm'>With ShiftMate, you can streamline your shift management, simplify employee scheduling, and ensure everyones on the same Page. Whether youre managing a small team or a large workforce, weve got you covered.</p>

          <hr className='border widget_border my-8'/>

          <h1 className='text-xl font-semibold pt-5'>Key Features at a Glance:</h1>
          <ul>
            <li className='text-sm pt-5'><span className='font-semibold'>Easy Scheduling:</span> Create, edit, and share shifts with ease.</li>
            <li className='text-sm pt-2'><span className='font-semibold'>Team Communication:</span> Stay connected with your team through integrated messaging.</li>
            <li className='text-sm pt-2'><span className='font-semibold'>Shift Reminders:</span> Never miss a shift with automated reminders.</li>
            <li className='text-sm pt-2'><span className='font-semibold'>Employee Availability:</span> Easily manage and accommodate your teams availability.</li>
            <li className='text-sm pt-2'><span className='font-semibold'>Reporting and Insights:</span> Gain valuable insights into your scheduling data.</li>
            <li className='text-sm pt-2'><span className='font-semibold'>Customization:</span> Tailor ShiftMate to your specific business needs.</li>
          </ul>

          <hr className='border widget_border my-8'/>

          <p className='text-sm mt-8 font-semibold'>Ready to simplify your shift management? Join ShiftMate today and start making your scheduling process a breeze.</p>
        </div>

        <SupportBox />
      
      </div>

    </div>
  )
}

export default Page