import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <section className="flex h-screen bg-slate-900 text-white">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            Sentinel - User Dashboard
          </p>
          <h2 className="text-2xl font-bold text-white mb-1">Protocol Alpha</h2>
          <small className="text-xs text-gray-500 uppercase tracking-widest">
            FLOOD MONITORING
          </small>

          <nav className="mt-8 flex flex-col gap-2">
            <button
              className="py-3 px-4 bg-blue-600/20 text-blue-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-blue-600/30 transition-colors"
              type="button"
            >
              DASHBOARD
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-colors"
              type="button"
            >
              LIVE MAP
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-colors"
              type="button"
            >
              VICTIM REPORTS
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-colors"
              type="button"
            >
              NGO COORDINATION
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-700 mt-auto">
          <div className="flex gap-3 mb-6">
            <button
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded text-xs font-semibold uppercase transition-colors"
              type="button"
            >
              SETTINGS
            </button>
            <button
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded text-xs font-semibold uppercase transition-colors"
              type="button"
            >
              SUPPORT
            </button>
          </div>
          <article className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
              STATUS
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              System operational. No active threats in your immediate zone.
            </p>
          </article>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center">
          <button
            type="button"
            className="text-xl font-bold tracking-wider hover:text-blue-400 transition-colors"
            onClick={() => navigate(ROUTES.home)}
          >
            SENTINEL
          </button>
          <nav className="flex gap-8">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors uppercase text-sm font-semibold"
            >
              ALERTS
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors uppercase text-sm font-semibold"
            >
              MAP
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors uppercase text-sm font-semibold"
            >
              CHAT
            </a>
          </nav>
          <div className="text-sm font-semibold text-gray-300">
            Marcus Thorne
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-3 gap-6 auto-rows-max">
            <section className="col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
              <span className="text-xs text-blue-400 uppercase tracking-widest font-bold">
                STANDARD ALERT PROTOCOL
              </span>
              <h1 className="text-3xl font-bold text-white mt-3 mb-4">
                Welcome back, Marcus.
              </h1>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your current region (Sector 7G) is under moderate observation.
                No immediate evacuation required.
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase text-sm rounded transition-colors"
                  type="button"
                >
                  View Daily Brief
                </button>
                <button
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold uppercase text-sm rounded border border-slate-600 transition-colors"
                  type="button"
                >
                  System Logs
                </button>
              </div>
            </section>

            <section className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col justify-between">
              <div>
                <small className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  REAL-TIME WEATHER
                </small>
                <h3 className="text-lg font-bold text-white mt-3 mb-2">
                  Sector 7G: West
                </h3>
                <strong className="text-4xl font-black text-blue-400">
                  24C
                </strong>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Light precipitation expected.
              </p>
            </section>

            <section className="col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">
                Active Alerts
              </h3>
              <div className="space-y-4">
                <article className="bg-slate-900/50 p-4 rounded border border-red-500/30">
                  <small className="text-xs text-red-400 uppercase tracking-widest font-bold">
                    SEVERE RISK
                  </small>
                  <h4 className="text-base font-bold text-white mt-2 mb-1">
                    Downstream Flood Level Warning
                  </h4>
                  <p className="text-gray-400 text-sm">
                    River gauge at Bridge 04 has exceeded 4.5m.
                  </p>
                </article>
                <article className="bg-slate-900/50 p-4 rounded border border-yellow-500/30">
                  <small className="text-xs text-yellow-400 uppercase tracking-widest font-bold">
                    MODERATE WATCH
                  </small>
                  <h4 className="text-base font-bold text-white mt-2 mb-1">
                    Precipitation Spike Forecast
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Incoming heavy storm cell expected to arrive within 2 hours.
                  </p>
                </article>
              </div>
            </section>

            <section className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded transition-colors"
                  type="button"
                >
                  Register as Victim
                </button>
                <button
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded transition-colors"
                  type="button"
                >
                  Nearest Shelter
                </button>
                <button
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded transition-colors"
                  type="button"
                >
                  Open Chat Board
                </button>
              </div>
            </section>

            <section className="col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Nearest Shelter
                </h3>
                <article className="mb-4">
                  <strong className="text-white text-base block">
                    City Hall Safezone
                  </strong>
                  <p className="text-gray-400 text-sm mt-1">1.2 KM</p>
                </article>
              </div>
              <button
                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase text-xs rounded transition-colors w-full"
                type="button"
              >
                GET DIRECTIONS
              </button>
            </section>
          </div>
        </div>
      </main>
    </section>
  );
}

export default DashboardPage;
