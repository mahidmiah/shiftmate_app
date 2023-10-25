'use client'

import AddNewShiftModal from '@/components/dashboard/schedule/modals/AddNewShiftModal';
import ScheduleContainer from '@/components/dashboard/schedule/container/ScheduleContainer';
import ScheduleMenu from '@/components/dashboard/schedule/ScheduleMenu';
import useShiftStore from '@/store/shiftStore';
import React, { useEffect, useState } from 'react';
import DeleteShiftModal from '@/components/dashboard/schedule/modals/DeleteShiftModal';
import EditShiftModal from '@/components/dashboard/schedule/modals/EditShiftModal';
import CalculatedWeeklyHours from '@/components/dashboard/schedule/CalculatedWeeklyHours';

function page() {

  // Store Vars
  const isAddShiftModalVisible = useShiftStore(state => state.isAddShiftModalVisible);
  const isDeleteShiftModalVisible = useShiftStore(state => state.isDeleteShiftModalVisible);
  const isEditShiftModalVisible = useShiftStore(state => state.isEditShiftModalVisible);


  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className='z-20 sticky top-0'>
        <ScheduleMenu />
      </div>

      <div className='z-10 mx-6 my-6 lg:mx-14 lg:my-12 max-w-7xl'>
        <ScheduleContainer />
      </div>

      <div className='z-10 mx-6 my-6 lg:mx-14 lg:my-12 max-w-7xl'>
        <CalculatedWeeklyHours />
      </div>

      {
        isAddShiftModalVisible &&
        <AddNewShiftModal />
      }

      {
        isDeleteShiftModalVisible &&
        <DeleteShiftModal />
      }

      {
        isEditShiftModalVisible &&
        <EditShiftModal />
      }

    </div>
  );
}

export default page;
