import { Link, NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";
import { fetchCart } from "../supabase/cartService";
import { CircleUserRound, Menu, SquareArrowRightExit, X } from "lucide-react";
import ShinyText from "./ShinyText";
import { motion, AnimatePresence } from "motion/react";

const Header = () => {
  const { user, role, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [modal, setModal] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
    setMobileOpen(false);
  };

  const navLinks = [
    { path: PATH.home,     title: t("header.home") },
    { path: PATH.about,    title: t("header.about") },
    { path: PATH.products, title: t("header.catalog") },
    { path: PATH.cart,     title: t("header.cart") },
    { path: PATH.orders,   title: t("header.orders") },
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <motion.nav
      className={`fixed z-100 flex items-center justify-between w-full px-5 md:px-10 pt-5 pb-5 md:pt-7 md:pb-7 ${
        scrolled ? "backdrop-blur-md border-b-black/10!" : "bg-transparent"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* ── Left nav links — desktop only ── */}
      <ul className="hidden md:flex items-center gap-3 lg:gap-6 flex-1">
        {navLinks.map((item, i) => (
          <li key={i}>
            <Link
              to={item.path}
              className="font-sora text-[10px] lg:text-[11.5px] font-light text-white/75 tracking-wide hover:text-white transition-colors duration-200 uppercase"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Hamburger — mobile only ── */}
      <button
        className="md:hidden flex items-center justify-center w-8 h-8 text-white/70 hover:text-white transition-colors cursor-pointer z-110"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ── Centre wordmark ── */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 md:static md:translate-x-0 md:top-auto md:flex md:justify-center md:flex-1">
        <Link to={PATH.home}>
          <ShinyText
            text="Lycoris"
            speed={2}
            delay={0.5}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="font-liter text-white/90 text-[22px] font-light tracking-wide select-none"
          />
        </Link>
      </div>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-2 md:gap-3 lg:gap-4 relative md:flex-1 md:justify-end">

        {/* Dashboard link — only for admins once auth resolves, desktop only */}
        {!loading && isAdmin && (
          <>
            <NavLink
              to={PATH.dashboard}
              className="hidden md:block font-sora text-[10px] lg:text-xs tracking-wide text-white/45 font-light hover:text-white/70 transition-colors duration-200"
            >
              {t("header.dashboard")}
            </NavLink>
            <span className="hidden md:block text-white/25 text-xs font-thin">|</span>
          </>
        )}

        <LanguageSelect />
        <span className="hidden md:block text-white/25 text-xs font-thin">|</span>

        <Link
          to={PATH.cart}
          className="hidden md:block font-sora text-[10px] lg:text-xs text-white/80 tracking-wide cursor-pointer hover:text-white transition-colors duration-200 whitespace-nowrap"
        >
          {t("header.bag")} [&nbsp;{totalItems}&nbsp;]
        </Link>
        <span className="hidden md:block text-white/25 text-xs font-thin">|</span>

        {/* Avatar — always rendered immediately, no loading gate */}
        <div className="relative">
          <button
            onClick={() => setModal((prev) => !prev)}
            aria-label="Open account menu"
            className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 hover:border-white/40 transition-colors duration-200 cursor-pointer"
          >
            <CircleUserRound className="w-4 h-4 text-white/50 hover:text-white/75 transition-colors duration-200" />
          </button>
        </div>

        {/* ── Dropdown modal ── */}
        <AnimatePresence>
          {modal && (
            <>
              <div className="fixed inset-0 z-90" onClick={() => setModal(false)} />

              <motion.div
                className="absolute z-100 top-11 right-0 max-w-80 w-72 rounded-xl border border-brownish/40 bg-stonish backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <button
                  onClick={() => setModal(false)}
                  aria-label="Close menu"
                  className="absolute top-3.5 right-3.5 text-textish hover:text-title transition-colors duration-150 cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {loading ? (
                  <div className="px-6 py-8 flex items-center justify-center">
                    <span className="font-sora text-xs text-textish">...</span>
                  </div>
                ) : user ? (
                  <>
                    <div className="px-6 pt-6 pb-5 border-b border-brownish/30">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-11 h-11 rounded-full border border-brownish/50 bg-brownish/20 shrink-0">
                          <CircleUserRound className="w-5 h-5 text-brownish" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-sora text-[10px] uppercase tracking-widest text-textish mb-0.5">
                            {t("header.modal.signedInAs")}
                          </p>
                          <p className="font-sora text-sm text-title truncate">{user.email}</p>
                        </div>
                      </div>
                      <p className="font-liter italic text-textish text-[11px] tracking-wide">
                        {t("header.modal.member")}
                      </p>
                    </div>

                    <div className="px-3 py-3 border-b border-brownish/30 flex flex-col gap-0.5">
                      <NavLink
                        to={PATH.orders}
                        onClick={() => setModal(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sora text-xs text-textish hover:text-title hover:bg-brownish/20 transition-all duration-150"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brownish shrink-0" />
                        {t("header.orders")}
                      </NavLink>
                      <NavLink
                        to={PATH.cart}
                        onClick={() => setModal(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sora text-xs text-textish hover:text-title hover:bg-brownish/20 transition-all duration-150"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brownish shrink-0" />
                        {t("header.bag")} [{totalItems}]
                      </NavLink>
                      {isAdmin && (
                        <NavLink
                          to={PATH.dashboard}
                          onClick={() => setModal(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sora text-xs text-textish hover:text-title hover:bg-brownish/20 transition-all duration-150"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brownish shrink-0" />
                          {t("header.dashboard")}
                        </NavLink>
                      )}
                    </div>

                    <div className="px-3 py-3">
                      <button
                        onClick={() => { handleSignOut(); setModal(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-sora text-xs text-textish hover:text-pinkish hover:bg-pinkish/10 transition-all duration-150 cursor-pointer text-left"
                      >
                        <SquareArrowRightExit className="w-4 h-4 shrink-0" />
                        {t("auth.logout")}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="px-6 pt-6 pb-5 border-b border-brownish/30">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-11 h-11 rounded-full border border-brownish/40 bg-brownish/15 shrink-0">
                          <CircleUserRound className="w-5 h-5 text-brownish" />
                        </div>
                        <div>
                          <p className="font-sora text-[10px] uppercase tracking-widest text-textish mb-0.5">
                            {t("header.modal.notSignedIn")}
                          </p>
                          <p className="font-liter italic text-title text-sm">
                            {t("header.modal.welcome")}
                          </p>
                        </div>
                      </div>
                      <p className="font-sora text-[11px] text-textish leading-relaxed">
                        {t("header.modal.guestHint")}
                      </p>
                    </div>

                    <div className="px-5 py-5">
                      <NavLink
                        to={PATH.login}
                        onClick={() => setModal(false)}
                        className="block w-full text-center font-sora text-xs tracking-widest uppercase py-3 px-4 rounded-lg border border-brownish/60 text-title hover:border-brownish hover:bg-brownish/20 transition-all duration-200"
                      >
                        {t("auth.login")}
                      </NavLink>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-95 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed h-screen top-0 left-0 w-72 max-w-[85vw] z-100 bg-stonish border-r border-brownish/30 flex flex-col pt-20 pb-8 px-6 md:hidden overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Nav links */}
              <ul className="flex flex-col gap-1">
                {navLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="block font-sora text-sm font-light text-title tracking-wide hover:text-white transition-colors duration-200 uppercase py-3 border-b border-brownish/10"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
                {!loading && isAdmin && (
                  <li>
                    <NavLink
                      to={PATH.dashboard}
                      onClick={() => setMobileOpen(false)}
                      className="block font-sora text-sm font-light text-title tracking-wide hover:text-white transition-colors duration-200 uppercase py-3 border-b border-brownish/10"
                    >
                      {t("header.dashboard")}
                    </NavLink>
                  </li>
                )}
              </ul>

              {/* Cart link */}
              <Link
                to={PATH.cart}
                onClick={() => setMobileOpen(false)}
                className="mt-6 font-sora text-sm text-title tracking-wide hover:text-white transition-colors duration-200"
              >
                {t("header.bag")} [{totalItems}]
              </Link>

              {/* Sign out if logged in */}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="mt-auto flex items-center gap-2 font-sora text-xs text-title hover:text-pinkish transition-colors duration-150 cursor-pointer"
                >
                  <SquareArrowRightExit className="w-4 h-4  shrink-0" />
                  {t("auth.logout")}
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Header;
