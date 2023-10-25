import axios from 'axios';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'sonner';

type params = {
  positions: string[] | null | undefined;
  setAddPositionModalVisible: Dispatch<SetStateAction<boolean>>;
  getAllPositions: () => Promise<void>;
}

function AddPositionModal({setAddPositionModalVisible, positions, getAllPositions}: params) {

  const [localUserData, setLocalUserData] = useState<formData>({
    position: '',
  })

  const [isVisible, setIsVisible] = useState(false);

  const [formDataFocus, setFormDataFocus] = useState<formData>({
    position: false,
  });

  const [formDataValid, setFormDataValid] = useState<formData>({
    position: true,
  });

  const checkIfInputValid = (field: string) => {
    if (formDataFocus[field] === true && localUserData[field] === '') {
      setFormDataValid({ ...formDataValid, [field]: false });
    }
    else if (formDataValid[field] === false && localUserData[field] != '') {
      setFormDataValid({ ...formDataValid, [field]: true });
    }
  }

  useEffect(() => {
    // Set a timeout to change the visibility after 1 second
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, [AddPositionModal]);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalUserData({ ...localUserData, [name]: value });
  };

  const handleFocus = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    setFormDataFocus({ ...formDataFocus, [name]: true });
  };

  const getInputClass = (field: string) => {
    return formDataValid[field] === true ? normalInputField : errorInputField
  }

  function toTitleCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const saveData = async () => {
    try {
      const response = await axios.post('/api/business/positions/addnewposition', localUserData);
      if(response.data.status == 200){
        toast.success('Position added!');
      }
      else if (response.data.status == 400){
        toast.error('User not found!');
      }
    } catch (error: any) {
        console.log('Adding position failed', error.message);
        toast.error(error.message);
    }
  }

  const handleOnClick = async () => {
    // List of required field names
    const requiredFields = [
      'position',
    ];

    // Create an object to store the changes
    const updatedValidData: formData = {};

    // Check each required field
    requiredFields.forEach((field) => {
      if (localUserData[field] === '') {
        updatedValidData[field] = false;
      }
    });

    const positionsArr = positions as Array<string>;

    if (Object.keys(updatedValidData).length >= 1) {
      toast.error('Fill in all required fields!');
      // Update the formDataValid state with the merged changes
      setFormDataValid({ ...formDataValid, ...updatedValidData });
    }
    if (positionsArr.includes((localUserData.position as string).toLowerCase())){
      toast.error('Position already exists!');
    }
    else {
      await saveData();
      await getAllPositions();
      setAddPositionModalVisible(false);
    }
  } 

  const normalInputField = 'text-sm md:text-md w-full border widget_border rounded-md h-10 widget_bg px-2 text-xs';
  const errorInputField =  'text-sm md:text-md w-full border border-red-500 rounded-md h-10 widget_bg px-2 text-xs';

  return (
    <div className='z-30 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-4 section_text'>
      
      <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} px-6 pb-8 pt-5 w-[30rem] h-fit widget_bg border widget_border rounded-md shadow-sm`}>
        
        <div className='flex justify-end pr-3'>
          <button
            className="section_text focus:outline-none"
            onClick={() => {setAddPositionModalVisible(false)}}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <h1 className='text-2xl font-semibold'>Add a position</h1>
        <p className='mt-2 text-sm lg:text-md'>Add a new psoition for your business. e.g. chef, manager...</p>

        <div className=''>
          <h1 className='text-sm mt-6'>Position</h1>
          <input 
            type='text'
            name='position'
            className={getInputClass('position') + ' mt-2'}
            placeholder='Position'
            value={localUserData.position as string}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => {checkIfInputValid('position')}}
            required
          />
          </div>

        <button
          className='bg-custom_blue hover:bg-custom_blue_hover border border-custom_blue w-full rounded-md h-10 font-medium text-white shadow-md mt-8 text-xs'
          onClick={handleOnClick}
        >
          Add Position
        </button>

      </div>

    </div>
  )
}

export default AddPositionModal