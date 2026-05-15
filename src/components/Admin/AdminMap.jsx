import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Map as MapIcon,
  Droplets,
  Home,
  Navigation,
  MapPin,
  X,
} from "lucide-react";
import Header from "./Header";
import SideBar from "./SideBar";
import { apiFetch } from "../../lib/api";

const AdminMap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Medical");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourceError, setResourceError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadResources = async () => {
      setLoadingResources(true);
      setResourceError("");
      try {
        const res = await apiFetch("/api/map/resources");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load resources");
        if (!cancelled) setResources(data.resources || []);
      } catch (error) {
        if (!cancelled)
          setResourceError(error.message || "Unable to fetch resources");
      } finally {
        if (!cancelled) setLoadingResources(false);
      }
    };

    loadResources();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const categoryLabel = String(res.category || "").toLowerCase();
      const matchesTab =
        (activeTab === "Medical" && categoryLabel === "medical") ||
        (activeTab === "Shelter" && categoryLabel === "shelter") ||
        (activeTab === "Rescue" && categoryLabel === "rescue");
      const search = searchTerm.toLowerCase().trim();
      const text =
        `${res.name || ""} ${res.type_label || ""} ${res.category || ""} ${res.distance_label || ""}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      return matchesTab && matchesSearch;
    });
  }, [resources, activeTab, searchTerm]);

  const selectedResource = resources.find((item) => item.id === selectedCenter);

  const handleNavigation = (lat, lng, name) => {
    const target =
      lat && lng
        ? `${lat},${lng}`
        : encodeURIComponent(name || "resource location");
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${target}`,
      "_blank",
    );
  };

  return (
    <section className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <aside className="w-64 h-full bg-[#1e1e1e] border-r border-gray-800 hidden md:flex flex-col">
        <SideBar />
      </aside>

      <main className="flex-1 h-full flex flex-col relative pl-9">
        <Header />

        <div className="flex-1 flex relative overflow-hidden bg-[#0a0a0a] p-4 lg:p-8">
          {/* LEFT SIDE: CENTERS PANEL */}
          <div className="w-100 h-full bg-[#1e1e1e]/95 backdrop-blur-xl border-r rounded-xl border-white/10 p-6 z-30 flex flex-col shadow-2xl">
            <div className="mb-4">
              <h2 className="text-xl font-bold uppercase tracking-tighter">
                Live Resource Hub
              </h2>
              <p className="text-xs mt-2 text-blue-400 font-bold tracking-widest uppercase">
                Real-time admin resource feed
              </p>
            </div>

            <div className="flex p-1 bg-black/40 rounded-lg mb-6 border border-white/5">
              {["Medical", "Shelter", "Rescue"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedCenter(null);
                  }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold uppercase transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {resourceError ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {resourceError}
                </div>
              ) : loadingResources ? (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-200">
                  Loading resources from the dashboard...
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                  No resources found for this category.
                </div>
              ) : (
                filteredResources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setSelectedCenter(res.id)}
                    className={`p-4 rounded-xl border-l-4 transition-all cursor-pointer ${
                      selectedCenter === res.id
                        ? "bg-blue-500/20 border-blue-400 scale-[1.02]"
                        : "bg-white/5 border-blue-500 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-blue-400">
                        {String(res.category || "").toUpperCase()}
                      </span>
                      <span className="text-[10px] opacity-40 font-mono">
                        {res.distance_label || res.capacity_text || "N/A"}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {res.name}
                    </h3>
                    <p className="text-[12px] text-gray-300 mt-1 font-semibold tracking-wide uppercase">
                      {res.type_label || "Unknown location"}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${res.status_color_class || "bg-blue-400"} animate-pulse`}
                        />
                        <span className="text-[10px] font-bold text-gray-400">
                          {res.status || "Unknown"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(res.lat, res.lng, res.name);
                        }}
                        className="p-1.5 rounded-md bg-white/5 hover:bg-blue-600 transition-colors"
                      >
                        <Navigation size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE: MAP VIEW */}
          <div className="flex-1 relative bg-[#0a0a0a]">
            <div className="absolute inset-0 z-0">
              <iframe
                title="Pakistan Map"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter:
                    "invert(90%) hue-rotate(180deg) brightness(0.6) contrast(1.2)",
                }}
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7500000!2d69.3451!3d30.3753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2spk!4v1700000000000"
                allowFullScreen
              ></iframe>
            </div>

            {/* SEARCH BAR (TOP CENTER) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-30">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources by name, location, or category..."
                  className="w-full bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none shadow-2xl transition-all"
                />
              </div>
            </div>

            {/* SELECTED RESOURCE SUMMARY */}
            {selectedCenter ? (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-6">
                <div className="rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-xl p-5 shadow-2xl">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
                        Selected Resource
                      </p>
                      <h3 className="text-lg font-bold text-white">
                        {selectedResource?.name || "Resource details"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCenter(null)}
                      className="rounded-full bg-white/5 p-2 text-gray-300 hover:bg-white/10"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                        Category
                      </p>
                      <p>{selectedResource?.category || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                        Status
                      </p>
                      <p>{selectedResource?.status || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                        Location
                      </p>
                      <p>{selectedResource?.type_label || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                        Coordinates
                      </p>
                      <p>
                        {selectedResource?.lat && selectedResource?.lng
                          ? `${selectedResource.lat}, ${selectedResource.lng}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* MAP TOOLS PANEL (RIGHT) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
              <div className="bg-[#1e1e1e]/90 p-2 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-2 backdrop-blur-md">
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="p-2.5 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all"
                  title="Reset Map"
                >
                  <MapIcon size={18} />
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Medical");
                    setSelectedCenter(null);
                  }}
                  className={`p-2.5 rounded-lg transition-all ${activeTab === "Medical" ? "text-blue-400 bg-white/10" : "text-gray-500 hover:bg-white/5"}`}
                >
                  <Droplets size={18} />
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Shelter");
                    setSelectedCenter(null);
                  }}
                  className={`p-2.5 rounded-lg transition-all ${activeTab === "Shelter" ? "text-blue-400 bg-white/10" : "text-gray-500 hover:bg-white/5"}`}
                >
                  <Home size={18} />
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Rescue");
                    setSelectedCenter(null);
                  }}
                  className={`p-2.5 rounded-lg transition-all ${activeTab === "Rescue" ? "text-blue-400 bg-white/10" : "text-gray-500 hover:bg-white/5"}`}
                >
                  <MapPin size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default AdminMap;
