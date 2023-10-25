import useShiftStore from '@/store/shiftStore';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner';

function AddNewShiftModal() {

  // Store Vars
  const currentDay = useShiftStore(state => state.currentDay);
  const currentWeek = useShiftStore(state => state.currentWeek);
  const currentYear = useShiftStore(state => state.currentYear);
  const scheduleUpdate = useShiftStore(state => state.scheduleUpdate);
  const triggerScheduleUpdate = useShiftStore(state => state.triggerScheduleUpdate);
  const hideAddShiftModal = useShiftStore(state => state.hideAddShiftModal);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [employees, setEmployees] = useState<any[] | undefined>();
  const [positions, setPositions] = useState<string[] | null>();
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const [localUserData, setLocalUserData] = useState<formData>({
    dayOfWeek: currentDay,
    weekNumber: currentWeek,
    currentYear: currentYear,
    employeeID: '',
    position: '',
    startTime: '',
    endTime: '',
  })

  const [isVisible, setIsVisible] = useState(false);

  const [formDataFocus, setFormDataFocus] = useState<formData>({
    dayOfWeek: false,
    position: false,
    startTime: false,
    endTime: false,
    employeeID: false
  });

  const [formDataValid, setFormDataValid] = useState<formData>({
    dayOfWeek: true,
    position: true,
    startTime: true,
    endTime: true,
    employeeID: true
  });

  const checkIfInputValid = (field: string) => {
    if (formDataFocus[field] === true && localUserData[field] === '') {
      setFormDataValid({ ...formDataValid, [field]: false });
    }
    else if (formDataValid[field] === false && localUserData[field] != '') {
      setFormDataValid({ ...formDataValid, [field]: true });
    }
  }

  const generateTimeSlots = () => {
    const timeSlots = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push(displayTime);
      }
    }
    timeSlots.push('24:00');
  
    return timeSlots;
  };
  
  const isStartTimeBeforeEndTime = (startTime: string, endTime: string) => {
    // Create Date objects to represent the times
    const startDate = new Date(`2000-01-01 ${startTime}`);
    const endDate = new Date(`2000-01-01 ${endTime}`);
  
    // Compare the times as Date objects
    return startDate < endDate;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const response = await axios.get('/api/business/employees/getallemployees');
        if(response.data.status == 200){
          setEmployees(response.data.data.employees);
        }
        else if (response.data.status == 400){
          toast.error('User not found!');
        }
      } catch (error: any) {
          console.log('Getting all employees failed!', error.message);
          toast.error(error.message);
      }
    }
    const getAllPositions = async () => {
      try {
        const response = await axios.get('/api/business/positions/getallpositions');
        if(response.data.status == 200){
          setPositions(response.data.data.positions);
        }
        else if (response.data.status == 400){
          toast.error('Business not found!');
        }
      } catch (error: any) {
          toast.error(error.message);
      }
    }

    getAllPositions();
    getAllEmployees();

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [AddNewShiftModal]);

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
    setLocalUserData({...localUserData, weekNumber: currentWeek, currentYear: currentYear, dayOfWeek: currentDay});
    try {
      console.log(localUserData);
      const response = await axios.post('/api/business/schedule/shifts/addnewshift', localUserData);
      if(response.data.status == 200){
        toast.success('Shift added!');
        triggerScheduleUpdate(!scheduleUpdate);
      }
      else if (response.data.status == 400){
        toast.error('User not found!');
      }
      else if (response.data.status == 401){
        toast.error('Week not found!');
      }
      else if (response.data.status == 402){
        toast.error('Shifts cannot overlap!');
      }
    } catch (error: any) {
        toast.error(error.message);
    }
  }

  const handleOnClick = async () => {
    setButtonDisabled(true);

    // List of required field names
    const requiredFields = [
      'dayOfWeek',
      'position',
      'startTime',
      'endTime',
      'employeeID'
    ];
  
    // Create an object to store the changes
    const updatedValidData: formData = {};
  
    // Check each required field
    requiredFields.forEach((field) => {
      if (localUserData[field] === '') {
        updatedValidData[field] = false;
      }
    });
  
    if (Object.keys(updatedValidData).length >= 1) {
      toast.error('Fill in all required fields!');
      setFormDataValid({ ...formDataValid, ...updatedValidData });
      setButtonDisabled(false);
      return; // Add this return statement to prevent the API call
    }
  
    if (!isStartTimeBeforeEndTime(localUserData.startTime as string, localUserData.endTime as string)){
      toast.error('End time cannot be before start time!');
      setButtonDisabled(false);
      return; // Add this return statement to prevent the API call
    }
    
    // If all required fields are valid, proceed with the API call
    await saveData();
    setButtonDisabled(false);
    hideAddShiftModal();
  }
  

  const normalInputField = 'text-sm md:text-md w-full border widget_border rounded-md h-10 widget_bg px-2 text-xs';
  const errorInputField =  'text-sm md:text-md w-full border border-red-500 rounded-md h-10 widget_bg px-2 text-xs';

  return (
    <div className='z-30 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-4 section_text'>
      
      <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'} px-6 pb-8 pt-5 w-[30rem] h-fit widget_bg border widget_border rounded-md shadow-sm`}>
        
        <div className='flex justify-end pr-3'>
          <button
            className="section_text focus:outline-none"
            onClick={() => {hideAddShiftModal()}}
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

        <h1 className='text-2xl font-semibold'>Add a new shift</h1>
        <p className='mt-2 text-sm lg:text-md'>Year: {currentYear}, Week: {currentWeek}</p>

        <div className='mt-8'>
          <h1 className='text-sm'>Day</h1>
          <select 
            name='dayOfWeek'
            className={getInputClass('dayOfWeek') + ' mt-2'}
            placeholder='Day of week'
            value={localUserData.dayOfWeek as number}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => {checkIfInputValid('dayOfWeek')}}
            required
          >
            <option value="" disabled>Select a day</option>
            {daysOfWeek.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))
            }
          </select>
        </div>

        <div className='mt-4'>
          <h1 className='text-sm'>Position</h1>
          <select 
            name='position'
            className={getInputClass('position') + ' mt-2'}
            placeholder='Position'
            value={localUserData.position as string}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => {checkIfInputValid('position')}}
            required
          >
            <option value="" disabled>Select a position</option>
            {positions?.map((positon, index) => (
              <option key={index} value={positon}>
                {positon}
              </option>
            ))
            }
          </select>
        </div>

        <div className='flex gap-x-4 mt-4'>
          <div className='w-1/2'>
            <h1 className='text-sm'>Start time</h1>
            <select
              name='startTime'
              className={getInputClass('startTime') + ' mt-2'}
              placeholder='Start time'
              value={localUserData.startTime as string}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('startTime')}}
              required
            >
              <option value="" disabled>Select start time</option>
              {timeSlots?.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))
              }
            </select>
          </div>
          <div className='w-1/2'>
            <h1 className='text-sm'>End time</h1>
            <select 
              name='endTime'
              className={getInputClass('endTime') + ' mt-2'}
              placeholder='End time'
              value={localUserData.endTime as string}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('endTime')}}
              required
            >
              <option value="" disabled>Select end time</option>
              {timeSlots?.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))
              }
            </select>
          </div>
        </div>

          <div className='mt-4'>
            <h1 className='text-sm'>Employee</h1>
            <select 
              name='employeeID'
              className={getInputClass('employeeID') + ' mt-2'}
              placeholder='Employee'
              value={localUserData.employeeID as string}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('employeeID')}}
              required
            >
              <option value='' disabled>Select an employee</option>
              {employees?.map((employee, index) => (
                employee !== null &&
                <option key={index} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))
              }
            </select>
          </div>

        <button
          className='blue_button h-10 mt-8'
          onClick={handleOnClick}
          disabled={buttonDisabled}
        >
          Add Shift
        </button>

      </div>

    </div>
  )
}

export default AddNewShiftModal