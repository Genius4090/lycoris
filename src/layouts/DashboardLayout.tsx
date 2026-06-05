import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const DashboardLayout = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
  };

  const navItems = [
    { path: PATH.dashboardProducts, label: "Products" },
    { path: PATH.dashboardUsers, label: "Users" },
    { path: PATH.dashboardOrders, label: "Orders" },
    ...(role === "superadmin"
      ? [{ path: PATH.dashboardAdmins, label: "Admins" }]
      : []),
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-black text-white flex flex-col fixed top-0 left-0 h-full z-20">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="font-semibold text-sm">Dashboard</p>
          <p className="text-xs text-white/50 mt-0.5 truncate">{user?.email}</p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-white/10 capitalize">
            {role}
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white text-black font-medium"
                    : "text-white/70 hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
          <NavLink
            to={PATH.home}
            className="px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors"
          >
            ← Back to Store
          </NavLink>
          <button
            onClick={handleSignOut}
            className="px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 text-left transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
