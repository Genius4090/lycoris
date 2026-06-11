import { Link, NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";
import { fetchCart } from "../supabase/cartService";

const Header = () => {
  const { user, role, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
  };

  const navLinks = [
    { path: PATH.home, title: t("header.home") },
    { path: PATH.about, title: t("header.about") },
    { path: PATH.products, title: t("header.catalog") },
    { path: PATH.cart, title: t("header.cart") },
    { path: PATH.orders, title: t("header.orders") },
  ];

  const isAdmin = role === "admin" || role === "superadmin";

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!user,
  });

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
    <nav className={` fixed z-100 flex items-center justify-between w-full px-10 pt-7 pb-7   ${
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
        <Link
        to={PATH.home}
          className="font-liter italic text-white/90 text-[22px] font-light tracking-wide select-none"
          style={{ letterSpacing: "0.04em" }}
        >
          Lycoris
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
      
 {!loading && isAdmin && (
                <>
                  <NavLink
                    to={PATH.dashboard}
                    className="font-sora text-xs tracking-wide text-white/45 font-light hover:text-white/70 transition-colors duration-200"
                  >
                    {t("header.dashboard")}
                  </NavLink>
                  <span className="text-white/25 text-xs font-thin">|</span>
                </>
              )}
        {/* Language */}
        <LanguageSelect />
        {/* Separator */}
        <span className="text-white/25 text-xs font-thin">|</span>
        {/* Bag */}
        <Link to={PATH.cart} className="font-sora text-xs text-white/80 tracking-wide cursor-pointer hover:text-white transition-colors duration-200">
          {t("header.bag")} [&nbsp;{totalItems}&nbsp;]
        </Link>
        <span className="text-white/25 text-xs font-thin">|</span>
        {/* Right - Auth */}
          {!loading && (user ? (
            
              !isAdmin && (
                <span className="font-sora text-xs tracking-wide text-white/45 font-light hidden sm:block truncate max-w-[160px]">
                  {user.email}
                </span>
              )
           
          ) : (
            <NavLink
              to={PATH.login}
              className="font-sora text-xs tracking-wide text-white/45 font-light hover:text-white/70 transition-colors duration-200"
            >
              {t("auth.login")}
            </NavLink>
          ))}
        <span className="text-white/25 text-xs font-thin">|</span>
          {user &&  <button
                onClick={handleSignOut}
                className="font-sora text-xs tracking-wide text-white/45 font-light hover:text-white/70 transition-colors duration-200 cursor-pointer"
              >
                {t("auth.logout")}
              </button>}
        </div>
      
    </nav>
  );
};

export default Header;


