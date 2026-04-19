import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

const navItems = ["ALERTS", "MAP", "CHAT", "LOGIN"];

function Navbar() {
  const navigate = useNavigate();

  const handleClick = (event, item) => {
    event.preventDefault();
    if (item === "LOGIN") {
      navigate(ROUTES.login);
    }
    if (item === "ALERTS") {
      navigate(ROUTES.alerts);
    }
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
            href={
              item === "ALERTS"
                ? ROUTES.alerts
                : item === "LOGIN"
                  ? ROUTES.login
                  : "#"
            }
            className={`cursor-pointer transition-colors ${
              index === 0
                ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                : "text-gray-300 hover:text-white"
            }`}
            aria-current={index === 0 ? "page" : undefined}
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
