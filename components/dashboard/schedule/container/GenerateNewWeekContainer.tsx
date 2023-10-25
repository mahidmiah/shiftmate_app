import React from 'react'

type params = {
  generateNewWeek: () => void;
  currentYear: number | null | undefined;
  currentWeek: number | null | undefined;
}

function GenerateNewWeekContainer({generateNewWeek, currentYear, currentWeek}:params) {
  return (
    <div className='w-full h-full flex items-center justify-center py-48'>
      <div className='flex flex-col items-center'>
        <p className='text-center pb-4'>No data! (Year: {currentYear}, Week: {currentWeek})</p>
        <button
          className='px-2 bg-custom_blue hover:bg-custom_blue_hover border border-custom_blue w-fit rounded-md h-10 font-medium text-white text-sm shadow-md'
          onClick={generateNewWeek}
        >
          Create new weekly schedule
        </button>
      </div>
    </div>
  )
}

export default GenerateNewWeekContainer