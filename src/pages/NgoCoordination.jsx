import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import {
  MessageSquare,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
} from "lucide-react";
import PageSidebar from "../components/PageSidebar";
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
    className={`p-5 rounded-[26px] border border-slate-700 bg-slate-950/80 transition duration-200 hover:-translate-y-1 hover:bg-slate-900/90 shadow-sm ${isActive ? "border-green-400/30" : "border-blue-400/30"}`}
  >
    <div className="flex justify-between items-start mb-3 gap-3">
      <div>
        <span className="text-[10px] uppercase tracking-[0.45em] font-bold text-slate-400">
          {type}
        </span>
        <h3 className="text-xl font-semibold text-white mt-3">{name}</h3>
      </div>
      <div className={`flex h-3 w-3 rounded-full ${statusColor}`} />
    </div>
    <div className="space-y-3 text-sm text-slate-300">
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-cyan-300" />
        <span>{location}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone size={14} className="text-cyan-300" />
        <span>{contact}</span>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <span
        className={`text-xs font-medium ${isActive ? "text-green-400" : "text-slate-400"}`}
      >
        {status}
      </span>
      <button
        type="button"
        className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-300 transition duration-200 hover:bg-cyan-500/20"
      >
        <MessageSquare size={16} className="text-white" />
      </button>
    </div>
  </div>
);

const NgoCoordination = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNgos = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/ngos");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load NGOs");
      setNgos(data.ngos || []);
      setLoadError("");
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      setLoadError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (cancelled) return;
      await fetchNgos();
    };

    const handleNgoRegistered = () => {
      if (!cancelled) {
        fetchNgos();
      }
    };

    load();
    const interval = setInterval(load, 10000);
    window.addEventListener("ngoRegistered", handleNgoRegistered);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("ngoRegistered", handleNgoRegistered);
    };
  }, []);

  const activeCount = ngos.filter((n) => n.is_active).length;
  const responseTeams = Math.max(activeCount * 7, ngos.length * 3);

  return (
    <section className="flex min-h-screen bg-slate-950 text-white">
      <PageSidebar />

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-slate-900 font-sans text-gray-200 lg:ml-72">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_50%)]" />
        </div>

        {/* Header */}
        <div className="relative z-10 p-8 border-b border-slate-700">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                NGO Coordination Hub
              </h1>
              <p className="text-gray-400">
                Real-time coordination with relief organizations
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
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
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {loading
                  ? "Refreshing..."
                  : lastUpdated
                    ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}`
                    : "Loading..."}
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
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.emergencySos)}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase text-sm rounded-lg transition-colors"
                >
                  Request Emergency Aid
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.assets)}
                  className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold uppercase text-sm rounded-lg border border-slate-600 transition-colors"
                >
                  Update Resource Status
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.notifications)}
                  className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold uppercase text-sm rounded-lg border border-slate-600 transition-colors"
                >
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
