import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col items-start justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-900/20 px-6 py-20 ml-6">
      <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/40 animate-in slide-in-from-top-4 duration-700">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        SYSTEM STATUS: ACTIVE MONITORING
      </span>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-4xl text-left">
        AI-Powered Flood <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Early Warning
        </span>
        <br />
        &amp; Management.
      </h1>

      <p className="text-lg text-gray-300 mb-12 max-w-2xl leading-relaxed text-left">
        Utilizing predictive neural networks and real-time telemetry to protect
        communities before the storm peaks.
      </p>

      <div className="flex gap-6 flex-wrap">
        <button
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-base shadow-lg hover:shadow-blue-500/50"
          type="button"
          onClick={() => navigate(ROUTES.alerts)}
        >
          View Live Alerts
        </button>
        <button
          className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold uppercase tracking-wider rounded-lg border border-slate-600 transition-all duration-200 text-base"
          type="button"
          onClick={() => navigate(ROUTES.victimRegistration)}
        >
          Register as Victim
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
