import { Outlet } from "react-router-dom"

export const RootLayout = () => {

  return (
    
    <div className="w-[48rem] h-[72rem] p-4 flex flex-col justify-between">
      <Outlet />
    </div>
  )
}
