import React, { useState } from "react";
import {
  Home,
  Package,
  PawPrint,
  Leaf,
  MapPin,
  Upload,
  Satellite,
  Zap,
  CheckCircle2,
  Maximize2,
  Droplets,
  Plus,
  Utensils,
  AlertOctagon,
  User,
  Phone,
  CreditCard,
  Mail,
  Users,
  Trash2,
  ShieldCheck,
  Edit3
} from "lucide-react";

const VictimRegisPage = () => {
  // --- STATES ---
  const [isSubmitted, setIsSubmitted] = useState(false); // Success message toggle
  const [lossTypes, setLossTypes] = useState(["House"]);
  const [familyMembers, setFamilyMembers] = useState([
    { name: "", category: "Child (0-12)" }
  ]);
  const [referenceId] = useState(() => `SOS-${Math.floor(100000 + Math.random() * 900000)}`);

  // --- FORM HANDLERS ---
  const addMember = () => {
    setFamilyMembers([...familyMembers, { name: "", category: "Adult (18-59)" }]);
  };

  const removeMember = (index) => {
    const list = [...familyMembers];
    list.splice(index, 1);
    setFamilyMembers(list);
  };

  const toggleLossType = (type) => {
    setLossTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = () => {
    setIsSubmitted(false); // Wapis form par le jane ke liye
  };

  return (
    <main className="min-h-screen bg-slate-900 text-[#E0E0E0] font-sans selection:bg-blue-500/30">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* --- HEADER SECTION --- */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              Emergency Response Portal | Phase Alpha
            </span>
          </div>
          <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6">
            <span className="text-white">Victim </span>
            <span className="text-[#A5C9FF]">Registration</span>
          </h1>
          <p className="max-w-3xl text-gray-400 text-lg leading-relaxed">
            Please provide accurate identification and family details. This data is transmitted via
            <span className="text-white font-medium"> Secure Protocol</span> to rescue teams for immediate action.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* --- MAIN CONTENT AREA (Form or Success Message) --- */}
          <div className="lg:col-span-2">

            {!isSubmitted ? (
              /* --- THE FORM --- */
              <div className="rounded-4xl border border-white/5 bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm">
                <form className="space-y-10" onSubmit={handleSubmit}>

                  {/* SECTION 1: Personal & Contact Data */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                      <User size={20} /> Primary Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">Full Name (As per CNIC)</label>
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400" />
                          <input required type="text" placeholder="e.g. Muhammad Ahmed" className="w-full rounded-2xl border border-gray-700 bg-[#0F172A] px-4 py-4 pl-14 text-gray-100 outline-none focus:border-blue-500 transition-all" />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">CNIC Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400" />
                          <input required type="text" placeholder="42101-XXXXXXX-X" className="w-full rounded-2xl border border-gray-700 bg-[#0F172A] px-4 py-4 pl-14 text-gray-100 outline-none focus:border-blue-500 transition-all font-mono" />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">Active Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400" />
                          <input required type="tel" placeholder="0300-1234567" className="w-full rounded-2xl border border-gray-700 bg-[#0F172A] px-4 py-4 pl-14 text-gray-100 outline-none focus:border-blue-500 transition-all" />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400" />
                          <input required type="email" placeholder="contact@example.com" className="w-full rounded-2xl border border-gray-700 bg-[#0F172A] px-4 py-4 pl-14 text-gray-100 outline-none focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Impacted Persons / Family Losses */}
                  <div className="space-y-6 pt-10 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                        <Users size={20} /> Impacted Family Members
                      </h2>
                      <button
                        type="button"
                        onClick={addMember}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                      >
                        <Plus size={14} /> Add Member
                      </button>
                    </div>

                    <div className="space-y-4">
                      {familyMembers.map((member, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 items-center">
                          <div className="md:col-span-6 group">
                            <input
                              type="text"
                              placeholder="Family Member Full Name"
                              className="w-full bg-transparent border-b border-gray-700 py-2 outline-none focus:border-blue-500 transition-all text-sm text-gray-200"
                            />
                          </div>
                          <div className="md:col-span-5">
                            <select className="w-full bg-[#1E293B] border border-gray-700 rounded-lg py-2 px-3 text-xs text-gray-300 outline-none focus:border-blue-400">
                              <option>Child (0-12)</option>
                              <option>Teenager (13-17)</option>
                              <option>Adult (18-59)</option>
                              <option>Senior (60+)</option>
                            </select>
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            {familyMembers.length > 1 && (
                              <button type="button" onClick={() => removeMember(index)} className="text-red-500/40 hover:text-red-500 transition-colors p-2">
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 3: Location & Impact Details */}
                  <div className="space-y-10 pt-10 border-t border-white/5">
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-4">Last Known Location / Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input required type="text" placeholder="e.g. Sector 4-B, Indus District" className="w-full rounded-[20px] border border-gray-700 bg-[#0F172A] px-4 py-4 pl-14 text-gray-100 outline-none focus:border-blue-500 transition-all" />
                      </div>
                    </div>

                    {/* Damage Categories */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-4">Infrastructure Damage</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          { icon: Home, label: "House" },
                          { icon: Package, label: "Property" },
                          { icon: PawPrint, label: "Livestock" },
                          { icon: Leaf, label: "Crops" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => toggleLossType(item.label)}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-6 text-center transition-all ${lossTypes.includes(item.label)
                              ? "border-blue-500 bg-blue-500/20 text-white shadow-xl scale-105"
                              : "border-gray-800 bg-[#0F172A] text-gray-500 hover:border-gray-600"
                              }`}
                          >
                            <item.icon className={`h-6 w-6 ${lossTypes.includes(item.label) ? "text-blue-400" : ""}`} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Critical Needs */}
                    <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
                      <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-red-400 font-bold mb-4">
                        <AlertOctagon size={14} /> Critical Resource Needs
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {["Water", "Food", "Medical Aid", "Power/Charge", "Rescue Boat"].map(need => (
                          <label key={need} className="flex items-center gap-2 bg-[#0F172A] border border-gray-800 px-4 py-3 rounded-xl cursor-pointer hover:border-red-500/30 transition-all">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-slate-900 text-blue-500 focus:ring-0" />
                            <span className="text-xs font-semibold text-gray-300">{need}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 max-w-xs leading-relaxed italic">
                      By clicking submit, you confirm that all information is correct as per government records.
                    </p>
                    <button type="submit" className="group relative w-full md:w-auto bg-blue-500 hover:bg-blue-400 text-slate-950 font-black py-5 px-16 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all active:scale-95 overflow-hidden">
                      <span className="relative z-10">Broadcast SOS Request</span>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* --- SUCCESS MESSAGE SCREEN --- */
              <div className="rounded-4xl border border-green-500/20 bg-slate-800/80 p-12 shadow-2xl backdrop-blur-md text-center flex flex-col items-center justify-center min-h-125 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>

                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Registration Successful!</h2>

                <div className="max-w-md space-y-4">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Aapka data system mein verify ho chuka hai.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                    <p className="text-blue-400 font-bold text-sm uppercase tracking-widest">
                      Rescue Team ap ke sath jald contact kare gi.
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm italic">
                    Reference ID: {referenceId}
                  </p>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-white/5"
                  >
                    <Edit3 size={16} /> Edit Form Data
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-lg"
                  >
                    Register New Victim
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- SIDEBAR --- */}
          <aside className="space-y-6">
            <section className="rounded-4xl border border-white/5 bg-slate-800/50 p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Live Monitoring</h3>
                <div className="flex items-center gap-2 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-green-500 uppercase">Secure Link</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Registration will be timestamped and geolocated. Ensure your phone's GPS is enabled for satellite sync.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl bg-black/30 p-4 border border-white/5">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">Data Security</p>
                    <p className="text-xs font-semibold text-gray-200">SHA-256 Encrypted</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-black/30 p-4 border border-white/5">
                  <Satellite className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">Relief Status</p>
                    <p className="text-xs font-semibold text-gray-200">Priority Level: High</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-white/5 aspect-video relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288560-1996948c3b6f?auto=format&fit=crop&q=80&w=800"
                alt="Thermal Satellite View"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Sector Scan Alpha</p>
                <h4 className="text-xs font-bold text-white">Thermal Connectivity Active</h4>
              </div>
            </section>
          </aside>

        </div>
      </div>
    </main>
  );
};

export default VictimRegisPage;