'import client'

import axios from 'axios';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

function VerifyEmailBox({token}: {token: string}) {

  const [verified, setVerified] = useState(false);

  const verify = async () => {
    try {
      const response = await axios.post('/api/auth/verifyemail', {token});
      if (response.data.status == 200){
        setVerified(true);
        toast.success('Email verified');
      }
      else if (response.data.status == 400){
        toast.error('Invalid token');
      }
    } catch (error: any) {
      toast.error('Something went wrong!');
    }
  }

  const handleVerify = () => {
    verify();
  }
  
  return (
    <div className='h-72 w-80 widget_bg border widget_border rounded-2xl px-6 py-8'>

      <div className='w-full flex justify-center'>
        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#0074D9" />
          <polygon points="50,30 60,50 50,70 40,50" fill="#FFF" />
        </svg>
      </div>

      <h1 className='text-lg text-center section_text font-semibold pt-4'>Verify your email</h1>
      
      <button 
        onClick={!verified ? handleVerify : redirect('/auth/login')}
        className='blue_button h-10'
      > 
        {!verified ? 'Verify Email' : 'Login'}
      </button>

    </div>
  )
}

export default VerifyEmailBox