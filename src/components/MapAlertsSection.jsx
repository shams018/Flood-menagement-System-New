import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/config";
import { ROUTES } from "../routes";

function MapAlertsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/alerts`);
        const data = await res.json();

        if (cancelled) return;

        const auto = (data.alerts || []).filter(
          (a) => a.kind === "automated_flood",
        );

        setItems(auto.slice(0, 3));
      } catch (error) {
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex gap-6 py-8 px-6 bg-slate-900">
      {/* MAP SECTION */}
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
            type="button"
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            +
          </button>

          <button
            type="button"
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            −
          </button>
        </div>
      </article>

      {/* ALERT SECTION */}
      <aside className="w-80 bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            WEATHER RISK FEED
          </h3>

          <button
            type="button"
            onClick={() => navigate(ROUTES.floodCheck)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
          >
            CHECK PLACE
          </button>
        </header>

        <div className="flex flex-col gap-4 flex-1">
          {loading && (
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Loading Open-Meteo assessments...
            </p>
          )}

          {!loading && items.length === 0 && (
            <p className="text-sm text-gray-400 leading-relaxed">
              No automated weather alerts yet. Run the backend (MongoDB +
              network) or open{" "}
              <button
                type="button"
                onClick={() => navigate(ROUTES.floodCheck)}
                className="text-blue-400 hover:underline"
              >
                Flood risk by location
              </button>{" "}
              to generate one.
            </p>
          )}

          {items.map((alert) => {
            const p = alert.payload;

            const critical =
              p.riskLevel === "CRITICAL" || p.riskLevel === "HIGH";

            return (
              <article
                key={alert.id}
                className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      critical ? "text-red-400" : "text-cyan-400"
                    }`}
                  >
                    {p.riskLevel} · {p.placeName || "Area"}
                  </span>

                  <time className="text-xs text-gray-400">
                    {p.assessedAt
                      ? new Date(p.assessedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </time>
                </div>

                <h4 className="text-sm font-bold text-white mb-2">
                  {p.title || "Flood risk update"}
                </h4>

                <p className="text-xs text-gray-300 mb-3 leading-relaxed line-clamp-4">
                  {p.summary || p.subtitle}
                </p>

                {p.metrics && (
                  <small className="text-xs text-gray-500">
                    ~24h rain: {p.metrics.rain24hMm} mm
                  </small>
                )}
              </article>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.alerts)}
          className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold uppercase tracking-wide rounded transition-colors"
        >
          VIEW ALL ALERTS
        </button>
      </aside>
    </section>
  );
}

export default MapAlertsSection;
