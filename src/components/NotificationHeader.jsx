import { Search, Bell, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import { useState } from "react";

const navLinks = [
  { key: "dashboard", label: "Dashboard", route: ROUTES.dashboard },
  { key: "analytics", label: "Analytics", route: ROUTES.analytics },
  { key: "assets", label: "Assets", route: ROUTES.assets },
];

export default function NotificationHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      const q = (query || "").trim();
      if (q.length) {
        navigate(`${ROUTES.search}?q=${encodeURIComponent(q)}`);
      }
    }
  };

  return (
    <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-slate-950/95 backdrop-blur-xl shadow-sm text-slate-100">
      <div className="flex items-center gap-12">
        <button
          type="button"
          onClick={() => navigate(ROUTES.home)}
          className="hover:text-blue-400 transition-colors cursor-pointer"
        >
          <h1 className="text-white font-black tracking-tighter text-xl  uppercase">
            Sentinel
          </h1>
        </button>
        <nav className="hidden md:flex gap-3">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.route;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all ${
                  isActive
                    ? "bg-blue-500/15 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Global Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKey}
            aria-label="Global Search"
            className="bg-slate-900/80 border border-white/10 rounded-2xl py-2 pl-10 pr-4 text-xs w-64 text-slate-100 focus:outline-none focus:border-blue-400/40 transition-all"
          />
        </div>
        <button
          aria-label="Go to notifications"
          onClick={() => navigate(ROUTES.notifications)}
        >
          <Bell
            size={18}
            className="text-gray-500 hover:text-white cursor-pointer"
          />
        </button>
        <button aria-label="Settings" onClick={() => navigate(ROUTES.settings)}>
          <Settings
            size={18}
            className="text-gray-500 hover:text-white cursor-pointer"
          />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
      </div>
    </header>
  );
}
