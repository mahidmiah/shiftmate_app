import useShiftStore from '@/store/shiftStore';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { RxAvatar } from 'react-icons/rx';

function EmployeeCard({employee, position}: {employee: Employee, position: string}) {

  // Edit Modal Vars
  const setEditEmployeeModalData = useShiftStore(state => state.setEditEmployeeModalData);
  const showEditEmployeeModal = useShiftStore(state => state.showEditEmployeeModal);

  // Delete Modal Vars
  const setDeleteEmployeeModalData = useShiftStore(state => state.setDeleteEmployeeModalData);
  const showDeleteEmployeeModal = useShiftStore(state => state.showDeleteEmployeeModal);

  const [buttonHovered, setButtonHovered] = useState(false);
  const [buttonCliicked, setButtonClicked] = useState(false);
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const handleOnClick = (e: React.MouseEvent) => {
    toggleContextMenu(e);
    setButtonClicked(true);
  }

  const toggleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuVisible(!isContextMenuVisible);
  };

  const closeContextMenu = () => {
    setContextMenuVisible(false);
    setButtonClicked(false);
    setButtonHovered(false);
  };

  const handleEdit = () => {
    // Implement the edit action here
    closeContextMenu();
    setEditEmployeeModalData({background: employee.background, foreground: employee.foreground, firstName: employee.firstName, lastName: employee.lastName, password: employee.password, id: employee.id});
    showEditEmployeeModal();
  };

  const handleDelete = () => {
    // Implement the delete action here
    closeContextMenu();
    setDeleteEmployeeModalData({firstName: employee.firstName, lastName: employee.lastName, id: employee.id});
    showDeleteEmployeeModal();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        closeContextMenu();
        setButtonHovered(false);
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
    <div 
      className='h-12 w-full max-w-7xl widget_bg border widget_border section_text shadow-md flex items-center justify-between pl-1 pr-4 lg:px-4 text-sm rounded-md'
      onContextMenu={handleOnClick}  
    >
      
      <div className='flex lg:gap-4'>
        <div className='w-12 md:w-16 flex justify-center'><RxAvatar size={25} /></div>
        <div className='border-[0.5px] widget_border' />
        <div className='w-20 md:w-32 flex justify-center'><p>{employee.firstName}</p></div>
        <div className='border-[0.5px] widget_border' />
        <div className='w-20 md:w-32 flex justify-center'><p>{employee.lastName}</p></div>
        <div className='border-[0.5px] widget_border' />
        <div className='w-24 lg:w-32 flex pl-3'><div className='text-xs text-white bg-custom_blue/75 py-1 px-2 rounded-2xl w-20 text-center'>{position}</div></div>
        {/* <div className='border widget_border' /> */}
        <div className='hidden xl:flex items-center text-xs'>{employee.id}</div>
      </div>
      
      {/* Dots */}
      {
      buttonCliicked === false &&
      <div className={`flex justify-end w-full`} >
        <div 
          className="flex gap-1 h-full"
          onClick={handleOnClick}
          onContextMenu={toggleContextMenu}
          onMouseOver={() => {setButtonHovered(true)}}
          onMouseLeave={() => {setButtonHovered(false)}}
        >
          <div className={`h-[0.20rem] w-[0.20rem] lg:h-[0.30rem] lg:w-[0.30rem] rounded-full ${buttonHovered ? 'bg-custom_blue' : 'dark:bg-[#E3E2E9] bg-[#373737]'}`}></div>
          <div className={`h-[0.20rem] w-[0.20rem] lg:h-[0.30rem] lg:w-[0.30rem] rounded-full ${buttonHovered ? 'bg-custom_blue' : 'dark:bg-[#E3E2E9] bg-[#373737]'}`}></div>
          <div className={`h-[0.20rem] w-[0.20rem] lg:h-[0.30rem] lg:w-[0.30rem] rounded-full ${buttonHovered ? 'bg-custom_blue' : 'dark:bg-[#E3E2E9] bg-[#373737]'}`}></div>
        </div>
      </div>
      }

      {isContextMenuVisible && (
        <div
          className="context-menu z-30 w-32 flex flex-col p-2 border widget_border widget_bg rounded-md shadow-lg mt-4 mr-2"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the context menu
          ref={contextMenuRef}
        >
          <button className="context-menu-item flex item-center py-2 hover:text-custom_blue section_text" disabled={position === 'Owner' ? true : false} onClick={handleEdit}>Edit</button>
          <button className="context-menu-item flex item-center py-2 border-t hover:text-custom_blue section_text" disabled={position === 'Owner' ? true : false} onClick={handleDelete}>Delete</button>
          <button className="context-menu-item flex item-center py-2 border-t hover:text-custom_blue section_text" onClick={closeContextMenu}>Close</button>
        </div>
      )}

    </div>
  )
}

export default EmployeeCard