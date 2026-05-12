import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";

function ProtectedRoute({ children }) {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-400 flex items-center justify-center text-sm uppercase tracking-widest">
        Loading session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location }} />
    );
  }

  return children;
}

export default ProtectedRoute;
