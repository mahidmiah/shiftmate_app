import useShiftStore from '@/store/shiftStore';
import React from 'react'

type params =  {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function SettingsNav({ setPage, page, setIsVisible }: params) {

  const darkMode = useShiftStore((state) => state.darkMode)

  const active = 'border-b-[2px] border-[#1188EC] hover:border-[#1170ec] hover:text-[#1170ec] h-full px-4 flex items-center font-medium text-md text-[#1188EC] cursor-pointer'
  const nonActive = 'hover:border-b-[2px] hover:border-[#1170ec] hover:text-[#1170ec] h-full px-4 flex items-center font-medium text-md text-[#8C9195] cursor-pointer'

  const handleClick = (nextPage: number) => {
    if (page === nextPage){
      return
    }
    else{
      setPage(nextPage);
      setIsVisible(false);
    }
  }

  return (
    <div className={`z-10 w-full h-10 widget_bg flex gap-x-4 items-center px-6 lg:px-14 ${darkMode ? 'offset_border_bottom_dark' : 'offset_border_bottom_light'}`}>
      <div 
        onClick={() => {handleClick(0)}}
        className={page === 0 ? active : nonActive}
      >
          Profile
      </div>

      <div 
        onClick={() => {handleClick(1)}}
        className={page === 1 ? active : nonActive}
      >
          Advanced
      </div>
    </div>
  )
}

export default SettingsNav