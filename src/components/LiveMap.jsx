import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Map as MapIcon,
  Droplets,
  Home,
  Plus,
  Navigation,
} from "lucide-react";
import { ROUTES } from "../routes";

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
      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
        <Navigation size={16} className="text-white opacity-80" />
      </button>
    </div>
  </div>
);

const LiveMap = () => {
  const navigate = useNavigate();

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
              className="py-3 px-4 bg-blue-600/20 text-blue-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-blue-600/30 transition-colors"
              type="button"
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
              className="py-3 px-4 text-gray-400 rounded font-semibold uppercase text-sm tracking-wide text-left hover:bg-slate-700/50 transition-colors"
              type="button"
              onClick={() => navigate(ROUTES.ngoCoordination)}
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
              System operational. Monitoring flood zones in real-time.
            </p>
          </article>
        </div>
      </aside>

      {/* Main Map Content */}
      <main className="flex-1 relative overflow-hidden bg-slate-900 font-sans text-gray-200">
        {/* Background Map Placeholder */}
        <div className="absolute inset-0 opacity-40 grayscale contrast-125">
          <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-74.006,40.7128,12/1200x800?access_token=YOUR_TOKEN')] bg-cover" />
        </div>

        {/* Top Search Bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-20">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search coordinates or locations..."
              className="w-full bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-12 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-2xl transition-all"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="absolute left-6 top-24 bottom-6 w-[380px] bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl z-20 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Nearby Resources
            </h1>
            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase tracking-tighter">
              24 Found
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-4 mb-8">
            <button className="px-6 py-2 rounded-lg bg-blue-400 text-[#121212] font-bold text-xs uppercase tracking-wider transition-transform active:scale-95">
              Shelters
            </button>
            <button className="px-6 py-2 rounded-lg text-gray-500 font-bold text-xs uppercase tracking-wider hover:text-gray-300 transition-colors">
              Medical
            </button>
          </div>

          {/* Resource List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
            <ResourceCard
              type="Emergency Shelter Alpha"
              name="Civic Center Plaza"
              distance="0.8 MI"
              status="85% Capacity"
              statusColor="bg-yellow-400"
            />
            <ResourceCard
              type="Medical Center Delta"
              name="St. Jude Field Hospital"
              distance="2.4 MI"
              status="Open - Low Traffic"
              statusColor="bg-green-500"
            />
            <ResourceCard
              type="Evacuation Hub"
              name="North Harbor Pier"
              distance="4.1 MI"
              status="CRITICAL: AT CAPACITY"
              statusColor="bg-red-500"
              isCritical={true}
            />
          </div>

          {/* Status Legend Footer */}
          <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Safe
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Warning
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Critical
              </span>
            </div>
          </div>
        </div>

        {/* Right Floating Map Controls */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
          <div className="flex flex-col bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl gap-2">
            <button className="p-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
              <MapIcon size={20} />
            </button>
            <button className="p-3 rounded-xl text-gray-500 hover:bg-white/5 transition-colors">
              <Droplets size={20} />
            </button>
            <button className="p-3 rounded-xl text-gray-500 hover:bg-white/5 transition-colors">
              <Home size={20} />
            </button>
            <div className="h-px bg-white/10 mx-2 my-1" />
            <button className="p-3 rounded-xl text-gray-500 hover:bg-white/5 transition-colors">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </main>
    </section>
  );
};

export default LiveMap;
