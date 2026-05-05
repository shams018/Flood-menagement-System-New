import React, { useState, useMemo } from 'react'
import {
  Search,
  Map as MapIcon,
  Droplets,
  Home,
  Navigation,
  MapPin,
} from "lucide-react";
import Header from "./Header";
import SideBar from "./SideBar";

// --- PAKISTAN DATA SET ---
const PAKISTAN_RESOURCES = [
  { id: 1, type: "Medical", name: "Jinnah Medical Centre", location: "Karachi, Sindh", category: "Medical", status: "Optimal", color: "bg-green-500", distance: "2.1 KM", coords: { top: '82%', left: '44%' }, lat: 24.8607, lng: 67.0011 },
  { id: 2, type: "Shelter", name: "Sukkur Relief Hub", location: "Sukkur, Sindh", category: "Shelter", status: "70% Full", color: "bg-yellow-400", distance: "5.4 KM", coords: { top: '70%', left: '49%' }, lat: 27.7244, lng: 68.8228 },
  { id: 3, type: "Medical", name: "Mayo Hospital", location: "Lahore, Punjab", category: "Medical", status: "Optimal", color: "bg-green-500", distance: "1.2 KM", coords: { top: '42%', left: '76%' }, lat: 31.5204, lng: 74.3587 },
  { id: 4, type: "Shelter", name: "Multan Relief Camp", location: "Multan, Punjab", category: "Shelter", status: "Optimal", color: "bg-green-500", distance: "3.8 KM", coords: { top: '55%', left: '62%' }, lat: 30.1575, lng: 71.5249 },
  { id: 5, type: "Medical", name: "PIMS Hospital", location: "Islamabad", category: "Medical", status: "Critical", color: "bg-red-500", distance: "0.5 KM", isCritical: true, coords: { top: '28%', left: '72%' }, lat: 33.6844, lng: 73.0479 },
  { id: 6, type: "Medical", name: "Lady Reading Hospital", location: "Peshawar, KPK", category: "Medical", status: "Optimal", color: "bg-green-500", distance: "4.1 KM", coords: { top: '28%', left: '64%' }, lat: 34.0151, lng: 71.5249 },
  { id: 8, type: "Medical", name: "Civil Hospital", location: "Quetta, Balochistan", category: "Medical", status: "Limited", color: "bg-red-500", distance: "1.5 KM", isCritical: true, coords: { top: '58%', left: '35%' }, lat: 30.1798, lng: 66.9750 },
  { id: 10, type: "Medical", name: "DHQ Gilgit", location: "Gilgit, GB", category: "Medical", status: "Optimal", color: "bg-green-500", distance: "2.4 KM", coords: { top: '10%', left: '78%' }, lat: 35.9208, lng: 74.3089 },
];

const AdminMap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Medical");
  const [selectedCenter, setSelectedCenter] = useState(null);

  const filteredResources = useMemo(() => {
    return PAKISTAN_RESOURCES.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            res.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = res.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const handleNavigation = (lat, lng) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
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
              <h2 className="text-xl font-bold uppercase tracking-tighter">Pakistan Radar</h2>
              <p className="text-xs mt-2 text-blue-400 font-bold tracking-widest uppercase">Live Resource Hub</p>
            </div>

            <div className="flex p-1 bg-black/40 rounded-lg mb-6 border border-white/5">
              {["Medical", "Shelter"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSelectedCenter(null); }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold uppercase transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {filteredResources.map(res => (
                <div 
                  key={res.id} 
                  onClick={() => setSelectedCenter(res.id)}
                  className={`p-4 rounded-xl border-l-4 transition-all cursor-pointer ${selectedCenter === res.id ? "bg-blue-500/20 border-blue-400 scale-[1.02]" : "bg-white/5 border-blue-500 hover:bg-white/10"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-blue-400">{res.category}</span>
                    <span className="text-[10px] opacity-40 font-mono">{res.distance}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{res.name}</h3>
                  {/* City Name - Thora barra aur clear font */}
                  <p className="text-[12px] text-gray-300 mt-1 font-semibold tracking-wide uppercase">{res.location}</p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${res.color} animate-pulse`} />
                      <span className="text-[10px] font-bold text-gray-400">{res.status}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNavigation(res.lat, res.lng); }}
                      className="p-1.5 rounded-md bg-white/5 hover:bg-blue-600 transition-colors"
                    >
                      <Navigation size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: MAP VIEW */}
          <div className="flex-1 relative bg-[#0a0a0a]">
            
            <div className="absolute inset-0 z-0">
              <iframe
                title="Pakistan Map"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.6) contrast(1.2)' }} 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7500000!2d69.3451!3d30.3753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2spk!4v1700000000000"
                allowFullScreen
              ></iframe>
            </div>

            {/* SEARCH BAR (TOP CENTER) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Pakistan Centers..."
                  className="w-full bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none shadow-2xl transition-all"
                />
              </div>
            </div>

            {/* DYNAMIC PINS ON MAP */}
            {filteredResources.map(res => (
              <div 
                key={res.id} 
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ top: res.coords.top, left: res.coords.left }}
              >
                {/* Tooltip: Active if selected or hovered */}
                <div className={`absolute bottom-full mb-2 ${selectedCenter === res.id ? 'block scale-110' : 'hidden group-hover:block'} bg-slate-900 border border-blue-500/30 p-2 rounded shadow-2xl min-w-[140px] backdrop-blur-md z-50 transition-all`}>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">{res.type}</p>
                  <p className="text-[11px] text-white font-semibold">{res.name}</p>
                  {selectedCenter === res.id && <p className="text-[9px] text-green-400 mt-1 animate-pulse font-bold tracking-widest uppercase italic">Selected</p>}
                </div>

                <MapPin 
                  onClick={() => setSelectedCenter(res.id)}
                  className={`${res.id === selectedCenter ? 'text-blue-400 scale-150' : res.isCritical ? 'text-red-500' : 'text-blue-500'} cursor-pointer hover:scale-125 transition-all duration-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]`} 
                  size={selectedCenter === res.id ? 36 : 30} 
                  fill="currentColor" 
                  fillOpacity={0.2} 
                />
              </div>
            ))}

            {/* MAP TOOLS PANEL (RIGHT) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
              <div className="bg-[#1e1e1e]/90 p-2 rounded-xl border border-white/10 shadow-2xl flex flex-col gap-2 backdrop-blur-md">
                <button 
                  onClick={() => { window.location.reload(); }}
                  className="p-2.5 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all"
                  title="Reset Map"
                >
                  <MapIcon size={18}/>
                </button>
                <button 
                  onClick={() => { setActiveTab("Medical"); setSelectedCenter(null); }}
                  className={`p-2.5 rounded-lg transition-all ${activeTab === "Medical" ? "text-blue-400 bg-white/10" : "text-gray-500 hover:bg-white/5"}`}
                >
                  <Droplets size={18}/>
                </button>
                <button 
                  onClick={() => { setActiveTab("Shelter"); setSelectedCenter(null); }}
                  className={`p-2.5 rounded-lg transition-all ${activeTab === "Shelter" ? "text-blue-400 bg-white/10" : "text-gray-500 hover:bg-white/5"}`}
                >
                  <Home size={18}/>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </section>
  );
}

export default AdminMap;