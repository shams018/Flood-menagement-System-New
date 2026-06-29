import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/heroimage.png"
          alt="Flood monitoring dashboard and emergency response visualization"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center px-6 py-16 md:py-20 lg:px-16">
        <div className="max-w-3xl sm:max-w-4xl">
          <span className="inline-flex flex-wrap items-center gap-2 px-4 py-2 mb-8 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/40 animate-in slide-in-from-top-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            SYSTEM STATUS: ACTIVE MONITORING
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            AI-Powered Flood <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Early Warning
            </span>
            <br />
            &amp; Management.
          </h1>

          <p className="text-base sm:text-lg text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Utilizing predictive neural networks and real-time telemetry to
            protect communities before the storm peaks.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pb-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.alerts)}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-base shadow-lg hover:shadow-blue-500/50"
            >
              View Live Alerts
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.floodCheck)}
              className="w-full sm:w-auto px-8 py-4 bg-cyan-700 hover:bg-cyan-600 text-white font-bold uppercase tracking-wider rounded-lg border border-cyan-500/50 transition-all duration-200 text-base"
            >
              Flood Risk by Location
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.victimRegistration)}
              className="w-full sm:w-auto px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold uppercase tracking-wider rounded-lg border border-slate-600 transition-all duration-200 text-base"
            >
              Register as Victim
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
