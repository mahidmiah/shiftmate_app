'use client'

import ChangePasswordForm from '@/components/auth/ChangePasswordForm'
import React from 'react'

function changePasswordPage({params,}: {params: { token: string; }}) {
  console.log('Token:', params.token);
  return (
    <main className="flex flex-col items-center ">
      
      {/* Logo / Tagline */}
      <div className='w-fit pb-12 mt-16 lg:mt-32'>
        <h1 className='text-2xl font-semibold text-center italic pb-2 section_text'>ShiftMate</h1>
        <p className='text-slate-400'>Shift Management Made Easy.</p>
      </div>

      {/* Form Container */}
      <ChangePasswordForm token={params.token} />

    </main>
  )
}

export default changePasswordPage