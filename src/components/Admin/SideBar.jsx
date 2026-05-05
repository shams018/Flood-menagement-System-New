import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Grid, Map, User, Users, Settings, HelpCircle } from "lucide-react";
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
          <button
            type="button"
            onClick={() => navigate(ROUTES.adminDashboard)}
            className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeRoute(ROUTES.adminDashboard)
              ? "bg-slate-900 text-slate-100"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/70"
              }`}
          >
            <Grid className={`${activeRoute(ROUTES.adminDashboard) ? "text-sky-300" : "text-slate-400"}`} size={18} />
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTES.adminMap)}
            className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeRoute(ROUTES.adminMap)
              ? "bg-slate-900 text-slate-100"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/70"
              }`}
          >
            <Map className={`${activeRoute(ROUTES.adminMap) ? "text-sky-300" : "text-slate-400"}`} size={18} />
            Resource Hub
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTES.adminVictimReport)}
            className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeRoute(ROUTES.adminVictimReport)
              ? "bg-slate-900 text-slate-100"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/70"
              }`}
          >
            <User className={`${activeRoute(ROUTES.adminVictimReport) ? "text-sky-300" : "text-slate-400"}`} size={18} />
            Victim Reports
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTES.adminNgoCoordination)}
            className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeRoute(ROUTES.adminNgoCoordination)
              ? "bg-slate-900 text-slate-100"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/70"
              }`}
          >
            <Users className={`${activeRoute(ROUTES.adminNgoCoordination) ? "text-sky-300" : "text-slate-400"}`} size={18} />
            NGO Coordination
          </button>
        </nav>
      </div>

      <div className="px-6 pb-8">
        <button
          type="button"
          onClick={() => navigate(ROUTES.victimRegistration)}
          className="w-full rounded-3xl bg-sky-400 text-slate-950 font-semibold py-3 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300"
        >
          Report Incident
        </button>

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
      </div>
    </aside>
  );
}

export default SideBar;
