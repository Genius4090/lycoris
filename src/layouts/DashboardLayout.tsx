import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Store,
} from "lucide-react";

const pageTitles: Record<string, string> = {
  [PATH.dashboard]:         "Dashboard",
  [PATH.dashboardProducts]: "Products",
  [PATH.dashboardUsers]:    "Users",
  [PATH.dashboardOrders]:   "Orders",
  [PATH.dashboardAdmins]:   "Admins",
};

const DashboardLayout = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
  };

  const navItems = [
    { path: PATH.dashboard,         label: "Dashboard", icon: LayoutDashboard, end: true },
    { path: PATH.dashboardProducts, label: "Products",  icon: Package },
    { path: PATH.dashboardUsers,    label: "Users",     icon: Users },
    { path: PATH.dashboardOrders,   label: "Orders",    icon: ClipboardList },
    ...(role === "superadmin"
      ? [{ path: PATH.dashboardAdmins, label: "Admins", icon: ShieldCheck }]
      : []),
  ];

  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";
  const displayName = user?.email?.split("@")[0] ?? "Admin";
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Admin";

  return (
  <section className="w-full bg-[#B5C2C9] min-h-screen">
      <div className="p-6 flex gap-4 items-start max-w-[1500px] mx-auto">

      {/* ── Sidebar — own floating card ── */}
      <aside className="w-64 shrink-0 bg-white rounded-2xl flex flex-col sticky top-6 min-h-[calc(100vh-48px)]">

        {/* Brand */}
        <div className="px-6 py-5 flex items-center gap-2">
          <span className="font-liter italic text-gray-900 text-xl">Lycoris</span>
          <span className="text-[10px] font-bold bg-[#FF0066] text-white px-1.5 py-0.5 rounded ml-1 tracking-wider">
            BETA
          </span>
        </div>

        {/* Nav */}
        <div className="flex flex-col flex-1 px-3 py-2 gap-0.5">
          <p className="text-[10px] text-gray-400 font-semibold tracking-widest px-3 mb-2 uppercase">
            Main Menu
          </p>
          {navItems.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="px-3 pb-5 flex flex-col gap-2">
          <button
            onClick={() => navigate(PATH.home)}
            className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium py-2.5 rounded-xl cursor-pointer"
          >
            <Store className="w-4 h-4" />
            Go to website
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full bg-[#FF0066] hover:bg-[#e0005a] transition-colors text-white text-sm font-semibold py-2.5 rounded-xl cursor-pointer"
          >
            Log out
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Right side — own floating card ── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Top header card */}
        <header className="bg-white rounded-2xl h-16 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{formattedName}</p>
              <p className="text-xs text-gray-400">{roleLabel}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
              {formattedName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  </section>
  );
};

export default DashboardLayout;
