import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const q = useQuery().get("q") || "";
  const { token } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(q)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setResults(data.results || {});
      })
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [q, token]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-300 p-8">
      <h1 className="text-3xl font-black text-white mb-4">Search Results</h1>
      <p className="text-sm text-gray-400 mb-6">
        Showing results for:{" "}
        <span className="text-white font-semibold">{q}</span>
      </p>

      {loading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {results && (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">Alerts</h2>
            {results.alerts && results.alerts.length ? (
              results.alerts.map((a) => (
                <div key={a.id} className="p-3 bg-slate-800 rounded mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{a.title}</div>
                      <div className="text-sm text-gray-400">{a.excerpt}</div>
                    </div>
                    <button
                      onClick={() => navigate(ROUTES.alerts)}
                      className="text-xs text-blue-400 underline"
                    >
                      View Alerts
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No alerts found</div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">NGOs</h2>
            {results.ngos && results.ngos.length ? (
              results.ngos.map((n) => (
                <div
                  key={n.id}
                  className="p-3 bg-slate-800 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-white">{n.name}</div>
                    <div className="text-sm text-gray-400">{n.location}</div>
                  </div>
                  <button
                    className="text-xs text-blue-400 underline"
                    onClick={() => navigate(ROUTES.ngoCoordination)}
                  >
                    Open
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No NGOs found</div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">
              Victim Registrations
            </h2>
            {results.victims && results.victims.length ? (
              results.victims.map((v) => (
                <div
                  key={v.id}
                  className="p-3 bg-slate-800 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-white">{v.name}</div>
                    <div className="text-sm text-gray-400">{v.location}</div>
                  </div>
                  <button
                    className="text-xs text-blue-400 underline"
                    onClick={() => navigate(ROUTES.victimRegistration)}
                  >
                    Open
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No registrations found</div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">Notifications</h2>
            {results.notifications && results.notifications.length ? (
              results.notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 bg-slate-800 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-white">{n.title}</div>
                    <div className="text-sm text-gray-400">{n.body}</div>
                  </div>
                  <button
                    className="text-xs text-blue-400 underline"
                    onClick={() => navigate(ROUTES.notifications)}
                  >
                    Open
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No notifications found</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
