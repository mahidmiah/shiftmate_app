'use client'

import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center ">
      
      {/* Logo / Tagline */}
      <div className='w-fit pb-12 mt-16 lg:mt-32'>
        <h1 className='text-2xl font-semibold text-center italic pb-2 section_text'>ShiftMate</h1>
        <p className='text-slate-400'>Shift Management Made Easy.</p>
      </div>

      {/* Form Container */}
      <LoginForm />

      <p className='text-slate-400 mt-12 text-xs'>
        Dont have an account? <Link href={'/auth/signup'} className='font-bold'>Signup instead</Link>
      </p>

      <p className='text-slate-400 mt-4 text-xs'>
        Forgot your password? <Link href={'/auth/forgotPassword'} className='font-bold'>Click here</Link>
      </p>

    </main>
  )
}
