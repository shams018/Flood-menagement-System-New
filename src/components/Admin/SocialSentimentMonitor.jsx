import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  TrendingUp,
  Bell,
  MapPin,
  Hash,
  AlertTriangle,
  Clock3,
  ShieldAlert,
} from "lucide-react";
import SideBar from "./SideBar";
import Header from "./Header";
import { apiFetch } from "../../lib/api";

const samplePosts = [
  {
    id: 1,
    user: "EmergencyAlert_SF",
    handle: "@EmergencyAlert_SF",
    time: "2m ago",
    location: "Sector 4, San Francisco, CA",
    message:
      "Massive flooding starting at 5th and Main. We are trapped on the 2nd floor. Need immediate extraction for elderly.",
    hashtags: ["SentinelHelp", "SFFloods"],
    urgency: "urgent",
    verified: true,
  },
  {
    id: 2,
    user: "Citizen_Journalist",
    handle: "@Citizen_Journalist",
    time: "8m ago",
    location: "Sector 2, Richmond District",
    message:
      "Smoke detected near the refinery. Locals are reporting a strange chemical smell. No official word yet. Monitoring.",
    hashtags: ["AirQuality", "ChemicalAlert"],
    urgency: "attention",
    verified: false,
  },
  {
    id: 3,
    user: "RescueNetwork",
    handle: "@RescueNetwork",
    time: "15m ago",
    location: "Sector 4 Delta",
    message:
      "Requesting priority medical for evacuation point Bravo. Oxygen supplies running low.",
    hashtags: ["CrisisResponse", "UrgentHelp"],
    urgency: "urgent",
    verified: true,
  },
  {
    id: 4,
    user: "StreetWatch_CA",
    handle: "@StreetWatch_CA",
    time: "22m ago",
    location: "Sector 7, Bayview",
    message:
      "Rising water levels have cut off the main bridge. Evacuation teams need support on the east side.",
    hashtags: ["Evacuation", "FloodResponse"],
    urgency: "urgent",
    verified: false,
  },
  {
    id: 5,
    user: "FloodEye",
    handle: "@FloodEye",
    time: "35m ago",
    location: "Central District",
    message:
      "AI keyword analysis shows a 22% jump in ‘medical help’ and ‘evacuation’ mentions across near-term posts.",
    hashtags: ["PanicIndex", "Trending"],
    urgency: "info",
    verified: true,
  },
];

const regionOptions = [
  "All",
  "San Francisco",
  "Richmond",
  "Bayview",
  "Central District",
];

const SentimentBadge = ({ label, color }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${color}`}
  >
    <TrendingUp size={14} />
    {label}
  </span>
);

function SocialSentimentMonitor() {
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [alertHistory, setAlertHistory] = useState([]);
  const [actionStatus, setActionStatus] = useState("");

  const [posts, setPosts] = useState(samplePosts);
  const [loadingFeed, setLoadingFeed] = useState(false);

  const filteredPosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return posts.filter((post) => {
      const text =
        `${post.location || post.region || ""} ${post.message} ${(post.hashtags || []).join(" ")}`.toLowerCase();
      const matchesQuery =
        !normalized ||
        text.includes(normalized) ||
        (post.hashtags || []).some((tag) =>
          tag.toLowerCase().includes(normalized),
        );
      const matchesRegion =
        selectedRegion === "All" ||
        (post.region || post.location || "")
          .toLowerCase()
          .includes(selectedRegion.toLowerCase());
      return matchesQuery && matchesRegion;
    });
  }, [posts, query, selectedRegion]);

  const [panicScore, setPanicScore] = useState(0);
  const [panicMeta, setPanicMeta] = useState({
    urgentRequests: 0,
    activeRegions: [],
  });

  const fetchOverview = async () => {
    try {
      const res = await apiFetch("/api/sentiment/overview");
      const data = await res.json();
      if (res.ok) {
        setPanicScore(data.panicScore || 0);
        setPanicMeta({
          urgentRequests: data.urgentRequests || 0,
          activeRegions: data.activeRegions || [],
        });
      }
    } catch (e) {
      console.error("Failed to load sentiment overview", e);
    }
  };

  const fetchFeed = async () => {
    try {
      setLoadingFeed(true);
      const res = await apiFetch("/api/sentiment/feed");
      const data = await res.json();
      if (res.ok && Array.isArray(data.posts)) {
        // normalize post fields to match UI expectations
        const mapped = data.posts.map((p) => ({
          id: p.id || p._id,
          user: p.user_label || p.user || p.user_handle || "Unknown",
          handle: p.user_handle || p.handle || "",
          time: p.created_at || p.time || "",
          location: p.location || p.region || "",
          message: p.message,
          hashtags: p.hashtags || [],
          urgency: p.urgency || "info",
          verified: Boolean(p.verified),
        }));
        setPosts(mapped);
      }
    } catch (e) {
      console.error("Failed to load feed", e);
    } finally {
      setLoadingFeed(false);
    }
  };

  const panicLevel =
    panicScore >= 70 ? "High" : panicScore >= 40 ? "Medium" : "Low";
  const panicColor =
    panicLevel === "High"
      ? "text-rose-400"
      : panicLevel === "Medium"
        ? "text-amber-400"
        : "text-emerald-400";

  const handleDeclareEmergency = async () => {
    try {
      const res = await apiFetch("/api/sentiment/action", {
        method: "POST",
        body: JSON.stringify({
          action: "declare_emergency",
          reason: "Manual from admin UI",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionStatus("Emergency status declared. Dispatch teams alerted.");
        fetchOverview();
      } else {
        setActionStatus(data.error || "Failed to declare emergency");
      }
    } catch (e) {
      setActionStatus("Network error declaring emergency");
    }
  };

  const handleDismissFalsePositive = async () => {
    try {
      const res = await apiFetch("/api/sentiment/action", {
        method: "POST",
        body: JSON.stringify({ action: "dismiss_false_positive" }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionStatus("False positive dismissed. Monitoring continues.");
      } else {
        setActionStatus(data.error || "Failed to dismiss false positive");
      }
    } catch (e) {
      setActionStatus("Network error");
    }
  };

  useEffect(() => {
    setAlertHistory([
      {
        id: "panic-spike-1",
        title: "Panic spike detected",
        detail:
          "AI detected a 22% surge in evacuation and medical help keywords from urgent social posts.",
        badge: "Auto-Triggered",
        time: "Just now",
      },
      {
        id: "dispatch-1",
        title: "Dispatch unit assigned",
        detail:
          "Team Alpha deployed to Sector 4 after multiple urgent posts flagged elderly extraction.",
        badge: "Action Required",
        time: "4m ago",
      },
    ]);
    // initial load
    fetchOverview();
    fetchFeed();
  }, []);

  const summaryCards = [
    {
      title: "Panic Index",
      value: `${panicScore}%`,
      label: panicLevel,
      icon: <Bell size={18} className="text-slate-200" />,
      color: panicColor,
    },
    {
      title: "Urgent Requests",
      value: panicMeta.urgentRequests || 0,
      label: "High priority",
      icon: <AlertTriangle size={18} className="text-slate-200" />,
      color: "text-orange-400",
    },
    {
      title: "Active Regions",
      value: (panicMeta.activeRegions || []).length,
      label: "Trending areas",
      icon: <MapPin size={18} className="text-slate-200" />,
      color: "text-sky-400",
    },
  ];

  return (
    <section className="flex h-screen w-full bg-slate-950 text-white overflow-hidden font-sans">
      <aside className="hidden md:block w-72 border-r border-slate-700 bg-slate-900/95">
        <SideBar />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.36em] text-sky-300 font-semibold">
                      Social Sentiment Monitor
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                      Monitor panic & urgent help from social channels
                    </h1>
                    <p className="mt-2 text-sm text-slate-400 leading-6">
                      Track urgent posts, filter by hashtag or region, and spot
                      panic spikes before they become emergencies.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                          Panic level
                        </p>
                        <h2 className={`mt-3 text-5xl font-bold ${panicColor}`}>
                          {panicScore}%
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                          {panicLevel} —{" "}
                          {panicLevel === "High"
                            ? "Critical"
                            : panicLevel === "Medium"
                              ? "Elevated"
                              : "Under control"}
                        </p>
                      </div>
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900/80 border border-white/10">
                        <TrendingUp size={32} className={panicColor} />
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-4 rounded-full ${panicColor}`}
                          style={{ width: `${panicScore}%` }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-slate-500">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {summaryCards.map((card) => (
                      <div
                        key={card.title}
                        className="rounded-3xl border border-slate-700 bg-slate-900/95 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                              {card.title}
                            </p>
                            <p
                              className={`mt-2 text-3xl font-semibold ${card.color}`}
                            >
                              {card.value}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
                            {card.icon}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">
                          {card.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-400 font-semibold">
                      Alert panel
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      Auto-triggered admin notifications
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Alerts created when the system detects panic spikes or
                      repeated urgent requests.
                    </p>
                  </div>
                  <ShieldAlert size={24} className="text-sky-400" />
                </div>

                <div className="mt-6 space-y-4">
                  {alertHistory.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {alert.title}
                          </p>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mt-1">
                            {alert.badge}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">
                          {alert.time}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300 leading-6">
                        {alert.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/95 p-5">
                  <p className="text-sm text-slate-300">
                    Take direct action on the current panic alert.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleDeclareEmergency}
                      className="rounded-3xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                    >
                      DECLARE EMERGENCY STATUS
                    </button>
                    <button
                      type="button"
                      onClick={handleDismissFalsePositive}
                      className="rounded-3xl border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
                    >
                      DISMISS FALSE POSITIVE
                    </button>
                  </div>
                  {actionStatus ? (
                    <p className="mt-4 rounded-2xl bg-white/5 border border-slate-700 px-4 py-3 text-sm text-slate-200">
                      {actionStatus}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-400 font-semibold">
                      Keyword filter
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      Search hashtags or region
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900 transition"
                      onClick={() => setQuery("")}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      size={18}
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Filter by hashtag, keyword, or location"
                      className="w-full rounded-3xl border border-slate-700 bg-slate-900/95 py-3 pl-12 pr-4 text-sm text-white outline-none transition focus:border-sky-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuery(query)}
                    className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  >
                    Apply filter
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {regionOptions.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => setSelectedRegion(region)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selectedRegion === region
                          ? "border-sky-400 bg-sky-500/15 text-sky-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-400 font-semibold">
                      Live Feed
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      Urgent social posts
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                    <Clock3 size={14} /> Live update
                  </div>
                </div>

                <div className="mt-6 space-y-4 max-h-[680px] overflow-y-auto pr-1">
                  {filteredPosts.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
                      No social posts match the selected filter.
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <article
                        key={post.id}
                        className="rounded-3xl border border-slate-700 bg-slate-950/60 p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-sky-400">
                                {post.user.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {post.user}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {post.handle}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            <p>{post.time}</p>
                            <p>{post.location}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-200">
                          {post.message}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.hashtags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300"
                            >
                              <Hash size={12} />
                              {`#${tag}`}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialSentimentMonitor;
