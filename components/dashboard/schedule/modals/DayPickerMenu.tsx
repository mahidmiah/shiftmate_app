import useShiftStore from '@/store/shiftStore';
import { eachDayOfInterval } from 'date-fns';
import React, { useEffect, useRef } from 'react'

function DayPickerMenu() {

  // Store Vars
  const currentDay = useShiftStore(state => state.currentDay);
  const setCurrentDay = useShiftStore(state => state.setCurrentDay);
  const hideDayPicker = useShiftStore(state => state.hideDayPicker);

  const active = 'text-[#1170ec] font-semibold text-left w-full py-2';
  const nonActive = 'hover:text-[#1170ec] hover:font-semibold text-left w-full py-2';

  const dayPickerRef = useRef<HTMLDivElement | null>(null);

  const getClass = (day: string) => {
    if (currentDay === day){
      return active;
    }
    return nonActive;
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dayPickerRef.current && !dayPickerRef.current.contains(e.target as Node)) {
        hideDayPicker();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleScroll = () => {
      hideDayPicker();
    }
    const container = document.getElementById("children_container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  
  return (
    <div 
      className='w-32 h-fit flex flex-col px-2 py-2 items-start widget_bg border widget_border shadow-md section_text text-sm rounded-md'
      ref={dayPickerRef}
    >
      <button 
        className={getClass('Monday')} 
        onClick={() => { setCurrentDay('Monday'); hideDayPicker(); }}
      >
        Monday
      </button>

      <hr className='w-full' />

      <button 
        className={getClass('Tuesday')} 
        onClick={() => { setCurrentDay('Tuesday'); hideDayPicker(); }}
      >
        Tuesday
      </button>

      <hr className='w-full' />

      <button 
        className={getClass('Wednesday')} 
        onClick={() => { setCurrentDay('Wednesday'); hideDayPicker(); }}
      >
        Wednesday
      </button>
      
      <hr className='w-full' />

      <button 
        className={getClass('Thursday')} 
        onClick={() => { setCurrentDay('Thursday'); hideDayPicker(); }}
      >
        Thursday
      </button>
      
      <hr className='w-full' />

      <button 
        className={getClass('Friday')} 
        onClick={() => { setCurrentDay('Friday'); hideDayPicker(); }}
      >
        Friday
      </button>

      <hr className='w-full' />

      <button 
        className={getClass('Saturday')} 
        onClick={() => { setCurrentDay('Saturday'); hideDayPicker(); }}
      >
        Saturday
      </button>

      <hr className='w-full' />
      
      <button 
        className={getClass('Sunday')} 
        onClick={() => { setCurrentDay('Sunday'); hideDayPicker(); }}
      >
        Sunday
      </button>
    </div>
  )
}

export default DayPickerMenu