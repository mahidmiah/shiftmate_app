'use client'

import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import LoadingContainer from './LoadingContainer';
import GenerateNewWeekContainer from './GenerateNewWeekContainer';
import ScheduleTopMenu from './ScheduleContainerMenu';
import Schedule from './Schedule';
import ShiftCell from '../ShiftCell';
import useShiftStore from '@/store/shiftStore';

function ScheduleContainer()  {

  const [data, setData] = useState<shiftData>();
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState<string[] | null>();
  const [shiftData, setShiftData] = useState<{ [key: string]: JSX.Element | undefined }>();

  // Store Vars
  const currentWeek = useShiftStore(state => state.currentWeek);
  const currentYear = useShiftStore(state => state.currentYear);
  const selectedDays = useShiftStore(state => state.selectedDays);
  const currentDay = useShiftStore(state => state.currentDay);
  const setCurrentDay = useShiftStore(state => state.setCurrentDay);
  const scheduleUpdate = useShiftStore(state => state.scheduleUpdate);
  const hideCalendar = useShiftStore(state => state.hideCalendar);
  
  const generateTimeSlots = () => {
    const timeSlots = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push(displayTime);
      }
    }
  
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  const getTimeDifference = (startTime: string, endTime: string) => {
    const startParts = startTime.split(":");
    const endParts = endTime.split(":");
    
    const startHour = parseInt(startParts[0], 10);
    const startMinute = parseInt(startParts[1], 10);
    
    const endHour = parseInt(endParts[0], 10);
    const endMinute = parseInt(endParts[1], 10);
  
    const startDate = new Date(0, 0, 0, startHour, startMinute);
    const endDate = new Date(0, 0, 0, endHour, endMinute);
  
    const timeDifferenceInMilliseconds = endDate.getTime() - startDate.getTime();
    
    // Convert milliseconds to hours and minutes
    let hours = Math.floor(timeDifferenceInMilliseconds / 3600000);
    const minutes = Math.floor((timeDifferenceInMilliseconds % 3600000) / 60000);

    if(minutes >= 30) {
      hours += 0.5; 
    }
  
    return hours;
  }

  const getEmployeeByID = async (employeeID: string) => {
    try {
      const response = await axios.post('/api/business/employees/getemployeebyid', { employeeID });
      if (response.data.status === 200) {
        return response.data.data;
      } else if (response.data.status === 400) {
        toast.error('Business not found!');
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const getAllPositions = async () => {
    try {
      const response = await axios.get('/api/business/positions/getallpositions');
      if(response.data.status == 200){
        setPositions(response.data.data.positions);
      }
      else if (response.data.status == 400){
        toast.error('Business not found!');
      }
    } catch (error: any) {
        toast.error(error.message);
    }
  }

  const findWeek = async () => {
    try {
      const response = await axios.post('/api/business/schedule/weeks/getweek', { year: currentYear, week: currentWeek });
      if (response.data.status === 200) {
        setData(response.data.data);
      } else if (response.data.status === 400) {
        toast.error('Business not found!');
      } else if (response.data.status === 401) {
        setData(undefined);
        setLoading(false);
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const generateNewWeek = async () => {
    try {
      const response = await axios.post('/api/business/schedule/weeks/addnewweek', {
        weekNumber: currentWeek,
        year: currentYear,
        weekStartDate: moment(selectedDays[0]).format('LL'),
        weekEndDate: moment(selectedDays[6]).format('LL')
      });

      if (response.data.status === 200) {
        toast.success('New week created.');
        findWeek();
      } else if (response.data.status === 400) {
        toast.error('Business not found!');
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const generateNullShiftData = async () => {

    const slots: { [key: string]: JSX.Element | undefined } = {};
    positions?.map((position) => {
      timeSlots.map((time) => {
        const key = `${position}_${time}`;
        slots[key] = undefined;
      });
    });
    setShiftData(slots);
  }

  const generateShiftDataFromWeek = async () => {
    const retrievedShifts: { [key: string]: JSX.Element | undefined } = {};
  
    if (data && data.shifts) {
      const shiftPromises = data.shifts.map(async (shiftID: string) => {
        try {
          const response = await axios.post('/api/business/schedule/shifts/getshiftbyid', { shiftID });
          if (response.data.status === 200) {
            const resData = response.data.data;
  
            // Check if the dayOfWeek matches the currentDay
            if (resData.dayOfWeek === currentDay) {

              const [hours, minutes] = resData.startTime.split(":");
              const key = `${resData.position}_${hours + ':00'}`;

              const difference = getTimeDifference(resData.startTime, resData.endTime);
              const widthFactor = 160; // w-40 is 160px
              const width = difference * widthFactor;
              
              const employee = await getEmployeeByID(resData.employeeID);

              // Child 
              retrievedShifts[key] = (
                <>
                  {retrievedShifts[key] && retrievedShifts[key]}
                  <ShiftCell key={key} width={width} employee={employee} resData={resData} />
                </>
              );
            }
          } else if (response.data.status === 400) {
            toast.error('User not found!');
          } else {
            toast.error('Something went wrong!');
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      });
  
      await Promise.all(shiftPromises);
  
      // Now that all API requests have completed, update the state
      setShiftData(retrievedShifts);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      findWeek();
      getAllPositions();
    }, 500);
    return () => {
      clearTimeout(timeout);
    }
  }, [currentYear, currentWeek, selectedDays, currentDay, scheduleUpdate]);

  useEffect(() => {
    setLoading(true);
    generateNullShiftData();
    generateShiftDataFromWeek();
    setLoading(false);
  }, [data]);

  useEffect(() => {
    setCurrentDay('Monday');
    hideCalendar();
  }, [currentWeek]);

  return (
    <div className='w-full h-fit widget_bg border widget_border section_text rounded-md shadow-md'>
      {
      loading === true ? 
        (
          <LoadingContainer />
        ) 
      : 
        (
          data ? (
            <div className='max-w-7xl h-full flex flex-col'>
              
              {/* Schedule top bar/menu */}
              <ScheduleTopMenu />

              {/* Content area */}
              <Schedule 
                timeSlots={timeSlots}
                positions={positions}
                shiftData={shiftData}
              />

            </div>
          ) 
        : 
          (
            <GenerateNewWeekContainer
              generateNewWeek={generateNewWeek}
              currentYear={currentYear}
              currentWeek={currentWeek}
            />
          )
        )
      }
    </div>
  );
}

export default ScheduleContainer;
