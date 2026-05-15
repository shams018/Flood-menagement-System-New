import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { ROUTES } from "../routes";
import {
  MapPin,
  AlertCircle,
  Cloud,
  Users,
  Home,
  Phone,
  ChevronRight,
} from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [resources, setResources] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [alertsRes, resourcesRes, floodRes] = await Promise.all([
          apiFetch("/api/alerts"),
          apiFetch("/api/map/resources"),
          apiFetch("/api/flood/assess"),
        ]);

        const alertsData = await alertsRes.json().catch(() => ({ alerts: [] }));
        const resourcesData = await resourcesRes
          .json()
          .catch(() => ({ resources: [] }));
        const floodData = await floodRes.json().catch(() => ({}));

        if (!cancelled) {
          // Map alerts to have title and description from payload
          const mappedAlerts = (alertsData.alerts || [])
            .map((alert) => ({
              _id: alert.id,
              priority: alert.payload?.priority || 50,
              title: alert.payload?.title || "Alert",
              description:
                alert.payload?.summary ||
                alert.payload?.subtitle ||
                "Alert notification",
            }))
            .slice(0, 5);

          // Map resources to have simplified structure
          const mappedResources = (resourcesData.resources || [])
            .map((resource) => ({
              _id: resource.id,
              name: resource.name,
              distance: resource.distance_label || "1.5",
              capacity: resource.capacity_text || "Available",
            }))
            .slice(0, 3);

          setAlerts(mappedAlerts);
          setResources(mappedResources);
          setWeatherData(floodData.weather || {});
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const getFirstName = () => {
    if (user?.full_name) {
      return user.full_name.split(" ")[0];
    }
    return user?.email?.split("@")[0] || "User";
  };

  const getSectorFromLocation = () => {
    return "Sector 7G";
  };

  const getAlertColor = (priority) => {
    if (priority >= 80) return "red";
    if (priority >= 50) return "yellow";
    return "green";
  };

  const getAlertLabel = (priority) => {
    if (priority >= 80) return "SEVERE";
    if (priority >= 50) return "MODERATE";
    return "LOW RISK";
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <p className="text-xs text-cyan-400 uppercase tracking-widest mb-2 font-semibold">
            Sentinel Protocol
          </p>
          <h2 className="text-2xl font-bold text-white mb-1">Dashboard</h2>
          <small className="text-xs text-gray-500 uppercase tracking-widest">
            Real-Time Monitoring
          </small>

          <nav className="mt-8 flex flex-col gap-2">
            <button
              className="py-3 px-4 bg-cyan-600/30 text-cyan-400 rounded-lg font-semibold uppercase text-sm tracking-wide text-left hover:bg-cyan-600/40 transition-all duration-200 border border-cyan-500/20"
              type="button"
            >
              DASHBOARD
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded-lg font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-all duration-200"
              type="button"
              onClick={() => navigate(ROUTES.liveMap)}
            >
              LIVE MAP
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded-lg font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-all duration-200"
              type="button"
              onClick={() => navigate(ROUTES.alerts)}
            >
              ALERTS
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded-lg font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-all duration-200"
              type="button"
              onClick={() => navigate(ROUTES.ngoCoordination)}
            >
              NGO COORDINATION
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-700 mt-auto space-y-4">
          <button
            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs font-semibold uppercase transition-all duration-200"
            type="button"
            onClick={() => navigate(ROUTES.chat)}
          >
            CHAT SUPPORT
          </button>
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              System Status
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {alerts.length > 0
                ? `${alerts.length} active alert${alerts.length > 1 ? "s" : ""}`
                : "All systems operational"}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6 auto-rows-max animate-fadeIn">
            {/* Welcome Section */}
            <section className="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300">
              <span className="text-xs text-cyan-400 uppercase tracking-widest font-bold">
                Welcome
              </span>
              <h1 className="text-4xl font-bold text-white mt-4 mb-4">
                Welcome back, {getFirstName()}.
              </h1>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your current region ({getSectorFromLocation()}) is being
                monitored in real-time.
                {alerts.length > 0
                  ? ` There are ${alerts.length} active alert(s) to review.`
                  : " No immediate threats detected."}
              </p>
              <div className="flex gap-3">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold uppercase text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  type="button"
                  onClick={() => navigate(ROUTES.alerts)}
                >
                  View All Alerts
                </button>
                <button
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold uppercase text-sm rounded-lg border border-slate-600 transition-all duration-200"
                  type="button"
                  onClick={() => navigate(ROUTES.floodCheck)}
                >
                  Check Flood Risk
                </button>
              </div>
            </section>

            {/* Weather Card */}
            <section
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between mb-4">
                <small className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Weather
                </small>
                <Cloud className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Current Conditions
              </h3>
              <strong className="text-4xl font-black text-cyan-400">
                {weatherData?.temp || "24"}°C
              </strong>
              <p className="text-gray-400 text-sm mt-4">
                {weatherData?.description || "Light precipitation expected"}
              </p>
            </section>

            {/* Active Alerts */}
            <section className="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Active Alerts
                </h3>
                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                  {alerts.length} Alert{alerts.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4 text-gray-400">
                    Loading alerts...
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    No active alerts
                  </div>
                ) : (
                  alerts.map((alert, idx) => {
                    const alertColor = getAlertColor(alert.priority || 50);
                    const alertLabel = getAlertLabel(alert.priority || 50);
                    return (
                      <div
                        key={alert._id || idx}
                        className={`bg-slate-900/50 p-4 rounded-lg border border-${alertColor}-500/30 hover:border-${alertColor}-500/50 transition-all duration-200 transform hover:scale-102 cursor-pointer`}
                        onClick={() => navigate(ROUTES.alerts)}
                      >
                        <small
                          className={`text-xs ${alertColor === "red" ? "text-red-400" : alertColor === "yellow" ? "text-yellow-400" : "text-green-400"} uppercase tracking-widest font-bold`}
                        >
                          {alertLabel}
                        </small>
                        <h4 className="text-base font-bold text-white mt-2 mb-1">
                          {alert.title || "Flood Alert"}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {alert.description || "New flood monitoring alert"}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  className="py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-between group"
                  type="button"
                  onClick={() => navigate(ROUTES.victimRegistration)}
                >
                  <span>Register Victim</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-between group"
                  type="button"
                  onClick={() => navigate(ROUTES.liveMap)}
                >
                  <span>Find Shelter</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-between group"
                  type="button"
                  onClick={() => navigate(ROUTES.chat)}
                >
                  <span>Open Chat</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>

            {/* Nearby Shelters */}
            <section className="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-400" />
                  Nearby Shelters
                </h3>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4 text-gray-400">
                    Loading shelters...
                  </div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    No shelters nearby
                  </div>
                ) : (
                  resources.map((shelter, idx) => (
                    <div
                      key={shelter._id || idx}
                      className="bg-slate-900/50 p-4 rounded-lg border border-slate-600 hover:border-green-500/50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-white text-base block">
                            {shelter.name || `Shelter ${idx + 1}`}
                          </strong>
                          <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {shelter.distance || "1.2"} KM away
                          </p>
                        </div>
                        <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                          {shelter.capacity || "Available"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold uppercase text-xs rounded-lg transition-all duration-200 mt-4 transform hover:scale-105"
                type="button"
                onClick={() => navigate(ROUTES.liveMap)}
              >
                View All Shelters
              </button>
            </section>

            {/* Emergency Section */}
            <section className="bg-gradient-to-br from-red-900/50 to-slate-900 rounded-xl p-8 border-2 border-red-500/30 shadow-lg hover:shadow-red-500/20 transition-shadow duration-300">
              <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                In case of immediate danger, call emergency services.
              </p>
              <button
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold uppercase text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                type="button"
                onClick={() => navigate(ROUTES.emergencySos)}
              >
                SOS - GET HELP
              </button>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;
