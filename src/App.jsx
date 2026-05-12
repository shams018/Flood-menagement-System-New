import "./App.css";
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
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">
          <Routes>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.login} element={<AuthPage />} />

            {/* {User Routes} */}
            <Route path={ROUTES.alerts} element={<AlertsFeedPage />} />
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.liveMap} element={<LiveMap />} />
            <Route
              path={ROUTES.ngoCoordination}
              element={<NgoCoordination />}
            />
            <Route
              path={ROUTES.victimRegistration}
              element={<VictimRegistration />}
            />
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
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default App;
