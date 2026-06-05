import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATH } from "../constants/paths";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="containers flex justify-center items-center py-20">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={PATH.login} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
