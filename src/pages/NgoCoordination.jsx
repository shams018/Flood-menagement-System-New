import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
} from "lucide-react";
import { ROUTES } from "../routes";
import { API_BASE } from "../lib/config";

const NgoCard = ({
  name,
  type,
  status,
  statusColor,
  location,
  contact,
  isActive,
}) => (
  <div
    className={`p-4 mb-4 rounded-xl border-l-4 transition-all hover:bg-white/5 cursor-pointer ${isActive ? "border-green-400" : "border-blue-400"}`}
  >
    <div className="flex justify-between items-start mb-1">
      <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
        {type}
      </span>
      <div className={`w-2 h-2 rounded-full ${statusColor}`} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <MapPin size={12} />
        <span>{location}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Phone size={12} />
        <span>{contact}</span>
      </div>
    </div>
    <div className="flex justify-between items-center mt-3">
      <span
        className={`text-xs font-medium ${isActive ? "text-green-400" : "text-gray-300"}`}
      >
        {status}
      </span>
      <button
        type="button"
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
      >
        <MessageSquare size={16} className="text-white opacity-80" />
      </button>
    </div>
  </div>
);

const NgoCoordination = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/ngos`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load NGOs");
        if (!cancelled) {
          setNgos(data.ngos || []);
          setLoadError("");
        }
      } catch (e) {
        if (!cancelled) setLoadError(e.message || "Network error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = ngos.filter((n) => n.is_active).length;
  const responseTeams = Math.max(activeCount * 7, ngos.length * 3);

  return (
    <section className="flex h-screen bg-slate-900 text-white">
      {/* Left Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            Sentinel - User Dashboard
          </p>
          <h2 className="text-2xl font-bold text-white mb-1">Protocol Alpha</h2>
          <small className="text-xs text-gray-500 uppercase tracking-widest">
            FLOOD MONITORING
          </small>

          <nav className="mt-8 flex flex-col gap-2">
            <button
              className="py-3 px-4 text-gray-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-colors"
              type="button"
              onClick={() => navigate(ROUTES.dashboard)}
            >
              DASHBOARD
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-colors"
              type="button"
              onClick={() => navigate(ROUTES.liveMap)}
            >
              LIVE MAP
            </button>
            <button
              className="py-3 px-4 text-gray-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-colors"
              type="button"
            >
              VICTIM REPORTS
            </button>
            <button
              className="py-3 px-4 bg-blue-600/20 text-blue-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-blue-600/30 transition-colors"
              type="button"
            >
              NGO COORDINATION
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-700 mt-auto">
          <div className="flex gap-3 mb-6">
            <button
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded text-xs font-semibold uppercase transition-colors"
              type="button"
            >
              SETTINGS
            </button>
            <button
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded text-xs font-semibold uppercase transition-colors"
              type="button"
            >
              SUPPORT
            </button>
          </div>
          <article className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
              STATUS
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Coordinating with {ngos.length || 12} active NGOs across flood
              zones.
            </p>
          </article>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-slate-900 font-sans text-gray-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_50%)]" />
        </div>

        {/* Header */}
        <div className="relative z-10 p-8 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                NGO Coordination Hub
              </h1>
              <p className="text-gray-400">
                Real-time coordination with relief organizations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Active Partners
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {ngos.length || "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Response Teams
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {ngos.length ? responseTeams : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="relative z-10 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NGO List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-[32px] border border-white/10 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Active NGOs
                </h2>
                <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full uppercase tracking-tighter">
                  {activeCount} Online
                </span>
              </div>

              {loadError ? (
                <p className="text-sm text-red-400 mb-4">{loadError}</p>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ngos.map((n) => (
                  <NgoCard
                    key={n.id}
                    name={n.name}
                    type={n.type}
                    status={n.status}
                    statusColor={n.status_color_class}
                    location={n.location}
                    contact={n.contact}
                    isActive={n.is_active}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coordination Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-[32px] border border-white/10 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase text-sm rounded-lg transition-colors">
                  Request Emergency Aid
                </button>
                <button className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold uppercase text-sm rounded-lg border border-slate-600 transition-colors">
                  Update Resource Status
                </button>
                <button className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold uppercase text-sm rounded-lg border border-slate-600 transition-colors">
                  Send Coordination Alert
                </button>
              </div>
            </div>

            {/* Communication Log */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-[32px] border border-white/10 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Recent Communications
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">
                      Medical supplies delivered to Sector 4
                    </p>
                    <p className="text-xs text-gray-400">
                      Red Cross • 2 min ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Clock size={16} className="text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">
                      Awaiting evacuation team assignment
                    </p>
                    <p className="text-xs text-gray-400">
                      Global Aid • 5 min ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">
                      Additional shelter capacity needed
                    </p>
                    <p className="text-xs text-gray-400">
                      Flood Relief Alliance • 8 min ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Status */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-[32px] border border-white/10 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Resource Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Medical Kits</span>
                  <span className="text-sm font-bold text-green-400">
                    247 Available
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Food Packages</span>
                  <span className="text-sm font-bold text-yellow-400">
                    89 Low
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Water Supplies</span>
                  <span className="text-sm font-bold text-green-400">
                    1,203 Available
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Shelter Units</span>
                  <span className="text-sm font-bold text-red-400">
                    12 Critical
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default NgoCoordination;
