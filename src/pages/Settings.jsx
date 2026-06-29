import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  Settings,
  LayoutDashboard,
  UserPlus,
  ClipboardCheck,
  Radio,
  HelpCircle,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Sub-components defined OUTSIDE the parent to avoid re-mounting on re-render
// ---------------------------------------------------------------------------

function AdminHeader({
  isSidebarOpen,
  setSidebarOpen,
  userRole,
  searchQuery,
  setSearchQuery,
}) {
  return (
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
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 leading-none">
            Settings Manager
          </h2>
          <span className="text-[10px] font-bold text-sky-400/70 mt-1 uppercase">
            {userRole ? `Role: ${userRole.toUpperCase()}` : "Admin Panel"}
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900/60 border border-slate-700/30 focus-within:ring-1 ring-sky-500/30 transition-all">
        <Search size={16} className="text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH SETTINGS..."
          className="bg-transparent border-none text-[9px] font-bold outline-none w-56 uppercase tracking-[0.2em] placeholder:text-slate-500 text-slate-100"
        />
      </div>
    </motion.header>
  );
}

function AdminSidebar({ isSidebarOpen, navigate }) {
  const navItems = [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      onClick: () => navigate(ROUTES.dashboard),
    },
    {
      icon: <UserPlus size={18} />,
      label: "NGO Registry",
      onClick: () => navigate("/admin"),
    },
    {
      icon: <ClipboardCheck size={18} />,
      label: "Mission Board",
      onClick: () => {},
    },
    { icon: <Radio size={18} />, label: "Live Intel", onClick: () => {} },
  ];

  return (
    <motion.aside
      className={`fixed md:static w-72 h-full bg-slate-950 border-r border-slate-700/30 flex flex-col z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-24 border-b border-slate-700/30 flex items-center px-8 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
          <Settings size={20} className="text-sky-400" />
        </div>
        <div>
          <h1 className="text-base font-black text-white">Admin Panel</h1>
          <p className="text-[9px] text-sky-400/80 font-bold uppercase tracking-[0.3em] mt-1.5">
            Configuration
          </p>
        </div>
      </div>

      <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto bg-slate-900/95">
        <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 mt-6">
          Operations
        </p>
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="w-full flex items-center gap-5 px-6 py-4 rounded-[22px] transition-all duration-300 group text-slate-400 hover:bg-slate-900/70 hover:text-slate-100"
          >
            <span className="group-hover:text-sky-400 transition-colors">
              {item.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {item.label}
            </span>
          </button>
        ))}

        <div className="pt-6">
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">
            Systems
          </p>
          <button className="w-full flex items-center gap-5 px-6 py-4 rounded-[22px] transition-all duration-300 bg-slate-900 text-slate-100 font-bold shadow-lg shadow-cyan-500/10">
            <Settings size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Settings
            </span>
          </button>
          <button className="w-full flex items-center gap-5 px-6 py-4 rounded-[22px] transition-all duration-300 group text-slate-400 hover:bg-slate-900/70 hover:text-slate-100 mt-1.5">
            <span className="group-hover:text-sky-400 transition-colors">
              <HelpCircle size={18} />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Support
            </span>
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}

function ProfileForm({
  loading,
  error,
  fullName,
  setFullName,
  phone,
  setPhone,
  isAdmin,
}) {
  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-8 text-slate-400">
        Loading profile settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold text-slate-100">Full Name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60"
            placeholder={isAdmin ? "Administrator Name" : "Your Name"}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-semibold text-slate-100">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60"
            placeholder="+1 (555) 123-4567"
          />
        </label>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300/80">
          {isAdmin ? "Admin Preferences" : "Notification preferences"}
        </p>
        <p className="mt-3 text-sm text-slate-400">
          {isAdmin
            ? "Configure your admin alerts and system notification settings to match your workflow preferences across the platform."
            : "These settings help ensure your alerts and system messages match your notification experience across the platform."}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm font-semibold text-slate-100">Alert tone</p>
            <p className="mt-2 text-sm text-slate-400">
              {isAdmin
                ? "Set the alert sound profile for admin warnings and critical updates."
                : "Set the alert sound profile for warnings and updates."}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm font-semibold text-slate-100">Theme accent</p>
            <p className="mt-2 text-sm text-slate-400">
              {isAdmin
                ? "Use a blue accent for notifications and cards across the admin dashboard."
                : "Use a blue accent for notifications and cards across the dashboard."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportSidebar({ isAdmin }) {
  return (
    <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-semibold text-white">
          {isAdmin ? "Admin Support" : "Support overview"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {isAdmin
            ? "Access admin support resources and keep system operations aligned with your configuration preferences."
            : "Access support resources directly and keep your system operations aligned with alerts and notification workflows."}
        </p>
        <div className="mt-6 space-y-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-slate-100">
              Support email
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {isAdmin ? "admin-support@system.ops" : "support@system.ops"}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-slate-100">
              System status
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {isAdmin
                ? "All admin systems are operational."
                : "All notification and alert channels are operational."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-xs uppercase tracking-[0.36em] text-sky-300/80">
          Quick Actions
        </p>
        <div className="mt-4 grid gap-3">
          <button className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-slate-800">
            {isAdmin ? "Review system config" : "Review notification theme"}
          </button>
          <button className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-slate-800">
            {isAdmin ? "Open admin chat" : "Open support chat"}
          </button>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Main Settings page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch("/api/auth/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const user = data.user || {};
        setFullName(user.full_name || "");
        setPhone(user.phone || "");
        setUserRole(user.role || user.type || "");
        setIsAdmin(
          user.role === "admin" ||
            user.type === "admin" ||
            user.is_admin === true,
        );
      })
      .catch((e) => {
        if (mounted) setError(String(e));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ fullName, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      navigate(ROUTES.dashboard);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }, [fullName, phone, token, navigate]);

  const pageContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 selection:bg-blue-500/30 py-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header card */}
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80">
                {isAdmin ? "Admin Settings" : "Platform settings"}
              </p>
              <h1 className="mt-3 text-4xl font-black text-white">
                {isAdmin ? "Configuration Panel" : "User settings"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                {isAdmin
                  ? "Manage your admin profile and customize the system experience. Save profile details and update your access."
                  : "Customize your user experience and notification preferences. Save your profile details and update your contact information."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save settings"}
              </button>
              <button
                onClick={() => navigate(ROUTES.dashboard)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/40 hover:text-white"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Body grid */}
        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20">
            <ProfileForm
              loading={loading}
              error={error}
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              isAdmin={isAdmin}
            />
          </section>

          <SupportSidebar isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <motion.div
        className="flex h-screen flex-col bg-slate-950 text-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userRole={userRole}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar isSidebarOpen={isSidebarOpen} navigate={navigate} />
          <div className="flex-1 flex flex-col overflow-auto">
            {pageContent}
          </div>
        </div>
      </motion.div>
    );
  }

  return pageContent;
}
