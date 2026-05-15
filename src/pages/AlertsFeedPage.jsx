import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import { API_BASE } from "../lib/config";
import { useAuth } from "../context/AuthContext";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function AlertsFeedPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/alerts`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load alerts");
        if (!cancelled) {
          setAlerts(data.alerts || []);
          setTotal(data.total ?? (data.alerts || []).length);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Could not load alerts");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      setSubscriptionMessage("Please login to subscribe to alerts.");
      navigate(ROUTES.login);
      return;
    }

    setSubscribed(true);
    setSubscriptionMessage(
      "You are now subscribed to alerts. Check notifications for updates.",
    );
    navigate(ROUTES.notifications);
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-slate-900 text-white"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <motion.section
        className="bg-slate-800/50 border-b border-slate-700 px-8 py-12"
        variants={itemVariants}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-4">
              REAL-TIME SITUATIONAL AWARENESS
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
              <span className="text-white">Active Flood</span>{" "}
              <span className="text-cyan-400">Intelligence.</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Live weather-driven assessments use Open-Meteo forecasts with
              rule-based rainfall thresholds (e.g. 24h totals) to raise or clear
              automated flood-risk alerts. Editorial briefings appear alongside
              for context.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section className="px-8 py-8" variants={itemVariants}>
        <div className="grid grid-cols-3 gap-8 mb-8">
          <motion.div variants={itemVariants} className="col-span-2">
            <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-4">
              ALERT OVERVIEW
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Review live alerts, region filters, and urgent action channels.
              Use the dashboard to track flood zones and response readiness in
              real time.
            </p>
          </motion.div>
          <motion.aside
            className="bg-slate-700 rounded-lg p-6 border border-slate-600 flex flex-col justify-between"
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">
                GLOBAL ALERT STATUS
              </p>
              <p className="flex items-center gap-2 text-white font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {total || 12} Live Feed Items
              </p>
            </div>
            <button
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs rounded transition-colors"
              type="button"
              onClick={handleSubscribe}
            >
              {subscribed ? "Subscribed to Alerts" : "Subscribe to Alerts"}
            </button>
            {subscriptionMessage ? (
              <p className="mt-3 text-sm text-cyan-300">
                {subscriptionMessage}
              </p>
            ) : null}
          </motion.aside>
        </div>

        <div className="flex items-center justify-between bg-slate-900/50 px-6 py-4 rounded border border-slate-700">
          <div className="flex items-center gap-4">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
              aria-hidden
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              FILTERS
            </span>
            <select
              className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs rounded hover:bg-slate-700 transition-colors"
              aria-label="Region"
            >
              <option>REGION: ALL GLOBAL</option>
            </select>
            <select
              className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs rounded hover:bg-slate-700 transition-colors"
              aria-label="Severity"
            >
              <option>SEVERITY: ALL</option>
            </select>
            <select
              className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-300 text-xs rounded hover:bg-slate-700 transition-colors"
              aria-label="Date sort"
            >
              <option>DATE: RECENT FIRST</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              LIVE STREAM:
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>
        </div>
      </motion.section>

      <motion.section
        className="flex-1 px-8 py-8 space-y-6"
        aria-label="Live incident reports"
        variants={itemVariants}
      >
        {error ? (
          <p className="text-red-400 text-sm border border-red-800/50 rounded-lg p-4">
            {error}
          </p>
        ) : null}

        {alerts.map((alert) => {
          const p = alert.payload;
          if (alert.kind === "automated_flood") {
            const risk = p.riskLevel || "LOW";
            const badgeClass =
              risk === "CRITICAL"
                ? "bg-red-600"
                : risk === "HIGH"
                  ? "bg-orange-600"
                  : risk === "MODERATE"
                    ? "bg-yellow-600"
                    : risk === "ELEVATED"
                      ? "bg-amber-600"
                      : "bg-green-600";
            return (
              <motion.article
                key={alert.id}
                className="bg-slate-800 rounded-lg border border-cyan-700/40 overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(14,165,233,0.12)]"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.007 }}
              >
                <div className="h-40 bg-gradient-to-br from-cyan-900/50 to-slate-900 flex flex-wrap items-start justify-between gap-3 p-6">
                  <span
                    className={`px-3 py-1 text-white text-xs font-bold uppercase rounded ${badgeClass}`}
                  >
                    {p.badgePrimary || `Risk: ${risk}`}
                  </span>
                  <span className="px-3 py-1 bg-slate-900/80 text-cyan-300 text-xs font-bold uppercase rounded max-w-xs truncate">
                    {p.badgeSecondary || p.placeLabel}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {p.title}
                  </h2>
                  <p className="text-sm text-cyan-200/70 mb-4">{p.subtitle}</p>
                  <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-4">
                    <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
                      MODEL SUMMARY
                    </span>
                    <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>
                  {p.metrics ? (
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-semibold mb-4">
                      <span>24h rain: {p.metrics.rain24hMm} mm</span>
                      <span>48h: {p.metrics.rain48hMm} mm</span>
                      <span>Peak day: {p.metrics.maxDaily7Mm} mm</span>
                    </div>
                  ) : null}
                  {p.factors?.length ? (
                    <ul className="text-xs text-gray-500 space-y-1 mb-4 list-disc pl-5">
                      {p.factors.slice(0, 4).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                    {p.dataSource} · {p.assessedAt}
                  </p>
                </div>
              </motion.article>
            );
          }
          if (alert.kind === "emergency_hero") {
            return (
              <motion.article
                key={alert.id}
                className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.2)]"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.007 }}
              >
                <div className="h-48 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 relative flex items-start justify-between p-6">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded">
                    {p.badgePrimary}
                  </span>
                  {p.badgeSecondary ? (
                    <span className="px-3 py-1 bg-slate-900/80 text-orange-400 text-xs font-bold uppercase rounded">
                      {p.badgeSecondary}
                    </span>
                  ) : null}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {p.title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">{p.subtitle}</p>
                  <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-4">
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                      AI SUMMARY
                    </span>
                    <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      {p.meta1 ? (
                        <span className="text-xs text-gray-400 font-semibold">
                          {p.meta1}
                        </span>
                      ) : null}
                      {p.meta2 ? (
                        <span className="text-xs text-gray-400 font-semibold">
                          {p.meta2}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-blue-400 text-sm font-semibold uppercase">
                      Full Incident Log <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          }
          if (alert.kind === "warning_card") {
            return (
              <motion.article
                key={alert.id}
                className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.2)]"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.007 }}
              >
                <div className="h-40 bg-gradient-to-br from-green-600/20 to-emerald-600/20 relative flex items-start justify-start p-6">
                  <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-bold uppercase rounded">
                    {p.badgePrimary}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{p.body}</p>
                  <div className="flex justify-between items-center">
                    <time className="text-xs text-gray-500 uppercase">
                      {p.timeLabel}
                    </time>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-sm font-bold uppercase"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          }
          if (alert.kind === "watch_card") {
            return (
              <motion.article
                key={alert.id}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.2)]"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.007 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase rounded">
                    {p.badgePrimary}
                  </span>
                  <span className="text-2xl text-gray-400">◷</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{p.body}</p>
                <div className="flex justify-between items-center">
                  <time className="text-xs text-gray-500 uppercase">
                    {p.timeLabel}
                  </time>
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-sm font-bold uppercase"
                  >
                    Read More
                  </button>
                </div>
              </motion.article>
            );
          }
          if (alert.kind === "priority_full") {
            return (
              <motion.article
                key={alert.id}
                className="bg-slate-800 rounded-lg border border-red-600/50 overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(220,38,38,0.15)]"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.007 }}
              >
                <div className="h-48 bg-gradient-to-br from-red-600/20 to-orange-600/20" />
                <div className="p-6">
                  <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-2">
                    {p.badgePrimary}
                  </p>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {p.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {p.body}
                  </p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs rounded transition-colors"
                    >
                      View Evacuation Map
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold uppercase text-xs rounded border border-slate-600 transition-colors"
                    >
                      Alert Details
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          }
          return null;
        })}
      </motion.section>

      <motion.div
        className="border-t border-slate-700 py-8 px-8 flex flex-col items-center gap-6"
        variants={itemVariants}
      >
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-blue-500" />
        </div>
        <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
          VIEWING {alerts.length} OF {Math.max(total, alerts.length, 12)} LIVE
          REPORTS
        </p>
        <button
          type="button"
          className="px-6 py-3 border-2 border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white font-bold uppercase text-sm rounded transition-colors"
        >
          Load Historical Logs
          <span className="ml-2" aria-hidden>
            ⌄
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

export default AlertsFeedPage;
