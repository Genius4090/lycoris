


import { Link, NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";

const Header = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation()

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
  };

  const navLinks = [
    { path: PATH.home, title:t("header.content1") },
    { path: PATH.about, title: "About" },
    { path: PATH.products, title: "Catalog" },
    { path: PATH.cart, title: "Cart" },
    { path: PATH.orders, title: "Orders" },
  ];

  const isAdmin = role === "admin" || role === "superadmin";

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])



  return (
  <header className="w-full fixed top-0 left-0 z-999">
    <nav
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-300
        py-5 px-10
         border-b-transparent
         border-b
        ${
          scrolled
            ? "backdrop-blur-md bg-[#F8F3EC] border-b-black/10!"
            : "bg-transparent" 
        }
      `}
    >
      <div className="grid grid-cols-3 items-center w-full">
        {/* Left - Logo */}
        <div className="flex justify-start items-center">
          <Link
            to={PATH.home}
            className="font-liter italic text-[24px] pb-2 text-title"
          >
            Lycoris
          </Link>
        <LanguageSelect/>

        </div>

        {/* Center - Navigation */}
        <ul className="flex justify-center items-center gap-10">
          {navLinks.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                 className="font-liter italic tracking-widest text-title uppercase"
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
  {/* Right — auth + dashboard */}
          
        {/* Right - Auth */}
        <div className="flex justify-end items-center gap-8">
          {user ? (
            <div className="flex items-center gap-8">
             {!isAdmin && (
               <span className="text-xs text-textish hidden sm:block truncate max-w-[220px] font-liter italic">
                {user.email}
              </span>
             )}
  {isAdmin && (
            <NavLink
              to={PATH.dashboard}
               className="font-liter italic tracking-widest text-title uppercase cursor-pointer border border-brownish px-2 rounded "
            >
              Dashboard
            </NavLink>
          )}
              <button
                onClick={handleSignOut}
                className="font-liter italic tracking-widest text-title uppercase cursor-pointer hover:opacity-70 transition"
              >
                 {
                  t("auth.logout")
                }
              </button>
            </div>
          ) : (
            <NavLink
              to={PATH.login}
              className="font-liter italic tracking-widest text-title uppercase cursor-pointer hover:opacity-70 transition"
            >
              {
                  t("auth.login")
                }
            </NavLink>
          )}
        
        </div>
        
      </div>
    </nav>
  </header>
);
};

export default Header;
