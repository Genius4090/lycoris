import { Outlet, useLocation } from "react-router-dom"
import { Footer, Header } from "../components"
import { useEffect } from "react"
import CursorComet from "../components/CursorComet"

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <CursorComet />
      <Header/>
        <Outlet />
      <Footer/>
    </>
  )
}

export default MainLayout