import useShiftStore from '@/store/shiftStore';
import axios from 'axios';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { RxAvatar } from 'react-icons/rx';
import { toast } from 'sonner';

type params = {
  getAllEmployees: () => void;
}

function EditEmployeeModal({getAllEmployees}: params) {

  // Edit Modal Data Vars
  const editEmployeelModalData = useShiftStore(state => state.editEmployeelModalData);
  const setEditEmployeeModalData = useShiftStore(state => state.setEditEmployeeModalData);
  const hideEditEmployeeModal = useShiftStore(state => state.hideEditEmployeeModal);

  const [isVisible, setIsVisible] = useState(false);

  const [formDataFocus, setFormDataFocus] = useState<formData>({
    firstName: false,
    lastName: false,
    password: false,
  });

  const [formDataValid, setFormDataValid] = useState<formData>({
    firstName: true,
    lastName: true,
    password: true,
  });

  const checkIfInputValid = (field: keyof typeof editEmployeelModalData) => {
    if (formDataFocus[field] === true && editEmployeelModalData[field] === '') {
      setFormDataValid({ ...formDataValid, [field]: false });
    }
    else if (formDataValid[field] === false && editEmployeelModalData[field] != '') {
      setFormDataValid({ ...formDataValid, [field]: true });
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [EditEmployeeModal]);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditEmployeeModalData({ ...editEmployeelModalData, [name]: value });
    console.log(value)
  };

  const handleFocus = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    setFormDataFocus({ ...formDataFocus, [name]: true });
  };

  const getInputClass = (field: string) => {
    return formDataValid[field] === true ? normalInputField : errorInputField
  }

  const updateData = async () => {
    try {
      const response = await axios.post('/api/business/employees/updateemployee', editEmployeelModalData);
      if(response.data.status == 200){
        toast.success('Employee updated!');
      }
      else if (response.data.status == 400){
        toast.error('User not found!');
      }
    } catch (error: any) {
        console.log('Employee update failed', error.message);
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
    const updatedValidData: formData = {};

    // Check each required field
    requiredFields.forEach((field) => {
      if (editEmployeelModalData[field as keyof typeof editEmployeelModalData] === '') {
        updatedValidData[field] = false;
      }
    });

    if (Object.keys(updatedValidData).length >= 1) {
      toast.error('Fill in all required fields!');
      // Update the formDataValid state with the merged changes
      setFormDataValid({ ...formDataValid, ...updatedValidData });
    }
    else {
      await updateData();
      await getAllEmployees();
      hideEditEmployeeModal();
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
            onClick={hideEditEmployeeModal}
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

        <h1 className='text-2xl font-semibold'>Edit an employee</h1>
        <p className='mt-2 text-sm lg:text-md'>Add a new employee.</p>

        <div className='mb-8 flex gap-x-4 mt-8'>
          <div className='w-1/2'>
            <h1 className='text-sm'>First name</h1>
            <input 
              type='text'
              name='firstName'
              className={getInputClass('firstName') + ' mt-2'}
              placeholder='First name'
              value={editEmployeelModalData.firstName as string}
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
              value={editEmployeelModalData.lastName as string}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('lastName')}}
              required
            />
          </div>
        </div>

        <div className='mb-8 flex gap-x-4 mt-8'>
          <div className='w-1/2'>
            <h1 className='text-sm'>Background colour</h1>
            <input 
              type='color'
              name='background'
              className={normalInputField + ' mt-2'}
              value={editEmployeelModalData.background as string}
              onChange={handleChange}
              required
            />
          </div>
          <div className='w-1/2'>
            <h1 className='text-sm'>Foreground colour</h1>
            <input 
              type='color'
              name='foreground'
              className={normalInputField + ' mt-2'}
              value={editEmployeelModalData.foreground as string}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h1 className='text-sm italic mt-8'>Example</h1>
        <div className='mt-2 w-full h-20 border widget_border rounded-md flex items-center justify-center shadow-md'>
          <div 
            style={{background: `${editEmployeelModalData.background}`, color: `${editEmployeelModalData.foreground}`}} 
            className='rounded-md h-12 w-52 flex items-center px-2 shadow-md'
          >
            <div>
              <RxAvatar size={25} />
            </div>

            <div className='flex flex-col text-xs pl-2'>
              <div className='flex font-medium gap-x-2'>
                <h1>{editEmployeelModalData.firstName}</h1>
                <h1>{editEmployeelModalData.lastName}</h1>
              </div>
              <h1 className='text-[11px]'>13:00 - 18:00</h1>
            </div>

          </div>
        </div>

        <div className='mt-8 '>
          <h1 className='text-sm'>Password</h1>
          <input 
            type='text'
            name='password'
            className={getInputClass('password') + ' mt-2'}
            placeholder='Password'
            value={editEmployeelModalData.password as string}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => {checkIfInputValid('password')}}
            required
          />
        </div>

        <button
          className='blue_button h-10 mt-8'
          onClick={handleOnClick}
        >
          Update Employee
        </button>

      </div>

    </div>
  )
}

export default EditEmployeeModal