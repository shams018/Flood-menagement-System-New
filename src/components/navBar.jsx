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
    <header className="top-nav">
      <button
        className="brand brand-btn"
        type="button"
        onClick={() => navigate(ROUTES.home)}
      >
        SENTINEL
      </button>
      <nav className="nav-links" aria-label="Main navigation">
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
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "page" : undefined}
            onClick={(event) => handleClick(event, item)}
          >
            {item}
          </a>
        ))}
      </nav>
      <button className="emergency-btn" type="button">
        EMERGENCY CALL
      </button>
    </header>
  );
}

export default Navbar;
