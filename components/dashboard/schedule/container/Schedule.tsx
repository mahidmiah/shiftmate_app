import React from 'react'

type params = {
  timeSlots: string[];
  positions: string[] | null | undefined;
  shiftData?: { [key: string]: JSX.Element | undefined };
}

function Schedule({timeSlots, positions, shiftData}:params) {
  return (
    <div className='z-10 h-full w-full overflow-auto section_text text-xs'>
      <div className='z-10 widget_bg bg-red-5000 w-20 lg:w-40 h-12 sticky left-0 top-70 border-[0.5px] border-t widget_border -mb-12'></div>
      <div className="flex">

        <div className="flex flex-col">

        {/* top left corner */}
        {/* <div className='z-10 widget_bg w-20 lg:w-40 h-12 absolute top-66 border-[0.5px] border-t widget_border'></div> */}

          <div className='flex flex-row sticky top-0 '>
            {/* Top left corner, still needed or the time slot starts from col 0 which is hidden by the overlaid top corner from above */}
            <div className='h-12 w-20 lg:w-40 border-[0.5px] border-t widget_border sticky left-0 top-0 widget_bg'></div> 
            {
              timeSlots.map((time: string) => (
                <div key={time} className='z-10 h-12 w-40 border-[0.5px] border-t widget_border font-bold flex items-end justify-start text-sm sticky top-0 widget_bg pl-4 pb-1'>{time}</div>
              ))
            }
          </div>
          
          {positions?.map((position: string) => (
            <div className='row flex flex-row'>
              <div key={position} className='z-20 h-12 w-20 lg:w-40 overflow-hidden border-[0.5px] widget_border font-bold flex items-center justify-start pl-4 text-sm sticky left-0 top-12 widget_bg'>{position}</div>
              {timeSlots.map((time:string) => (
                // Parent / Container
                <div key={position + '-' + time} className='h-12 w-40 border-[0.5px] widget_border text-xs page_bg static pl-1 py-1'>{shiftData && shiftData[`${position}_${time}`]}</div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Schedule