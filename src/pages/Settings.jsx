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
    <div className="min-h-screen bg-slate-900 text-gray-300 p-8">
      <button
        className="mb-6 text-sm text-blue-400 underline"
        onClick={() => navigate(ROUTES.dashboard)}
      >
        Back to Dashboard
      </button>

      <h1 className="text-3xl font-black text-white mb-4">Settings</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="max-w-md space-y-4">
          {error && <div className="text-red-400">{error}</div>}
          <label className="block">
            <div className="text-sm text-gray-400 mb-1">Full Name</div>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 border border-white/5"
            />
          </label>
          <label className="block">
            <div className="text-sm text-gray-400 mb-1">Phone</div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 border border-white/5"
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 px-4 py-2 rounded font-bold"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => navigate(ROUTES.dashboard)}
              className="px-4 py-2 rounded border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
