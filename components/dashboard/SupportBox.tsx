import React from 'react'
import { BiSupport } from 'react-icons/bi'
import { BsInfoCircle } from 'react-icons/bs'

function SupportBox() {
  return (
    <div className='px-6 py-8 widget_bg widget_border border w-full lg:h-fit lg:w-96 rounded-md section_text shadow-md'>
      <h1 className='text-lg font-semibold'>Help and Support</h1>
      
      <p className='mt-4 text-sm'>Looking for info about us?</p>
      <p className='text-custom_blue text-sm'>Learn more</p>

      <p className='mt-4 text-sm'>Tips on how to use ShiftMate?</p>
      <p className='text-custom_blue text-sm'>Learn more</p>

      <h1 className='text-lg font-semibold mt-8'>Need something else?</h1>
      <p className='text-custom_blue text-sm flex items-center gap-x-3 mt-3'> <span className='section_text'><BiSupport size={20} /></span> Contact support</p>
      <p className='text-custom_blue text-sm flex items-center gap-x-3 mt-3'> <span className='section_text'><BsInfoCircle size={20} /></span> FAQs</p>
    </div>
  )
}

export default SupportBox