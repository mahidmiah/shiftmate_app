'use client'

import useShiftStore from '@/store/shiftStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function CalculatedWeeklyHours() {

  const [employeeHours, setEmployeeHours] = useState<Array<{ employeeName: string; hours: number }>>([]);

  // Store Vars
  const currentYear = useShiftStore(state => state.currentYear);
  const currentWeek = useShiftStore(state => state.currentWeek);
  const scheduleUpdate = useShiftStore(state => state.scheduleUpdate);

  const calculate = async () => {
    try {
      const response = await axios.post('/api/business/schedule/weeks/getweeklyhours', {
        year: currentYear,
        week: currentWeek,
      });

      if (response.data.status === 200) {
        // toast.success('Weekly hours calcualted.');
        const employeeData = Object.entries(response.data.data).map(([employeeName, hours]) => ({
          employeeName,
          hours: hours as number,
        }));
        // Sort the employeeData array by employeeName
        employeeData.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
        setEmployeeHours(employeeData);
      } else if (response.data.status === 400) {
        toast.error('Business not found!');
      } else {
        // toast.error('Something went wrong!');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    setEmployeeHours([]);
    calculate();
  }, [currentWeek, currentYear, scheduleUpdate])

  return (
    <div className='w-full h-fit widget_bg border widget_border section_text rounded-md shadow-md mt-8 md:mt-0 px-8 py-8'>
      <h1 className='text-xl font-medium pb-6'>Calculated hours (Weekly)</h1>

        { employeeHours.length > 0 &&  
          employeeHours.map((employee: { employeeName: string; hours: number }, index: number) => (
            <div key={index} className='flex py-2 border-t'>
              <p className='w-36'>{employee.employeeName}</p>
              <p>: {employee.hours} hours</p>
            </div>
          ))
        }

    </div>
  )
}

export default CalculatedWeeklyHours