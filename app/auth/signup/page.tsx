'use client'

import SignupForm from '@/components/auth/SignupForm'
import Image from 'next/image'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center py-4">
      
      {/* Logo / Tagline */}
      <div className='w-fit pb-12 mt-6 lg:mt-32'>
        <h1 className='text-2xl font-semibold text-center italic pb-2 text-white'>ShiftMate</h1>
        <p className='text-slate-400'>Shift Management Made Easy.</p>
      </div>

      {/* Form Container */}
      <SignupForm />

      <p className='text-slate-400 mt-8 lg:mt-12 text-xs'>
        Already have an account? <Link href={'/auth/login'} className='font-bold'>Login instead</Link>
      </p>

    </main>
  )
}
