import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const baseNavItems = [
  "DASHBOARD",
  "ALERTS",
  "FLOOD",
  "SOS",
  "NOTIFICATIONS",
  "CHAT",
  "REGISTER",
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, sessionRestoring, logout } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      case "DASHBOARD":
        navigate(ROUTES.dashboard);
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
      case "DASHBOARD":
        return ROUTES.dashboard;
      case "ALERTS":
        return ROUTES.alerts;
      case "FLOOD":
        return ROUTES.floodCheck;
      case "SOS":
        return ROUTES.emergencySos;
      case "NOTIFICATIONS":
        return ROUTES.notifications;
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
    <header className="bg-slate-900 text-white border-b border-slate-700 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo */}
        <button
          className="text-lg sm:text-xl font-bold tracking-wider hover:text-blue-400 transition-colors cursor-pointer shrink-0"
          type="button"
          onClick={() => {
            navigate(ROUTES.home);
            setMobileMenuOpen(false);
          }}
        >
          SENTINEL
        </button>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex gap-6 items-center"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={getItemRoute(item)}
              className={`cursor-pointer transition-colors text-sm font-medium ${
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

        {/* Desktop Emergency Button */}
        <button
          className="hidden lg:inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded transition-colors cursor-pointer text-sm"
          type="button"
          onClick={handleEmergencyCall}
        >
          EMERGENCY
        </button>

        {/* Mobile Menu Button + Emergency */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-2 rounded transition-colors cursor-pointer text-xs sm:text-sm"
            type="button"
            onClick={handleEmergencyCall}
          >
            SOS
          </button>
          <button
            className="p-2 hover:bg-slate-800 rounded transition-colors"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-2"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={getItemRoute(item)}
              className={`block px-4 py-3 rounded cursor-pointer transition-colors text-sm font-medium ${
                item === "SESSION"
                  ? "text-gray-500 cursor-default pointer-events-none bg-transparent"
                  : isActive(item)
                    ? "text-blue-400 bg-slate-700"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`}
              aria-current={isActive(item) ? "page" : undefined}
              onClick={(event) => {
                handleClick(event, item);
                setMobileMenuOpen(false);
              }}
            >
              {item === "SESSION" ? "…" : item}
            </a>
          ))}
        </nav>
      )}

      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border-2 border-red-600 rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
            <h2 className="text-xl sm:text-2xl font-black text-red-600 mb-4 uppercase">
              Emergency Services
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Call the emergency number immediately for urgent assistance
            </p>
            <div className="bg-slate-900 p-4 rounded-lg mb-6 border border-red-600/50">
              <p className="text-gray-500 text-xs sm:text-sm mb-2">
                Emergency Number:
              </p>
              <p className="text-3xl sm:text-4xl font-black text-red-600 font-mono tracking-wider">
                {emergencyNumber}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors text-sm sm:text-base"
              >
                Copy Number
              </button>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded transition-colors text-sm sm:text-base"
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
