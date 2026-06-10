import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATH } from "../constants/paths";
import type { ReactNode } from "react";

/** Allows superadmin only. */
const SuperAdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-textish text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to={PATH.login} replace />;
  if (role !== "superadmin") {
    return <Navigate to={PATH.dashboard} replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
