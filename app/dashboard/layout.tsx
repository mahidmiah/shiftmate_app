'use client'

import MobileNavBar from "@/components/dashboard/MobileNavBar"
import MobileTopBar from "@/components/dashboard/MobileTopBar"
import Navbar from "@/components/dashboard/Navbar"
import TopBar from "@/components/dashboard/TopBar"
import useShiftStore from "@/store/shiftStore"
import axios from "axios"
import { useEffect } from "react"

export default function DashboardLayout({children,}: {children: React.ReactNode}) {

  const setDarkMode = useShiftStore((state) => state.setDark)
  const setLightMode = useShiftStore((state) => state.setLight)

  const getDarkModePreference = async () => {
    const res = await axios.get('/api/business/profile/getdarkmode')
    const data = res.data.data;
    if (data.darkMode === true){
      setDarkMode();
    }
    else{
      setLightMode();
    }
  }

  useEffect(() => {
    getDarkModePreference();
  }, [DashboardLayout])

  const darkMode = useShiftStore((state) => state.darkMode)
    
  return (
    <section className={`flex w-screen h-screen overflow-hidden bg-yellow-100 ${darkMode === true ? 'dark' : ''}`}>

      <MobileNavBar />

      {/* LEFT BAR */}
      <div className="w-56 h-full hidden lg:flex bg-red-400">
        <Navbar />
      </div>

      {/* WHOLE RIGHT SIDE */}
      <div className="bg-blue-100 w-full h-full overflow-hidden">
        {/* TOP BAR */}
        <div className="bg-green-100 h-fit">
          <MobileTopBar />
          <TopBar />
        </div>

        {/* CONTENT AREA */}
        <div className="page_bg h-full w-full overflow-auto no-scrollbar pb-32" id="children_container">
          {children}
        </div>

      </div>
      
    </section>
  )
}