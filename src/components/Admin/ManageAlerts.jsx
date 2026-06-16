import React, { useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  MapPin,
  X,
  Zap,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Added for professional animations

// External Components Imports
import Header from "./Header";
import SideBar from "./SideBar";

const ManageAlerts = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlertId, setCurrentAlertId] = useState(null);

  const [formValues, setFormValues] = useState({
    title: "",
    region: "South Industrial District",
    severity: "Level 3: Critical",
    message: "",
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Structural Instability Detected",
      region: "South Industrial District",
      severity: "Critical",
      date: "2026-05-10 14:00",
      status: "Published",
      message: "Potential structural failure at Sector 4 Bridge.",
    },
    {
      id: 2,
      title: "Flash Flood Warning",
      region: "Sector 7-G Northwest",
      severity: "High",
      date: "2026-05-10 12:30",
      status: "Draft",
      message: "Water levels rising at 2.4cm/min.",
    },
    {
      id: 3,
      title: "Dam Level Alert",
      region: "Rawal Basin",
      severity: "Medium",
      date: "2026-05-09 18:45",
      status: "Published",
      message: "Inbound flow from East Basin is projected to increase.",
    },
  ]);

  const handleEditClick = (alert) => {
    setIsEditing(true);
    setCurrentAlertId(alert.id);
    setFormValues({
      title: alert.title,
      region: alert.region,
      severity: alert.severity.includes("Level")
        ? alert.severity
        : `Level ${alert.severity === "Critical" ? "3" : alert.severity === "High" ? "2" : "1"}: ${alert.severity}`,
      message: alert.message || "",
    });
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentAlertId(null);
    setFormValues({
      title: "",
      region: "South Industrial District",
      severity: "Level 3: Critical",
      message: "",
    });
    setShowModal(true);
  };

  const handleDeleteAlert = (id) => {
    if (window.confirm("Are you sure?")) {
      setAlerts(alerts.filter((alert) => alert.id !== id));
    }
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.region.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // --- ANIMATION VARIANTS ---
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-panel { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(148,163,184,0.06); }
        .protocol-modal { background: #0b1220; border: 1px solid rgba(148,163,184,0.06); }
      `}</style>

      <aside className="hidden md:block shrink-0 h-screen sticky top-0 border-r border-slate-700 bg-slate-900/95 z-50">
        <SideBar />
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
        <Header />

        <motion.main
          initial="hidden"
          animate="visible"
          variants={containerVars}
          className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-12"
        >
          <div className="max-w-[1400px] mx-auto space-y-10">
            <motion.div
              variants={itemVars}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[9px] font-black uppercase tracking-widest text-sky-400">
                  <ShieldAlert size={12} /> Alert Management System
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  Broadcast <span className="text-sky-400">Control</span>
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateClick}
                className="w-full md:w-auto flex items-center justify-center gap-4 bg-sky-500 text-slate-950 px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-[0_20px_40px_rgba(14,165,233,0.15)] hover:bg-sky-400 transition-all"
              >
                <Plus size={18} /> Create New Alert
              </motion.button>
            </motion.div>

            <motion.div
              variants={itemVars}
              className="flex flex-col lg:flex-row gap-4"
            >
              <div className="flex-1 relative group">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="SEARCH MISSION LOGS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/95 border border-slate-700 rounded-2xl px-16 py-5 text-xs font-bold uppercase tracking-widest outline-none focus:border-sky-500/50 transition-all text-white"
                />
              </div>
              <button className="flex items-center justify-center gap-3 px-8 py-5 glass-panel rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                <Filter size={16} /> Advanced Filter
              </button>
            </motion.div>

            <motion.div
              variants={itemVars}
              className="glass-panel rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="bg-slate-950/80 border-b border-slate-700 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    <tr>
                      <th className="px-8 py-7">Incident Title</th>
                      <th className="px-8 py-7">Deployment Region</th>
                      <th className="px-8 py-7">Severity Level</th>
                      <th className="px-8 py-7">Protocol Time</th>
                      <th className="px-8 py-7">Broadcast Status</th>
                      <th className="px-8 py-7 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/20">
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert) => (
                        <motion.tr
                          layout
                          key={alert.id}
                          variants={itemVars}
                          className="group hover:bg-slate-900/80 transition-all"
                        >
                          <td className="px-8 py-7">
                            <p className="font-black uppercase text-xs tracking-tight text-white group-hover:text-sky-300 transition-colors">
                              {alert.title}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-1 font-bold">
                              LOG ID: {alert.id * 1024}
                            </p>
                          </td>
                          <td className="px-8 py-7 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                              <MapPin size={12} className="text-sky-500" />{" "}
                              {alert.region}
                            </div>
                          </td>
                          <td className="px-8 py-7">
                            <SeverityBadge level={alert.severity} />
                          </td>
                          <td className="px-8 py-7 text-[10px] font-bold text-slate-500 font-mono italic uppercase">
                            {alert.date}
                          </td>
                          <td className="px-8 py-7">
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${alert.status === "Published" ? "text-green-500" : "text-slate-500"}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${alert.status === "Published" ? "bg-green-500 animate-pulse" : "bg-slate-700"}`}
                              ></span>
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-8 py-7 text-right">
                            <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                              <motion.button
                                whileHover={{ y: -2 }}
                                className="p-3 bg-slate-800/60 rounded-xl hover:text-sky-400 text-slate-300"
                                onClick={() => handleEditClick(alert)}
                              >
                                <Edit3 size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ y: -2 }}
                                className="p-3 bg-slate-800/60 rounded-xl hover:text-rose-400 text-slate-300"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-8 py-20 text-center text-slate-400 uppercase text-[11px] font-black tracking-[0.5em]"
                        >
                          No matching logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg protocol-modal rounded-[32px] overflow-hidden"
            >
              <div className="flex justify-between items-start p-10 pb-0">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                    Protocol Entry:{" "}
                    <span className="text-sky-400">
                      {isEditing ? "Modify" : "New"} Alert
                    </span>
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-800/60 rounded-full text-slate-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                className="p-10 space-y-7"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                    Mission Title
                  </label>
                  <input
                    value={formValues.title}
                    onChange={(e) =>
                      setFormValues(
                        Object.assign({}, formValues, {
                          title: e.target.value,
                        }),
                      )
                    }
                    className="w-full bg-slate-900/95 border border-slate-700 rounded-2xl px-6 py-5 text-xs font-bold text-white outline-none focus:border-sky-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      Target Zone
                    </label>
                    <select
                      value={formValues.region}
                      onChange={(e) =>
                        setFormValues(
                          Object.assign({}, formValues, {
                            region: e.target.value,
                          }),
                        )
                      }
                      className="w-full bg-slate-900/95 border border-slate-700 rounded-2xl px-6 py-5 text-xs font-bold text-white outline-none"
                    >
                      <option>South Industrial District</option>
                      <option>Sector 7-G Northwest</option>
                      <option>Rawal Basin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      Severity
                    </label>
                    <select
                      value={formValues.severity}
                      onChange={(e) =>
                        setFormValues(
                          Object.assign({}, formValues, {
                            severity: e.target.value,
                          }),
                        )
                      }
                      className="w-full bg-slate-900/95 border border-slate-700 rounded-2xl px-6 py-5 text-xs font-bold text-rose-400 outline-none"
                    >
                      <option>Level 3: Critical</option>
                      <option>Level 2: High</option>
                      <option>Level 1: Medium</option>
                    </select>
                  </div>
                </div>

                <div className="bg-sky-500/5 border-l-2 border-sky-500 p-6 rounded-r-2xl space-y-2">
                  <div className="flex items-center gap-2 text-sky-400">
                    <Zap size={14} className="fill-current" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      AI Summary
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic leading-relaxed font-medium">
                    Broadcast ready for {formValues.title || "standby"}.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-6 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors"
                  >
                    Discard
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gradient-to-r from-sky-600 to-blue-700 text-white px-10 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-sky-500/30 transition-all"
                  >
                    {isEditing ? "Apply Changes" : "Execute Signal"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SeverityBadge = ({ level }) => {
  const styles = {
    Critical:
      "bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
    High: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span
      className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${styles[level] || styles.Medium}`}
    >
      {level}
    </span>
  );
};

export default ManageAlerts;
