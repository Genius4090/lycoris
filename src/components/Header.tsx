import { NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
  };

  const navLinks = [
    { path: PATH.home, title: "Home" },
    { path: PATH.products, title: "Products" },
    { path: PATH.cart, title: "Cart" },
    { path: PATH.orders, title: "Orders" },
  ];

  const isAdmin = role === "admin" || role === "superadmin";

  return (
    <header className="w-full fixed top-0 left-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left — store nav */}
        <nav className="flex items-center gap-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Right — auth + dashboard */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <NavLink
              to={PATH.dashboard}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </NavLink>
          )}

          {user ? (
            <>
              <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[160px]">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm bg-black text-white px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink
              to={PATH.login}
              className="text-sm bg-black text-white px-3 py-1.5 rounded-lg"
            >
              Log in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
