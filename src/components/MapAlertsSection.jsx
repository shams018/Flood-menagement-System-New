const recentAlerts = [
  {
    level: "DANGER - LEVEL 5",
    time: "12:45 PM",
    title: "Coastal Breach Forecast: Sector 7",
    text: "Neural model predicts 85% probability of overflow within 4 hours. Immediate evacuation of lower banks recommended.",
    footer: "92% AI CONFIDENCE",
    critical: true,
  },
  {
    level: "WATCH - LEVEL 2",
    time: "11:20 AM",
    title: "Upstream Flow Increase",
    text: "Gage sensor #442 reporting steady rise. Monitor drainage systems in residential zone Delta.",
    footer: "TELEMETRY VALIDATED",
  },
  {
    level: "WATCH - LEVEL 3",
    time: "08:15 AM",
    title: "Rainfall Threshold Warning",
    text: "Accumulated rainfall has exceeded 50mm in 24 hours. Soil saturation levels at critical capacity.",
  },
];

function MapAlertsSection() {
  return (
    <section className="flex gap-6 py-8 px-6 bg-slate-900">
      <article className="flex-1 bg-slate-800 rounded-lg p-6 border border-slate-700 relative">
        <div className="flex items-center gap-3 bg-slate-700 rounded-lg p-4 w-fit">
          <span className="text-2xl font-bold text-blue-400">o</span>
          <div className="flex flex-col">
            <small className="text-xs text-gray-400 uppercase tracking-widest">
              COORDINATION CENTER
            </small>
            <strong className="text-white text-sm">Zone Alpha-9</strong>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <button
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
            type="button"
          >
            +
          </button>
          <button
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
            type="button"
          >
            −
          </button>
        </div>
      </article>

      <aside className="w-80 bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            RECENT ALERTS
          </h3>
          <button
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
            type="button"
          >
            LIVE FEED
          </button>
        </header>

        <div className="flex flex-col gap-4 flex-1">
          {recentAlerts.map((alert) => (
            <article
              key={alert.title}
              className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wide ${alert.critical ? "text-red-400" : "text-yellow-400"}`}
                >
                  {alert.level}
                </span>
                <time className="text-xs text-gray-400">{alert.time}</time>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {alert.title}
              </h4>
              <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                {alert.text}
              </p>
              {alert.footer && (
                <small className="text-xs text-gray-400">{alert.footer}</small>
              )}
            </article>
          ))}
        </div>

        <button
          className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold uppercase tracking-wide rounded transition-colors"
          type="button"
        >
          VIEW ALL ARCHIVES
        </button>
      </aside>
    </section>
  );
}

export default MapAlertsSection;
