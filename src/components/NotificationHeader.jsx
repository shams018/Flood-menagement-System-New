import { Search, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

export default function NotificationHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-slate-900">
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
        <nav className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
          <a href="#" className="text-white">
            Dashboard
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Analytics
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Assets
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Global Search..."
            className="bg-slate-800/50 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs w-64 focus:outline-none focus:border-white/20 transition-all"
          />
        </div>
        <Bell
          size={18}
          className="text-gray-500 hover:text-white cursor-pointer"
        />
        <Settings
          size={18}
          className="text-gray-500 hover:text-white cursor-pointer"
        />
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
      </div>
    </header>
  );
}
