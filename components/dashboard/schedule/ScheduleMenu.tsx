'use client'

import useShiftStore from '@/store/shiftStore'
import React from 'react'
import 'react-day-picker/dist/style.css';
import WeekPicker from './modals/WeekPicker';
import moment from 'moment';
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';

function ScheduleMenu() {

  const darkMode = useShiftStore((state) => state.darkMode);
  const isCalendarVisible = useShiftStore(state => state.isCalendarVisible);
  const currentYear = useShiftStore(state => state.currentYear);
  const currentWeek = useShiftStore(state => state.currentWeek);
  const selectedDays = useShiftStore(state => state.selectedDays);
  const showCalendar = useShiftStore(state => state.showCalendar);
  const hideCalendar = useShiftStore(state => state.hideCalendar);

  return (
    <div className={`z-10 px-6 lg:px-14 w-full widget_bg section_text ${darkMode ? 'offset_border_bottom_dark' : 'offset_border_bottom_light'}`}>
      <div className='h-12 flex items-center justify-between gap-x-2 lg:gap-x-4 max-w-7xl'>
        
        <div className={`z-30 ${isCalendarVisible ? 'absolute' : 'hidden'} top-16 lg:left-8`}>
          <WeekPicker />
        </div>

        {/* Select week button */}
        <button 
          className='text-sm h-8 border widget_border rounded-md shadow-sm px-2 hover:text-white hover:bg-[#1188EC] overflow-hidden mr-4' 
          onClick={isCalendarVisible ? hideCalendar : showCalendar}
        >
          <div className='flex items-center gap-x-2'>
            <p className='font-medium'>Select Week</p>
            {isCalendarVisible ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
          </div>
        </button>

        <div className='flex gap-x-6 lg:gap-x-12 text-sm'>
          <p>Year: {currentYear}</p> 
          <p>Week: {currentWeek}</p>
          <div className='hidden lg:flex'>
            {moment(selectedDays[0]).format('LL')} -{' '}
            {moment(selectedDays[6]).format('LL')}
          </div>
        </div>
  
      </div>
    </div>
  )
}

export default ScheduleMenu
