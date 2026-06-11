import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATH } from "../constants/paths";
import type { ReactNode } from "react";

/** Allows admin and superadmin. Redirects users to home, guests to login. */
const DashboardRoute = ({ children }: { children: ReactNode }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
        <div className=" flex justify-center w-full h-screen items-center">
        <p className="text-textish text-2xl font-liter">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to={PATH.login} replace />;
  if (role !== "admin" && role !== "superadmin") {
    return <Navigate to={PATH.home} replace />;
  }

  return <>{children}</>;
};

export default DashboardRoute;
