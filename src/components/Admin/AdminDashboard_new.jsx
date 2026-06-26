import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  AlertTriangle,
  Users,
  Home,
  Shield,
  Download,
  Filter,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import SideBar from "./SideBar";
import Header from "./Header";
import SOSNotificationPanel from "./SOSNotificationPanel";
import { apiFetch } from "../../lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { display: false }, y: { display: false } },
};

const StatCard = ({ item }) => (
  <motion.div
    className="bg-slate-900/95 p-6 rounded-xl border border-slate-700 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
  >
    <div>
      <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
        {item.title}
      </p>
      <h2 className={`text-4xl font-semibold mt-2 ${item.color}`}>
        {item.value}
      </h2>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
      {item.trend ? <span className="text-orange-500">↗</span> : null}
      {item.trend}
    </div>
    <div className="absolute -bottom-2.5 -right-2.5 opacity-10 text-white">
      {item.icon}
    </div>
  </motion.div>
);

function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOverview = async () => {
      try {
        const res = await apiFetch("/api/admin/overview");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Unable to load admin overview");
        }
        if (!cancelled) {
          setOverview(data.overview || null);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Unable to load admin overview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = useMemo(
    () => [
      {
        title: "TOTAL VICTIMS",
        value: overview?.totalVictims?.toLocaleString() ?? "—",
        trend: overview ? "Updated live" : "Loading…",
        icon: <Users size={20} />,
        color: "text-white",
      },
      {
        title: "ACTIVE ALERTS",
        value: overview?.activeAlerts?.toLocaleString() ?? "—",
        trend: overview ? "Current active incidents" : "Loading…",
        icon: <AlertTriangle size={20} />,
        color: "text-orange-400",
      },
      {
        title: "SHELTERS ACTIVE",
        value: overview?.sheltersActive?.toLocaleString() ?? "—",
        trend: overview ? "Shelters available" : "Loading…",
        icon: <Home size={20} />,
        color: "text-blue-400",
      },
      {
        title: "RESCUE TEAMS",
        value: overview?.rescueTeams?.toLocaleString() ?? "—",
        trend: overview ? "Deployed capacity" : "Loading…",
        icon: <Shield size={20} />,
        color: "text-yellow-200",
      },
    ],
    [overview],
  );

  const barData = useMemo(() => {
    const alertItems = overview?.alertsOverTime?.length
      ? overview.alertsOverTime
      : Array.from({ length: 7 }, () => ({ label: "", count: 0 }));
    const labels = alertItems.map((item) => item.label);
    const data = alertItems.map((item) => item.count);
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: (context) =>
            context.dataIndex === 2 ? "#a78bfa" : "#64748b",
          borderRadius: 4,
        },
      ],
    };
  }, [overview]);

  const recentRows = overview?.recentVictimReports || [];
  const resourceAllocations = overview?.resourceAllocation || [
    { label: "Food & Medical", val: 0, color: "bg-blue-400" },
    { label: "Search & Rescue", val: 0, color: "bg-yellow-400" },
    { label: "Infrastructure", val: 0, color: "bg-red-400" },
  ];
  const victimsByRegion = overview?.victimsByRegion || [];

  const createDashboardReportHTML = (rows) => {
    const formatDate = (dateString) =>
      dateString
        ? new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";

    const reportRows = rows
      .map(
        (row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${row.victim_name || "N/A"}</td>
          <td>${row.incident_location || "N/A"}</td>
          <td>${row.loss_type || "N/A"}</td>
          <td>${formatDate(row.created_at)}</td>
          <td>${row.status || "New"}</td>
        </tr>`,
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Recent Victim Reports</title>
<style>
  body { margin: 0; font-family: Arial, sans-serif; background: #f4f5f7; color: #1f2937; }
  .page { max-width: 1000px; margin: 0 auto; padding: 40px; background: #fff; }
  .header { text-align: center; padding-bottom: 18px; border-bottom: 4px solid #1d4ed8; }
  .header-title { font-size: 24px; font-weight: 800; color: #1d4ed8; margin-bottom: 6px; }
  .header-subtitle { color: #4b5563; font-size: 14px; margin-bottom: 8px; }
  .meta { text-align: right; color: #6b7280; font-size: 12px; margin-bottom: 24px; }
  .section-title { display: inline-block; background: #1d4ed8; color: #fff; padding: 10px 14px; border-radius: 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { padding: 14px 12px; border: 1px solid #e5e7eb; font-size: 13px; }
  th { background: #eff6ff; color: #1e3a8a; text-align: left; }
  tr:nth-child(even) { background: #f8fafc; }
  .status-chip { display: inline-flex; padding: 6px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .status-new { background: #ede9fe; color: #5b21b6; }
  .status-approved { background: #dcfce7; color: #166534; }
  .status-rejected { background: #fee2e2; color: #991b1b; }
  .footer { margin-top: 32px; padding-top: 18px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
  @media print { body { background: white; } .page { box-shadow: none; margin: 0; } .no-print { display: none; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-title">Victim Incident Report</div>
    <div class="header-subtitle">Recent victim reports compiled for official review.</div>
  </div>
  <div class="meta">Generated: ${new Date().toLocaleString()}</div>
  <div class="section-title">Recent Victim Reports</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Victim Name</th>
        <th>Location</th>
        <th>Loss Type</th>
        <th>Reported At</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${reportRows}
    </tbody>
  </table>
  <div class="footer">Total reports: ${rows.length}. Flood Management System — official dashboard export.</div>
</div>
</body>
</html>`;
  };

  const downloadReports = (rows) => {
    const htmlContent = createDashboardReportHTML(rows);
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "recent-victim-reports.html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReports = () => {
    if (!recentRows.length) return;
    downloadReports(recentRows);
  };

  return (
    <section className="flex h-screen w-full bg-slate-950 text-white overflow-hidden">
      <aside className="w-64 h-full bg-slate-900/95 border-r border-slate-700 hidden md:flex flex-col">
        <SideBar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar pl-9">
        <Header />
        <div className="p-4 lg:p-2 scroll-auto">
          <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 font-sans ">
            {error ? (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                {error}
              </div>
            ) : null}

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {statCards.map((card, i) => (
                <StatCard key={i} item={card} />
              ))}
            </motion.div>

            <motion.div
              className="mb-8 bg-slate-900/95 p-6 rounded-xl border border-red-700/30 shadow-xl shadow-red-500/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">🚨</span>
                Emergency SOS Notifications
              </h2>
              <SOSNotificationPanel />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  className="bg-slate-900/95 p-6 rounded-xl border border-slate-700 min-h-[420px] flex flex-col shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Flood Alerts Over Time
                      </h3>
                      <p className="text-slate-400 text-xs uppercase">
                        7-Day incident frequency
                      </p>
                    </div>
                    <button className="bg-slate-700/60 text-[10px] px-3 py-1 rounded text-slate-300 font-bold uppercase tracking-tighter hover:bg-slate-600 transition">
                      Live Feed
                    </button>
                  </div>
                  <div className="grow">
                    {loading ? (
                      <div className="flex h-60 items-center justify-center text-slate-400">
                        <Loader2 className="animate-spin mr-2" size={18} />{" "}
                        Loading chart...
                      </div>
                    ) : (
                      <Bar data={barData} options={barOptions} />
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="bg-slate-900/95 rounded-xl border border-slate-700 overflow-hidden shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="p-6 flex justify-between items-center border-b border-slate-700">
                    <h3 className="text-xl font-semibold text-white">
                      Recent Victim Reports
                    </h3>
                    <div className="flex gap-4 text-slate-400">
                      <Filter
                        size={18}
                        className="cursor-pointer hover:text-white transition"
                      />
                      <button
                        type="button"
                        onClick={handleDownloadReports}
                        className="flex items-center justify-center rounded-full p-1 hover:text-white transition"
                        title="Download recent victim reports"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-medium">Victim</th>
                          <th className="px-6 py-4 font-medium">Location</th>
                          <th className="px-6 py-4 font-medium">Loss Type</th>
                          <th className="px-6 py-4 font-medium">Reported</th>
                          <th className="px-6 py-4 font-medium text-right">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {loading ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-slate-400"
                            >
                              Loading recent reports...
                            </td>
                          </tr>
                        ) : recentRows.length > 0 ? (
                          recentRows.map((row, i) => (
                            <motion.tr
                              key={row.id}
                              className="hover:bg-slate-800/50 transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 1 + i * 0.05,
                              }}
                            >
                              <td className="px-6 py-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-cyan-200">
                                  {row.victim_name
                                    ?.split(" ")
                                    .map((part) => part[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-white">
                                    {row.victim_name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {new Date(row.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-300">
                                {row.incident_location}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-200">
                                {row.loss_type}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-200">
                                {new Date(row.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-200 text-xs uppercase tracking-wider">
                                  New
                                </span>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-slate-400"
                            >
                              No recent victim reports available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="bg-slate-900/95 p-6 rounded-xl border border-slate-700 shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-6">
                    Resource Allocation
                  </h3>
                  <div className="space-y-6">
                    {resourceAllocations.map((res, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 + i * 0.1 }}
                      >
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-2">
                          <span>{res.label}</span>
                          <span>{res.val}</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full">
                          <motion.div
                            className={`${res.color} h-1.5 rounded-full`}
                            style={{ width: `${Math.min(res.val, 100)}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(res.val, 100)}%` }}
                            transition={{ duration: 1, delay: 1.6 + i * 0.1 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="bg-slate-900/95 p-6 rounded-xl border border-slate-700 shadow-xl shadow-cyan-500/10 transition duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-6">
                    Victims by Region
                  </h3>
                  <div className="flex justify-between items-end h-32 gap-2">
                    {(victimsByRegion.length > 0
                      ? victimsByRegion
                      : [
                          { region: "A", count: 25 },
                          { region: "B", count: 45 },
                          { region: "C", count: 30 },
                          { region: "D", count: 55 },
                        ]
                    ).map((region, i) => (
                      <motion.div
                        key={i}
                        className="flex flex-col items-center flex-1 gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.6 + i * 0.1 }}
                      >
                        <span className="text-[10px] text-slate-400 font-bold">
                          {region.region}
                        </span>
                        <div
                          className="w-full bg-slate-700 rounded-t-md overflow-hidden"
                          style={{ height: "100px" }}
                        >
                          <motion.div
                            className="bg-cyan-400/50 w-full rounded-t-md"
                            style={{
                              height: `${Math.min(region.count, 100)}%`,
                            }}
                            initial={{ height: 0 }}
                            animate={{
                              height: `${Math.min(region.count, 100)}%`,
                            }}
                            transition={{ duration: 1, delay: 1.8 + i * 0.1 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </section>
  );
}
export default AdminDashboard;
