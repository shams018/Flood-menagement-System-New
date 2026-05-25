import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Map as MapIcon,
  Droplets,
  Home,
  Plus,
  Navigation,
} from "lucide-react";
import PageSidebar from "../components/PageSidebar";
import { ROUTES } from "../routes";
import { API_BASE } from "../lib/config";

const ResourceCard = ({
  type,
  name,
  status,
  statusColor,
  distance,
  capacity,
  isCritical,
}) => (
  <div
    className={`p-4 mb-4 rounded-xl border-l-4 transition-all hover:bg-white/5 cursor-pointer ${isCritical ? "border-red-400" : "border-blue-400"}`}
  >
    <div className="flex justify-between items-start mb-1">
      <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
        {type}
      </span>
      <span className="text-xs font-medium opacity-50">{distance}</span>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span
          className={`text-xs font-medium ${isCritical ? "text-red-400" : "text-gray-300"}`}
        >
          {status} {capacity && `- ${capacity}`}
        </span>
      </div>
      <button
        type="button"
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
      >
        <Navigation size={16} className="text-white opacity-80" />
      </button>
    </div>
  </div>
);

const LiveMap = () => {
  const navigate = useNavigate();
  const liveMapEmbedUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=-74.1,40.64,-73.9,40.78&layer=mapnik&marker=40.7128,-74.0060";
  const [mapTab, setMapTab] = useState("shelters");
  const [resources, setResources] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const category = mapTab === "shelters" ? "shelters" : "medical";
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/map/resources?category=${category}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load map data");
        if (!cancelled) {
          setResources(data.resources || []);
          setLoadError("");
        }
      } catch (e) {
        if (!cancelled) setLoadError(e.message || "Network error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mapTab]);

  return (
    <section className="relative flex min-h-screen bg-slate-950 text-white">
      <PageSidebar />
      <main className="flex-1 relative overflow-hidden bg-slate-900 font-sans text-gray-200 lg:pl-72">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/95 to-slate-900" />

        <div className="relative z-10 min-h-screen">
          <div className="px-6 py-6 md:px-10 md:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.45em] text-cyan-400 font-black">
                  Live Map Overview
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Flood Response Control
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">
                  Monitor locations, relief resources and alert status on a
                  dashboard-inspired interface.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.dashboard)}
                className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-slate-950/40 transition hover:bg-white/15"
              >
                Back to dashboard
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Active zones
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    Stable
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black text-white">14</p>
                <p className="mt-2 text-sm text-slate-400">
                  Flood risk zones currently under observation.
                </p>
              </div>
              <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Safe shelters
                  </span>
                  <Home size={18} className="text-sky-400" />
                </div>
                <p className="mt-4 text-3xl font-black text-white">27</p>
                <p className="mt-2 text-sm text-slate-400">
                  Verified shelter locations available now.
                </p>
              </div>
              <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Response units
                  </span>
                  <MapIcon size={18} className="text-emerald-400" />
                </div>
                <p className="mt-4 text-3xl font-black text-white">8</p>
                <p className="mt-2 text-sm text-slate-400">
                  Teams actively deployed across the region.
                </p>
              </div>
              <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Live alerts
                  </span>
                  <Droplets size={18} className="text-cyan-300" />
                </div>
                <p className="mt-4 text-3xl font-black text-white">5</p>
                <p className="mt-2 text-sm text-slate-400">
                  Open alerts across monitored flood corridors.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-8 md:px-10">
            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)_320px]">
              <aside className="flex min-h-[620px] flex-col rounded-[40px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3 mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Nearby resources
                    </p>
                    <h2 className="mt-3 text-2xl font-black text-white">
                      Resource panel
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-300">
                    {resources.length} items
                  </span>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setMapTab("shelters")}
                    className={`flex-1 rounded-3xl border px-4 py-3 text-xs font-black uppercase tracking-[0.25em] transition ${
                      mapTab === "shelters"
                        ? "border-blue-400 bg-blue-400/15 text-blue-300"
                        : "border-white/10 text-slate-300 hover:border-blue-400 hover:text-white"
                    }`}
                  >
                    Shelters
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapTab("medical")}
                    className={`flex-1 rounded-3xl border px-4 py-3 text-xs font-black uppercase tracking-[0.25em] transition ${
                      mapTab === "medical"
                        ? "border-blue-400 bg-blue-400/15 text-blue-300"
                        : "border-white/10 text-slate-300 hover:border-blue-400 hover:text-white"
                    }`}
                  >
                    Medical
                  </button>
                </div>

                {loadError ? (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                    {loadError}
                  </div>
                ) : null}

                <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4">
                  {resources.length ? (
                    resources.map((item) => (
                      <ResourceCard
                        key={item.id}
                        type={item.type_label}
                        name={item.name}
                        distance={item.distance_label}
                        status={item.status}
                        statusColor={item.status_color_class}
                        capacity={item.capacity_text}
                        isCritical={item.is_critical}
                      />
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                      No resources found. Switch tabs or refresh to reload live
                      data.
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-[32px] border border-white/10 bg-slate-950/75 p-4 text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
                    Legend
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      <span>Safe shelters</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span>Warning zones</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <span>Critical alerts</span>
                    </div>
                  </div>
                </div>
              </aside>

              <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/60 shadow-2xl shadow-slate-950/40">
                <div className="relative h-[560px] sm:h-[620px] lg:h-[700px]">
                  <iframe
                    title="Live map"
                    src={liveMapEmbedUrl}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                  <div className="absolute inset-x-0 top-6 px-6">
                    <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-sky-400">
                            Map focus
                          </p>
                          <h2 className="mt-2 text-xl font-black text-white">
                            Sector G-9 Flood Corridor
                          </h2>
                        </div>
                        <button
                          type="button"
                          className="rounded-3xl bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/15"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-1/2 w-full max-w-4xl -translate-x-1/2 px-6">
                    <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl bg-slate-950/70 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                            Flood level
                          </p>
                          <p className="mt-3 text-2xl font-black text-white">
                            High
                          </p>
                        </div>
                        <div className="rounded-3xl bg-slate-950/70 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                            Wind speed
                          </p>
                          <p className="mt-3 text-2xl font-black text-white">
                            22 km/h
                          </p>
                        </div>
                        <div className="rounded-3xl bg-slate-950/70 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                            Active alerts
                          </p>
                          <p className="mt-3 text-2xl font-black text-white">
                            5
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="hidden xl:flex min-w-[280px] flex-col gap-5">
                <div className="rounded-[32px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300 font-black">
                        Map tools
                      </p>
                      <p className="mt-3 text-sm text-slate-400">
                        Quick controls for map overlays and view mode.
                      </p>
                    </div>
                    <MapIcon size={20} className="text-cyan-300" />
                  </div>
                  <div className="mt-6 grid gap-3">
                    <button className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-blue-400/30 hover:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <MapIcon size={18} className="text-sky-300" />
                        <span>Basemap controls</span>
                      </div>
                    </button>
                    <button className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-blue-400/30 hover:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <Droplets size={18} className="text-cyan-300" />
                        <span>Water level alerts</span>
                      </div>
                    </button>
                    <button className="w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-blue-400/30 hover:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <Plus size={18} className="text-white" />
                        <span>Add marker</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-300">
                      Quick status
                    </h3>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-slate-300">
                      Live
                    </span>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white">
                          Operational
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        All systems are currently functional.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white">
                          Shelters filling
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        2 locations are nearing capacity.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white">
                          Critical zone
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        1 zone requires immediate attention.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default LiveMap;
