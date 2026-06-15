import { useState, useEffect } from "react";

const DEPLOYMENT_ZONES = [
  "Pacific Northwest (Sector 7)",
  "Southeast Asia (Sector 3)",
  "Central Europe (Sector 12)",
  "Sub-Saharan Africa (Sector 5)",
  "South Asia (Sector 9)",
  "East Africa (Sector 2)",
];

const SEVERITY_LEVELS = ["TRIVIAL", "NOMINAL_WATCH", "CATASTROPHIC"];

export default function SystemParameters() {
  const [form, setForm] = useState({
    fullName: "Cmdr. Elias Thorne",
    protocolEmail: "e.thorne@sentinel.hq",
    secureLine: "+1 (555) 092-8841",
    accessLevel: "LEVEL_7_ADMINISTRATOR",
  });

  const [signals, setSignals] = useState({
    priorityEmailAlerts: true,
    smsCriticalFlash: false,
    minAlertSeverity: 1, // 0=TRIVIAL, 1=NOMINAL_WATCH, 2=CATASTROPHIC
  });

  const [geoZone, setGeoZone] = useState(DEPLOYMENT_ZONES[0]);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [protocolKey, setProtocolKey] = useState("••••••••••••");
  const [keyVisible, setKeyVisible] = useState(false);
  const [realKey, setRealKey] = useState("SK-7G-ALPHA-2024-XK9");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [gpsRefreshing, setGpsRefreshing] = useState(false);

  // Load settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        if (!res.ok) return;
        const data = await res.json();
        if (data.fullName) setForm((f) => ({ ...f, ...data }));
        if (data.priorityEmailAlerts !== undefined)
          setSignals((s) => ({ ...s, ...data }));
        if (data.geoZone) setGeoZone(data.geoZone);
      } catch {
        // Backend not connected yet — using defaults
      }
    };
    fetchSettings();
  }, []);

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleToggle = (key) => {
    setSignals((s) => ({ ...s, [key]: !s[key] }));
  };

  const handleSeverityClick = (idx) => {
    setSignals((s) => ({ ...s, minAlertSeverity: idx }));
  };

  const handleRegenerateKeys = async () => {
    const newKey =
      "SK-" +
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      "-" +
      Date.now().toString(36).toUpperCase();
    setRealKey(newKey);
    setProtocolKey(keyVisible ? newKey : "••••••••••••");
    showToast("Protocol key regenerated.");
    try {
      await fetch("http://localhost:5000/api/settings/regenerate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey }),
      });
    } catch {
      /* offline */
    }
  };

  const handleGpsRefresh = () => {
    setGpsRefreshing(true);
    setTimeout(() => {
      setGpsRefreshing(false);
      showToast("GPS lock refreshed for " + geoZone);
    }, 1800);
  };

  const handleCommit = async () => {
    setSaving(true);
    const payload = { ...form, ...signals, geoZone };
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast("Changes committed successfully.");
      } else {
        showToast("Server error. Check backend.");
      }
    } catch {
      showToast("Backend offline — changes saved locally.");
    }
    setSaving(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleKeyVisibility = () => {
    setKeyVisible((v) => {
      setProtocolKey(!v ? realKey : "••••••••••••");
      return !v;
    });
  };

  // Severity slider position percentage
  const sliderPct =
    (signals.minAlertSeverity / (SEVERITY_LEVELS.length - 1)) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .sp-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .sp-root { background: #0e1015; min-height: 100vh; color: #c9cdd8; padding: 40px 32px 60px; }

        .sp-input {
          width: 100%; background: #181c26; border: 1px solid #252a38;
          border-radius: 8px; padding: 11px 14px; color: #e2e6f0;
          font-size: 15px; font-weight: 500; outline: none;
          transition: border-color 0.15s;
        }
        .sp-input:focus { border-color: #3b5bdb; }
        .sp-input[readonly] { cursor: default; color: #f0a500; font-weight: 700; letter-spacing: 0.05em; background: #181c26; }

        .sp-label {
          font-size: 9px; letter-spacing: 0.18em; color: #4b5263;
          font-weight: 600; text-transform: uppercase; margin-bottom: 6px; display: block;
        }
        .sp-card {
          background: #13161f; border: 1px solid #1e2230;
          border-radius: 12px; padding: 24px 22px;
          border-left: 3px solid #2a3050;
        }
        .sp-section-title {
          font-size: 10px; letter-spacing: 0.22em; font-weight: 700;
          color: #5a6380; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
        }
        .toggle-track {
          width: 44px; height: 24px; border-radius: 12px; cursor: pointer;
          transition: background 0.2s; position: relative; flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute; top: 3px; width: 18px; height: 18px;
          border-radius: 50%; background: #fff; transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .sp-zone-dropdown {
          background: #181c26; border: 1px solid #252a38; border-radius: 8px;
          padding: 11px 14px; cursor: pointer; display: flex;
          justify-content: space-between; align-items: center;
          color: #e2e6f0; font-size: 14px; font-weight: 500;
          transition: border-color 0.15s; user-select: none;
        }
        .sp-zone-dropdown:hover { border-color: #3b5bdb; }
        .sp-zone-option {
          padding: 10px 14px; cursor: pointer; font-size: 13px; color: #c9cdd8;
          transition: background 0.1s; border-radius: 6px;
        }
        .sp-zone-option:hover { background: rgba(59,91,219,0.15); color: #fff; }
        .sp-commit-btn {
          width: 100%; padding: 17px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
          color: #fff; font-size: 13px; font-weight: 800; letter-spacing: 0.22em;
          cursor: pointer; transition: opacity 0.2s, transform 0.1s;
          text-transform: uppercase;
        }
        .sp-commit-btn:hover { opacity: 0.92; }
        .sp-commit-btn:active { transform: scale(0.99); }
        .sp-commit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .sp-regen-btn {
          background: none; border: none; cursor: pointer;
          color: #4f8ef7; font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; display: flex; align-items: center; gap: 6px;
          padding: 0; margin-top: 14px; transition: color 0.15s;
        }
        .sp-regen-btn:hover { color: #7eb3ff; }
        .sp-map-box {
          background: #0d1520;
          border-radius: 10px; height: 130px; position: relative; overflow: hidden;
          border: 1px solid #1a2030; margin-top: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .sp-gps-btn {
          background: rgba(20,28,45,0.92); border: 1px solid #2a3555;
          color: #c9cdd8; font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
          padding: 9px 20px; border-radius: 20px; cursor: pointer;
          transition: all 0.15s; z-index: 2; position: relative;
        }
        .sp-gps-btn:hover { background: rgba(30,42,70,0.98); border-color: #4f8ef7; color: #fff; }
        .severity-track {
          position: relative; height: 4px; background: #252a38;
          border-radius: 2px; margin: 16px 0 10px; cursor: pointer;
        }
        .severity-fill {
          position: absolute; top: 0; left: 0; height: 100%;
          background: linear-gradient(90deg, #3b5bdb, #60a5fa);
          border-radius: 2px; transition: width 0.2s;
        }
        .severity-thumb {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          width: 14px; height: 14px; border-radius: 50%;
          background: #fff; border: 2px solid #4f8ef7;
          box-shadow: 0 0 8px rgba(79,142,247,0.5); transition: left 0.2s;
        }
        .severity-labels {
          display: flex; justify-content: space-between;
          font-size: 9px; letter-spacing: 0.12em; font-weight: 600;
        }
      `}</style>

      {/* Toast */}
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

      <div className="sp-root">
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
            SYSTEM PARAMETERS
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#4b5263",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Configure administrative protocols and node-level notification
            triggers for
            <br />
            Sector 7-G Alpha.
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
            {/* IDENTITY_PROFILE card */}
            <div className="sp-card">
              <div className="sp-section-title">
                <span style={{ fontSize: 13 }}>👤</span>
                IDENTITY_PROFILE
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label className="sp-label">Full Name</label>
                  <input
                    className="sp-input"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleFormChange}
                    placeholder="Commander Name"
                  />
                </div>
                <div>
                  <label className="sp-label">Protocol Email</label>
                  <input
                    className="sp-input"
                    name="protocolEmail"
                    value={form.protocolEmail}
                    onChange={handleFormChange}
                    placeholder="email@sentinel.hq"
                    type="email"
                  />
                </div>
                <div>
                  <label className="sp-label">Secure Line</label>
                  <input
                    className="sp-input"
                    name="secureLine"
                    value={form.secureLine}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="sp-label">Access Level</label>
                  <input
                    className="sp-input"
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

            {/* SECURITY_OVERRIDE card */}
            <div className="sp-card">
              <div className="sp-section-title">
                <span style={{ fontSize: 13 }}>🔒</span>
                SECURITY_OVERRIDE
              </div>

              <label className="sp-label">New Protocol Key</label>
              <div style={{ position: "relative" }}>
                <input
                  className="sp-input"
                  type={keyVisible ? "text" : "password"}
                  value={protocolKey}
                  readOnly
                  style={{
                    letterSpacing: keyVisible ? "0.05em" : "0.2em",
                    paddingRight: 44,
                  }}
                />
                <button
                  onClick={toggleKeyVisibility}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4b5263",
                    fontSize: 15,
                    padding: 0,
                    transition: "color 0.15s",
                  }}
                  title={keyVisible ? "Hide key" : "Show key"}
                >
                  {keyVisible ? "🙈" : "👁"}
                </button>
              </div>

              <button className="sp-regen-btn" onClick={handleRegenerateKeys}>
                <span style={{ fontSize: 14 }}>↻</span> REGENERATE_KEYS
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* SIGNAL_THRESHOLDS card */}
            <div className="sp-card">
              <div className="sp-section-title">SIGNAL_THRESHOLDS</div>

              {/* Toggle rows */}
              {[
                {
                  key: "priorityEmailAlerts",
                  label: "Priority Email Alerts",
                  sub: "Telemetry deviation reports",
                },
                {
                  key: "smsCriticalFlash",
                  label: "SMS Critical Flash",
                  sub: "Tier 3 structural failures",
                },
              ].map(({ key, label, sub }) => {
                const on = signals[key];
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
                      className="toggle-track"
                      style={{ background: on ? "#2563eb" : "#252a38" }}
                      onClick={() => handleToggle(key)}
                    >
                      <div
                        className="toggle-thumb"
                        style={{ left: on ? "23px" : "3px" }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Severity slider */}
              <div style={{ marginTop: 8 }}>
                <label className="sp-label">Minimum Alert Severity</label>
                <div
                  className="severity-track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    const idx = Math.round(pct * (SEVERITY_LEVELS.length - 1));
                    handleSeverityClick(
                      Math.max(0, Math.min(SEVERITY_LEVELS.length - 1, idx)),
                    );
                  }}
                >
                  <div
                    className="severity-fill"
                    style={{ width: `${sliderPct}%` }}
                  />
                  <div
                    className="severity-thumb"
                    style={{ left: `${sliderPct}%` }}
                  />
                </div>
                <div className="severity-labels">
                  {SEVERITY_LEVELS.map((lvl, i) => (
                    <span
                      key={lvl}
                      onClick={() => handleSeverityClick(i)}
                      style={{
                        cursor: "pointer",
                        color:
                          signals.minAlertSeverity === i
                            ? "#60a5fa"
                            : "#4b5263",
                        fontWeight: signals.minAlertSeverity === i ? 700 : 500,
                        transition: "color 0.15s",
                      }}
                    >
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* GEO_LOCATION_LOCK card */}
            <div className="sp-card">
              <div className="sp-section-title">GEO_LOCATION_LOCK</div>

              <label className="sp-label">Active Deployment Zone</label>
              <div style={{ position: "relative" }}>
                <div
                  className="sp-zone-dropdown"
                  onClick={() => setZoneOpen((o) => !o)}
                >
                  <span>{geoZone}</span>
                  <span
                    style={{
                      transform: zoneOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      fontSize: 12,
                      color: "#4b5263",
                    }}
                  >
                    ▼
                  </span>
                </div>
                {zoneOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      right: 0,
                      background: "#181c26",
                      border: "1px solid #252a38",
                      borderRadius: 10,
                      padding: 6,
                      zIndex: 50,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}
                  >
                    {DEPLOYMENT_ZONES.map((z) => (
                      <div
                        key={z}
                        className="sp-zone-option"
                        style={{
                          color: z === geoZone ? "#60a5fa" : "#c9cdd8",
                          fontWeight: z === geoZone ? 600 : 400,
                        }}
                        onClick={() => {
                          setGeoZone(z);
                          setZoneOpen(false);
                        }}
                      >
                        {z}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Map placeholder */}
              <div className="sp-map-box">
                {/* Grid lines to simulate map */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.15,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {[20, 40, 60, 80].map((p) => (
                    <g key={p}>
                      <line
                        x1={`${p}%`}
                        y1="0"
                        x2={`${p}%`}
                        y2="100%"
                        stroke="#4f8ef7"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="0"
                        y1={`${p}%`}
                        x2="100%"
                        y2={`${p}%`}
                        stroke="#4f8ef7"
                        strokeWidth="0.5"
                      />
                    </g>
                  ))}
                  <ellipse
                    cx="50%"
                    cy="50%"
                    rx="45%"
                    ry="35%"
                    stroke="#2a4070"
                    strokeWidth="1"
                    fill="none"
                  />
                  <ellipse
                    cx="50%"
                    cy="50%"
                    rx="28%"
                    ry="20%"
                    stroke="#2a4070"
                    strokeWidth="1"
                    fill="none"
                  />
                  {gpsRefreshing && (
                    <circle
                      cx="50%"
                      cy="50%"
                      r="8"
                      fill="#4f8ef7"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values="8;22;8"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0;0.8"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <circle cx="50%" cy="50%" r="4" fill="#4f8ef7" />
                </svg>
                <button className="sp-gps-btn" onClick={handleGpsRefresh}>
                  {gpsRefreshing ? "LOCKING..." : "REFRESH_GPS_LOCK"}
                </button>
              </div>
            </div>

            {/* COMMIT button */}
            <button
              className="sp-commit-btn"
              onClick={handleCommit}
              disabled={saving}
            >
              {saving ? "COMMITTING..." : "COMMIT_CHANGES"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
