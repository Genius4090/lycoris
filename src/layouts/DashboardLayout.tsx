import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, Package, Users, ClipboardList, ShieldCheck, LogOut, Store } from "lucide-react";

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
    { path: PATH.dashboardProducts, label: "Products", icon: Package },
    { path: PATH.dashboardUsers,    label: "Users",    icon: Users },
    { path: PATH.dashboardOrders,   label: "Orders",   icon: ClipboardList },
    ...(role === "superadmin"
      ? [{ path: PATH.dashboardAdmins, label: "Admins", icon: ShieldCheck }]
      : []),
  ];

  const roleMeta: Record<string, string> = {
    user: "bg-brownish/30 text-title",
    admin: "bg-blue-100 text-blue-700",
    superadmin: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3EC]">

      {/* ── Sidebar ── */}
      <aside className="w-60 flex flex-col fixed top-0 left-0 h-full z-20 border-r border-brownish bg-[#F8F3EC]">

        {/* Brand */}
        <div className="px-6 py-6 border-b border-brownish">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-4 h-4 text-textish" />
            <p className="font-liter text-title text-sm tracking-wide">Dashboard</p>
          </div>
          <p className="font-liter italic text-title text-xs truncate">{user?.email}</p>
          <span className={`inline-block mt-2 text-xs px-2.5 py-0.5 font-liter capitalize ${roleMeta[role ?? "user"] ?? roleMeta.user}`}>
            {role}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-liter transition-colors ${
                  isActive
                    ? "bg-brownish text-title"
                    : "text-textish hover:bg-brownish/30"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t border-brownish flex flex-col gap-0.5">
          <NavLink
            to={PATH.home}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-liter text-textish hover:bg-brownish/30 transition-colors"
          >
            <Store className="w-4 h-4 shrink-0" />
            Back to Store
          </NavLink>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-liter text-textish hover:bg-brownish/30 transition-colors text-left cursor-pointer w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="ml-60 flex-1 p-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
