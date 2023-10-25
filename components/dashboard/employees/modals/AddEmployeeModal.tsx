import useShiftStore from '@/store/shiftStore';
import axios from 'axios';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'sonner';
import { generate } from 'generate-password';

type params = {
  getAllEmployees: () => void;
}

function AddEmployeeModal({getAllEmployees}: params) {

  const hideAddEmployeeModal = useShiftStore(state => state.hideAddEmployeeModal);

  interface localData {
    [key: string]: string | boolean;
  }

  const [localUserData, setLocalUserData] = useState<localData>({
    firstName: '',
    lastName: '',
    password: generate({
      length: 8,
      numbers: true,
      symbols: false,
      uppercase: false,
    }),
    background: '',
    foreground: ''
  })

  function getRandomColors() {
    const excludedShades = ['000000', 'ffffff', '888888', '777777', '666666', '555555'];
    let bgColor;
    let fgColor;
  
    do {
      bgColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    } while (excludedShades.includes(bgColor.toLowerCase()));
  
    // Calculate the brightness of the background color
    const hexColor = bgColor.substring(1); // Remove the "#" character
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    // Choose text color based on background brightness
    if (brightness > 110) {
      fgColor = '#333E52'; // Use black text for light backgrounds
    } else {
      fgColor = '#ffffff'; // Use white text for dark backgrounds
    }
  
    return { bgColor, fgColor };
  }

  const [isVisible, setIsVisible] = useState(false);

  const [formDataFocus, setFormDataFocus] = useState<formData>({
    firstName: false,
    lastName: false,
    password: true,
  });

  const [formDataValid, setFormDataValid] = useState<localData>({
    firstName: true,
    lastName: true,
    password: true,
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
    const { bgColor, fgColor } = getRandomColors();
    const timeout = setTimeout(() => {
      setIsVisible(true);
      setLocalUserData({...localUserData, background: bgColor, foreground: fgColor});
    }, 300);

    return () => clearTimeout(timeout);
  }, [AddEmployeeModal]);

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

  const saveData = async () => {
    try {
      const response = await axios.post('/api/business/employees/addnewemployee', localUserData);
      if(response.data.status == 200){
        toast.success('Employee added!');
      }
      else if (response.data.status == 400){
        toast.error('User not found!');
      }
    } catch (error: any) {
        console.log('Profile update failed', error.message);
        toast.error(error.message);
    }
  }

  const handleOnClick = async () => {
    // List of required field names
    const requiredFields = [
      'firstName',
      'lastName',
      'password',
    ];

    // Create an object to store the changes
    const updatedValidData: localData = {};

    // Check each required field
    requiredFields.forEach((field) => {
      if (localUserData[field] === '') {
        updatedValidData[field] = false;
      }
    });

    if (Object.keys(updatedValidData).length >= 1) {
      toast.error('Fill in all required fields!');
      // Update the formDataValid state with the merged changes
      setFormDataValid({ ...formDataValid, ...updatedValidData });
    }
    else {
      await saveData();
      await getAllEmployees();
      hideAddEmployeeModal();
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
            onClick={() => {hideAddEmployeeModal()}}
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

        <h1 className='text-2xl font-semibold'>Add an employee</h1>
        <p className='mt-2 text-sm lg:text-md'>Add a new employee.</p>

        <div className='mb-8 flex gap-x-4 mt-8'>
          <div className='w-1/2'>
            <h1 className='text-sm'>First name</h1>
            <input 
              type='text'
              name='firstName'
              className={getInputClass('firstName') + ' mt-2'}
              placeholder='First name'
              value={localUserData.firstName as string}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('firstName')}}
              required
            />
          </div>
          <div className='w-1/2'>
            <h1 className='text-sm'>Last name</h1>
            <input 
              type='text'
              name='lastName'
              className={getInputClass('lastName') + ' mt-2'}
              placeholder='Last name'
              value={localUserData.lastName as string}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('lastName')}}
              required
            />
          </div>
        </div>

        <div className=''>
          <h1 className='text-sm'>Password</h1>
          <input 
            type='text'
            name='password'
            className={getInputClass('password') + ' mt-2 mb-8'}
            placeholder='Password'
            value={localUserData.password as string}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => {checkIfInputValid('password')}}
            required
          />
          </div>

        <button
          className='blue_button h-10'
          onClick={handleOnClick}
        >
          Add Employee
        </button>

      </div>

    </div>
  )
}

export default AddEmployeeModal