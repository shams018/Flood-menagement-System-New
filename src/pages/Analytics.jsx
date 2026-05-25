import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "../context/AuthContext";

export default function Analytics() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/analytics`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setStats(data || {});
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-300 p-8">
      <button
        className="mb-6 text-sm text-blue-400 underline"
        onClick={() => navigate(ROUTES.dashboard)}
      >
        Back to Dashboard
      </button>
      <h1 className="text-3xl font-black text-white mb-4">Analytics</h1>

      {loading && <div className="text-gray-500">Loading analytics...</div>}

      {stats && (
        <div className="grid grid-cols-2 gap-6 max-w-3xl">
          <div className="p-4 bg-slate-800 rounded">
            <div className="text-sm text-gray-400">Alerts</div>
            <div className="text-3xl font-black text-white">
              {stats.alerts ?? 0}
            </div>
          </div>
          <div className="p-4 bg-slate-800 rounded">
            <div className="text-sm text-gray-400">NGOs</div>
            <div className="text-3xl font-black text-white">
              {stats.ngos ?? 0}
            </div>
          </div>
          <div className="p-4 bg-slate-800 rounded">
            <div className="text-sm text-gray-400">Victim Reports</div>
            <div className="text-3xl font-black text-white">
              {stats.victims ?? 0}
            </div>
          </div>
          <div className="p-4 bg-slate-800 rounded">
            <div className="text-sm text-gray-400">Notifications</div>
            <div className="text-3xl font-black text-white">
              {stats.notifications ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
