import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

const navItems = ["ALERTS", "MAP", "CHAT", "REGISTER", "LOGIN"];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event, item) => {
    event.preventDefault();
    if (item === "LOGIN") {
      navigate(ROUTES.login);
    }
    if (item === "ALERTS") {
      navigate(ROUTES.alerts);
    }
    if (item === "MAP") {
      navigate(ROUTES.liveMap);
    }
    if (item === "CHAT") {
      navigate(ROUTES.chat);
    }
    if (item === "REGISTER") {
      navigate(ROUTES.victimRegistration);
    }
  };

  const getItemRoute = (item) => {
    switch (item) {
      case "ALERTS":
        return ROUTES.alerts;
      case "MAP":
        return ROUTES.liveMap;
      case "CHAT":
        return ROUTES.chat;
      case "REGISTER":
        return ROUTES.victimRegistration;
      case "LOGIN":
        return ROUTES.login;
      default:
        return "#";
    }
  };

  const isActive = (item) => {
    const itemRoute = getItemRoute(item);
    return location.pathname === itemRoute;
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
      <nav className="flex gap-8 items-center" aria-label="Main navigation">
        {navItems.map((item, index) => (
          <a
            key={item}
            href={getItemRoute(item)}
            className={`cursor-pointer transition-colors ${
              isActive(item)
                ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                : "text-gray-300 hover:text-white"
            }`}
            aria-current={isActive(item) ? "page" : undefined}
            onClick={(event) => handleClick(event, item)}
          >
            {item}
          </a>
        ))}
      </nav>
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
        type="button"
      >
        EMERGENCY CALL
      </button>
    </header>
  );
}

export default Navbar;
