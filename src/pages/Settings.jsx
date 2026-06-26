import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/auth/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const user = data.user || {};
        setFullName(user.full_name || "");
        setPhone(user.phone || "");
      })
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/me`, {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 selection:bg-blue-500/30 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80">
                Platform settings
              </p>
              <h1 className="mt-3 text-4xl font-black text-white">
                Administrator settings
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Customize the admin experience and notification theme to match
                the Sentinel dashboard style. Save profile details, update
                contact access, and preview system status.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving settings..." : "Save settings"}
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

        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20">
            {loading ? (
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-8 text-slate-400">
                Loading profile settings...
              </div>
            ) : (
              <div className="space-y-6">
                {error && (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                  </div>
                )}
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-300">
                    <span className="font-semibold text-slate-100">
                      Full Name
                    </span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60"
                      placeholder="Commander Name"
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
                    Notification preferences
                  </p>
                  <p className="mt-3 text-sm text-slate-400">
                    These settings help ensure your admin alerts and system
                    messages match the notification experience across the
                    platform.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-sm font-semibold text-slate-100">
                        Alert tone
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Set the alert sound profile for admin warnings and
                        updates.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-sm font-semibold text-slate-100">
                        Theme accent
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Use a blue accent for notifications and cards across the
                        dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold text-white">
                Support overview
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Access admin support resources directly and keep system
                operations aligned with alerts and notification workflows.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold text-slate-100">
                    Support email
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    support@sentinel.ops
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold text-slate-100">
                    System status
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    All notification and alert channels are operational.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-xs uppercase tracking-[0.36em] text-sky-300/80">
                Quick actions
              </p>
              <div className="mt-4 grid gap-3">
                <button className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-slate-800">
                  Review notification theme
                </button>
                <button className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-slate-800">
                  Open support chat
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
