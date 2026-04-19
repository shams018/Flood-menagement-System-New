import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import AlertsFeedPage from "./components/AlertsFeedPage";
import DashboardPage from "./components/DashboardPage";
import Footer from "./components/Footer";
import Navbar from "./components/navBar";
import LandingPage from "./pages/LandingPage";
import LiveMap from "./components/LiveMap";
import NgoCoordination from "./components/NgoCoordination";
import VictimRegisPage from "./components/VictemRegisPage";
import ChatDashboard from "./components/chat";
import { ROUTES } from "./routes";

function App() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path={ROUTES.home} element={<LandingPage />} />
            <Route path={ROUTES.login} element={<AuthPage />} />
            <Route path={ROUTES.alerts} element={<AlertsFeedPage />} />
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.liveMap} element={<LiveMap />} />
            <Route
              path={ROUTES.ngoCoordination}
              element={<NgoCoordination />}
            />
            <Route
              path={ROUTES.victimRegistration}
              element={<VictimRegisPage />}
            />
            <Route path={ROUTES.chat} element={<ChatDashboard />} />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default App;
