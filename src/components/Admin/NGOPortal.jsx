import React, { useState } from 'react';
import { 
  LayoutDashboard, UserPlus, ClipboardCheck, Radio, ShieldCheck, 
  MapPin, Phone, Briefcase, Activity, CheckCircle, 
  History, AlertTriangle, Menu, X, Bell, Search, Settings, 
  HelpCircle, MoreHorizontal, ArrowUpRight, Globe
} from 'lucide-react';

const NGOPortal = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- TACTICAL DATA ---
  const tasks = [
    { id: 1, title: "Ration Logistics", ngo: "Al-Khidmat", status: "In Progress", priority: "High", region: "Sector G-9" },
    { id: 2, title: "Medical Trauma Unit", ngo: "Edhi Foundation", status: "Pending", priority: "Critical", region: "Rawal Dam" },
    { id: 3, title: "Water Filtration", ngo: "Hands Org", status: "Completed", priority: "Low", region: "Soan River" },
  ];

  return (
    <div className="flex h-screen w-full bg-[#05070a] text-slate-100 overflow-hidden font-sans">
      {/* Scrollbar Hidden Utility */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-panel { background: rgba(13, 17, 28, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      {/* --- ELITE SIDEBAR --- */}
      <aside className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:relative z-50 w-72 h-full bg-[#090b14] border-r border-white/5 transition-all duration-500 ease-in-out flex flex-col shrink-0
      `}>
        <div className="p-8 flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500 blur-md opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 rounded-2xl">
              <ShieldCheck size={28} className="text-slate-950" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">Vanguard</h1>
            <p className="text-[9px] text-sky-400/80 font-bold uppercase tracking-[0.3em] mt-1.5">NGO Coordination</p>
          </div>
        </div>

        <nav className="flex-1 px-5 space-y-1.5 mt-8 overflow-y-auto no-scrollbar">
          <SectionLabel label="Operations" />
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeView === 'dashboard'} onClick={() => {setActiveView('dashboard'); setSidebarOpen(false);}} />
          <SidebarLink icon={<UserPlus size={18}/>} label="NGO Registry" active={activeView === 'reg'} onClick={() => {setActiveView('reg'); setSidebarOpen(false);}} />
          <SidebarLink icon={<ClipboardCheck size={18}/>} label="Mission Board" active={activeView === 'board'} onClick={() => {setActiveView('board'); setSidebarOpen(false);}} />
          <SidebarLink icon={<Radio size={18}/>} label="Live Intel" active={activeView === 'news'} onClick={() => {setActiveView('news'); setSidebarOpen(false);}} />
          
          <div className="pt-6">
            <SectionLabel label="Systems" />
            <SidebarLink icon={<Settings size={18}/>} label="Configurations" onClick={() => {}} />
            <SidebarLink icon={<HelpCircle size={18}/>} label="Tech Support" onClick={() => {}} />
          </div>
        </nav>

        {/* User Quick Profile */}
        <div className="p-6 mt-auto">
          <div className="glass-panel p-4 rounded-[24px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex-shrink-0 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/shapes/svg?seed=NGO" alt="User" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate uppercase">NGO Admin</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Verified Unit</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN INTERFACE --- */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        
        {/* Superior Header */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 md:px-12 shrink-0 bg-[#05070a]/60 backdrop-blur-xl z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-sky-400 transition-all">
              {isSidebarOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
            <div className="flex flex-col">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 leading-none">Tactical Overview</h2>
                <span className="text-[10px] font-bold text-sky-500/60 mt-1 uppercase">Region: Islamabad Capital Territory</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl focus-within:ring-1 ring-sky-500/30 transition-all">
              <Search size={16} className="text-slate-500" />
              <input placeholder="SEARCH OPERATIONAL DATABASE..." className="bg-transparent border-none text-[9px] font-bold outline-none w-56 uppercase tracking-[0.2em] placeholder:text-slate-700" />
            </div>
            <div className="flex items-center gap-4">
                <div className="relative p-3 glass-panel rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                    <Bell size={18} className="text-slate-400 group-hover:text-white" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full border-2 border-[#05070a]"></span>
                </div>
                <div className="p-3 glass-panel rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                    <Globe size={18} className="text-slate-400 group-hover:text-white" />
                </div>
            </div>
          </div>
        </header>

        {/* Tactical Canvas Area */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
          <div className="max-w-[1500px] mx-auto space-y-12">
            {activeView === 'dashboard' && <DashboardView tasks={tasks} />}
            {activeView === 'reg' && <RegistrationForm />}
            {activeView === 'board' && <MissionBoard tasks={tasks} />}
            {activeView === 'news' && <IntelView />}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- ELITE VIEWS ---

const DashboardView = ({ tasks }) => (
  <div className="space-y-12 animate-in fade-in duration-700">
    {/* Dynamic Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Registered NGOs" value="28" icon={<Users size={20}/>} color="sky" />
      <StatCard label="Active Missions" value="14" icon={<Activity size={20}/>} color="blue" />
      <StatCard label="Completion Rate" value="88%" icon={<CheckCircle size={20}/>} color="green" />
      <StatCard label="Critical Alerts" value="03" icon={<AlertTriangle size={20}/>} color="red" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Tasks Panel */}
      <div className="xl:col-span-8 glass-panel rounded-[40px] p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Mission Logs</h3>
                <p className="text-sm font-bold text-white mt-1 uppercase tracking-tight">Active Deployments</p>
            </div>
            <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreHorizontal/></button>
        </div>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-6 rounded-[28px] bg-white/[0.02] border border-white/5 hover:border-sky-500/20 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner ${
                    task.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-sky-500/10 text-sky-400'
                }`}>
                    <ClipboardCheck size={20} />
                </div>
                <div>
                    <p className="text-base font-black uppercase tracking-tight text-white">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{task.ngo}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><MapPin size={10}/> {task.region}</span>
                    </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border ${
                    task.priority === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-900 text-slate-400 border-white/5'
                }`}>
                    {task.priority}
                </span>
                <ArrowUpRight size={18} className="text-slate-700 group-hover:text-sky-400 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Intel Panel */}
      <div className="xl:col-span-4 space-y-6">
          <div className="glass-panel rounded-[40px] p-8 bg-gradient-to-br from-sky-500/10 to-transparent border-sky-500/10">
              <div className="flex items-center gap-3 text-sky-400 mb-6">
                <Radio size={20} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Broadcast</span>
              </div>
              <p className="text-lg font-bold text-slate-200 leading-tight italic">"Emergency convoy arriving at Sector G-9. All NGOs coordinate for last-mile delivery."</p>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auth: Command Central</span>
                  <span className="text-[9px] font-bold text-sky-500/60 uppercase tracking-widest">12m Ago</span>
              </div>
          </div>
          
          <div className="glass-panel rounded-[40px] p-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                <History size={14}/> Node Activity
              </h4>
              <div className="space-y-6">
                  <ActivityItem label="NGO Edhi registered" time="2m ago" />
                  <ActivityItem label="Water Task #442 closed" time="18m ago" />
                  <ActivityItem label="Resource request: Medical" time="1h ago" />
              </div>
          </div>
      </div>
    </div>
  </div>
);

const RegistrationForm = () => (
  <div className="max-w-3xl mx-auto glass-panel rounded-[48px] p-12 md:p-16 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
    <div className="text-center mb-16">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">NGO <span className="text-sky-400">Registry</span></h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-4 italic opacity-60">Authorize Humanitarian Credentials</p>
    </div>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2"><InputField label="Organization Nomenclature" placeholder="e.g. Hope Alliance" icon={<Globe size={18}/>} /></div>
        <InputField label="Assigned Lead" placeholder="Name of Representative" icon={<ShieldCheck size={18}/>} />
        <InputField label="Encrypted Comms" placeholder="+92 3XX XXXXXXX" icon={<Phone size={18}/>} />
        <InputField label="Service Core" placeholder="e.g. Medical / Rescue" icon={<Briefcase size={18}/>} />
        <InputField label="Operational Zone" placeholder="e.g. Sector G-10" icon={<MapPin size={18}/>} />
        <div className="md:col-span-2 pt-8">
            <button className="w-full bg-white text-slate-950 py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-sky-400 transition-all active:scale-95">
                Establish Protocol
            </button>
        </div>
    </form>
  </div>
);

// --- ATOMIC COMPONENTS ---

const SectionLabel = ({ label }) => (
    <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 mb-4 mt-6">{label}</p>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[22px] transition-all duration-300 group relative ${
      active 
      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-sky-500/20' 
      : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-200'
    }`}
  >
    <span className={`${active ? 'text-slate-950' : 'group-hover:text-sky-400'} transition-colors`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    sky: 'text-sky-400 bg-sky-400/5 border-sky-400/10',
    blue: 'text-blue-400 bg-blue-400/5 border-blue-400/10',
    green: 'text-green-400 bg-green-400/5 border-green-400/10',
    red: 'text-red-400 bg-red-400/5 border-red-400/10'
  };
  return (
    <div className="glass-panel p-8 rounded-[32px] group hover:bg-white/[0.03] transition-all cursor-default">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">{label}</p>
      <p className="text-4xl font-black text-white tracking-tighter leading-none">{value}</p>
    </div>
  );
};

const InputField = ({ label, placeholder, icon }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] ml-4">{label}</label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-sky-500 transition-colors">{icon}</div>
      <input 
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-white/5 rounded-[24px] px-16 py-5 text-sm text-white focus:border-sky-500/40 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all placeholder:text-slate-800 font-medium tracking-wide"
      />
    </div>
  </div>
);

const ActivityItem = ({ label, time }) => (
    <div className="flex items-center justify-between group cursor-default">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-sky-500 transition-colors"></div>
            <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-tight">{label}</span>
        </div>
        <span className="text-[9px] font-black text-slate-700 uppercase">{time}</span>
    </div>
);

// Mission Board and Intel View placeholders...
const MissionBoard = ({ tasks }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Central <span className="text-sky-400">Board</span></h2>
            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all">
                <ArrowUpRight size={16} className="text-sky-400"/>
                <span className="text-[10px] font-black uppercase tracking-widest">Global Status</span>
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map(t => (
                <div key={t.id} className="glass-panel p-8 rounded-[40px] hover:border-sky-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.region}</span>
                        <div className={`p-2 rounded-lg ${t.status === 'Completed' ? 'bg-green-500/10' : 'bg-sky-500/10'}`}>
                            {t.status === 'Completed' ? <CheckCircle size={14} className="text-green-500"/> : <Activity size={14} className="text-sky-500"/>}
                        </div>
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-white mb-2 leading-tight group-hover:text-sky-400 transition-colors">{t.title}</h4>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t.ngo}</p>
                    <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{t.status}</span>
                        <button className="text-[9px] font-black uppercase text-slate-700 hover:text-white transition-colors">Details</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const IntelView = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex items-center gap-6 mb-16">
            <div className="w-16 h-16 rounded-[28px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-2xl">
                <Radio size={28} className="text-sky-400 animate-pulse"/>
            </div>
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Live <span className="text-sky-400">Intel</span> Feed</h2>
                <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em] mt-2">Authenticated Broadcast Stream</p>
            </div>
        </div>
        {[1, 2, 3].map(i => (
            <div key={i} className="glass-panel p-10 rounded-[50px] relative group hover:bg-white/[0.02] transition-all">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-sky-500/50 rounded-full scale-y-50 group-hover:scale-y-100 transition-transform"></div>
                <div className="flex justify-between items-start mb-6">
                    <span className="text-[11px] font-black text-sky-400 uppercase tracking-[0.4em]">Auth: Command Central</span>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{i * 10}m Ago</span>
                </div>
                <p className="text-xl font-medium text-slate-300 italic leading-relaxed pr-10">"Surge in river water level detected at Station {i}. All relief units at Zone Delta to enter high-alert state."</p>
            </div>
        ))}
    </div>
);

export default NGOPortal;