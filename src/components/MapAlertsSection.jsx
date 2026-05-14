import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/config";
import { ROUTES } from "../routes";

const MapMarker = ({ lat, lng, text }) => (
  <div
    style={{
      position: "absolute",
      transform: "translate(-50%, -50%)",
      fontSize: "20px",
      color: "#ef4444",
      fontWeight: "bold",
      textShadow: "0 0 8px rgba(0, 0, 0, 0.8)",
    }}
  >
    📍
  </div>
);

function MapAlertsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 31.5204, lng: 74.3587 });
  const [zoomLevel, setZoomLevel] = useState(6);

  const navigate = useNavigate();

  const mapSrc = useMemo(() => {
    const delta = Math.max(0.12, 0.7 - zoomLevel * 0.04);
    const left = mapCenter.lng - delta;
    const right = mapCenter.lng + delta;
    const top = mapCenter.lat + delta;
    const bottom = mapCenter.lat - delta;
    const url = new URL("https://www.openstreetmap.org/export/embed.html");
    url.searchParams.set("bbox", `${left},${bottom},${right},${top}`);
    url.searchParams.set("layer", "mapnik");
    url.searchParams.set("marker", `${mapCenter.lat},${mapCenter.lng}`);
    return url.toString();
  }, [mapCenter, zoomLevel]);

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
    <section className="flex flex-col lg:flex-row items-stretch gap-6 py-8 px-6 bg-slate-900">
      {/* MAP SECTION */}
      <article className="flex-1 bg-slate-800 rounded-lg p-6 border border-slate-700 relative min-h-[32rem] lg:min-h-[36rem] overflow-hidden flex flex-col">
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3 bg-slate-700/80 backdrop-blur rounded-lg p-4 w-fit">
          <span className="text-2xl font-bold text-blue-400">o</span>
          <div className="flex flex-col">
            <small className="text-xs text-gray-400 uppercase tracking-widest">
              FLOOD MONITORING ZONE
            </small>
            <strong className="text-white text-sm">Pakistan Sector</strong>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 18))}
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 2))}
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            −
          </button>
        </div>

        <div className="relative flex-1 mt-4 overflow-hidden rounded-xl border border-slate-700">
          <iframe
            title="Flood monitoring live map"
            src={mapSrc}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, minHeight: "100%" }}
          />
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/70 px-3 py-2 rounded-lg text-xs text-white">
            {items.length > 0
              ? `${items.length} automated alerts shown`
              : "Live flood monitoring map"}
          </div>
        </div>
      </article>

      {/* ALERT SECTION */}
      <aside className="w-full lg:w-80 bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col min-h-[32rem] lg:min-h-[36rem]">
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
