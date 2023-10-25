'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner';

function ChangePasswordForm({token}: {token: string}) {

  const router = useRouter();

  const [formData, setFormData] = useState<formData>({
    password: '',
    password2: '',
  });

  const [formDataFocus, setFormDataFocus] = useState<formData>({
    password: false,
    password2: false,
  });

  const [formDataValid, setFormDataValid] = useState<formData>({
    password: true,
    password2: true,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a timeout to change the visibility after 1 second
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    setFormDataFocus({ ...formDataFocus, [name]: true });
  };

  const checkIfInputValid = (field: string) => {
    if (formDataFocus[field] === true && formData[field] === '') {
      setFormDataValid({ ...formDataValid, [field]: false });
    }
    else if (formDataValid[field] === false && formData[field] != '') {
      setFormDataValid({ ...formDataValid, [field]: true });
    }
  }

  const getInputClass = (field: string) => {
    return formDataValid[field] === true ? normalInputField : errorInputField
  }

  const validateFields = () => {
    // Minimum length of 8 characters
    if((formData.password as string).length < 8){
      toast.error('Password must me more then 8 characters long!');
      return false;
    }
    // At least one uppercase letter
    if (!/[A-Z]/.test(formData.password as string)) {
      toast.error('Password must have at least 1 uppercase letter!');
      return false;
    }
    // At least one symbol (special character)
    if(!/[^a-zA-Z0-9]/.test(formData.password as string)){
      toast.error('Password must have at least 1 symbol!');
      return false;
    }
    if(formData.password !== formData.password2){
      toast.error('Passwords do not match!');
      return false;
    }
    return true;
  }

  const changePassword = async () => {
    try {
        const password = formData.password;
        const response = await axios.post('/api/auth/changepassword', {token, password});
        if(response.data.status == 200){
          toast.success('Password changed!');
          router.push('/auth/login')
        }
        else if (response.data.status == 400){
          toast.error('User does not exist!')
        }
    } catch (error: any) {
        toast.error(error.message);
    }
  } 

  const handleChangePassword = () => {
    // List of required field names
    const requiredFields = [
      'password',
      'password2',
    ];

    // Create an object to store the changes
    const updatedValidData: formData = {};

    // Check each required field
    requiredFields.forEach((field) => {
      if (formData[field] === '') {
        updatedValidData[field] = false;
      }
    });

    if (Object.keys(updatedValidData).length >= 1) {
      toast.error('Fill in all required fields!');
      // Update the formDataValid state with the merged changes
      setFormDataValid({ ...formDataValid, ...updatedValidData });
    }
    else {
      if(validateFields()){
        setFormDataValid({ ...formDataValid, ...updatedValidData });
        changePassword();
      }
    }

  }

  // Styles

  const normalInputField = 'w-full border widget_border rounded-md h-10 widget_bg rounded-md px-2 section_text font-medium mb-6 text-xs';
  const errorInputField = 'w-full border border-red-500 rounded-md h-10 widget_bg px-2 section_text font-medium mb-6 text-xs';

  return (
    <div className='w-80 h-fit widget_bg widget_border border rounded-2xl px-6 py-8'>
      <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <input 
          type='password'
          name='password'
          className={getInputClass('password')}
          placeholder='Password'
          value={formData.password as string}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => {checkIfInputValid('password')}}
          required
        />

        <input 
          type='password'
          name='password2'
          className={getInputClass('password2')}
          placeholder='Confirm password'
          value={formData.password2 as string}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => {checkIfInputValid('password2')}}
          required
        />

        <button
          className='blue_button h-10'
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  )
}

export default ChangePasswordForm