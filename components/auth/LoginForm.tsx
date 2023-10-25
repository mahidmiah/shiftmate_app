'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner';

function LoginForm() {

  const router = useRouter();

  const [formData, setFormData] = useState<formData>({
    email: '',
    password: '',
  });

  const [formDataFocus, setFormDataFocus] = useState<formData>({
    email: false,
    password: false,
  });

  const [formDataValid, setFormDataValid] = useState<formData>({
    email: true,
    password: true,
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
    const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email as string);
    if(!isEmailValid){
      toast.error('Email Invalid');
      return false;
    }
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
    return true;
  }

  const login = async () => {
    try {
        const response = await axios.post('/api/auth/login', formData);
        if(response.data.status == 200){
          toast.success('Successfully logged in!');
          router.push('/dashboard/home')
        }
        else if (response.data.status == 400){
          toast.error('User does not exist!')
        }
        else if (response.data.status == 401){
            toast.error('Incorrect Password!')
        }
        else if (response.data.status == 402){
          toast.error('Business has not been verified!')
        }
        else {
            toast.error('Something went wrong!')
            console.log('Login Response', response.data);
        }
    } catch (error: any) {
        console.log('Login failed', error.message);
        toast.error(error.message);
    }
  } 

  const handleLogin = () => {
    // List of required field names
    const requiredFields = [
      'email',
      'password',
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
        login();
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
          type='email'
          name='email'
          className={getInputClass('email')}
          placeholder='Email'
          value={formData.email as string}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => {checkIfInputValid('email')}}
          required
        />

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

        <button
          className='blue_button h-10'
          onClick={handleLogin}
        >
          Login
          
        </button>
      </div>
    </div>
  )
}

export default LoginForm