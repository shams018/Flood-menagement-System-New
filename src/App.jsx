import "./App.css";
<<<<<<< HEAD
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import AlertsFeedPage from "./components/AlertsFeedPage";

import Footer from "./components/Footer";
import Navbar from "./components/navBar";
import LandingPage from "./pages/UserLanding";
import LiveMap from "./components/LiveMap";
import NgoCoordination from "./components/NgoCoordination";
import VictimRegistration from "./components/VictimRegisPage";
import ChatDashboard from "./components/chat";
import DashboardPage from "./components/DashboardPage";
=======
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
>>>>>>> upstream/main
import { ROUTES } from "./routes";

import AdminMap from "./components/Admin/AdminMap";
import ResourceManagement from "./components/Admin/ResourceManagement";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminVictimReport from "./components/Admin/AdminVictimReport";
import AdminChat from "./components/Admin/AdminChart";
import NGOPortal from "./components/Admin/NGOPortal";
import NGOAdminLogin from "./components/Admin/NGOAdminLogin";
import ManageAlerts from "./components/Admin/ManageAlerts";

function App() {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="flex min-h-screen flex-col">
<<<<<<< HEAD
=======
        {location.pathname !== ROUTES.notifications && <Navbar />}
>>>>>>> upstream/main
        <div className="flex-1">
          <Routes>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.login} element={<AuthPage />} />

            {/* {User Routes} */}
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
              element={<VictimRegistration />}
            />
<<<<<<< HEAD
            <Route path={ROUTES.chat} element={<ChatDashboard />} />

            {/* ADMIN ROUTES */}

            <Route path={ROUTES.adminDashboard} element={<AdminDashboard />} />
            <Route path={ROUTES.adminMap} element={<AdminMap />} />
            <Route path={ROUTES.adminResourceManagement} element={<ResourceManagement />} />
            <Route path={ROUTES.adminVictimReport} element={<AdminVictimReport />} />
            <Route path={ROUTES.adminChat} element={<AdminChat />} />
            <Route path={ROUTES.ngoPortal} element={<NGOPortal />} />
            <Route path={ROUTES.ngoAdminLogin} element={<NGOAdminLogin />} />
            <Route path={ROUTES.manageAlerts} element={<ManageAlerts />} />

            {/* Catch-all route to redirect to home */}
=======
            <Route
              path={ROUTES.chat}
              element={
                <ProtectedRoute>
                  <ChatDashboard />
                </ProtectedRoute>
              }
            />
>>>>>>> upstream/main
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default App;
