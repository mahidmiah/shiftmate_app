'use client'

import AddPositionModal from '@/components/dashboard/settings/AddPositionModal';
import Advanced from '@/components/dashboard/settings/Advanced';
import Profile from '@/components/dashboard/settings/Profile';
import SettingsNav from '@/components/dashboard/settings/SettingsNav';
import SupportBox from '@/components/dashboard/SupportBox';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function settingsPage() {

  const [isVisible, setIsVisible] = useState(false);
  const [page, setPage] = useState(0);

  const [addPositionModalVisible, setAddPositionModalVisible] = useState(false);

  const [positions, setPositions] = useState<string[] | null>();

  const getAllPositions = async () => {
    try {
      const response = await axios.get('/api/business/positions/getallpositions');
      if(response.data.status == 200){
        setPositions(response.data.data.positions);
      }
      else if (response.data.status == 400){
        toast.error('User not found!');
      }
    } catch (error: any) {
        console.log('Getting all positions failed!', error.message);
        toast.error(error.message);
    }
  }

  const updateAllPositions = async (updatedPositions: string[]) => {
    try {
      const response = await axios.post('/api/business/positions/updateallpositions', updatedPositions);
      if(response.data.status == 200){
      }
      else if (response.data.status == 400){
        toast.error('User not found!');
      }
    } catch (error: any) {
        toast.error(error.message);
    }
  }

  useEffect(() => {
    // Set a timeout to change the visibility after 1 second
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, [page]);

  return (
    <div>
      
      <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} w-full sticky top-0`}>
        <SettingsNav setPage={setPage} page={page} setIsVisible={setIsVisible} />
      </div>

      {
        page === 0 &&
        <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col lg:flex-row gap-y-12 gap-x-12 px-6 py-6 lg:px-14 lg:py-12`}>
          <Profile />
          <SupportBox />
        </div>
      }

      {
        page === 1 &&
        <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col lg:flex-row gap-y-12 gap-x-12 px-4 py-6 lg:px-14 lg:py-12`}>
          <Advanced setAddPositionModalVisible={setAddPositionModalVisible} positions={positions} setPositions={setPositions} getAllPositions={getAllPositions} updateAllPositions={updateAllPositions} />
          <SupportBox />
        </div>
      }
      
      {
        addPositionModalVisible &&
        <AddPositionModal setAddPositionModalVisible={setAddPositionModalVisible} positions={positions} getAllPositions={getAllPositions} />
      }
    </div>
  )
}

export default settingsPage