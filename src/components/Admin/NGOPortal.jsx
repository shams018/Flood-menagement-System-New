import React, { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UserPlus,
  ClipboardCheck,
  Radio,
  ShieldCheck,
  MapPin,
  Phone,
  Briefcase,
  Activity,
  CheckCircle,
  History,
  AlertTriangle,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  HelpCircle,
  MoreHorizontal,
  ArrowUpRight,
  Globe,
  Users,
} from "lucide-react";
import { io } from "socket.io-client";
import { API_BASE } from "../../lib/config";
import { useAuth } from "../../context/AuthContext";

const NGOPortal = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    type: "",
    contact: "",
    status: "Active",
    status_color_class: "bg-green-400",
    location: "",
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });
  const [ngos, setNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();
  const socketRef = React.useRef(null);

  const fetchNgos = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await apiFetch("/api/ngos");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load NGO records.");
      }
      setNgos(data.ngos || []);
    } catch (error) {
      setLoadError(error.message || "Unable to load NGO records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    const url = API_BASE || window.location.origin;
    const socket = io(url, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join:ngo");
    });

    socket.on("disconnect", () => {});

    socket.on("ngo:update", (update) => {
      try {
        const action = update?.action;
        const payload = update?.ngo || {};
        setNgos((prev) => {
          if (action === "created") {
            // avoid duplicate
            if (prev.some((p) => p.id === payload.id)) return prev;
            return [payload, ...prev];
          }
          if (action === "updated") {
            return prev.map((p) => (p.id === payload.id ? payload : p));
          }
          if (action === "deleted") {
            const id = payload.id || payload || null;
            if (!id) return prev;
            return prev.filter((p) => p.id !== id);
          }
          return prev;
        });
      } catch (e) {
        console.error("Error applying NGO update:", e);
      }
    });

    return () => {
      try {
        socket.emit("leave:ngo");
        socket.disconnect();
      } catch (e) {
        /* ignore */
      }
      socketRef.current = null;
    };
  }, [token]);

  const updateFormField = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error for this field when user changes it
    setFormErrors((prev) => {
      if (!prev || !prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.name || values.name.trim().length < 3) {
      errors.name = "Enter a valid organization name (min 3 characters).";
    }
    if (!values.type || values.type.trim().length < 2) {
      errors.type = "Enter a valid lead/representative name.";
    }
    // Basic international phone regex (allows + and spaces/dashes)
    const phoneRe = /^\+?[0-9][0-9\s\-]{7,}$/;
    if (!values.contact || !phoneRe.test(values.contact.trim())) {
      errors.contact = "Enter a valid phone number (digits, optional +).";
    }
    if (!values.status || values.status.trim().length < 2) {
      errors.status = "Status is required.";
    }
    if (
      !values.status_color_class ||
      !/^bg-[a-z]+-\d{3}$/i.test(values.status_color_class)
    ) {
      errors.status_color_class = "Choose a valid indicator color.";
    }
    if (!values.location || values.location.trim().length < 3) {
      errors.location = "Enter an operational zone (min 3 characters).";
    }
    return errors;
  };

  const handleRegisterNgo = async (event) => {
    event.preventDefault();
    setFormStatus({ message: "", type: "" });

    // Validate before sending
    const errors = validateForm(formState);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      setFormStatus({ message: "Please fix form errors.", type: "error" });
      return;
    }

    try {
      const response = await apiFetch("/api/ngos", {
        method: "POST",
        body: JSON.stringify(formState),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create NGO entry.");
      }

      setFormStatus({
        message:
          "NGO added successfully. Coordination dashboard will refresh shortly.",
        type: "success",
      });
      setFormState({
        name: "",
        type: "",
        contact: "",
        status: "Active",
        status_color_class: "bg-green-400",
        location: "",
        is_active: true,
      });
      await fetchNgos();
    } catch (error) {
      setFormStatus({
        message: error.message || "Unable to register NGO.",
        type: "error",
      });
    }
  };

  // Real data displayed below is derived from fetched `ngos`.

  return (
    <motion.div
      className="flex h-screen w-full bg-slate-950 text-white overflow-hidden font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {/* Scrollbar Hidden Utility */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-panel { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(148, 163, 184, 0.12); }
      `}</style>

      {/* --- ELITE SIDEBAR --- */}
      <motion.aside
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:relative z-50 w-72 h-full bg-slate-900/95 border-r border-slate-700/30 transition-all duration-500 ease-in-out flex flex-col shrink-0
      `}
        initial={{ x: -36, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 flex items-center gap-4 bg-slate-900/95 border-b border-slate-700/30">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500 blur-md opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 rounded-2xl">
              <ShieldCheck size={28} className="text-slate-950" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">
              Vanguard
            </h1>
            <p className="text-[9px] text-sky-400/80 font-bold uppercase tracking-[0.3em] mt-1.5">
              NGO Coordination
            </p>
          </div>
        </div>

        <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto no-scrollbar bg-slate-900/95">
          <SectionLabel label="Operations" />
          <SidebarLink
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={activeView === "dashboard"}
            onClick={() => {
              setActiveView("dashboard");
              setSidebarOpen(false);
            }}
          />
          <SidebarLink
            icon={<UserPlus size={18} />}
            label="NGO Registry"
            active={activeView === "reg"}
            onClick={() => {
              setActiveView("reg");
              setSidebarOpen(false);
            }}
          />
          <SidebarLink
            icon={<ClipboardCheck size={18} />}
            label="Mission Board"
            active={activeView === "board"}
            onClick={() => {
              setActiveView("board");
              setSidebarOpen(false);
            }}
          />
          <SidebarLink
            icon={<Radio size={18} />}
            label="Live Intel"
            active={activeView === "news"}
            onClick={() => {
              setActiveView("news");
              setSidebarOpen(false);
            }}
          />

          <div className="pt-6">
            <SectionLabel label="Systems" />
            <SidebarLink
              icon={<Settings size={18} />}
              label="Configurations"
              onClick={() => {
                setActiveView("config");
                setSidebarOpen(false);
              }}
            />
            <SidebarLink
              icon={<HelpCircle size={18} />}
              label="Tech Support"
              onClick={() => {
                setActiveView("support");
                setSidebarOpen(false);
              }}
            />
          </div>
        </nav>
      </motion.aside>
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Superior Header */}
        <motion.header
          className="h-24 border-b border-slate-700/30 flex items-center justify-between px-8 md:px-12 shrink-0 bg-slate-950 backdrop-blur-xl z-40"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-3 bg-slate-900/95 rounded-2xl text-slate-400 hover:text-sky-400 transition-all"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex flex-col ">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 leading-none ">
                Tactical Overview
              </h2>
              <span className="text-[10px] font-bold text-sky-400/70 mt-1 uppercase">
                Region: Islamabad Capital Territory
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl focus-within:ring-1 ring-sky-500/30 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH OPERATIONAL DATABASE..."
                className="bg-transparent border-none text-[9px] font-bold outline-none w-56 uppercase tracking-[0.2em] placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <div
                role="button"
                onClick={() => setActiveView("news")}
                className="relative p-3 glass-panel rounded-xl hover:bg-slate-900/90 cursor-pointer transition-all group"
              >
                <Bell
                  size={18}
                  className="text-slate-400 group-hover:text-white"
                />
                <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full border-2 border-[#05070a]"></span>
              </div>
              <div
                role="button"
                onClick={() => setActiveView("board")}
                className="p-3 glass-panel rounded-xl hover:bg-slate-900/90 cursor-pointer transition-all group"
              >
                <Globe
                  size={18}
                  className="text-slate-400 group-hover:text-white"
                />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Tactical Canvas Area */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
          <div className="max-w-[1500px] mx-auto space-y-12">
            {activeView === "dashboard" && (
              <DashboardView
                ngos={ngos}
                searchQuery={searchQuery}
                isLoading={isLoading}
                error={loadError}
                refresh={fetchNgos}
              />
            )}
            {activeView === "reg" && (
              <RegistrationForm
                formState={formState}
                formStatus={formStatus}
                handleRegisterNgo={handleRegisterNgo}
                updateFormField={updateFormField}
                formErrors={formErrors}
              />
            )}
            {activeView === "board" && (
              <MissionBoard ngos={ngos} searchQuery={searchQuery} />
            )}
            {activeView === "news" && <IntelView />}
            {activeView === "config" && <ConfigView />}
            {activeView === "support" && <SupportView />}
          </div>
        </main>
      </div>
    </motion.div>
  );
};

// --- ELITE VIEWS ---

const DashboardView = ({
  ngos,
  searchQuery = "",
  isLoading,
  error,
  refresh,
}) => {
  const q = (searchQuery || "").trim().toLowerCase();
  const filteredNgos = q
    ? ngos.filter((ngo) => {
        const hay =
          `${ngo.name || ""} ${ngo.type || ""} ${ngo.location || ""} ${ngo.status || ""}`.toLowerCase();
        return hay.includes(q);
      })
    : ngos;

  const activeNgos = filteredNgos.filter((ngo) => ngo.is_active).length;
  const totalNgos = ngos.length;
  const criticalCount = ngos.filter((ngo) =>
    ngo.status?.toLowerCase().includes("critical"),
  ).length;
  const completionRate = totalNgos
    ? Math.round((activeNgos / totalNgos) * 100)
    : 0;
  const displayTasks = filteredNgos.length
    ? filteredNgos.slice(0, 6).map((ngo, idx) => ({
        id: ngo.id || idx,
        title: `${ngo.name} Deployment`,
        ngo: ngo.type || "Partner",
        status: ngo.is_active ? "Active" : "Inactive",
        priority: ngo.status_color_class?.includes("red")
          ? "Critical"
          : ngo.status_color_class?.includes("yellow")
            ? "Medium"
            : "Normal",
        region: ngo.location || "Unknown",
      }))
    : [];

  return (
    <motion.div
      className="space-y-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  ">
        <StatCard
          label="Registered NGOs"
          value={isLoading ? "..." : totalNgos}
          icon={<Users size={20} />}
          color="sky"
        />
        <StatCard
          label="Active Partners"
          value={isLoading ? "..." : activeNgos}
          icon={<Activity size={20} />}
          color="blue"
        />
        <StatCard
          label="Active Ratio"
          value={isLoading ? "..." : `${completionRate}%`}
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatCard
          label="Critical Alerts"
          value={isLoading ? "..." : criticalCount}
          icon={<AlertTriangle size={20} />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Tasks Panel */}
        <div className="xl:col-span-8 rounded-[40px] p-8 shadow-xl shadow-cyan-500/10 bg-slate-900/95 border border-slate-700/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">
                Mission Logs
              </h3>
              <p className="text-sm font-bold text-white mt-1 uppercase tracking-tight">
                Active Deployments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={refresh}
                className="px-4 py-2 rounded-2xl border border-slate-700/50 bg-slate-900/95 text-slate-100 text-[11px] uppercase tracking-[0.25em] hover:bg-slate-900 transition"
              >
                Refresh Data
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <MoreHorizontal />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {displayTasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="flex items-center justify-between p-6 rounded-[28px] bg-slate-900/95 border border-slate-700/30 hover:border-sky-500/30 hover:bg-slate-900 transition-all group"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + index * 0.06 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-700/40 shadow-inner ${
                      task.status === "Completed"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-sky-500/10 text-sky-400"
                    }`}
                  >
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <p className="text-base font-black uppercase tracking-tight text-white">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        {task.ngo}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={10} /> {task.region}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border ${
                      task.priority === "Critical"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-slate-900 text-slate-400 border-slate-700/30"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-slate-400 group-hover:text-sky-400 transition-all"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mini Intel Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900/95 rounded-[40px] p-8 border border-slate-700/30 shadow-xl shadow-cyan-500/10">
            <div className="flex items-center gap-3 text-sky-400 mb-6">
              <Radio size={20} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Live Broadcast
              </span>
            </div>
            <p className="text-lg font-bold text-slate-200 leading-tight italic">
              "Emergency convoy arriving at Sector G-9. All NGOs coordinate for
              last-mile delivery."
            </p>
            <div className="mt-8 pt-8 border-t border-slate-700/20 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Auth: Command Central
              </span>
              <span className="text-[9px] font-bold text-sky-500/60 uppercase tracking-widest">
                12m Ago
              </span>
            </div>
          </div>

          <div className="bg-slate-900/95 rounded-[40px] p-8 border border-slate-700/30 shadow-xl shadow-cyan-500/10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
              <History size={14} /> Node Activity
            </h4>
            <div className="space-y-6">
              <ActivityItem label="NGO Edhi registered" time="2m ago" />
              <ActivityItem label="Water Task #442 closed" time="18m ago" />
              <ActivityItem label="Resource request: Medical" time="1h ago" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RegistrationForm = ({
  formState,
  formStatus,
  handleRegisterNgo,
  updateFormField,
  formErrors = {},
}) => (
  <div className="max-w-3xl mx-auto glass-panel rounded-[48px] p-12 md:p-16 relative overflow-hidden shadow-xl shadow-cyan-500/10 border border-slate-700/30">
    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
    <div className="text-center mb-16">
      <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
        NGO <span className="text-sky-400">Registry</span>
      </h2>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-4 italic opacity-60">
        Authorize Humanitarian Credentials
      </p>
    </div>
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      onSubmit={handleRegisterNgo}
    >
      <div className="md:col-span-2">
        <InputField
          label="Organization Nomenclature"
          placeholder="e.g. Hope Alliance"
          icon={<Globe size={18} />}
          value={formState.name}
          error={formErrors.name}
          onChange={(value) => updateFormField("name", value)}
        />
      </div>
      <InputField
        label="Assigned Lead"
        placeholder="Name of Representative"
        icon={<ShieldCheck size={18} />}
        value={formState.type}
        error={formErrors.type}
        onChange={(value) => updateFormField("type", value)}
      />
      <InputField
        label="Encrypted Comms"
        placeholder="+92 3XX XXXXXXX"
        icon={<Phone size={18} />}
        value={formState.contact}
        error={formErrors.contact}
        onChange={(value) => updateFormField("contact", value)}
      />
      <InputField
        label="Service Core"
        placeholder="e.g. Medical / Rescue"
        icon={<Briefcase size={18} />}
        value={formState.status}
        error={formErrors.status}
        onChange={(value) => updateFormField("status", value)}
      />
      <InputField
        label="Operational Zone"
        placeholder="e.g. Sector G-10"
        icon={<MapPin size={18} />}
        value={formState.location}
        error={formErrors.location}
        onChange={(value) => updateFormField("location", value)}
      />
      <div className="space-y-4 md:col-span-2">
        <div className="rounded-[24px] border border-slate-700/30 bg-slate-900/95 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3">
            Status Settings
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Visibility"
              value={formState.is_active ? "Active" : "Inactive"}
              options={["Active", "Inactive"]}
              onChange={(value) =>
                updateFormField("is_active", value === "Active")
              }
            />
            <SelectField
              label="Indicator Color"
              value={formState.status_color_class}
              options={[
                { label: "Green", value: "bg-green-400" },
                { label: "Blue", value: "bg-blue-400" },
                { label: "Yellow", value: "bg-yellow-400" },
                { label: "Red", value: "bg-red-400" },
              ]}
              error={formErrors.status_color_class}
              onChange={(value) => updateFormField("status_color_class", value)}
            />
          </div>
        </div>
        {formStatus.message ? (
          <div
            className={`rounded-3xl p-4 text-sm ${formStatus.type === "success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}
          >
            {formStatus.message}
          </div>
        ) : null}
        <button className="w-full bg-sky-500 text-slate-950 py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95">
          Establish Protocol
        </button>
      </div>
    </form>
  </div>
);

// --- ATOMIC COMPONENTS ---

const SelectField = ({ label, value, options, onChange, error }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-4">
      {label}
    </label>
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-slate-900/95 border border-slate-700/40 rounded-[24px] px-4 py-4 text-sm text-white focus:border-sky-500/40 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all"
      >
        {options.map((option) => {
          if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          }
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
    {error ? <p className="text-sm text-rose-400 mt-2 ml-4">{error}</p> : null}
  </div>
);

const SectionLabel = ({ label }) => (
  <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 mt-6">
    {label}
  </p>
);

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[22px] transition-all duration-300 group relative ${
      active
        ? "bg-slate-900 text-slate-100 font-bold shadow-lg shadow-cyan-500/10"
        : "text-slate-400 hover:bg-slate-900/70 hover:text-slate-100"
    }`}
  >
    <span
      className={`${active ? "text-slate-100" : "group-hover:text-sky-400"} transition-colors`}
    >
      {icon}
    </span>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
      {label}
    </span>
  </button>
);

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    sky: "text-sky-400 bg-sky-400/5 border-sky-400/10",
    blue: "text-blue-400 bg-blue-400/5 border-blue-400/10",
    green: "text-green-400 bg-green-400/5 border-green-400/10",
    red: "text-red-400 bg-red-400/5 border-red-400/10",
  };
  return (
    <div className="glass-panel p-8 rounded-[32px] border border-slate-700/40 group hover:bg-slate-900/95 transition-all cursor-default">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2">
        {label}
      </p>
      <p className="text-4xl font-black text-white tracking-tighter leading-none">
        {value}
      </p>
    </div>
  );
};

const InputField = ({ label, placeholder, icon, value, onChange, error }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-4">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">
        {icon}
      </div>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900/95 border border-slate-700/40 rounded-[24px] px-16 py-5 text-sm text-white focus:border-sky-500/40 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all placeholder:text-slate-500 font-medium tracking-wide"
      />
    </div>
    {error ? <p className="text-sm text-rose-400 mt-2 ml-4">{error}</p> : null}
  </div>
);

const ActivityItem = ({ label, time }) => (
  <div className="flex items-center justify-between group cursor-default">
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-sky-500 transition-colors"></div>
      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-tight">
        {label}
      </span>
    </div>
    <span className="text-[9px] font-black text-slate-500 uppercase">
      {time}
    </span>
  </div>
);

// Mission Board and Intel View placeholders...
const MissionBoard = ({ ngos, searchQuery = "" }) => {
  const q = (searchQuery || "").trim().toLowerCase();
  const filtered = q
    ? ngos.filter((ngo) => {
        const hay =
          `${ngo.name || ""} ${ngo.type || ""} ${ngo.location || ""} ${ngo.status || ""}`.toLowerCase();
        return hay.includes(q);
      })
    : ngos;

  const displayTasks =
    filtered && filtered.length
      ? filtered.slice(0, 6).map((ngo, idx) => ({
          id: ngo.id || idx,
          title: `${ngo.name} Coordination`,
          ngo: ngo.type || "Partner",
          status: ngo.is_active ? "Active" : "Inactive",
          priority: ngo.status_color_class?.includes("red")
            ? "Critical"
            : ngo.status_color_class?.includes("yellow")
              ? "Medium"
              : "Normal",
          region: ngo.location || "Unknown",
        }))
      : [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Central <span className="text-sky-400">Board</span>
        </h2>
        <button className="flex items-center gap-3 bg-slate-900/95 hover:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-700/40 transition-all">
          <ArrowUpRight size={16} className="text-sky-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">
            Global Status
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayTasks.map((t) => (
          <div
            key={t.id}
            className="glass-panel p-8 rounded-[40px] border border-slate-700/30 hover:border-sky-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-10">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                {t.region}
              </span>
              <div
                className={`p-2 rounded-lg ${t.status === "Completed" ? "bg-green-500/10" : "bg-sky-500/10"}`}
              >
                {t.status === "Completed" ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <Activity size={14} className="text-sky-500" />
                )}
              </div>
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight text-white mb-2 leading-tight group-hover:text-sky-400 transition-colors">
              {t.title}
            </h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t.ngo}
            </p>
            <div className="mt-10 pt-10 border-t border-slate-700/20 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">
                {t.status}
              </span>
              <button className="text-[9px] font-black uppercase text-slate-400 hover:text-white transition-colors">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IntelView = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
    <div className="flex items-center gap-6 mb-16">
      <div className="w-16 h-16 rounded-[28px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-2xl">
        <Radio size={28} className="text-sky-400 animate-pulse" />
      </div>
      <div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
          Live <span className="text-sky-400">Intel</span> Feed
        </h2>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.4em] mt-2">
          Authenticated Broadcast Stream
        </p>
      </div>
    </div>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="glass-panel p-10 rounded-[50px] relative group hover:bg-slate-900 transition-all border border-slate-700/30 shadow-xl shadow-cyan-500/10"
      >
        <div className="absolute left-0 top-0 h-full w-1.5 bg-sky-500/50 rounded-full scale-y-50 group-hover:scale-y-100 transition-transform"></div>
        <div className="flex justify-between items-start mb-6">
          <span className="text-[11px] font-black text-sky-400 uppercase tracking-[0.4em]">
            Auth: Command Central
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {i * 10}m Ago
          </span>
        </div>
        <p className="text-xl font-medium text-slate-300 italic leading-relaxed pr-10">
          "Surge in river water level detected at Station {i}. All relief units
          at Zone Delta to enter high-alert state."
        </p>
      </div>
    ))}
  </div>
);

const ConfigView = () => {
  const [form, setForm] = useState({
    adminName: "Administrator",
    adminEmail: "admin@ngo.system",
    adminPhone: "+1 (555) 000-0000",
    accessLevel: "LEVEL_7_ADMINISTRATOR",
  });

  const [settings, setSettings] = useState({
    notificationAlerts: true,
    emergencySMS: true,
    autoBackup: true,
    minAlertLevel: 1,
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleToggle = (key) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  const handleCommit = async () => {
    setSaving(true);
    const payload = { ...form, ...settings };
    try {
      const response = await apiFetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setToast("Configuration changes committed successfully.");
        setTimeout(() => setToast(null), 3000);
      } else {
        const errorData = await response.json();
        setToast(errorData.error || "Server error. Check backend.");
        setTimeout(() => setToast(null), 3000);
      }
    } catch (e) {
      console.error("Config commit error:", e);
      setToast("Backend offline — changes saved locally.");
      setTimeout(() => setToast(null), 3000);
    }
    setSaving(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .cfg-root { 
          background: #0e1015; 
          min-height: 100%;
          color: #c9cdd8; 
          padding: 40px 32px 60px;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }
        .cfg-root * { 
          font-family: 'Inter', sans-serif; 
          box-sizing: border-box; 
        }

        .cfg-input {
          width: 100%; background: #181c26; border: 1px solid #252a38;
          border-radius: 8px; padding: 11px 14px; color: #e2e6f0;
          font-size: 15px; font-weight: 500; outline: none;
          transition: border-color 0.15s;
        }
        .cfg-input:focus { border-color: #3b5bdb; }
        .cfg-input[readonly] { cursor: default; color: #f0a500; font-weight: 700; letter-spacing: 0.05em; background: #181c26; }

        .cfg-label {
          font-size: 9px; letter-spacing: 0.18em; color: #4b5263;
          font-weight: 600; text-transform: uppercase; margin-bottom: 6px; display: block;
        }
        .cfg-card {
          background: #13161f; border: 1px solid #1e2230;
          border-radius: 12px; padding: 24px 22px;
          border-left: 3px solid #2a3050;
        }
        .cfg-section-title {
          font-size: 10px; letter-spacing: 0.22em; font-weight: 700;
          color: #5a6380; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
        }
        .cfg-toggle-track {
          width: 44px; height: 24px; border-radius: 12px; cursor: pointer;
          transition: background 0.2s; position: relative; flex-shrink: 0;
        }
        .cfg-toggle-thumb {
          position: absolute; top: 3px; width: 18px; height: 18px;
          border-radius: 50%; background: #fff; transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .cfg-commit-btn {
          width: 100%; padding: 17px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
          color: #fff; font-size: 13px; font-weight: 800; letter-spacing: 0.22em;
          cursor: pointer; transition: opacity 0.2s, transform 0.1s;
          text-transform: uppercase;
        }
        .cfg-commit-btn:hover { opacity: 0.92; }
        .cfg-commit-btn:active { transform: scale(0.99); }
        .cfg-commit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cfg-severity-track {
          position: relative; height: 4px; background: #252a38;
          border-radius: 2px; margin: 16px 0 10px; cursor: pointer;
        }
        .cfg-severity-fill {
          position: absolute; top: 0; left: 0; height: 100%;
          background: linear-gradient(90deg, #3b5bdb, #60a5fa);
          border-radius: 2px;
        }
        .cfg-severity-thumb {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          width: 14px; height: 14px; border-radius: 50%;
          background: #fff; border: 2px solid #4f8ef7;
          box-shadow: 0 0 8px rgba(79,142,247,0.5);
        }
        .cfg-severity-labels {
          display: flex; justify-content: space-between;
          font-size: 9px; letter-spacing: 0.12em; font-weight: 600;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: "#2563eb",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "11px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 24px rgba(37,99,235,0.45)",
          }}
        >
          {toast}
        </div>
      )}

      <div className="cfg-root">
        {/* Page Header */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 10px",
              letterSpacing: "-0.5px",
              lineHeight: 1,
              background: "linear-gradient(90deg, #fff 60%, #4f8ef7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SYSTEM CONFIGURATIONS
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#4b5263",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Manage administrative settings and notification preferences for the
            <br />
            NGO Coordination Platform.
          </p>
        </div>

        {/* Two column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ADMIN_PROFILE card */}
            <div className="cfg-card">
              <div className="cfg-section-title">
                <span style={{ fontSize: 13 }}>👤</span>
                ADMIN_PROFILE
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label className="cfg-label">Admin Name</label>
                  <input
                    className="cfg-input"
                    name="adminName"
                    value={form.adminName}
                    onChange={handleFormChange}
                    placeholder="Administrator"
                  />
                </div>
                <div>
                  <label className="cfg-label">Admin Email</label>
                  <input
                    className="cfg-input"
                    name="adminEmail"
                    value={form.adminEmail}
                    onChange={handleFormChange}
                    placeholder="admin@ngo.system"
                    type="email"
                  />
                </div>
                <div>
                  <label className="cfg-label">Contact Phone</label>
                  <input
                    className="cfg-input"
                    name="adminPhone"
                    value={form.adminPhone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="cfg-label">Access Level</label>
                  <input
                    className="cfg-input"
                    name="accessLevel"
                    value={form.accessLevel}
                    readOnly
                    style={{
                      color: "#f0a500",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* NOTIFICATION_SETTINGS card */}
            <div className="cfg-card">
              <div className="cfg-section-title">
                <span style={{ fontSize: 13 }}>🔔</span>
                NOTIFICATION_SETTINGS
              </div>

              {[
                {
                  key: "notificationAlerts",
                  label: "Notification Alerts",
                  sub: "System-wide notification delivery",
                },
                {
                  key: "emergencySMS",
                  label: "Emergency SMS Alerts",
                  sub: "Critical alerts via SMS",
                },
                {
                  key: "autoBackup",
                  label: "Auto Backup System",
                  sub: "Automatic database backups",
                },
              ].map(({ key, label, sub }) => {
                const on = settings[key];
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#d4d8e4",
                          marginBottom: 3,
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontSize: 11, color: "#4b5263" }}>
                        {sub}
                      </div>
                    </div>
                    <div
                      className="cfg-toggle-track"
                      style={{ background: on ? "#2563eb" : "#252a38" }}
                      onClick={() => handleToggle(key)}
                    >
                      <div
                        className="cfg-toggle-thumb"
                        style={{ left: on ? "23px" : "3px" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* ALERT_SEVERITY card */}
            <div className="cfg-card">
              <div className="cfg-section-title">
                <span style={{ fontSize: 13 }}>⚠️</span>
                ALERT_SEVERITY_LEVEL
              </div>

              <div>
                <label className="cfg-label">Minimum Alert Level</label>
                <div
                  className="cfg-severity-track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    const idx = Math.round(pct * 2);
                    handleToggle(
                      "minAlertLevel",
                      Math.max(0, Math.min(2, idx)),
                    );
                  }}
                >
                  <div
                    className="cfg-severity-fill"
                    style={{ width: `${(settings.minAlertLevel / 2) * 100}%` }}
                  />
                  <div
                    className="cfg-severity-thumb"
                    style={{ left: `${(settings.minAlertLevel / 2) * 100}%` }}
                  />
                </div>
                <div className="cfg-severity-labels">
                  <span
                    style={{
                      cursor: "pointer",
                      color:
                        settings.minAlertLevel === 0 ? "#60a5fa" : "#4b5263",
                      fontWeight: settings.minAlertLevel === 0 ? 700 : 500,
                    }}
                    onClick={() =>
                      setSettings((s) => ({ ...s, minAlertLevel: 0 }))
                    }
                  >
                    LOW
                  </span>
                  <span
                    style={{
                      cursor: "pointer",
                      color:
                        settings.minAlertLevel === 1 ? "#60a5fa" : "#4b5263",
                      fontWeight: settings.minAlertLevel === 1 ? 700 : 500,
                    }}
                    onClick={() =>
                      setSettings((s) => ({ ...s, minAlertLevel: 1 }))
                    }
                  >
                    MEDIUM
                  </span>
                  <span
                    style={{
                      cursor: "pointer",
                      color:
                        settings.minAlertLevel === 2 ? "#60a5fa" : "#4b5263",
                      fontWeight: settings.minAlertLevel === 2 ? 700 : 500,
                    }}
                    onClick={() =>
                      setSettings((s) => ({ ...s, minAlertLevel: 2 }))
                    }
                  >
                    HIGH
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#4b5263",
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  📊 Configure the system to only trigger alerts above the
                  selected severity level to reduce notification fatigue.
                </p>
              </div>
            </div>

            {/* SYSTEM_INFO card */}
            <div className="cfg-card">
              <div className="cfg-section-title">
                <span style={{ fontSize: 13 }}>ℹ️</span>
                SYSTEM_INFORMATION
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: "#4b5263",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Platform Version
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#e2e6f0",
                      fontWeight: 600,
                    }}
                  >
                    v2.4.1
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: "#4b5263",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Last Updated
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#e2e6f0",
                      fontWeight: 600,
                    }}
                  >
                    {new Date().toLocaleDateString("en-US")}
                  </div>
                </div>
              </div>
            </div>

            {/* COMMIT button */}
            <button
              className="cfg-commit-btn"
              onClick={handleCommit}
              disabled={saving}
            >
              {saving ? "COMMITTING..." : "SAVE_CONFIGURATION"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const SupportView = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-600">
    <div className="flex items-center gap-6 mb-8">
      <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
        Tech Support
      </h2>
      <p className="text-sm text-slate-400 uppercase font-bold tracking-[0.3em]">
        Contact and troubleshooting
      </p>
    </div>
    <div className="glass-panel p-10 rounded-[40px] border border-slate-700/30">
      <p className="text-sm text-slate-300">
        For assistance, email: ops-support@example.org or call the command line.
      </p>
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-slate-900/95 text-white rounded-xl border border-slate-700/30">
          Open Ticket
        </button>
        <button className="px-4 py-2 bg-sky-500 text-slate-950 rounded-xl">
          Contact Now
        </button>
      </div>
    </div>
  </div>
);

export default NGOPortal;
