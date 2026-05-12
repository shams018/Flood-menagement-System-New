import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Grid,
  Map,
  User,
  Users,
  Activity,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { ROUTES } from "../../routes";
import Logo from "../../assets/logo.jpg";
function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeRoute = (route) => location.pathname === route;

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-slate-200 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div>
        <div className="flex flex-row px-6 pt-8 pb-4 border-b border-slate-700">
          <div className=" w-10 h-10 rounded-3xl bg-slate-500 flex items-center justify-center mb-5 shadow-xl">
            <img src={Logo} alt="Logo" />
            {/* <Shield className="text-sky-300" size={26} /> */}
          </div>
          <div className="flex flex-col ml-4">
            <p className="text-xl font-extrabold uppercase tracking-widest text-[#A9C7FF] leading-tight">
              Protocol Alpha
            </p>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mt-3">
              Flood Monitoring
            </span>
          </div>
        </div>

        <nav className="px-4 pt-4 pb-4 space-y-2">
          {[
            { route: ROUTES.adminDashboard, icon: Grid, label: "Dashboard" },
            { route: ROUTES.adminMap, icon: Map, label: "Resource Hub" },
            {
              route: ROUTES.adminResourceManagement,
              icon: Activity,
              label: "Resources",
            },
            {
              route: ROUTES.adminVictimReport,
              icon: User,
              label: "Victim Reports",
            },
            {
              route: ROUTES.ngoAdminLogin,
              icon: Users,
              label: "NGO Coordination"
            },
          ].map((item, index) => (
            <motion.button
              key={item.route}
              type="button"
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeRoute(item.route)
                  ? "bg-slate-900 text-slate-100"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/70"
                }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon
                className={`${activeRoute(item.route) ? "text-sky-300" : "text-slate-400"}`}
                size={18}
              />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </div>

      <div className="px-6 pb-8">
        <motion.button
          type="button"
          onClick={() => navigate(ROUTES.victimRegistration)}
          className="w-full rounded-3xl bg-sky-400 text-slate-950 font-semibold py-3 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Report Incident
        </motion.button>

        {location.pathname === ROUTES.ngoPortal ? (
          <div className="mt-8 p-4 bg-slate-800 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">NGO Admin</p>
                <p className="text-xs text-slate-400">admin@ngo.org</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.adminDashboard)}
              className="w-full flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition"
            >
              <LogOut size={18} className="text-red-400" />
              Logout
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              className="w-full flex items-center gap-3 text-sm text-slate-400 hover:text-slate-100 transition"
            >
              <Settings size={18} className="text-slate-400" />
              Settings
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 text-sm text-slate-400 hover:text-slate-100 transition"
            >
              <HelpCircle size={18} className="text-slate-400" />
              Support
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default SideBar;
