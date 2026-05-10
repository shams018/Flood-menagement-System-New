import React, { useState } from 'react';
import { Table, Plus, Globe, Activity, ShieldAlert, ChevronRight, X, Map, MoreVertical, Edit, Trash2, Eye, Layout, MapPin, Radio, Users } from 'lucide-react';
import SideBar from './SideBar';
import Header from './Header';

/**
 * RESOURCE MANAGEMENT PAGE
 * A tactical dashboard for managing disaster relief resources.
 */
const ResourceManagement = () => {
  const [activeTab, setActiveTab] = useState('Shelters');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    location: '',
    capacity: '',
    maxCapacity: '',
    status: '',
    channel: '',
  });

  const [resources, setResources] = useState({
    'Shelters': [
      { id: 'SH-0442', name: 'Central Civic Hub', location: 'North District, Sector 4', capacity: 450, maxCapacity: 500, status: 'CRITICAL FILL', channel: '+1 (800) OPS-442', color: 'bg-red-500' },
      { id: 'SH-0891', name: 'St. Jude Relief Wing', location: 'East Basin, Zone B', capacity: 112, maxCapacity: 250, status: 'OPERATIONAL', channel: '+1 (800) OPS-891', color: 'bg-yellow-500' },
      { id: 'SH-0120', name: 'Unity High Gym', location: 'Harbor District', capacity: 45, maxCapacity: 300, status: 'STAGING', channel: '+1 (800) OPS-120', color: 'bg-blue-400' }
    ],
    'Medical Centers': [
      { id: 'MC-1198', name: 'Mercy Trauma Unit', location: 'Harbor District, West Zone', capacity: 72, maxCapacity: 120, status: 'OPERATIONAL', channel: '+1 (800) MED-1198', color: 'bg-emerald-400' },
      { id: 'MC-2207', name: 'Field Care Outpost', location: 'East Basin, Relief Sector', capacity: 19, maxCapacity: 80, status: 'CRITICAL FILL', channel: '+1 (800) MED-2207', color: 'bg-red-500' },
    ],
    'Rescue Teams': [
      { id: 'RT-3344', name: 'Delta Search Squad', location: 'Sector 7 Perimeter', capacity: 25, maxCapacity: 30, status: 'DEPLOYED', channel: '+1 (800) RES-3344', color: 'bg-sky-400' },
      { id: 'RT-8821', name: 'Rapid Water Response', location: 'North Dam Channel', capacity: 12, maxCapacity: 20, status: 'STAGING', channel: '+1 (800) RES-8821', color: 'bg-amber-400' },
    ],
  });

  const currentResources = resources[activeTab];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (isEditing && selectedResource) {
      setResources(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(res =>
          res.id === selectedResource.id
            ? { ...res, ...formValues, capacity: parseInt(formValues.capacity), maxCapacity: parseInt(formValues.maxCapacity) }
            : res
        )
      }));
      setSuccessMessage('Resource updated successfully!');
      setIsEditing(false);
    } else {
      const newResource = {
        id: `${activeTab.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
        ...formValues,
        capacity: parseInt(formValues.capacity),
        maxCapacity: parseInt(formValues.maxCapacity),
        color: 'bg-blue-400',
      };
      setResources(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newResource] }));
      setSuccessMessage('Resource added successfully!');
    }
    closeAddModal();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setShowDetailModal(true);
    setOpenMenuId(null);
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setFormValues({
      name: resource.name, location: resource.location,
      capacity: resource.capacity.toString(), maxCapacity: resource.maxCapacity.toString(),
      status: resource.status, channel: resource.channel,
    });
    setIsEditing(true);
    setShowAddModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    setResources(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(res => res.id !== selectedResource.id)
    }));
    setSuccessMessage('Resource deleted successfully!');
    setShowDeleteConfirm(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setIsEditing(false);
    setFormValues({ name: '', location: '', capacity: '', maxCapacity: '', status: '', channel: '' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#090b14] text-slate-100">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- FIXED SIDEBAR --- */}
      <aside className="hidden md:block shrink-0 h-screen sticky top-0 border-r border-white/5 bg-[#090b14]">
        <SideBar />
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        {successMessage && (
          <div className="fixed top-4 right-4 z-110 bg-sky-500 text-slate-950 px-6 py-3 rounded-full shadow-2xl font-black uppercase tracking-widest text-[10px]">
            {successMessage}
          </div>
        )}

        {/* --- SCROLLABLE CONTENT --- */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 lg:p-8 bg-[#090b14]">
          <div className="max-w-400 mx-auto space-y-8">
            <section className="rounded-[40px] border border-white/5 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-sky-300 font-bold">
                    <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
                    Operational Logistics Engine
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-tight">
                    Resource <span className="text-sky-300">Management</span>
                  </h1>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex rounded-full border border-white/5 bg-slate-900/90 p-1.5 shadow-lg backdrop-blur-md">
                    <button className="flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-950">
                      <Table size={14} /> Table
                    </button>
                    <button className="flex items-center gap-2 rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition">
                      <Map size={14} /> Map
                    </button>
                  </div>
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-white text-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-sky-50"
                    onClick={() => { setIsEditing(false); setShowAddModal(true); }}
                  >
                    <Plus size={16} /> Add Resource
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 rounded-4xl border border-white/5 bg-slate-950 p-6 shadow-2xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                  <div className="flex flex-wrap gap-2">
                    {['Shelters', 'Medical Centers', 'Rescue Teams'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="text-white">{currentResources.length}</span> Records Active
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-3xl border border-white/10 bg-slate-900">
                  <table className="w-full min-w-180 text-left text-sm">
                    <thead className="bg-slate-950/90 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Resource Name</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Capacity</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {currentResources.map((res) => (
                        <tr key={res.id} className="transition hover:bg-white/2 group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`h-10 w-1.5 rounded-full ${res.color}`} />
                              <div>
                                <p className="font-black uppercase tracking-tight text-white">{res.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">ID: {res.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-xs font-semibold text-slate-400 uppercase tracking-widest">{res.location}</td>
                          <td className="px-6 py-5">
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase font-black">{res.capacity}/{res.maxCapacity}</p>
                              <div className="h-1.5 w-32 rounded-full bg-white/5 overflow-hidden">
                                <div className={`${res.color} h-full transition-all duration-1000`} style={{ width: `${(res.capacity / res.maxCapacity) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${res.status === 'CRITICAL FILL' ? 'bg-red-900/20 text-red-400 border-red-500/20' : 'bg-sky-900/20 text-sky-400 border-sky-500/20'}`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right relative">
                            <button onClick={() => setOpenMenuId(openMenuId === res.id ? null : res.id)} className="text-slate-500 hover:text-white p-2">
                              <MoreVertical size={20} />
                            </button>
                            {openMenuId === res.id && (
                              <div className="absolute right-6 top-12 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl z-50 min-w-40 overflow-hidden">
                                <button onClick={() => handleViewResource(res)} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-slate-300 hover:bg-white/5 border-b border-white/5"><Eye size={14}/> View Details</button>
                                <button onClick={() => handleEditResource(res)} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-slate-300 hover:bg-white/5 border-b border-white/5"><Edit size={14}/> Edit Record</button>
                                <button onClick={() => {setSelectedResource(res); setShowDeleteConfirm(true); setOpenMenuId(null);}} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-400 hover:bg-white/5"><Trash2 size={14}/> Delete</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* --- RIGHT SIDEBAR --- */}
              <aside className="lg:col-span-4 space-y-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-250px)]">
                <div className="rounded-[40px] border border-white/5 bg-slate-900 p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 text-sky-400 font-bold uppercase text-[10px] tracking-widest"><Globe size={18} /> Live View</div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase">32 Units Active</span>
                  </div>
                  <div className="h-64 rounded-[30px] bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center grayscale brightness-75 contrast-125 border border-white/5" />
                </div>

                <div className="rounded-[40px] border border-white/5 bg-linear-to-br from-slate-900 to-slate-950 p-10 shadow-xl">
                  <div className="flex items-center gap-3 text-sky-400 mb-8 font-bold uppercase text-[10px] tracking-widest"><Activity size={18} /> Operational Pulse</div>
                  <div className="space-y-6">
                    <p className="text-6xl font-light text-white tracking-tighter">84.2<span className="text-xl text-sky-500 ml-1">%</span></p>
                    <StatBar label="Shelter Load" value={91} color="bg-red-500" />
                    <StatBar label="Medical Burn" value={64} color="bg-amber-400" />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>

      {/* --- ATTRACTIVE VIEW DETAILS MODAL --- */}
      {showDetailModal && selectedResource && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={() => setShowDetailModal(false)}>
          <div className="w-full max-w-2xl bg-[#090b14] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(56,189,248,0.1)] relative" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header with Glow */}
            <div className={`h-2 w-full ${selectedResource.color} shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
            
            <div className="p-10 space-y-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-sky-400 mb-4">
                    <Layout size={12}/> Resource Profile
                  </div>
                  <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedResource.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-[0.4em]">{selectedResource.id}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-4 rounded-full bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white transition-all shadow-inner border border-white/5">
                  <X size={20}/>
                </button>
              </div>

              {/* Tactical Grid Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-white/5 rounded-4xl p-6 group hover:border-sky-500/30 transition-all duration-500">
                  <div className="flex items-center gap-3 text-slate-600 mb-4">
                    <MapPin size={18} className="group-hover:text-sky-400"/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Location Zone</span>
                  </div>
                  <p className="text-lg font-bold text-slate-200 uppercase leading-tight">{selectedResource.location}</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-4xl p-6 group hover:border-sky-500/30 transition-all duration-500">
                  <div className="flex items-center gap-3 text-slate-600 mb-4">
                    <Radio size={18} className="group-hover:text-sky-400 animate-pulse"/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Comm Channel</span>
                  </div>
                  <p className="text-lg font-bold text-slate-200 uppercase leading-tight">{selectedResource.channel}</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-4xl p-6 group hover:border-sky-500/30 transition-all duration-500">
                   <div className="flex items-center gap-3 text-slate-600 mb-4">
                    <Users size={18} className="group-hover:text-sky-400"/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Load Status</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <p className="text-2xl font-black text-white">{Math.round((selectedResource.capacity/selectedResource.maxCapacity)*100)}%</p>
                       <p className="text-[10px] font-bold text-slate-500">{selectedResource.capacity} / {selectedResource.maxCapacity}</p>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`${selectedResource.color} h-full transition-all duration-1000`} style={{width: `${(selectedResource.capacity/selectedResource.maxCapacity)*100}%`}}/>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-4xl p-6 group hover:border-sky-500/30 transition-all duration-500 flex flex-col justify-between">
                  <div className="flex items-center gap-3 text-slate-600 mb-4">
                    <ShieldAlert size={18} className="group-hover:text-sky-400"/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Deployment</span>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] text-center ${selectedResource.status === 'CRITICAL FILL' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-sky-500/10 border-sky-500/30 text-sky-400'}`}>
                    {selectedResource.status}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowDetailModal(false)} className="flex-1 py-5 rounded-3xl bg-slate-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all shadow-inner">
                  Close Dashboard
                </button>
                <button onClick={() => {setShowDetailModal(false); handleEditResource(selectedResource);}} className="flex-1 py-5 rounded-3xl bg-sky-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-sky-500/20 hover:bg-sky-400 transition-all">
                  Modify Tactical Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-140 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={closeAddModal}>
          <div className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-[40px] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{isEditing ? 'Update' : 'Initialize'} <span className="text-sky-400">Resource</span></h2>
              <button onClick={closeAddModal} className="text-slate-400 hover:text-white"><X/></button>
            </div>
            <form onSubmit={handleAddResource} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Name" name="name" value={formValues.name} onChange={handleInputChange} />
              <InputField label="Location" name="location" value={formValues.location} onChange={handleInputChange} />
              <InputField label="Current" name="capacity" type="number" value={formValues.capacity} onChange={handleInputChange} />
              <InputField label="Total" name="maxCapacity" type="number" value={formValues.maxCapacity} onChange={handleInputChange} />
              <div className="sm:col-span-2"><InputField label="Comm Channel" name="channel" value={formValues.channel} onChange={handleInputChange} /></div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-2">Condition Status</label>
                <select name="status" value={formValues.status} onChange={handleInputChange} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-sky-500 outline-none mt-1">
                   <option value="">Select Level</option>
                   <option value="OPERATIONAL">OPERATIONAL</option>
                   <option value="CRITICAL FILL">CRITICAL FILL</option>
                   <option value="STAGING">STAGING</option>
                   <option value="DEPLOYED">DEPLOYED</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={closeAddModal} className="text-[10px] font-black uppercase text-slate-500 px-6 tracking-widest">Cancel</button>
                <button type="submit" className="bg-sky-500 text-slate-950 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Execute Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-160 flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg">
          <div className="max-w-md w-full bg-slate-950 border border-white/10 rounded-[40px] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <Trash2 size={36}/>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Confirm Deletion</h3>
            <p className="text-sm text-slate-500 mb-10 leading-relaxed uppercase tracking-widest text-[10px]">Irreversible Purge: <span className="text-white font-bold">{selectedResource?.name}</span></p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">Abort</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20">Purge Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB COMPONENTS ---
const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-2">{label}</label>
    <input required {...props} className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-sky-500 outline-none transition-all placeholder:text-slate-800" />
  </div>
);

const StatBar = ({ label, value, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default ResourceManagement;