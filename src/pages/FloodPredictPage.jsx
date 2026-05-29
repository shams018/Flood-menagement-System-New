import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Droplets,
  MapPin,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { API_BASE } from "../lib/config";
import { ROUTES } from "../routes";

const riskStyles = {
  CRITICAL: "border-red-500 bg-red-950/40 text-red-200",
  HIGH: "border-orange-500 bg-orange-950/30 text-orange-100",
  MODERATE: "border-yellow-500 bg-yellow-950/20 text-yellow-100",
  ELEVATED: "border-amber-600 bg-amber-950/20 text-amber-100",
  LOW: "border-green-600 bg-green-950/20 text-green-100",
};

function FloodPredictPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const defaultPlaceImage =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

  const getPlaceImageUrl = (label) => {
    if (!label) return defaultPlaceImage;
    return `https://source.unsplash.com/1200x600/?${encodeURIComponent(
      label,
    )}&sig=${encodeURIComponent(label)}`;
  };

  const placeImageUrl = getPlaceImageUrl(result?.placeLabel || query);

  async function runSearch(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    const q = query.trim();
    if (!q) {
      setError("Enter a city, town, or region.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/flood/assess?q=${encodeURIComponent(q)}`,
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Assessment failed");
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not reach the weather service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/30 mb-10">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-300 mb-4">
              Live weather · Open-Meteo
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
              Flood risk assessment for{" "}
              <span className="text-cyan-300">any location</span>
            </h1>
            <p className="text-slate-300 text-lg leading-8">
              Geocode a region, fetch the latest seven-day precipitation
              forecast, and evaluate flood risk using Sentinel’s tiered hazard
              rules. Designed for situational awareness with a premium dashboard
              look.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
              <form onSubmit={runSearch} className="grid gap-4">
                <label className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Search Flood Risk
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Karachi, London, Houston…"
                    className="w-full h-14 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 pl-14 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg transition hover:opacity-95 disabled:opacity-60"
                >
                  <Search className="h-4 w-4" />
                  {loading ? "Analyzing…" : "Check risk"}
                </button>
              </form>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-800/60 bg-red-950/30 p-4 text-red-200 shadow-lg shadow-red-950/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-300 mt-0.5" />
                  <p className="text-sm leading-relaxed">{error}</p>
                </div>
              </div>
            ) : null}

            {result ? (
              <article className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                      Flood assessment result
                    </p>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                      <Droplets className="h-8 w-8 text-cyan-300" />
                      {result.placeLabel}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                      {result.dataSource}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-4 text-right">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Risk level
                    </p>
                    <p className="text-4xl font-black text-white">
                      {result.riskLevel}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mb-8">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-3">
                      Rain (24h)
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {result.metrics.rain24hMm} mm
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-3">
                      Rain (48h)
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {result.metrics.rain48hMm} mm
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-3">
                      Peak day
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {result.metrics.maxDaily7Mm} mm
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 mb-8">
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400 mb-3">
                      Rule factors
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-100">
                      {result.factors.map((factor, idx) => (
                        <li key={idx} className="flex gap-3 leading-relaxed">
                          <span className="mt-1 text-cyan-300">▸</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400 mb-3 flex items-center gap-2">
                      {result.hasFloodConcern ? (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      )}
                      Recommendation
                    </h3>
                    <p className="text-sm text-slate-100 leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>

                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                  Assessed {new Date(result.assessedAt).toLocaleString()} ·
                  Rules {result.rulesVersion}
                </p>
                <div className="mt-8 rounded-3xl overflow-hidden border border-white/10 bg-slate-800">
                  <img
                    src={placeImageUrl}
                    alt={
                      result.placeLabel
                        ? `${result.placeLabel} overview`
                        : "Place overview"
                    }
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultPlaceImage;
                    }}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        {
                          pathname: ROUTES.alerts,
                          search: `?place=${encodeURIComponent(
                            result.placeLabel || query,
                          )}`,
                        },
                        {
                          state: {
                            placeLabel: result.placeLabel || query,
                            placeImageUrl: getPlaceImageUrl(
                              result.placeLabel || query,
                            ),
                          },
                        },
                      )
                    }
                    className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-bold text-cyan-200 hover:bg-cyan-500/15 transition"
                  >
                    See alert details for {result.placeLabel}
                  </button>
                </div>
              </article>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-300 mb-4">
                  Ready to assess
                </p>
                <h2 className="text-3xl font-black text-white mb-4">
                  Search a location to reveal flood risk and preparedness
                  guidance.
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: "Fast insight",
                      value: "Live forecast + risk tier",
                    },
                    { label: "Actionable", value: "Prep advice and alerts" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                        {item.label}
                      </p>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
              <h3 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">
                Flood risk legend
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Critical", badge: "bg-red-500/10 text-red-300" },
                  { label: "High", badge: "bg-orange-500/10 text-orange-300" },
                  {
                    label: "Moderate",
                    badge: "bg-yellow-500/10 text-yellow-300",
                  },
                  {
                    label: "Elevated",
                    badge: "bg-amber-500/10 text-amber-300",
                  },
                  { label: "Low", badge: "bg-emerald-500/10 text-emerald-300" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-4"
                  >
                    <span className="text-sm text-slate-100">{item.label}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${item.badge}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
              <h3 className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">
                Please note
              </h3>
              <ul className="space-y-3 text-sm text-slate-200 leading-relaxed">
                <li>
                  • Use this assessment for awareness, not as a formal warning.
                </li>
                <li>• Combine with local alerts and official advisories.</li>
                <li>• Higher rainfall forecasts can change quickly.</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => navigate(ROUTES.alerts)}
            className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-blue-300 hover:bg-blue-500/15 transition"
          >
            Open alerts feed
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-slate-200 hover:bg-white/10 transition"
          >
            Home
          </button>
        </div>
      </div>
    </main>
  );
}

export default FloodPredictPage;
