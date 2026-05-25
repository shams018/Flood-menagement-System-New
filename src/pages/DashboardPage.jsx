import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { ROUTES } from "../routes";
import {
  MapPin,
  AlertCircle,
  Cloud,
  Home,
  Phone,
  ChevronRight,
} from "lucide-react";
import PageSidebar from "../components/PageSidebar";

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
          const mappedAlerts = (alertsData.alerts || [])
            .map((alert) => ({
              _id: alert.id,
              priority: alert.payload?.priority || 50,
              title: alert.payload?.title || "Flood Alert",
              description:
                alert.payload?.summary ||
                alert.payload?.subtitle ||
                "New flood monitoring alert",
            }))
            .slice(0, 5);

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

  const getSectorFromLocation = () => "Sector 7G";

  const getWeatherLabel = () =>
    weatherData?.description || "Light precipitation expected";

  return (
    <div className="flex min-h-screen bg-slate-950 text-white overflow-hidden lg:pl-72">
      <PageSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            <section className="col-span-12 xl:col-span-8 rounded-[32px] border border-slate-700 bg-slate-900/95 p-8 shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs text-cyan-300 uppercase tracking-[0.35em] font-semibold">
                      Flood Risk Monitor
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
                      Welcome back, {getFirstName()}.
                    </h1>
                    <p className="max-w-2xl text-slate-400 leading-relaxed">
                      Your area ({getSectorFromLocation()}) is monitored in real
                      time. Keep an eye on alerts, shelter access, and your
                      local weather at a glance.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-3 rounded-full bg-slate-800/90 border border-cyan-500/20 px-4 py-3 text-sm text-cyan-200 shadow-lg shadow-cyan-500/5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live updates active
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard
                    title="Active alerts"
                    value={alerts.length}
                    subtitle="Monitored in your region"
                  />
                  <MetricCard
                    title="Nearby shelters"
                    value={resources.length}
                    subtitle="Safe shelters available"
                  />
                  <MetricCard
                    title="Risk status"
                    value={
                      alerts.length === 0
                        ? "Stable"
                        : getAlertLabel(
                            Math.max(
                              ...alerts.map((alert) => alert.priority || 0),
                            ),
                          )
                    }
                    subtitle="Latest flood assessment"
                  />
                </div>

                <div className="rounded-[30px] border border-slate-700 bg-slate-950/90 p-6 shadow-xl shadow-cyan-500/10">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300 font-semibold">
                        Situation brief
                      </p>
                      <h2 className="mt-3 text-2xl font-bold text-white">
                        Monitoring your flood zone
                      </h2>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/90 px-4 py-2 text-sm text-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse" />
                      Hazard feed live
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <StatusCard
                      label="Today's weather"
                      value={`${weatherData?.temp ?? weatherData?.temperature ?? "24"}°C`}
                      detail={getWeatherLabel()}
                    />
                    <StatusCard
                      label="Current sector"
                      value={getSectorFromLocation()}
                      detail="Priority monitoring zone."
                    />
                    <StatusCard
                      label="Response team"
                      value="24/7 Ready"
                      detail="Assistance available anytime."
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="col-span-12 xl:col-span-4 space-y-6">
              <aside className="rounded-[32px] border border-slate-700 bg-slate-900/95 p-6 shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">
                      Current Weather
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {weatherData?.temp ?? weatherData?.temperature ?? "24"}°C
                    </h3>
                  </div>
                  <Cloud className="w-10 h-10 text-cyan-300" />
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  {getWeatherLabel()} in your monitoring area.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <SmallMetric
                    label="Humidity"
                    value={`${weatherData?.humidity ?? "68"}%`}
                  />
                  <SmallMetric
                    label="Wind"
                    value={`${weatherData?.wind_speed ?? weatherData?.wind ?? "12"} km/h`}
                  />
                </div>
              </aside>

              <aside className="rounded-[32px] border border-rose-500/20 bg-gradient-to-br from-rose-900/80 via-slate-950/80 to-slate-900 p-6 shadow-xl shadow-rose-500/10 transition duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 text-rose-200 mb-4">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.35em]">
                    Emergency
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Immediate help available
                </h3>
                <p className="text-sm text-rose-200/80 mb-6">
                  If you are in danger, either call emergency services or submit
                  an SOS report immediately.
                </p>
                <button
                  className="w-full rounded-3xl bg-rose-500 px-4 py-3 text-sm font-bold uppercase text-white transition duration-200 hover:bg-rose-400"
                  type="button"
                  onClick={() => navigate(ROUTES.emergencySos)}
                >
                  SOS - Get help
                </button>
              </aside>
            </section>

            <section className="col-span-12 lg:col-span-8 rounded-[32px] border border-slate-700 bg-slate-900/95 p-8 shadow-xl shadow-cyan-500/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Active Alerts
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Review the latest flood warnings and recommended actions.
                  </p>
                </div>
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-red-200">
                  {alerts.length} active
                </span>
              </div>
              <div className="grid gap-4">
                {loading ? (
                  <div className="rounded-[28px] border border-slate-700 bg-slate-950/80 p-6 text-center text-slate-400">
                    Loading alerts...
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="rounded-[28px] border border-slate-700 bg-slate-950/80 p-6 text-center text-slate-400">
                    No active alerts at this time.
                  </div>
                ) : (
                  alerts.map((alert, idx) => {
                    const priority = alert.priority || 50;
                    const alertColor = getAlertColor(priority);
                    return (
                      <button
                        key={alert._id || idx}
                        className={`${getSeverityClasses(priority)} ${getAlertPanelClasses(alertColor)} w-full rounded-[28px] border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10`}
                        type="button"
                        onClick={() => navigate(ROUTES.alerts)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] font-semibold text-slate-300">
                              {getAlertLabel(priority)}
                            </p>
                            <h3 className="text-lg font-bold text-white mt-3">
                              {alert.title}
                            </h3>
                          </div>
                          <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
                            Priority {priority}
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-slate-300">
                          {alert.description}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            <section className="col-span-12 lg:col-span-4 rounded-[32px] border border-slate-700 bg-slate-900/95 p-8 shadow-xl shadow-cyan-500/10">
              <h2 className="text-xl font-bold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <ActionButton
                  label="Register Victim"
                  onClick={() => navigate(ROUTES.victimRegistration)}
                  variant="blue"
                />
                <ActionButton
                  label="Find Shelter"
                  onClick={() => navigate(ROUTES.liveMap)}
                  variant="green"
                />
                <ActionButton
                  label="Open Chat"
                  onClick={() => navigate(ROUTES.chat)}
                  variant="violet"
                />
              </div>
            </section>

            <section className="col-span-12 rounded-[32px] border border-slate-700 bg-slate-900/95 p-8 shadow-xl shadow-cyan-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Nearby Shelters
                    </h2>
                    <p className="text-sm text-slate-400">
                      Shelter availability and distance from your area.
                    </p>
                  </div>
                </div>
                <button
                  className="rounded-full border border-cyan-500/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300 transition duration-200 hover:bg-cyan-500/10"
                  type="button"
                  onClick={() => navigate(ROUTES.liveMap)}
                >
                  Open Map
                </button>
              </div>
              <div className="space-y-4 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                {loading ? (
                  <div className="rounded-[28px] border border-slate-700 bg-slate-950/80 p-6 text-center text-slate-400">
                    Loading shelters...
                  </div>
                ) : resources.length === 0 ? (
                  <div className="rounded-[28px] border border-slate-700 bg-slate-950/80 p-6 text-center text-slate-400">
                    No shelters nearby
                  </div>
                ) : (
                  resources.map((shelter, idx) => (
                    <div
                      key={shelter._id || idx}
                      className="rounded-[28px] border border-slate-700 bg-slate-950/80 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <strong className="text-white text-base block">
                            {shelter.name || `Shelter ${idx + 1}`}
                          </strong>
                          <p className="mt-2 text-sm text-slate-400 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-cyan-300" />
                            {shelter.distance} km away
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-emerald-200">
                          {shelter.capacity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

const MetricCard = ({ title, value, subtitle }) => (
  <div className="rounded-[24px] border border-slate-700 bg-slate-950/85 p-6 shadow-lg shadow-cyan-500/5 transition duration-300 hover:-translate-y-1">
    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">
      {title}
    </p>
    <h3 className="mt-4 text-3xl font-bold text-white">{value}</h3>
    <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
  </div>
);

const StatusCard = ({ label, value, detail }) => (
  <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5">
    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">
      {label}
    </p>
    <p className="mt-4 text-2xl font-bold text-white">{value}</p>
    <p className="mt-2 text-sm text-slate-400">{detail}</p>
  </div>
);

const SmallMetric = ({ label, value }) => (
  <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4">
    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">
      {label}
    </p>
    <p className="mt-3 text-lg font-semibold text-white">{value}</p>
  </div>
);

const ActionButton = ({ label, onClick, variant }) => {
  const variantColors = {
    blue: "from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400",
    green:
      "from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400",
    violet:
      "from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400",
  };

  return (
    <button
      className={`w-full rounded-3xl px-5 py-4 text-sm font-semibold uppercase text-white transition duration-200 hover:-translate-y-1 bg-gradient-to-r ${variantColors[variant] || variantColors.blue}`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const getAlertLabel = (priority) => {
  if (priority >= 80) return "SEVERE";
  if (priority >= 50) return "MODERATE";
  return "LOW RISK";
};

const getAlertColor = (priority) => {
  if (priority >= 80) return "red";
  if (priority >= 50) return "yellow";
  return "green";
};

const getAlertPanelClasses = (alertColor) => {
  if (alertColor === "red")
    return "bg-slate-900/50 border-red-500/30 hover:border-red-500/50";
  if (alertColor === "yellow")
    return "bg-slate-900/50 border-yellow-500/30 hover:border-yellow-500/50";
  return "bg-slate-900/50 border-emerald-500/30 hover:border-emerald-500/50";
};

const getSeverityClasses = (priority) => {
  if (priority >= 80) return "border-red-500/30 bg-red-500/10 text-red-200";
  if (priority >= 50)
    return "border-yellow-500/30 bg-amber-500/10 text-amber-200";
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
};

export default DashboardPage;
