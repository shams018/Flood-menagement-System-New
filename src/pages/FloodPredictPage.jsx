import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Droplets, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
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
    <div className="min-h-screen bg-slate-900 text-white">
      <section className="border-b border-slate-700 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-400 mb-4">
            Live weather · Open-Meteo
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Flood risk for{" "}
            <span className="text-cyan-400">any place</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-2">
            We geocode your search, pull a real 7-day precipitation forecast, and
            apply Sentinel rule thresholds (rainfall &gt; X mm → tiered risk).
            Results also update the live Alerts feed when risk is elevated.
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Not a replacement for official government warnings — use for planning
            and situational awareness only.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <form
          onSubmit={runSearch}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Karachi, London, Houston…"
              className="w-full rounded-xl border border-slate-600 bg-slate-800/80 py-4 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-4 font-bold uppercase tracking-wider text-sm"
          >
            <Search className="w-4 h-4" />
            {loading ? "Analyzing…" : "Check risk"}
          </button>
        </form>

        {error ? (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-800/60 bg-red-950/30 p-4 text-red-200">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        {result ? (
          <article
            className={`rounded-2xl border-2 p-8 shadow-xl ${riskStyles[result.riskLevel] || riskStyles.LOW}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Droplets className="w-7 h-7" />
                  {result.placeLabel}
                </h2>
                <p className="text-sm opacity-80 mt-1">{result.dataSource}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest opacity-70">
                  Risk level
                </p>
                <p className="text-3xl font-black">{result.riskLevel}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl bg-black/20 p-4 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                  Rain (~24h)
                </p>
                <p className="text-2xl font-bold">{result.metrics.rain24hMm} mm</p>
              </div>
              <div className="rounded-xl bg-black/20 p-4 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                  Rain (~48h)
                </p>
                <p className="text-2xl font-bold">{result.metrics.rain48hMm} mm</p>
              </div>
              <div className="rounded-xl bg-black/20 p-4 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                  Peak day (7d)
                </p>
                <p className="text-2xl font-bold">{result.metrics.maxDaily7Mm} mm</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-3">
                Rule factors
              </h3>
              <ul className="space-y-2">
                {result.factors.map((f, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-white/90 leading-relaxed"
                  >
                    <span className="text-cyan-400 shrink-0">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-black/25 p-5 border border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2 text-white">
                {result.hasFloodConcern ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
                Recommendation
              </h3>
              <p className="text-sm leading-relaxed text-white/90">
                {result.recommendation}
              </p>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-6">
              Assessed {new Date(result.assessedAt).toLocaleString()} · Rules{" "}
              {result.rulesVersion}
            </p>
          </article>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={() => navigate(ROUTES.alerts)}
            className="text-sm text-blue-400 hover:text-blue-300 font-semibold uppercase tracking-wider"
          >
            Open alerts feed
          </button>
          <span className="text-gray-600">·</span>
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            className="text-sm text-gray-400 hover:text-white font-semibold uppercase tracking-wider"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloodPredictPage;
