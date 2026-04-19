import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/trainer/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    const redirectPath =
      user.role === "trainer" ? "/trainer/dashboard" : "/client/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
