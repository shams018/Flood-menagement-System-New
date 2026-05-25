import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

const navItems = [
  { to: ROUTES.dashboard, label: "DASHBOARD" },
  { to: ROUTES.liveMap, label: "LIVE MAP" },
  { to: ROUTES.alerts, label: "ALERTS" },
  { to: ROUTES.ngoCoordination, label: "NGO COORDINATION" },
];

export default function PageSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex fixed left-0 top-[72px] z-30 w-72 h-[calc(100vh-72px)] bg-slate-900 border-r border-slate-800 flex-col overflow-y-auto shadow-2xl shadow-cyan-500/10">
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-700">
            <p className="text-xs text-cyan-300 uppercase tracking-[0.45em] mb-2 font-semibold">
              Sentinel Navigator
            </p>
            <h2 className="text-2xl font-bold text-white mb-1">
              Flood Control
            </h2>
          </div>

          <div className="p-6 space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex w-full items-center justify-between rounded-full border px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.35em] transition duration-200 ${
                    isActive
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 shadow-lg shadow-cyan-500/10"
                      : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive ? (
                      <span className="h-3.5 w-3.5 rounded-full bg-cyan-300 shadow shadow-cyan-500/30" />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-700">
          <div className="rounded-[28px] border border-slate-700 bg-slate-900/85 p-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 mb-3">
              System Status
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified navigation across every user page.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
