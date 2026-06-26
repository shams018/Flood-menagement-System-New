import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/navBar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AlertsFeedPage from "./pages/AlertsFeedPage";
import AuthPage from "./pages/AuthPage";
import ChatDashboard from "./pages/chat";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/UserLanding";
import LiveMap from "./pages/LiveMap";
import NgoCoordination from "./pages/NgoCoordination";
import Notification from "./pages/Notification";
import VictimRegisPage from "./pages/VictemRegisPage";
import FloodPredictPage from "./pages/FloodPredictPage";
import EmergencySos from "./pages/EmergencySos";
import Analytics from "./pages/Analytics";
import Assets from "./pages/Assets";
import Settings from "./pages/Settings";
import SearchResults from "./pages/SearchResults";

import { ROUTES } from "./routes";
import AdminMap from "./components/Admin/AdminMap";
import SocialSentimentMonitor from "./components/Admin/SocialSentimentMonitor";
import ResourceManagement from "./components/Admin/ResourceManagement";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminVictimReport from "./components/Admin/AdminVictimReport";
import AdminChat from "./components/Admin/AdminChart";
import NGOPortal from "./components/Admin/NGOPortal";
import NGOAdminLogin from "./components/Admin/NGOAdminLogin";
import ManageAlerts from "./components/Admin/ManageAlerts";
import AiReport from "./components/Admin/AiReport";
import SystemParameters from "./components/Admin/SystemPrameter";

function App() {
  const location = useLocation();

  const isAdminRoute = () => {
    return (
      location.pathname.startsWith("/admin") ||
      [
        ROUTES.adminVictimReport,
        ROUTES.ngoPortal,
        ROUTES.ngoAdminLogin,
        ROUTES.manageAlerts,
      ].includes(location.pathname)
    );
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="flex min-h-screen flex-col">
        {!isAdminRoute() && location.pathname !== ROUTES.notifications && (
          <Navbar />
        )}

        <div className="flex-1">
          <Routes>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.login} element={<AuthPage />} />

            {/* User Routes */}
            <Route path={ROUTES.alerts} element={<AlertsFeedPage />} />
            <Route path={ROUTES.floodCheck} element={<FloodPredictPage />} />
            <Route
              path={ROUTES.emergencySos}
              element={
                <ProtectedRoute>
                  <EmergencySos />
                </ProtectedRoute>
              }
            />
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
              path={ROUTES.analytics}
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.assets}
              element={
                <ProtectedRoute>
                  <Assets />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.settings}
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.search}
              element={
                <ProtectedRoute>
                  <SearchResults />
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
              element={
                <ProtectedRoute>
                  <VictimRegisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.chat}
              element={
                <ProtectedRoute>
                  <ChatDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path={ROUTES.adminDashboard}
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.sentimentMonitor}
              element={
                <AdminRoute>
                  <SocialSentimentMonitor />
                </AdminRoute>
              }
            />

            <Route
              path={ROUTES.airepot}
              element={
                <AdminRoute>
                  <AiReport />
                </AdminRoute>
              }
            />

            <Route
              path={ROUTES.systemParameters}
              element={
                <AdminRoute>
                  <SystemParameters />
                </AdminRoute>
              }
            />

            <Route
              path={ROUTES.adminMap}
              element={
                <AdminRoute>
                  <AdminMap />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.adminResourceManagement}
              element={
                <AdminRoute>
                  <ResourceManagement />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.adminVictimReport}
              element={
                <AdminRoute>
                  <AdminVictimReport />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.adminChat}
              element={
                <AdminRoute>
                  <AdminChat />
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ngoPortal}
              element={
                <AdminRoute>
                  <NGOPortal />
                </AdminRoute>
              }
            />
            <Route path={ROUTES.ngoAdminLogin} element={<NGOAdminLogin />} />
            <Route
              path={ROUTES.manageAlerts}
              element={
                <AdminRoute>
                  <ManageAlerts />
                </AdminRoute>
              }
            />

            {/* Catch-all route to redirect to home */}
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default App;
