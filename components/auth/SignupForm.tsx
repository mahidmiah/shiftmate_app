'import client'

import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';

function SignupForm() {

  const router = useRouter();

  const [formData, setFormData] = useState<formData>({
    businessName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    postCode: '',
    businessType: '',
    ownerFirstName: '',
    ownerLastName: '',
    password: '',
    password2: '',
    email: '',
    logo: '',
  });

  const [formDataFocus, setFormDataFocus] = useState<formData>({
    businessName: false,
    streetLine1: false,
    streetLine2: false,
    city: false,
    postCode: false,
    businessType: false,
    ownerFirstName: false,
    ownerLastName: false,
    password: false,
    password2: false,
    email: false,
    logo: false,
  });

  const [formDataValid, setFormDataValid] = useState<formData>({
    businessName: true,
    streetLine1: true,
    streetLine2: true,
    city: true,
    postCode: true,
    businessType: true,
    ownerFirstName: true,
    ownerLastName: true,
    password: true,
    password2: true,
    email: true,
    logo: true,
  });

  const [page, setPage] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  const businessTypes = ['Fast Food', 'Restaurant', 'Barbers', 'Driving School', 'Other']

  useEffect(() => {
    // Set a timeout to change the visibility after 1 second
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, [page]);

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

    // Create an object to store the changes
    const updatedValidData: formData = {};

    const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email as string);
    if(!isEmailValid){
      toast.error('Email Invalid');
      updatedValidData.email = false;
      setFormDataValid({ ...formDataValid, ...updatedValidData });
      return false;
    }
    // Minimum length of 8 characters
    if((formData.password as string).length < 8){
      toast.error('Password must me more then 8 characters long!');
      updatedValidData.password = false;
      updatedValidData.password2 = false;
      setFormDataValid({ ...formDataValid, ...updatedValidData });
      return false;
    }
    // At least one uppercase letter
    if (!/[A-Z]/.test(formData.password as string)) {
      toast.error('Password must have at least 1 uppercase letter!');
      updatedValidData.password = false;
      updatedValidData.password2 = false;
      setFormDataValid({ ...formDataValid, ...updatedValidData });
      return false;
    }
    // At least one symbol (special character)
    if(!/[^a-zA-Z0-9]/.test(formData.password as string)){
      toast.error('Password must have at least 1 symbol!');
      updatedValidData.password = false;
      updatedValidData.password2 = false;
      setFormDataValid({ ...formDataValid, ...updatedValidData });
      return false;
    }
    return true;
  }

  const signUp = async () => {
    try {
      const response = await axios.post('/api/auth/signup', formData);
      if (response.data.status == 201){
        toast.success('Singed up!');
        router.push('/auth/login')
      }
      else if (response.data.status == 400){
        toast.error('Business already exists!')
      }
      else {
        toast.error('Something went wrong!')
        console.log('Signup Response', response.data);
      }
    } catch (error: any) {
      console.log('Signup failed', error.message);
      toast.error(error.message);
    }
  }

  const handleSignUp = () => {
    // List of required field names
    const requiredFields = [
      'businessName',
      'businessType',
      'streetLine1',
      'city',
      'postCode',
      'ownerFirstName',
      'ownerLastName',
      'email',
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
    // If passwords do not match
    else if (formData.password !== formData.password2) {
      updatedValidData.password = false;
      updatedValidData.password2 = false;
      toast.error('Passwords do not match!');
      // Update the formDataValid state with the merged changes
      setFormDataValid({ ...formDataValid, ...updatedValidData });
    }
    else {
      if(validateFields()){
        updatedValidData.password = true;
        updatedValidData.password2 = true;
        setFormDataValid({ ...formDataValid, ...updatedValidData });
        signUp();
      }
    }
    
  };

  // Styles
  const activeBar = 'w-1/3 h-2 rounded-2xl bg-custom_blue';
  const nonActiveBar = 'w-1/3 h-2 rounded-2xl bg-slate-400';

  const normalInputField = 'w-full border widget_border rounded-md h-10 widget_bg px-2 text-slate-400 font-medium mb-6 text-xs';
  const errorInputField = 'w-full border border-red-500 rounded-md h-10 widget_bg px-2 text-slate-400 font-medium mb-6 text-xs'

  return (
    <div className='w-80 h-fit widget_bg border widget_border rounded-2xl px-6 py-8'>

      <div className={`flex gap-4 mb-8`}>
        <div className={page === 0 ? activeBar : nonActiveBar}></div>
        <div className={page === 1 ? activeBar : nonActiveBar}></div>
        <div className={page === 2 ? activeBar : nonActiveBar}></div>
      </div>

      {
      page === 0 ? 
        <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className='h-96'>
            <input 
              type='text'
              className={getInputClass('businessName')}
              placeholder='Business Name'
              name='businessName'
              value={formData.businessName as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('businessName')}}
            />

            <select 
              className={getInputClass('businessType')}
              placeholder='Business Type'
              name='businessType'
              value={formData.businessType as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('businessType')}}
            >
              <option value="" disabled>Select Business Type</option>
              {businessTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))
              }
            </select>
          </div> 

          <div className='flex justify-end'>
            <button
              className='text-white bg-custom_blue border border-custom_blue w-4/12 rounded-md h-10 hover:bg-custom_blue_hover shadow-md font-medium text-sm'
              onClick={() => {
                setPage(page + 1);
                setIsVisible(false);
              }}
            >
              Next
            </button>
          </div>
        </div>
      : 
        ''
      }

      {
      page === 1 ? 
        <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className='h-96'>
            <input 
              type='text'
              className={getInputClass('streetLine1')}
              placeholder='Street Line 1'
              name='streetLine1'
              value={formData.streetLine1 as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('streetLine1')}}
            />

            <input 
              type='text'
              className={normalInputField}
              placeholder='Street Line 2 (Optional)'
              name='streetLine2'
              value={formData.streetLine2 as string}
              onChange={handleChange}
            />

            <input 
              type='text'
              className={getInputClass('city')}
              placeholder='City'
              name='city'
              value={formData.city as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('city')}}
            />

            <input 
              type='text'
              className={getInputClass('postCode')}
              placeholder='Post Code'
              name='postCode'
              value={formData.postCode as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('postCode')}}
            />
          </div> 

          <div className='flex justify-between'>
            <button
              className='text-white bg-custom_blue border border-custom_blue w-4/12 rounded-md h-10 hover:custom_blue_hover shadow-md font-medium text-sm'
              onClick={() => {
                setPage(page - 1);
                setIsVisible(false);
              }}
            >
              Back
            </button>

            <button
              className='text-white bg-custom_blue border border-custom_blue w-4/12 rounded-md h-10 hover:custom_blue_hover shadow-md font-medium text-sm'
              onClick={() => {
                setPage(page + 1);
                setIsVisible(false);
              }}
            >
              Next
            </button>
          </div>
        </div>
      : 
        ''
      }

      {
      page === 2 ? 
        <div className={`transition-opacity duration-[0.5s] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className='h-96'>
            <input 
              type='text'
              className={getInputClass('ownerFirstName')}
              placeholder='First Name'
              name='ownerFirstName'
              value={formData.ownerFirstName as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('ownerFirstName')}}
            />

            <input 
              type='text'
              className={getInputClass('ownerLastName')}
              placeholder='Last Name'
              name='ownerLastName'
              value={formData.ownerLastName as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('ownerLastName')}}
            />

            <input 
              type='text'
              className={getInputClass('email')}
              placeholder='Email'
              name='email'
              value={formData.email as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('email')}}
            />

            <input 
              type='password'
              className={getInputClass('password')}
              placeholder='Password'
              name='password'
              value={formData.password as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('password')}}
            />

            <input 
              type='password'
              className={getInputClass('password2')}
              placeholder='Confirm Password'
              name='password2'
              value={formData.password2 as string}
              onChange={handleChange}
              required
              onFocus={handleFocus}
              onBlur={() => {checkIfInputValid('password2')}}
            />
          </div> 

          <div className='flex justify-between'>
            <button
              className='text-white bg-custom_blue border border-custom_blue w-4/12 rounded-md h-10 hover:custom_blue_hover shadow-md font-medium text-sm'
              onClick={() => {
                setPage(page - 1);
                setIsVisible(false);
              }}
            >
              Back
            </button>

            <button
              className='text-white bg-custom_blue border border-custom_blue w-7/12 rounded-md h-10 hover:custom_blue_hover shadow-md font-medium text-sm'
              onClick={handleSignUp}
            >
              Signup
            </button>
          </div>
        </div>
      : 
        ''
      }
    </div>
  )
}

export default SignupForm