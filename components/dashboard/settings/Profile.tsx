'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

function Profile() {

  const initialProfileData: ProfileData = {
    id: '',
    darkMode: false,
    businessName: '',
    businessType: '',
    logo: null,
    businessAddress: {
      streetLine1: '',
      streetLine2: null,
      city: '',
      postCode: '',
    },
    email: '',
    ownerFirstName: '',
    ownerLastName: '',
  };

  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const getProfileData = async () => {
    try {
      const res = await axios.get('/api/business/profile/getprofiledata')
      const data: ProfileData = res.data.data;
      setProfileData(data);
    } catch (error: any) {
      toast.error('Failed to load prfile data!');
    }
  }

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleChangeEmbedded = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      businessAddress: {
        ...prevProfileData.businessAddress,
        [name]: value,
      },
    }));
  };
  

  useEffect(() => {
    getProfileData();
  }, []);

  const saveData = async () => {
    try {
      const response = await axios.post('/api/business/profile/updateprofile', profileData);
      if(response.data.status == 200){
        toast.success('Profile updated!');
      }
      else if (response.data.status == 400){
        toast.error('Business not found!');
      }
    } catch (error: any) {
        toast.error('Failed to update profile!');
    }
  }

  const handleClick = () => {
    setEditMode(!editMode);
    if (editMode === true){
      saveData();
    }
  }

  // Styles
  const normalInputField = 'text-xs md:text-md w-full border widget_border rounded-md h-8 widget_bg  px-2 section_text';
  const errorInputField =  'text-xs md:text-md w-full border border-custom_blue rounded-md h-8 widget_bg px-2 section_text';

  return (
    <div className='px-6 py-8 widget_bg widget_border border h-fit w-full lg:w-[40rem] rounded-md section_text shadow-md'>
      
      <h1 className='text-2xl lg:text-2xl font-semibold'>Profile settings</h1>
      <p className='mt-2 text-sm lg:text-sm'>Update your profile and how your employees will view you generally</p>

      <hr className='my-6 widget_border'></hr>
      
      <h1 className='text-xl lg:text-xl font-medium'>Profile details</h1>
      <h1 className='text-xs italic mt-1 lg:mt-1 mb-8'>ID: {profileData?.id}</h1>

      <div className='mb-6'>
        <h1 className='text-md md:text-md'>Business name</h1>
        <input 
          type='text'
          name='businessName'
          className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
          placeholder='Business name'
          value={profileData?.businessName}
          onChange={handleChange}
          required
          disabled={editMode === false ? true : false}
        />
      </div>

      <div className='mb-8'>
        <h1 className='text-md md:text-md'>Business type</h1>
        <input 
          type='text'
          name='businessType'
          className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
          placeholder='Business type'
          value={profileData?.businessType}
          onChange={handleChange}
          required
          disabled={editMode === false ? true : false}
        />
      </div>

      <hr className='my-8 widget_border'></hr>

      <div className='mb-8 flex gap-x-4'>
        <div className='w-1/2'>
          <h1 className='text-md md:text-md'>Street line 1</h1>
          <input 
            type='text'
            name='streetLine1'
            className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
            placeholder='Street line 1'
            value={profileData.businessAddress.streetLine1}
            onChange={handleChangeEmbedded}
            required
            disabled={editMode === false ? true : false}
          />
        </div>
        <div className='w-1/2'>
          <h1 className='text-md md:text-md'>Street line 2</h1>
          <input 
            type='text'
            name='streetLine2'
            className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
            placeholder='Street line 2'
            value={profileData.businessAddress.streetLine2 || ''}
            onChange={handleChangeEmbedded}
            required
            disabled={editMode === false ? true : false}
          />
        </div>
      </div>

      <div className='mb-8 flex gap-x-4'>
        <div className='w-1/2'>
          <h1 className='text-md md:text-md'>City</h1>
          <input 
            type='text'
            name='city'
            className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
            placeholder='City'
            value={profileData.businessAddress.city}
            onChange={handleChangeEmbedded}
            required
            disabled={editMode === false ? true : false}
          />
        </div>
        <div className='w-1/2'>
          <h1 className='text-md md:text-md'>Post code</h1>
          <input 
            type='text'
            name='postCode'
            className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
            placeholder='Post code'
            value={profileData.businessAddress.postCode}
            onChange={handleChangeEmbedded}
            required
            disabled={editMode === false ? true : false}
          />
        </div>
      </div>

      <hr className='my-8 widget_border'></hr>

      <div className='mb-8 flex gap-x-4'>
        <div className='w-1/2'>
          <h1 className='text-md md:text-md'>First name</h1>
          <input 
            type='text'
            name='ownerFirstName'
            className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
            placeholder='First name'
            value={profileData?.ownerFirstName}
            onChange={handleChange}
            required
            disabled={editMode === false ? true : false}
          />
        </div>
        <div className='w-1/2'>
          <h1 className='text-md md:text-md'>Last name</h1>
          <input 
            type='text'
            name='ownerLastName'
            className={(editMode === false ? normalInputField : errorInputField) + ' mt-2'}
            placeholder='Last name'
            value={profileData?.ownerLastName}
            onChange={handleChange}
            required
            disabled={editMode === false ? true : false}
          />
        </div>
      </div>

      <button
        className='bg-custom_blue hover:bg-custom_blue_hover border border-custom_blue w-full rounded-md h-10 font-semibold text-white mt-4 shadow-md'
        onClick={handleClick}
      >
        {editMode ? 'Save' : 'Edit'}
      </button>
    </div>
  )
}

export default Profile