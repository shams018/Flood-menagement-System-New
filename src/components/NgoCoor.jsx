import React, { useState } from "react";
import {
  List,
  Map as MapIcon,
  Plus,
  MoreVertical,
  Globe,
  Zap,
} from "lucide-react";

const NgoCoor = ({ status }) => {
  const styles = {
    "CRITICAL FILL": "bg-red-500/10 text-red-400 border-red-500/20",
    OPERATIONAL: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    STAGING: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const ResourceRow = ({
  name,
  id,
  location,
  current,
  max,
  status,
  comms,
  accentColor,
}) => {
  const progress = (current / max) * 100;

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="py-6 pl-6">
        <div className="flex items-center gap-4">
          <div className={`w-1 h-12 rounded-full ${accentColor}`} />
          <div>
            <div className="text-white font-bold text-lg leading-tight">
              {name}
            </div>
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mt-1">
              ID: {id}
            </div>
          </div>
        </div>
      </td>
      <td className="text-zinc-400 text-sm py-6">
        {location.split(",").map((part, i) => (
          <div key={i}>{part.trim()}</div>
        ))}
      </td>
      <td className="py-6">
        <div className="w-24">
          <div className="flex justify-between text-[11px] font-bold text-white mb-2 font-mono">
            <span>
              {current} / {max}
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${accentColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </td>
      <td className="py-6 text-center">
        <StatusBadge status={status} />
      </td>
      <td className="py-6 text-zinc-400 text-xs font-mono">
        <div>{comms.phone}</div>
        <div className="text-zinc-500">{comms.channel}</div>
      </td>
      <td className="py-6 pr-6 text-right">
        <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 transition-colors">
          <MoreVertical size={20} />
        </button>
      </td>
    </tr>
  );
};

export default function ResourceDashboard() {
  const [viewMode, setViewMode] = useState("table");
  const resources = [
    {
      name: "Central Civic Hub",
      id: "SH-0442",
      location: "North District, Sector 4",
      current: 450,
      max: 500,
      status: "CRITICAL FILL",
      comms: { phone: "+1 (800)", channel: "OPS-442" },
      accentColor: "bg-blue-400",
    },
    {
      name: "St. Jude Relief Wing",
      id: "SH-0891",
      location: "East Basin, Zone B",
      current: 112,
      max: 250,
      status: "OPERATIONAL",
      comms: { phone: "+1 (800)", channel: "OPS-891" },
      accentColor: "bg-yellow-400",
    },
    {
      name: "Unity High Gym",
      id: "SH-0120",
      location: "Harbor District",
      current: 45,
      max: 300,
      status: "STAGING",
      comms: { phone: "+1 (800)", channel: "OPS-120" },
      accentColor: "bg-zinc-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-12 font-sans selection:bg-blue-500/30">
      {/* Header Section */}
      <header className="flex justify-between items-start mb-16">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-[0.2em]">
              Operational Logistics Engine
            </span>
          </div>
          <h1 className="text-7xl font-bold text-white tracking-tighter leading-none">
            Resource
            <br />
            Management
          </h1>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex bg-zinc-900/50 border border-white/5 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                viewMode === "table"
                  ? "bg-zinc-800 text-white shadow-xl"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <List size={16} /> Table View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                viewMode === "map"
                  ? "bg-zinc-800 text-white shadow-xl"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <MapIcon size={16} /> Map Overlay
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-blue-300 hover:bg-blue-200 text-black rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <Plus size={18} /> Add Resource
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {viewMode === "table" ? (
          <>
            {/* Left Column: Table */}
            <div className="col-span-8">
              <nav className="flex gap-12 border-b border-white/5 mb-8">
                {["Shelters", "Medical Centers", "Rescue Teams"].map(
                  (tab, i) => (
                    <button
                      key={tab}
                      className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${i === 0 ? "text-white border-b-2 border-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </nav>

              <div className="bg-[#111111] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-black border-b border-white/5 bg-zinc-900/20">
                      <th className="text-left py-4 pl-10">Resource Name</th>
                      <th className="text-left py-4">Geographical Location</th>
                      <th className="text-left py-4">Current Capacity</th>
                      <th className="text-center py-4">Deployment Status</th>
                      <th className="text-left py-4">Comms Channel</th>
                      <th className="py-4 pr-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((res) => (
                      <ResourceRow key={res.id} {...res} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Sidebar Widgets */}
            <div className="col-span-4 flex flex-col gap-8">
              {/* Geospatial Distribution Widget */}
              <div className="bg-[#111111] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Live View
                  </span>
                  <div className="mt-28 flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-xl font-bold tracking-tight uppercase">
                        Geospatial Distribution
                      </h3>
                      <p className="text-zinc-500 text-xs font-bold mt-1 uppercase tracking-widest">
                        32 Units Deployed
                      </p>
                    </div>
                    <button className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      View Full Map <span>→</span>
                    </button>
                  </div>
                </div>
                {/* Map Decorative Element */}
                <div className="absolute top-0 right-0 w-full h-full opacity-30 grayscale brightness-125 mix-blend-lighten pointer-events-none translate-x-12 -translate-y-8">
                  <Globe
                    className="w-full h-full text-zinc-700"
                    strokeWidth={0.5}
                  />
                </div>
              </div>

              {/* Global Capacity Widget */}
              <div className="bg-[#111111] rounded-[2rem] p-8 border border-white/5 border-l-4 border-l-blue-400 flex flex-col">
                <div className="flex items-center gap-2 text-blue-400 mb-6">
                  <Zap size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Global Capacity
                  </span>
                </div>
                <div className="text-6xl font-black text-white tracking-tighter mb-4">
                  84.2%
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                  Total refuge capacity reached. 12 standby units ready for
                  tactical deployment within 30 minutes.
                </p>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-zinc-500">Shelter Load</span>
                      <span className="text-red-400">91%</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full">
                      <div className="h-full bg-red-400 w-[91%] rounded-full shadow-[0_0_10px_rgba(248,113,113,0.3)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-zinc-500">Medical Burn</span>
                      <span className="text-yellow-500">64%</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full">
                      <div className="h-full bg-yellow-500 w-[64%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-12">
            <div className="bg-[#111111] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl h-[760px]">
              <div className="flex items-center justify-between p-8 border-b border-white/5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    Resource Map Overlay
                  </p>
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    Disaster Relief Map
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className="rounded-full bg-white/5 px-5 py-3 text-xs uppercase font-bold tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  Back to Table
                </button>
              </div>
              <div className="relative h-full">
                <iframe
                  title="Resource Map Overlay"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-74.1%2C40.64%2C-73.9%2C40.78&layer=mapnik&marker=40.7128%2C-74.0060"
                  className="h-full w-full border-0"
                  allowFullScreen
                />
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-xl text-white">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase text-blue-400 tracking-[0.35em]">
                        Live Resource Heatmap
                      </p>
                      <p className="text-sm text-zinc-300 mt-2">
                        Resources are displayed across the affected region with
                        current deployment status.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-zinc-400 uppercase tracking-[0.2em] text-[10px]">
                          Shelters
                        </p>
                        <p className="text-xl font-bold text-white">12</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-zinc-400 uppercase tracking-[0.2em] text-[10px]">
                          Medical
                        </p>
                        <p className="text-xl font-bold text-white">8</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-zinc-400 uppercase tracking-[0.2em] text-[10px]">
                          Rescue
                        </p>
                        <p className="text-xl font-bold text-white">5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
