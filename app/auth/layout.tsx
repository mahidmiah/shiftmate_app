export default function DashboardLayout({children,}: {children: React.ReactNode}) {
    
  return (
    <section className='dark w-screen h-screen'>
      <div className="page_bg h-full w-full">
        {children}   
      </div>   
    </section>
  )
}