import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = ["ALERTS", "MAP", "CHAT"];
  const authItems = ["REGISTER", "LOGIN"];

  const handleClick = (event, item) => {
    event.preventDefault();
    if (item === "LOGIN") navigate(ROUTES.login);
    if (item === "ALERTS") navigate(ROUTES.adminDashboard);
    if (item === "MAP") navigate(ROUTES.adminMap);
    if (item === "CHAT") navigate(ROUTES.adminChat);
    if (item === "REGISTER") navigate(ROUTES.victimRegistration);
  };

  const getItemRoute = (item) => {
    switch (item) {
      case "ALERTS": return ROUTES.adminDashboard;
      case "MAP": return ROUTES.adminMap;
      case "CHAT": return ROUTES.adminChat;
      case "REGISTER": return ROUTES.victimRegistration;
      case "LOGIN": return ROUTES.login;
      default: return "#";
    }
  };

  const isActive = (item) => {
    const currentPath = location.pathname;
    const itemRoute = getItemRoute(item);

    if (item === "ALERTS" && currentPath === ROUTES.adminDashboard) {
      return true;
    }
    return currentPath === itemRoute;
  };

  return (
    <header className="flex items-center justify-between bg-[#121212] text-white px-6 py-3 border-b border-gray-800 sticky top-0 z-50">

      <div className="flex items-center space-x-10">
        <button
          className="text-blue-300 text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
          onClick={() => navigate(ROUTES.home)}
        >
          SENTINEL
        </button>

        <nav className="flex gap-8 items-center" aria-label="Main navigation">
          {mainNavItems.map((item) => (
            <div key={item} className="relative cursor-pointer">
              <a
                href={getItemRoute(item)}
                className={`transition-colors ${isActive(item)
                  ? "text-blue-400 pb-1"
                  : "text-gray-300  hover:text-white"
                  }`}
                onClick={(event) => handleClick(event, item)}
              >
                {item}
              </a>
              {isActive(item) && (
                <div className="absolute -bottom-5.25 left-0 w-full h-0.5 bg-blue-400"></div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden xl:flex bg-[#1e1e1e] px-4 py-2 rounded-full border border-gray-800 items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-sm font-bold text-gray-300 tracking-wider uppercase">
            System Status: Optimal
          </span>
        </div>

        <div className="flex items-center space-x-4 mr-2">
          {authItems.map((item) => (
            <button
              key={item}
              onClick={() => navigate(getItemRoute(item))}
              className={`text-sm font-bold tracking-widest transition-colors ${isActive(item) ? "text-blue-300" : "text-gray-400 hover:text-white"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="bg-[#1e1e1e] hover:bg-gray-800 text-blue-300 px-5 py-2 rounded border border-gray-800 text-sm font-bold tracking-widest transition-all"
          onClick={() => window.location.href = "tel:911"}
        >
          EMERGENCY CALL
        </button>

        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-gray-800 cursor-pointer hover:border-blue-300 transition-all">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;