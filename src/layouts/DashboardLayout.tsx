import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../constants/paths";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  LayoutDashboard, Package, Users, ClipboardList, ShieldCheck, LogOut, Store,
} from "lucide-react";

const DashboardLayout = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate(PATH.login);
  };

  const navItems = [
    { path: PATH.dashboard,         label: t("dashboard.dashboard"), icon: LayoutDashboard, end: true },
    { path: PATH.dashboardProducts, label: t("dashboard.products"),  icon: Package },
    { path: PATH.dashboardUsers,    label: t("dashboard.users"),     icon: Users },
    { path: PATH.dashboardOrders,   label: t("dashboard.orders"),    icon: ClipboardList },
    ...(role === "superadmin"
      ? [{ path: PATH.dashboardAdmins, label: t("dashboard.admins"), icon: ShieldCheck }]
      : []),
  ];

  const pageTitles: Record<string, string> = {
    [PATH.dashboard]:         t("dashboard.dashboard"),
    [PATH.dashboardProducts]: t("dashboard.products"),
    [PATH.dashboardUsers]:    t("dashboard.users"),
    [PATH.dashboardOrders]:   t("dashboard.orders"),
    [PATH.dashboardAdmins]:   t("dashboard.admins"),
  };

  const pageTitle = pageTitles[location.pathname] ?? t("dashboard.dashboard");
  const displayName = user?.email?.split("@")[0] ?? "Admin";
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Admin";

  return (
    <section className="w-full bg-grayish/10 min-h-screen">
      <div className="p-6 flex gap-4 items-start max-w-[1500px] mx-auto">
        <aside className="w-64 shrink-0  border border-brownish/40 bg-stonish flex flex-col sticky top-6 min-h-[calc(100vh-48px)]">
          <div className="px-6 py-5 flex items-center gap-2 border-b border-brownish/10">
            <span className="font-liter italic text-title text-xl">Lycoris</span>
            <span className="text-[10px] font-sora bg-brownish  px-1.5 py-0.5 ml-1 tracking-wider">BETA</span>
          </div>
          <div className="flex flex-col flex-1 px-3 py-3 gap-0.5">
            <p className="font-sora text-[10px] text-lightish tracking-widest px-3 mb-2 uppercase">{t("dashboard.mainMenu")}</p>
            {navItems.map(({ path, label, icon: Icon, end }) => (
              <NavLink key={path} to={path} end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 transition-colors font-sora text-xs ${isActive ? "bg-brownish/15 text-title" : "text-textish hover:text-title hover:bg-brownish/8"}`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />{label}
              </NavLink>
            ))}
          </div>
          <div className="px-3 pb-5 flex flex-col gap-2 border-t border-brownish/10 pt-3">
            <button onClick={() => navigate(PATH.home)} className="flex items-center justify-center gap-2 w-full border border-brownish/30 text-textish hover:border-brownish/60 hover:text-title font-sora text-xs py-2 px-4 transition-colors cursor-pointer">
              <Store className="w-4 h-4" />{t("dashboard.goToWebsite")}
            </button>
            <button onClick={handleSignOut} className="flex items-center justify-center gap-2 w-full bg-brownish text-grayish font-sora text-xs tracking-wide py-2.5 px-6 hover:bg-brownish/70 transition-colors cursor-pointer">
              {t("dashboard.logOut")}<LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <header className="border-brownish/40 bg-stonish border  h-16 flex items-center justify-between px-8 shrink-0">
            <h1 className="text-title font-liter text-xl">{pageTitle}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-sora text-sm text-title leading-tight">{displayName}</p>
                  <p className="font-sora text-xs text-title">{roleLabel}</p>
                </div>
                <div className="w-9 h-9 bg-brownish/15 border border-brownish/20 flex items-center justify-center text-title font-sora text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1"><Outlet /></main>
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
