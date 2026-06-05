import { Outlet } from "react-router-dom"
import Header from "../components/Header"

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="pt-20 pb-10">
        <Outlet />
      </div>
    </>
  )
}

export default MainLayout