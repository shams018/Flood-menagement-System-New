import React, { useEffect, useMemo, useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { apiFetch } from "../../lib/api";

function AiReport() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ reportsToday: 0, successRate: 0 });
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let canceled = false;

    const fetchReportData = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/api/admin/reports");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Unable to load AI reports");
        }
        if (canceled) return;
        setReports(data.reports || []);
        setStats(data.stats || { reportsToday: 0, successRate: 0 });
        setAiSummary(data.aiSummary || null);
        setError("");
      } catch (err) {
        if (!canceled) setError(err.message || "Unable to load AI reports");
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchReportData();
    return () => {
      canceled = true;
    };
  }, []);

  const filteredArchive = useMemo(() => {
    if (activeFilter === "ALL") return reports;
    if (activeFilter === "FAILED")
      return reports.filter((item) => item.status === "FAILED");
    if (activeFilter === "PENDING")
      return reports.filter((item) => item.status === "GENERATED");
    return reports;
  }, [activeFilter, reports]);

  const displayReports = useMemo(() => {
    return filteredArchive.slice(0, 6);
  }, [filteredArchive]);

  const summary = aiSummary || {
    title: "No AI reports available",
    summary: "The AI system is preparing the first intelligence summaries.",
    confidence: 0,
    evacPriority: "N/A",
    impactRadius: "N/A",
  };

  return (
    <section className="flex h-screen w-full bg-slate-950 text-white overflow-hidden font-sans">
      <aside className="w-72 h-full bg-slate-900/95 border-r border-slate-700 hidden md:flex flex-col">
        <SideBar />
      </aside>

      <main className="flex-1 h-full flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
              <div className="mb-8 flex flex-col gap-4">
                <span className="text-xs uppercase tracking-[0.35em] text-sky-400 font-semibold">
                  Live intelligence stream
                </span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                      AI Reports
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-400 text-sm leading-6">
                      Deep learning synthesis of multispectral flood data and
                      humanitarian telemetry. Generated via Sentinel Neural
                      Link.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                      <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Reports Today
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-sky-400">
                        14
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                      <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Success Rate
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-emerald-400">
                        98.2%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-inner shadow-slate-950/20">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-3">
                      Recent Archive
                    </h2>
                    <p className="text-sm text-slate-400">
                      Review the latest generated reports, delivery status, and
                      retry failed predictions instantly.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { label: "All", value: "ALL" },
                      { label: "Failed", value: "FAILED" },
                      { label: "Pending", value: "PENDING" },
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveFilter(filter.value)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          activeFilter === filter.value
                            ? "bg-sky-500 text-slate-950"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {filteredArchive.map((item) => (
                    <div
                      key={`${item.date}-${item.title}`}
                      className="flex flex-col gap-4 rounded-3xl border border-slate-700 bg-slate-950/90 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                            {item.date.split(" ")[0]}
                          </span>
                          <span>{item.date}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400 uppercase tracking-[0.2em]">
                            Region: {item.region}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:items-end">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                            item.badge === "blue"
                              ? "bg-sky-500/10 text-sky-300"
                              : item.badge === "amber"
                                ? "bg-amber-500/10 text-amber-300"
                                : "bg-red-500/10 text-red-300"
                          }`}
                        >
                          {item.status}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.status === "FAILED" ? (
                            <button className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400">
                              Retry Generation
                            </button>
                          ) : (
                            <button className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
                              View Report
                            </button>
                          )}
                          <button className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    Neural Preview
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    Executive Summary
                  </h2>
                </div>
                <div className="rounded-3xl bg-slate-950/90 px-4 py-3 text-sm text-slate-300">
                  AI Confidence
                  <div className="mt-2 text-2xl font-semibold text-sky-400">
                    94%
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-5 border-t border-slate-700 pt-6 text-slate-300">
                <p className="text-sm leading-7">
                  "Probability of critical failure at Barrage Sector 4 has
                  increased to 74% based on latest n8n telemetry analysis."
                </p>
                <p className="text-sm leading-7 text-slate-400">
                  Water levels at the Danube station reported an anomalous rise
                  of 1.2m within 180 minutes. Prediction models suggest peak
                  overflow between 0400h and 0600h tomorrow.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Evac Priority
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-rose-400">
                      Urgent
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Impact Radius
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-sky-400">
                      12.4 km
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                    Export Full PDF
                  </button>
                  <button className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                    Resend to Admins
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default AiReport;
