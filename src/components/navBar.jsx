import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const baseNavItems = [
  "ALERTS",
  "FLOOD",
  "SOS",
  "NOTIFICATIONS",
  "MAP",
  "CHAT",
  "REGISTER",
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, sessionRestoring, logout } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const emergencyNumber = "1122";

  const accountItem = sessionRestoring
    ? "SESSION"
    : isAuthenticated
      ? "LOGOUT"
      : "LOGIN";

  const navItems = [...baseNavItems, accountItem];

  const handleClick = (event, item) => {
    event.preventDefault();
    if (item === "SESSION") return;

    switch (item) {
      case "LOGIN":
        navigate(ROUTES.login);
        break;
      case "LOGOUT":
        logout();
        navigate(ROUTES.home);
        break;
      case "ALERTS":
        navigate(ROUTES.alerts);
        break;
      case "FLOOD":
        navigate(ROUTES.floodCheck);
        break;
      case "SOS":
        navigate(ROUTES.emergencySos);
        break;
      case "NOTIFICATIONS":
        navigate(ROUTES.notifications);
        break;
      case "MAP":
        navigate(ROUTES.liveMap);
        break;
      case "CHAT":
        navigate(ROUTES.chat);
        break;
      case "REGISTER":
        navigate(ROUTES.victimRegistration);
        break;
      default:
        break;
    }
  };

  const getItemRoute = (item) => {
    switch (item) {
      case "ALERTS":
        return ROUTES.alerts;
      case "FLOOD":
        return ROUTES.floodCheck;
      case "SOS":
        return ROUTES.emergencySos;
      case "NOTIFICATIONS":
        return ROUTES.notifications;
      case "MAP":
        return ROUTES.liveMap;
      case "CHAT":
        return ROUTES.chat;
      case "REGISTER":
        return ROUTES.victimRegistration;
      case "LOGIN":
        return ROUTES.login;
      case "LOGOUT":
        return ROUTES.home;
      case "SESSION":
        return "#";
      default:
        return "#";
    }
  };

  const isActive = (item) => {
    const itemRoute = getItemRoute(item);
    if (item === "SESSION" || item === "LOGOUT") return false;
    return location.pathname === itemRoute;
  };

  const handleEmergencyCall = () => {
    setShowEmergencyModal(true);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(emergencyNumber);
    alert("Emergency number copied to clipboard!");
  };

  return (
    <header className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 border-b border-slate-700">
      <button
        className="text-xl font-bold tracking-wider hover:text-blue-400 transition-colors cursor-pointer"
        type="button"
        onClick={() => navigate(ROUTES.home)}
      >
        SENTINEL
      </button>

      <nav
        className="flex gap-5 md:gap-8 items-center flex-wrap justify-end"
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <a
            key={item}
            href={getItemRoute(item)}
            className={`cursor-pointer transition-colors text-sm md:text-base ${
              item === "SESSION"
                ? "text-gray-500 cursor-default pointer-events-none"
                : isActive(item)
                  ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                  : "text-gray-300 hover:text-white"
            }`}
            aria-current={isActive(item) ? "page" : undefined}
            onClick={(event) => handleClick(event, item)}
          >
            {item === "SESSION" ? "…" : item}
          </a>
        ))}
      </nav>

      <button
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors cursor-pointer shrink-0"
        type="button"
        onClick={handleEmergencyCall}
      >
        EMERGENCY CALL
      </button>

      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border-2 border-red-600 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-black text-red-600 mb-4 uppercase">
              Emergency Services
            </h2>
            <p className="text-gray-300 mb-6">
              Call the emergency number immediately for urgent assistance
            </p>
            <div className="bg-slate-900 p-4 rounded-lg mb-6 border border-red-600/50">
              <p className="text-gray-500 text-sm mb-2">Emergency Number:</p>
              <p className="text-4xl font-black text-red-600 font-mono tracking-wider">
                {emergencyNumber}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
              >
                Copy Number
              </button>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
