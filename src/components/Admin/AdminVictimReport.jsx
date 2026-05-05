import React, { useState, useEffect } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import {
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Search,
  ArrowLeft,
  Phone,
  Mail,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";


const AdminVictimReport = () => {
  // --- DATA STATE ---
  const [victims, setVictims] = useState([
    {
      id: "SOS-882910",
      name: "Ahmed Khan",
      cnic: "42101-1234567-1",
      phone: "0300-1234567",
      email: "ahmed@example.com",
      location: "Sector 4-B, Indus District",
      status: "Pending",
      needs: ["Water", "Medical Aid"],
      family: [
        { name: "Saira", category: "Child (0-12)" },
        { name: "Bilal", category: "Senior (60+)" },
      ],
    },
    {
      id: "SOS-112039",
      name: "Sara Bibi",
      cnic: "35202-9876543-2",
      phone: "0321-7654321",
      email: "sara@test.com",
      location: "Village Jallo, Punjab",
      status: "Responded",
      needs: ["Food", "Shelter"],
      family: [{ name: "Ali", category: "Teenager (13-17)" }],
    },
  ]);

  const [selectedVictim, setSelectedVictim] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- KEYBOARD FEATURE: ESCAPE KEY TO GO BACK ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedVictim(null); // Escape dabanay par view band ho jayega
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- STATUS UPDATE LOGIC ---
  const updateStatus = (id, newStatus) => {
    setVictims((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)),
    );

    if (selectedVictim && selectedVictim.id === id) {
      setSelectedVictim((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // --- SEARCH/FILTER LOGIC ---
  const filteredVictims = victims.filter((victim) => {
    const query = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanCNIC = victim.cnic.replace(/[^0-9]/g, "");
    const cleanID = victim.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanName = victim.name.toLowerCase();

    return (
      cleanName.includes(searchTerm.toLowerCase()) ||
      cleanCNIC.includes(query) ||
      cleanID.includes(query)
    );
  });

  return (
    <section className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* SIDEBAR - Jo aapne pehle use kiya tha */}
      <aside className="w-64 h-full bg-[#1e1e1e] border-r border-gray-800 hidden md:flex flex-col shrink-0">
        <SideBar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden pl-9">
        {/* HEADER - Jo aapne pehle use kiya tha */}
        <Header/>

        {/* CONTENT CONTAINER (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#0a0a0a] no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* --- TOP BAR (Stats & Search) --- */}
            {!selectedVictim && (
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                      Live Victim Intel
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                    <ShieldCheck className="text-blue-500 w-8 h-8" />
                    Victim <span className="text-slate-500">Reports</span>
                  </h1>
                </div>

                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search Name, CNIC or ID..."
                    className="bg-[#1e1e1e] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 w-full transition-all text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </header>
            )}

            {/* --- MAIN VIEW SWITCHER --- */}
            {!selectedVictim ? (
              /* --- LIST VIEW --- */
              <div className="bg-[#1e1e1e]/50 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl animate-in fade-in duration-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black">
                        <th className="p-6">Reference</th>
                        <th className="p-6">Victim Details</th>
                        <th className="p-6">Location</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredVictims.map((victim) => (
                        <tr
                          key={victim.id}
                          className="hover:bg-white/[0.03] transition-all group"
                        >
                          <td className="p-6">
                            <span className="font-mono text-blue-400 text-xs font-bold bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/10 tracking-widest uppercase">
                              {victim.id}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                              {victim.name}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono mt-1 tracking-tighter italic">
                              {victim.cnic}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-start gap-2 text-sm text-gray-400 max-w-[200px]">
                              <MapPin
                                size={16}
                                className="text-red-500 shrink-0 mt-0.5"
                              />
                              <span className="leading-snug">
                                {victim.location}
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span
                              className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
                                victim.status === "Pending"
                                  ? "bg-yellow-500/5 text-yellow-500 border-yellow-500/20"
                                  : victim.status === "Approved"
                                    ? "bg-green-500/5 text-green-500 border-green-500/20"
                                    : victim.status === "Responded"
                                      ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                                      : "bg-red-500/5 text-red-500 border-red-500/20"
                              }`}
                            >
                              {victim.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  updateStatus(victim.id, "Approved")
                                }
                                className="p-2.5 text-green-500 hover:bg-green-500/10 rounded-xl transition-all"
                                title="Approve"
                              >
                                <CheckCircle size={20} />
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(victim.id, "Rejected")
                                }
                                className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Reject"
                              >
                                <XCircle size={20} />
                              </button>
                              <button
                                onClick={() => setSelectedVictim(victim)}
                                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 ml-2"
                                title="View Full Report"
                              >
                                <Eye size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* --- DETAIL VIEW --- */
              <div className="animate-in slide-in-from-right-8 duration-500">
                {/* Back Navigation & ESC Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <button
                    onClick={() => setSelectedVictim(null)}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-all font-bold text-xs uppercase tracking-[0.2em] group"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10">
                      <ArrowLeft size={18} />
                    </div>
                    Go Back to Table
                  </button>
                  <div className="px-4 py-2 bg-[#1e1e1e] border border-white/10 rounded-xl">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                      Shortcut: Press{" "}
                      <span className="text-blue-400 underline underline-offset-4 font-black tracking-tighter">
                        Esc
                      </span>{" "}
                      key to exit
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Victim Card */}
                    <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-[40px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                      <div
                        className={`absolute top-0 right-0 w-48 h-1.5 ${
                          selectedVictim.status === "Approved"
                            ? "bg-green-500"
                            : selectedVictim.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      />

                      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                        <div>
                          <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">
                            {selectedVictim.name}
                          </h2>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-blue-400 font-mono text-sm font-bold tracking-[0.2em]">
                              {selectedVictim.id}
                            </span>
                            <div className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">
                              {selectedVictim.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              updateStatus(selectedVictim.id, "Approved")
                            }
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95"
                          >
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(selectedVictim.id, "Rejected")
                            }
                            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h3 className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-black">
                            Identity Details
                          </h3>
                          <div className="space-y-4">
                            <div className="bg-black/20 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                              <CreditCard className="text-blue-400" size={20} />
                              <div>
                                <p className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">
                                  CNIC
                                </p>
                                <p className="text-sm font-mono font-bold">
                                  {selectedVictim.cnic}
                                </p>
                              </div>
                            </div>
                            <div className="bg-black/20 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                              <Phone className="text-blue-400" size={20} />
                              <div>
                                <p className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">
                                  Phone
                                </p>
                                <p className="text-sm font-bold">
                                  {selectedVictim.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-black">
                            Family Info
                          </h3>
                          <div className="space-y-3">
                            {selectedVictim.family.map((m, idx) => (
                              <div
                                key={idx}
                                className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center italic"
                              >
                                <span className="text-sm font-bold">
                                  {m.name}
                                </span>
                                <span className="text-[9px] bg-slate-800 text-gray-400 px-3 py-1 rounded-lg uppercase font-black">
                                  {m.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Panel */}
                    <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl shadow-2xl">
                      <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-8">
                        Location Intelligence
                      </h3>
                      <div className="flex items-center gap-6 bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
                        <div className="p-5 bg-red-500/10 rounded-2xl">
                          <MapPin
                            size={40}
                            className="text-red-500 animate-bounce"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-red-400 font-black tracking-[0.2em] mb-2">
                            Registry Address
                          </p>
                          <p className="text-2xl font-black text-white italic">
                            {selectedVictim.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Sidebar */}
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <MessageSquare size={100} />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3">
                        Action Command
                      </h3>
                      <p className="text-blue-100 text-[11px] mb-8 font-medium uppercase tracking-widest opacity-80">
                        Send instructions directly
                      </p>
                      <textarea
                        placeholder="Type message here..."
                        className="w-full bg-black/20 border border-white/10 rounded-3xl p-5 text-sm text-white placeholder:text-white/30 outline-none focus:bg-black/40 h-40 mb-6 resize-none transition-all"
                      />
                      <button
                        onClick={() =>
                          updateStatus(selectedVictim.id, "Responded")
                        }
                        className="w-full bg-white text-blue-800 font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all active:scale-95 shadow-xl"
                      >
                        Deploy Message
                      </button>
                    </div>

                    <div className="bg-[#1e1e1e]/80 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
                      <div className="flex items-center gap-3 text-yellow-500 mb-5">
                        <AlertTriangle size={20} />
                        <span className="text-[11px] uppercase font-black tracking-widest">
                          Protocol Notice
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-400 leading-relaxed italic">
                        Cross-verify CNIC data with NADRA registry before
                        finalizing{" "}
                        <span className="text-green-500 font-bold">
                          Approval
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default AdminVictimReport;
