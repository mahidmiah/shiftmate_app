import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';
import { MdAdd } from 'react-icons/md';

type params = {
  positions: string[] | null | undefined;
  setAddPositionModalVisible: Dispatch<SetStateAction<boolean>>;
  setPositions:Dispatch<SetStateAction<string[] | null | undefined>>;
  getAllPositions: () => Promise<void>;
  updateAllPositions: (arg: string[]) => void;
}

function Advanced({setAddPositionModalVisible, positions, setPositions, getAllPositions, updateAllPositions}:params) {

  const handleMovePosition = (index: number, direction: string) => {
    if(positions) {
      const newPositionArray = [...positions];
      if (direction === 'up' && index > 0) {
        // Swap the position with the one above
        [newPositionArray[index], newPositionArray[index - 1]] = [newPositionArray[index - 1], newPositionArray[index]];
      } else if (direction === 'down' && index < newPositionArray.length - 1) {
        // Swap the position with the one below
        [newPositionArray[index], newPositionArray[index + 1]] = [newPositionArray[index + 1], newPositionArray[index]];
      }
      setPositions(newPositionArray);
      updateAllPositions(newPositionArray);
    }
  };

  useEffect(() => {
    getAllPositions();
  }, [Advanced]);
  
  return (
    <div className='px-6 py-8 widget_bg widget_border border h-fit w-full lg:w-[40rem] rounded-md section_text shadow-md'>
      
      <h1 className='text-2xl lg:text-2xl font-semibold'>Advanced settings</h1>
      <p className='mt-2 text-sm lg:text-md'>Update your advanced business settings and preferences</p>

      <hr className='my-6 widget_border'></hr>

      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl font-medium'>Shift positions</h1>
        <button 
          className='outline_button'
          onClick={() => {setAddPositionModalVisible(true)}}
        >
          <p className='text-left'>Add position</p>
          <MdAdd size={20} />
        </button>
      </div>

      {
        positions &&
        positions.map((position: string, index: number) =>(
          <div key={position} className='h-10 rounded-md flex items-center justify-between px-4 font-medium widget_bg border widget_border shadow-md section_text mt-2 text-sm'>
            {position}
            <div className='flex gap-x-4'>

              {/* Down button */}
              <button 
                className='text-sm hover:text-custom_blue' 
                onClick={() => handleMovePosition(index, 'down')} 
              > 
                <BiSolidDownArrow /> 
              </button>

              {/* Up button */}
              <button 
                className='text-sm hover:text-custom_blue' 
                onClick={() => handleMovePosition(index, 'up')} 
              > 
                <BiSolidUpArrow /> 
              </button>
              
            </div>
          </div>
        ))
      }

    </div>
  )
}

export default Advanced