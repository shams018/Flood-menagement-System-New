import { useEffect, useState } from "react";
import { API_BASE } from "../lib/config";

export default function NotificationAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/analytics/summary`);
        if (!res.ok) throw new Error("Failed to load analytics");
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Error fetching analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => (cancelled = true);
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-slate-400">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  const {
    totalVictims = 0,
    rescueTeams = 0,
    sheltersActive = 0,
    activeAlerts = 0,
    notifications = 0,
  } = stats || {};

  return (
    <div className="p-4">
      <h3 className="text-sm uppercase tracking-[0.35em] text-amber-300">
        Analytics
      </h3>
      <p className="mt-2 text-xs text-slate-300">
        Live operational overview — notification themed
      </p>

      <div className="mt-4 grid gap-3">
        <div className="rounded-lg bg-slate-900/60 border border-white/6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">Victims Registered</p>
              <p className="text-xl font-semibold text-white">
                {totalVictims.toLocaleString()}
              </p>
            </div>
            <div className="text-xs text-slate-400">Trend</div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-blue-400"
              style={{
                width: `${Math.min(100, (totalVictims / Math.max(1, totalVictims + 100)) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/60 border border-white/6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">Active Rescue Teams</p>
              <p className="text-xl font-semibold text-white">
                {rescueTeams.toLocaleString()}
              </p>
            </div>
            <div className="text-xs text-slate-400">Coverage</div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-emerald-400"
              style={{ width: `${Math.min(100, rescueTeams * 10)}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/60 border border-white/6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">Shelters Open</p>
              <p className="text-xl font-semibold text-white">
                {sheltersActive.toLocaleString()}
              </p>
            </div>
            <div className="text-xs text-slate-400">Capacity</div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-amber-400"
              style={{ width: `${Math.min(100, sheltersActive * 8)}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/60 border border-white/6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">Active Alerts</p>
              <p className="text-xl font-semibold text-red-400">
                {activeAlerts.toLocaleString()}
              </p>
            </div>
            <div className="text-xs text-slate-400">Severity</div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-red-500"
              style={{ width: `${Math.min(100, activeAlerts * 10)}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/60 border border-white/6 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400">Total Notifications</p>
              <p className="text-lg font-semibold text-white">
                {(notifications || 0).toLocaleString()}
              </p>
            </div>
            <div className="text-xs text-slate-400">All time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
