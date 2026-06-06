import { Outlet } from "react-router-dom"
import { Footer, Header } from "../components"

const MainLayout = () => {
  return (
    <>
      <Header/>
        <Outlet />
      <Footer/>
    </>
  )
}

export default MainLayout