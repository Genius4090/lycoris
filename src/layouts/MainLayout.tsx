import { Outlet, useLocation } from "react-router-dom"
import { Footer, Header } from "../components"
import { useEffect } from "react"

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header/>
        <Outlet />
      <Footer/>
    </>
  )
}

export default MainLayout