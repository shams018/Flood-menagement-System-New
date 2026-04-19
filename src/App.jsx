import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import AlertsFeedPage from "./components/AlertsFeedPage";
import DashboardPage from "./components/DashboardPage";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import { ROUTES } from "./routes";

function App() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path={ROUTES.home} element={<LandingPage />} />
          <Route path={ROUTES.login} element={<AuthPage />} />
          <Route path={ROUTES.alerts} element={<AlertsFeedPage />} />
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
        <Footer />
      </div>
    </main>
  );
}

export default App;
