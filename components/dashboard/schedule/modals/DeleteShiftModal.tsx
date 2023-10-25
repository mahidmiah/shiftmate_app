'use client'

import useShiftStore from '@/store/shiftStore';
import axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'sonner';

function DeleteEmployeeModal() {

  // Delete Modal Vars
  const hideDeleteShiftModal = useShiftStore(state => state.hideDeleteShiftModal);
  const deleteEmployeelModalData = useShiftStore(state => state.deleteEmployeelModalData);

  const scheduleUpdate = useShiftStore(state => state.scheduleUpdate);
  const triggerScheduleUpdate = useShiftStore(state => state.triggerScheduleUpdate);



  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [DeleteEmployeeModal]);

  const deleteShift = async () => {
    try {
      const response = await axios.post('/api/business/schedule/shifts/deleteshift', {shiftID: deleteEmployeelModalData.id});
      if(response.data.status == 200){
        toast.success('Shift has been deleted!');
        triggerScheduleUpdate(!scheduleUpdate);
      }
      else if (response.data.status == 400){
        toast.error('Business not found!');
      }
      else if (response.data.status == 401){
        toast.error('Week not found!');
      }
      else if (response.data.status == 402){
        toast.error('Shift not found!');
      }
    } catch (error: any) {
        toast.error(error.message);
    }
  }

  const handleOnClick = async () => {
    await deleteShift();
    hideDeleteShiftModal();
  } 

  return (
    <div className='z-30 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-4 section_text'>
      
      <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} px-6 pb-8 pt-5 w-[30rem] h-fit widget_bg border widget_border rounded-md shadow-sm`}>
        
        <div className='flex justify-end pr-3'>
          <button
            className="section_text focus:outline-none"
            onClick={hideDeleteShiftModal}
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

        <h1 className='text-2xl font-semibold'>Delete shift</h1>
        <p className='mt-2 text-sm lg:text-md'>Delete an employees shift.</p>

        <div className='text-sm mt-6'>
          <h1 className='font-semibold mb-4 text-red-500'>Are you sure want to delete the shift?</h1>
          <p><span className='font-semibold w-24 inline-block'>First Name:</span> {deleteEmployeelModalData.firstName}</p>
          <p><span className='font-semibold w-24 inline-block'>Last Name:</span> {deleteEmployeelModalData.lastName}</p>
          <p><span className='font-semibold w-24 inline-block'>Position:</span> {deleteEmployeelModalData.position}</p>
          <p><span className='font-semibold w-24 inline-block'>Day:</span> {deleteEmployeelModalData.day}</p>
          <p><span className='font-semibold w-24 inline-block'>Start Time:</span> {deleteEmployeelModalData.startTime}</p>
          <p><span className='font-semibold w-24 inline-block'>End Time:</span> {deleteEmployeelModalData.endTime}</p>
        </div>

        <div className='mt-8 flex gap-x-6 text-sm'>
          <button
            className='bg-red-500 hover:bg-red-600 border border-red-500 w-1/2 rounded-md h-10 font-medium text-white shadow-md'
            onClick={handleOnClick}
          >
            Delete shift
          </button>

          <button
          className='bg-custom_blue hover:bg-custom_blue_hover border border-custom_blue w-1/2 rounded-md h-10 font-medium text-white shadow-md'
          onClick={hideDeleteShiftModal}
          >
            Cancel
          </button>
        </div>

      </div>

    </div>
  )
}

export default DeleteEmployeeModal