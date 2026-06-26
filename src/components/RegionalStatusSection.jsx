import { useEffect, useState } from "react";
import { API_BASE } from "../lib/config";

function RegionalStatusSection() {
  const [stats, setStats] = useState({
    totalVictims: 0,
    rescueTeams: 0,
    sheltersActive: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/analytics/summary`);
        if (!response.ok) {
          throw new Error("Unable to load regional status data");
        }

        const data = await response.json();
        if (!cancelled) {
          setStats({
            totalVictims: data.totalVictims ?? 0,
            rescueTeams: data.rescueTeams ?? 0,
            sheltersActive: data.sheltersActive ?? 0,
            activeAlerts: data.activeAlerts ?? 0,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch regional status");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const statsCards = [
    {
      icon: "o",
      value: stats.totalVictims.toLocaleString(),
      label: "REGISTERED VICTIMS",
      highlight: true,
    },
    {
      icon: "+",
      value: stats.rescueTeams.toLocaleString(),
      label: "RESCUE TEAMS ACTIVE",
    },
    {
      icon: "*",
      value: stats.sheltersActive.toLocaleString(),
      label: "SHELTERS AVAILABLE",
    },
    {
      icon: "!",
      value: stats.activeAlerts.toLocaleString(),
      label: "ACTIVE ALERTS",
      alert: true,
    },
  ];

  return (
    <section className="space-y-6 py-8 px-6 bg-slate-950/95">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-blue-400/80">
              Global risk profile
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Regional status
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Current sector monitoring and response readiness with real-time
              counts from the backend.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/15 hover:text-blue-100"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse" />
            Live
          </button>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/15">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Active sectors
              </p>
              <p className="mt-3 text-5xl font-black text-blue-400">
                {stats.activeAlerts}
              </p>
            </div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
              Active alerts being tracked
            </p>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(100, stats.activeAlerts * 8)}%` }}
            />
          </div>
        </div>
      </article>

      {error ? (
        <div className="rounded-[1.75rem] border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-4">
        {statsCards.map((item) => (
          <article
            key={item.label}
            className={`rounded-[1.75rem] border border-white/10 p-5 text-center bg-slate-950/70 shadow-2xl shadow-slate-950/15 transition duration-300 hover:-translate-y-1 hover:border-blue-500 ${
              item.alert
                ? "border-red-500/50 bg-red-500/10 hover:border-red-400"
                : ""
            }`}
          >
            <span className="block text-3xl font-bold text-slate-400 mb-3">
              {item.icon}
            </span>
            <p className="text-3xl font-black text-white">
              {loading ? "..." : item.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RegionalStatusSection;
