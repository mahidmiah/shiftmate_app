import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <main className="flex flex-col items-center ">
      
      {/* Logo / Tagline */}
      <div className='w-fit pb-12 mt-16 lg:mt-32'>
        <h1 className='text-2xl font-semibold text-center italic pb-2 section_text'>ShiftMate</h1>
        <p className='text-slate-400'>Shift Management Made Easy.</p>
      </div>

      {/* Form Container */}
      <ForgotPasswordForm />

      <p className='text-slate-400 mt-12 text-xs'>
        Already have an account? <Link href={'/auth/login'} className='font-bold'>Login instead</Link>
      </p>

    </main>
  )
}

export default page