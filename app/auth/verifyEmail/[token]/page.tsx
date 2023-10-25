'use client'

import VerifyEmailBox from '@/components/auth/VerifyEmailBox';
import React from 'react'

function VerifyEmailPage({params,}: {params: { token: string; }}) {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      {/* Render VerifyEmailBox component */}
      <VerifyEmailBox token={params.token} />
    </div>
  )
}


export default VerifyEmailPage
