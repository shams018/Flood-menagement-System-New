import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/navBar";
import ProtectedRoute from "./components/ProtectedRoute";
import AlertsFeedPage from "./pages/AlertsFeedPage";
import AuthPage from "./pages/AuthPage";
import ChatDashboard from "./pages/chat";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LiveMap from "./pages/LiveMap";
import NgoCoordination from "./pages/NgoCoordination";
import VictimRegisPage from "./pages/VictemRegisPage";
import FloodPredictPage from "./pages/FloodPredictPage";
import EmergencySos from "./pages/EmergencySos";
import Notification from "./pages/Notification";
import { ROUTES } from "./routes";

function App() {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="flex min-h-screen flex-col">
        {location.pathname !== ROUTES.notifications && <Navbar />}
        <div className="flex-1">
          <Routes>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.login} element={<AuthPage />} />
            <Route path={ROUTES.alerts} element={<AlertsFeedPage />} />
            <Route path={ROUTES.floodCheck} element={<FloodPredictPage />} />
            <Route path={ROUTES.emergencySos} element={<EmergencySos />} />
            <Route
              path={ROUTES.notifications}
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.dashboard}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.liveMap}
              element={
                <ProtectedRoute>
                  <LiveMap />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ngoCoordination}
              element={
                <ProtectedRoute>
                  <NgoCoordination />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.victimRegistration}
              element={<VictimRegisPage />}
            />
            <Route
              path={ROUTES.chat}
              element={
                <ProtectedRoute>
                  <ChatDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default App;
