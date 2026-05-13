import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";

function AdminRoute({ children }) {
  const { isAuthenticated, booting, user } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-400 flex items-center justify-center text-sm uppercase tracking-widest">
        Loading session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  if (String(user?.role || "").toLowerCase() !== "admin") {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return children;
}

export default AdminRoute;
