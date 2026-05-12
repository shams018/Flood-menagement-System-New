import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function AlertsFeedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <section className="bg-slate-800/50 border-b border-slate-700 px-8 py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-4">
              REAL-TIME SITUATIONAL AWARENESS
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
              <span className="text-white">Active Flood</span>{" "}
              <span className="text-cyan-400">Intelligence.</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Sentinel Protocol processes thousands of hydrological data points
              per second to deliver verified emergency broadcasts before the
              surge hits.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-xs rounded transition-colors"
              type="button"
            >
              EMERGENCY CALL
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.login)}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs rounded transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      <section className="px-8 py-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="col-span-2">
            <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-4">
              ALERT OVERVIEW
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Review live alerts, region filters, and urgent action channels.
              Use the dashboard to track flood zones and response readiness in
              real time.
            </p>
          </div>
          <aside className="bg-slate-700 rounded-lg p-6 border border-slate-600 flex flex-col justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">
                GLOBAL ALERT STATUS
              </p>
              <p className="flex items-center gap-2 text-white font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                14 High-Risk Zones
              </p>
            </div>
            <button
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs rounded transition-colors"
              type="button"
            >
              Subscribe to Alerts
            </button>
          </aside>
        </div>

        <div className="flex items-center justify-between bg-slate-900/50 px-6 py-4 rounded border border-slate-700">
          <div className="flex items-center gap-4">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
              aria-hidden
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              FILTERS
            </span>
            <select
              className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs rounded hover:bg-slate-700 transition-colors"
              aria-label="Region"
            >
              <option>REGION: ALL GLOBAL</option>
            </select>
            <select
              className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs rounded hover:bg-slate-700 transition-colors"
              aria-label="Severity"
            >
              <option>SEVERITY: ALL</option>
            </select>
            <select
              className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs rounded hover:bg-slate-700 transition-colors"
              aria-label="Date sort"
            >
              <option>DATE: RECENT FIRST</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              LIVE STREAM:
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>
        </div>
      </section>

      <section
        className="flex-1 px-8 py-8 space-y-6"
        aria-label="Live incident reports"
      >
        <article className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 relative flex items-start justify-between p-6">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded">
              EMERGENCY
            </span>
            <span className="px-3 py-1 bg-slate-900/80 text-orange-400 text-xs font-bold uppercase rounded">
              IMPACT IN: 04 MINUTES
            </span>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Sudden Surge: Lower Manhattan Zone 4
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Lower Manhattan, NY · 12:42 PM EST
            </p>
            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-4">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                AI SUMMARY
              </span>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                Rapid water-level rise detected upstream. Models indicate breach
                risk at seawall nodes LM-12 to LM-15 within the next hour.
                Evacuation corridors Alpha and Bravo remain open.
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <span className="text-xs text-gray-400 font-semibold">
                  WIND 28 KTS
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  RISE +0.4M / 15 MIN
                </span>
              </div>
              <a className="text-blue-400 hover:text-blue-300 text-sm font-semibold uppercase">
                Full Incident Log <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </article>

        <article className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-green-600/20 to-emerald-600/20 relative flex items-start justify-start p-6">
            <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-bold uppercase rounded">
              WARNING
            </span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-2">
              Thames Estuary Watch
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Elevated tidal coupling combined with upstream discharge may
              exceed advisory thresholds near barrier gates T3-T5.
            </p>
            <div className="flex justify-between items-center">
              <time className="text-xs text-gray-500 uppercase">
                2 HOURS AGO
              </time>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 text-sm font-bold uppercase"
              >
                Read More
              </button>
            </div>
          </div>
        </article>

        <article className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase rounded">
              WATCH
            </span>
            <span className="text-2xl text-gray-400">◷</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Rhine Valley Pre-Alert
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Long-range precipitation models suggest sustained saturation along
            the middle Rhine basin through Thursday.
          </p>
          <div className="flex justify-between items-center">
            <time className="text-xs text-gray-500 uppercase">
              10 HOURS AGO
            </time>
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 text-sm font-bold uppercase"
            >
              Read More
            </button>
          </div>
        </article>

        <article className="bg-slate-800 rounded-lg border border-red-600/50 overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-red-600/20 to-orange-600/20" />
          <div className="p-6">
            <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-2">
              HIGH PRIORITY EMERGENCY
            </p>
            <h2 className="text-2xl font-bold text-white mb-4">
              Coastal Breach: Mumbai North Coastal Sector
            </h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Storm surge modeling shows overlapping king tide and cyclonic
              fetch. Municipal seawall monitoring stations report structural
              stress above rated tolerance. Shelter capacity and evacuation
              routes are being updated in real time.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs rounded transition-colors"
              >
                View Evacuation Map
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold uppercase text-xs rounded border border-slate-600 transition-colors"
              >
                Alert Details
              </button>
            </div>
          </div>
        </article>
      </section>

      <div className="border-t border-slate-700 py-8 px-8 flex flex-col items-center gap-6">
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-blue-500" />
        </div>
        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
          VIEWING 12 OF 84 LIVE REPORTS
        </p>
        <button
          type="button"
          className="px-6 py-3 border-2 border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white font-bold uppercase text-sm rounded transition-colors"
        >
          Load Historical Logs
          <span className="ml-2" aria-hidden>
            ⌄
          </span>
        </button>
      </div>
    </div>
  );
}

export default AlertsFeedPage;
