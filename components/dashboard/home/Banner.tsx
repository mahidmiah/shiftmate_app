'use client'

import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function Banner() {

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
  }, [])

  return (
    <div className='rounded-md w-full max-w-7xl h-24 lg:h-48 widget_bg widget_border border flex items-center justify-center text-center shadow-md'>
      <h1 className='text-2xl lg:text-3xl font-bold section_text'>{profileData?.businessName}</h1>
    </div>
  )
}

export default Banner