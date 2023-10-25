import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { BiLogOut } from 'react-icons/bi';
import { toast } from 'sonner';

function LogoutButton() {
  const router = useRouter();
  return (
    <button 
      className='text-red-500 hover:text-red-700 hover:font-semibold rounded-md flex items-center justify-center gap-2 px-4 py-3 w-full text-md mb-20'
      onClick={async () => {
        try {
          const res = await axios.get('/api/auth/logout');
          if (res.status === 200){
            toast.success('You have been successfully logged out!')
            router.push('/auth/login');
          }
          else{
            toast.error('Something went wrong!')
          }
        } catch (error: any) {
          toast.error(error.message)
        }
      }}
    >
      <BiLogOut size={20} /> Log out
    </button>
  )
}

export default LogoutButton