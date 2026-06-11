import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATH } from "../constants/paths";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className=" flex justify-center w-full h-screen items-center">
        <p className="text-textish text-2xl font-liter">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={PATH.login} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
