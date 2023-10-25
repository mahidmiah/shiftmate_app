import React, { Dispatch, SetStateAction } from 'react'
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi'
import { MdAdd } from 'react-icons/md'
import DayPickerMenu from '../modals/DayPickerMenu'
import useShiftStore from '@/store/shiftStore'

function ScheduleContainerMenu() {

  // Store Vars
  const isDayPickerVisible = useShiftStore(state => state.isDayPickerVisible);
  const showDayPicker = useShiftStore(state => state.showDayPicker);
  const hideDayPicker = useShiftStore(state => state.hideDayPicker);
  const currentDay = useShiftStore(state => state.currentDay);
  const showAddShiftModal = useShiftStore(state => state.showAddShiftModal);

  return (
    <div className={`h-12 w-full rounded-t-md flex items-center justify-between font-medium px-4`}>
      
      {/* Day selector button */}
      <button 
        className='outline_button'
        onClick={() => {isDayPickerVisible ? hideDayPicker() : showDayPicker()}}
      > 
        <p className='w-20 text-left'>{currentDay} </p>
        {isDayPickerVisible ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
      </button>

      {/* Add shift button */}
      <button 
        className='outline_button'
        onClick={showAddShiftModal}
      > 
        <p className='w-20 text-left'>Add shift</p>
        <MdAdd size={20} />
      </button>

      {
        isDayPickerVisible &&
          <div className='z-20 absolute mt-80'>
            <DayPickerMenu />
          </div>
      }

    </div>
  )
}

export default ScheduleContainerMenu