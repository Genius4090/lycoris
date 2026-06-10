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
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
  };

  const navLinks = [
    { path: PATH.home, title: t("header.content1") },
    { path: PATH.about, title: "About" },
    { path: PATH.products, title: "Catalog" },
    { path: PATH.cart, title: "Cart" },
    { path: PATH.orders, title: "Orders" },
  ];

  const isAdmin = role === "admin" || role === "superadmin";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={` fixed z-10 flex items-center justify-between w-full px-10 pt-7 pb-7   ${
           scrolled
             ? "backdrop-blur-md  border-b-black/10!"
             : "bg-transparent"
         }`}>
      {/* Left nav links */}
      <ul className="flex items-center gap-6">
        {navLinks.map((item,key) => (
          <li key={key}>
            <Link
              to={item.path}
              className="font-sora text-[11.5px] font-light text-white/75 tracking-wide hover:text-white transition-colors duration-200 uppercase"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Centre wordmark */}
      <div className="absolute left-1/2 -translate-x-1/2 top-6">
        <span
          className="font-liter italic text-white/90 text-[22px] font-light tracking-wide select-none"
          style={{ letterSpacing: "0.04em" }}
        >
          Lycoris
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
      
 {isAdmin && (
                <>
                  <NavLink
                    to={PATH.dashboard}
                    className="font-sora text-[11px] tracking-wide text-white/45 font-light hover:text-white/70 transition-colors duration-200"
                  >
                    dashboard
                  </NavLink>
                  <span className="text-white/25 text-xs font-thin">|</span>
                </>
              )}
      

        {/* Language */}
        <LanguageSelect />
        {/* Separator */}
        <span className="text-white/25 text-xs font-thin">|</span>

        {/* Bag */}
        <span className="font-sora text-[11px] text-white/80 tracking-wide cursor-pointer hover:text-white transition-colors duration-200">
          bag [&nbsp;0&nbsp;]
        </span>

        <span className="text-white/25 text-xs font-thin">|</span>
    
    

        {/* Right - Auth */}
          {user ? (
            <>
              {!isAdmin && (
                <span className="font-sora text-xs tracking-wide text-white/45 font-light hidden sm:block truncate max-w-[160px]">
                  {user.email}
                </span>
              )}
             
              <button
                onClick={handleSignOut}
                className="font-sora text-xs tracking-wide text-white/45 font-light hover:text-white/70 transition-colors duration-200 cursor-pointer"
              >
                {t("auth.logout")}
              </button>
            </>
          ) : (
            <NavLink
              to={PATH.login}
              className="font-sora text-xs tracking-wide text-white/45 font-light hover:text-white/70 transition-colors duration-200"
            >
              {t("auth.login")}
            </NavLink>
          )}
        </div>
      
    </nav>
  );
};

export default Header;


