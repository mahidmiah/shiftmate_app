'use client'

import useShiftStore from '@/store/shiftStore'
import React, { useEffect, useRef, useState } from 'react'
import { RxAvatar } from 'react-icons/rx'

type params = {
  width: number;
  employee: {[key: string]: string};
  resData: {[key: string]: string | number | null};
}

function ShiftCell({width, employee, resData}: params) {

  // Store Vars
  const showDeleteShiftModal = useShiftStore(state => state.showDeleteShiftModal);
  const setDeleteShiftModalData = useShiftStore(state => state.setDeleteShiftModalData);
  const setEditShiftModalData = useShiftStore(state => state.setEditShiftModalData);
  const currentWeek = useShiftStore(state => state.currentWeek);
  const currentYear = useShiftStore(state => state.currentYear);
  const showEditShiftModal = useShiftStore(state => state.showEditShiftModal);

  const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  
  const [hours, minutes] = (resData.startTime as String).split(":");
  const [clickX, setClickX] = useState<number | null>(null);


  const toggleContextMenu = (e: React.MouseEvent) => { 
    const relativeX = e.nativeEvent.offsetX;
    setClickX(relativeX);   
    e.preventDefault();
    setContextMenuVisible(!isContextMenuVisible);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    const relativeX = e.nativeEvent.offsetX;
    setClickX(relativeX);
    toggleContextMenu(e);
  }

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

  const handleEdit = async () => {
    // Implement the edit action here
    setEditShiftModalData({
      weekNumber: currentWeek,
      currentYear: currentYear,
      employeeID: employee._id,
      position: resData.position,
      dayOfWeek: resData.dayOfWeek,
      startTime: resData.startTime,
      endTime: resData.endTime,
      existingShiftID: resData._id,
    });
    showEditShiftModal();
    closeContextMenu();
  }

  const handleDelete = () => {
    // Implement the delete action here
    setDeleteShiftModalData({
      id: resData._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: resData.position,
      day: resData.dayOfWeek,
      startTime: resData.startTime,
      endTime: resData.endTime,
    });
    showDeleteShiftModal();
    closeContextMenu();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleScroll = () => {
      closeContextMenu();
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
    <div>
    <div 
      style={{ userSelect: 'none', width: `${width - 5}px`, backgroundColor: `${employee && employee.background}`, color: `${employee && employee.foreground}`, opacity: '0.9', marginLeft: `${minutes === '30' ? '80px' : '0px'}`, marginBottom: `-40px`}} 
      className={`h-10 relative rounded-md pl-2 border widget_border overflow-hidden`}
      onClick={handleOnClick}
      onContextMenu={toggleContextMenu} 
    >
      <div className='flex items-center h-full'>
        
        {
          width > 100 ?
          <>
            <RxAvatar size={30} />
            <div className='flex flex-col justify-center h-full pl-2'>
              <h1 className='text-[12px] font-semibold'>{employee?.firstName} {employee?.lastName} </h1>
              <h1 className='text-[11px]'>{resData.startTime} - {resData.endTime}</h1>
            </div>
          </>
          :
          <>
            <RxAvatar size={30} />
            <div className='flex flex-col justify-center h-full pl-2'>
              <h1 className='text-[12px] font-semibold'>{employee?.firstName}</h1>
            </div>
          </>
        }

      </div>
    </div>

    {isContextMenuVisible && (
        <div
          style={{ marginLeft: `${clickX}px`, marginTop: '-85px'}}
          className={`relative z-10 w-32 flex flex-col p-2 border widget_border widget_bg rounded-md shadow-lg"}`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the context menu
          ref={contextMenuRef}
        >
          <button className="context-menu-item flex item-center py-2 hover:text-custom_blue section_text" onClick={handleEdit}>Edit</button>
          <button className="context-menu-item flex item-center py-2 border-t hover:text-custom_blue section_text" onClick={handleDelete}>Delete</button>
        </div>
      )}

    </div>
  )
}

export default ShiftCell