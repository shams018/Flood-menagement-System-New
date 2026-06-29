import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES } from "../../routes";
import SideBar from "./SideBar";
import { Menu, X } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const mainNavItems = ["ALERTS", "MAP"];

  const handleClick = (event, item) => {
    event.preventDefault();
    if (item === "ALERTS") navigate(ROUTES.manageAlerts);
    if (item === "MAP") navigate(ROUTES.adminMap);
  };

  const getItemRoute = (item) => {
    switch (item) {
      case "ALERTS":
        return ROUTES.manageAlerts;
      case "MAP":
        return ROUTES.adminMap;
      default:
        return "#";
    }
  };

  const isActive = (item) => {
    const currentPath = location.pathname;
    const itemRoute = getItemRoute(item);

    // if (item === "ALERTS" && currentPath === ROUTES.adminDashboard) {
    //   return true;
    // }
    return currentPath === itemRoute;
  };

  return (
    <>
      <header className="flex items-center justify-between bg-slate-950 text-white px-4 sm:px-6 md:px-8 lg:px-10 py-3 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-10">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-gray-700 p-2 text-gray-300 hover:bg-white/10 transition md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <button
            className="text-blue-300 text-xl sm:text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
            onClick={() => navigate(ROUTES.adminDashboard)}
          >
            SENTINEL
          </button>

          <nav
            className="hidden sm:flex gap-4 sm:gap-6 md:gap-8 items-center"
            aria-label="Main navigation"
          >
            {mainNavItems.map((item) => (
              <motion.div
                key={item}
                className="relative cursor-pointer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <a
                  href={getItemRoute(item)}
                  className={`transition-colors text-sm sm:text-base ${
                    isActive(item)
                      ? "text-blue-400 pb-1"
                      : "text-gray-300  hover:text-white"
                  }`}
                  onClick={(event) => handleClick(event, item)}
                >
                  {item}
                </a>
                {isActive(item) && (
                  <motion.div
                    className="absolute -bottom-5.25 left-0 w-full h-0.5 bg-blue-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                )}
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:flex bg-slate-900/95 px-2 sm:px-4 py-2 rounded-full border border-gray-800 items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-bold text-gray-300 tracking-wider uppercase">
              System Status: Optimal
            </span>
          </div>

          <button
            className="bg-red-700 hover:bg-red-900 text-white px-3 sm:px-5 py-1 sm:py-2 rounded border border-gray-800 text-xs sm:text-sm font-bold tracking-widest transition-all"
            onClick={() => (window.location.href = "tel:911")}
          >
            EMERGENCY CALL
          </button>
        </div>
      </header>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 h-full w-72 bg-slate-900 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-3xl bg-slate-500 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-200">
                    Admin Menu
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                    Quick access
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-full p-2 text-gray-300 hover:bg-white/10 transition"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
            <SideBar />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
