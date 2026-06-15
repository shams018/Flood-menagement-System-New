import { useState, useEffect } from "react";

const MOCK_REPORTS = [
  {
    _id: "1",
    date: "2024-10-24",
    title: "Flash Flood Vector Analysis: Lower Danube",
    region: "SE-EUROPE",
    status: "sent",
    confidence: 94,
    summary:
      "Probability of critical failure at Barrage Sector 4 has increased to 74% based on latest n8n telemetry analysis.",
    detail:
      "Water levels at the Danube station reported an anomalous rise of 1.2m within 180 minutes. Prediction models suggest peak overflow between 0400h and 0600h tomorrow.",
    evacPriority: "URGENT",
    impactRadius: "12.4 km",
  },
  {
    _id: "2",
    date: "2024-10-23",
    title: "Inland Surge Prediction: Northern Delta",
    region: "G-AFRICA",
    status: "generated",
    confidence: 88,
    summary:
      "Surge prediction models indicate elevated risk across 3 districts with expected water ingress of 0.8m above threshold.",
    detail:
      "Satellite telemetry confirms inland surge forming 40km north. NDVI anomaly detected indicating soil saturation beyond safe limits.",
    evacPriority: "HIGH",
    impactRadius: "8.1 km",
  },
  {
    _id: "3",
    date: "2024-10-23",
    title: "Urban Drainage Saturation Report",
    region: "JAKARTA-M",
    status: "failed",
    confidence: null,
    summary: "Report generation failed due to telemetry feed interruption.",
    detail:
      "Neural link to Jakarta sensor grid was interrupted at 03:14 UTC. Manual review required.",
    evacPriority: "PENDING",
    impactRadius: "N/A",
  },
  {
    _id: "4",
    date: "2024-10-22",
    title: "Post-Event Damage Assessment: Alpha-9",
    region: "SE-ASIA",
    status: "sent",
    confidence: 97,
    summary:
      "Post-flood damage synthesis complete. 62 structures compromised, 14 critical infrastructure nodes offline.",
    detail:
      "Multispectral analysis confirms widespread inundation pattern. Emergency response teams dispatched to zones A3 through A7.",
    evacPriority: "MODERATE",
    impactRadius: "19.2 km",
  },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleString("default", { month: "short" }).toUpperCase(),
    day: d.getDate(),
  };
}

export default function AIReports() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [selected, setSelected] = useState(MOCK_REPORTS[0]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Replace with real API call:
    // const res = await fetch("/api/reports");
    // const data = await res.json();
    // setReports(data);
    setReports(MOCK_REPORTS);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 900);
    return () => clearInterval(t);
  }, []);

  const filtered =
    filter === "ALL"
      ? reports
      : reports.filter((r) => r.status.toUpperCase() === filter);

  const handleRetry = (id) => {
    setLoading(true);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "generated" } : r)),
      );
      setLoading(false);
      showToast("Report regeneration queued.");
    }, 1500);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const successRate = (
    (reports.filter((r) => r.status !== "failed").length / reports.length) *
    100
  ).toFixed(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .ai-reports * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .ai-reports { background: #111318; min-height: 100vh; color: #e4e6eb; }
        .report-row:hover { background: rgba(255,255,255,0.03); }
        .btn-view:hover { background: #2a2f3d; }
        .btn-export:hover { background: #1f2d4a; }
        .btn-resend:hover { background: rgba(255,255,255,0.05); }
        .filter-btn:hover { color: #c9ccd4; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: "#4f8ef7",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            padding: "10px 18px",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(79,142,247,0.4)",
          }}
        >
          {toast}
        </div>
      )}

      <div
        className="ai-reports"
        style={{ display: "flex", minHeight: "100vh" }}
      >
        {/* ── LEFT COLUMN ── */}
        <div style={{ flex: 1, minWidth: 0, padding: "36px 32px 40px" }}>
          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4f8ef7",
                display: "inline-block",
                transition: "opacity 0.5s",
                opacity: pulse ? 1 : 0.15,
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "#4f8ef7",
                fontWeight: 500,
              }}
            >
              LIVE INTELLIGENCE STREAM
            </span>
          </div>

          {/* Title row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 0 10px",
                  lineHeight: 1,
                  letterSpacing: "-1.5px",
                }}
              >
                AI Reports
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: 1.7,
                  maxWidth: 380,
                }}
              >
                Deep learning synthesis of multispectral flood data and
                humanitarian
                <br />
                telemetry. Generated via Sentinel Neural Link.
              </p>
            </div>

            {/* Stat cards */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                {
                  label: "REPORTS TODAY",
                  value: reports.length,
                  color: "#e4e6eb",
                },
                {
                  label: "SUCCESS RATE",
                  value: `${successRate}%`,
                  color: "#4f8ef7",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    background: "#181b23",
                    border: "1px solid #252932",
                    borderRadius: 12,
                    padding: "16px 28px",
                    textAlign: "center",
                    minWidth: 130,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "#6b7280",
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 800,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Archive header + filters */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "#4b5563",
                fontWeight: 500,
              }}
            >
              RECENT ARCHIVE
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {["ALL", "FAILED", "PENDING"].map((f) => (
                <button
                  key={f}
                  className="filter-btn"
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? "#4f8ef7" : "transparent",
                    color: filter === f ? "#fff" : "#6b7280",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    padding: "5px 14px",
                    borderRadius: 20,
                    transition: "all 0.15s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#1e2330", marginBottom: 4 }} />

          {/* Report rows */}
          {filtered.map((r) => {
            const { month, day } = formatDate(r.date);
            const isSelected = selected?._id === r._id;

            return (
              <div key={r._id}>
                <div
                  className="report-row"
                  onClick={() => setSelected(r)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 12px",
                    cursor: "pointer",
                    background: isSelected
                      ? "rgba(79,142,247,0.06)"
                      : "transparent",
                    borderLeft: `3px solid ${r.status === "failed" ? "#ef4444" : isSelected ? "#4f8ef7" : "transparent"}`,
                    transition: "all 0.15s",
                    position: "relative",
                  }}
                >
                  {/* Date box */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: 38,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        color: "#4b5563",
                        fontWeight: 500,
                      }}
                    >
                      {month}
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#9ca3af",
                        lineHeight: 1.1,
                      }}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#d1d5db",
                        marginBottom: 7,
                        lineHeight: 1.4,
                      }}
                    >
                      {r.title}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          color: "#4b5563",
                          letterSpacing: "0.12em",
                        }}
                      >
                        REGION: {r.region}
                      </span>
                      {r.status === "sent" && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#60a5fa",
                            letterSpacing: "0.08em",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#60a5fa",
                              display: "inline-block",
                            }}
                          />
                          SENT
                        </span>
                      )}
                      {r.status === "generated" && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#f59e0b",
                            letterSpacing: "0.08em",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#f59e0b",
                              display: "inline-block",
                            }}
                          />
                          GENERATED
                        </span>
                      )}
                      {r.status === "failed" && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#f87171",
                            letterSpacing: "0.08em",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#f87171",
                              display: "inline-block",
                            }}
                          />
                          FAILED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    {r.status === "failed" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(r._id);
                        }}
                        disabled={loading}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          color: "#f87171",
                          background: "transparent",
                          border: "1px solid rgba(248,113,113,0.4)",
                          padding: "7px 14px",
                          borderRadius: 8,
                          cursor: "pointer",
                          opacity: loading ? 0.6 : 1,
                          transition: "all 0.15s",
                        }}
                      >
                        {loading ? "RETRYING..." : "RETRY GENERATION"}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast("Email sent.");
                          }}
                          style={{
                            width: 34,
                            height: 34,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#4b5563",
                            fontSize: 16,
                            transition: "color 0.15s",
                          }}
                          title="Email"
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "#9ca3af")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "#4b5563")
                          }
                        >
                          ✉
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast("Downloading...");
                          }}
                          style={{
                            width: 34,
                            height: 34,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#4b5563",
                            fontSize: 18,
                            transition: "color 0.15s",
                          }}
                          title="Download"
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "#9ca3af")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "#4b5563")
                          }
                        >
                          ↓
                        </button>
                        <button
                          className="btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r);
                          }}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "#d1d5db",
                            background: "#1e2330",
                            border: "1px solid #2a3040",
                            padding: "8px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            lineHeight: 1.4,
                            textAlign: "center",
                            transition: "all 0.15s",
                          }}
                        >
                          VIEW
                          <br />
                          REPORT
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ height: 1, background: "#1a1e2a" }} />
              </div>
            );
          })}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          style={{
            width: 285,
            flexShrink: 0,
            background: "#13161e",
            borderLeft: "1px solid #1e2330",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {selected && (
            <div
              style={{
                padding: "28px 22px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Neural Preview */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: "#4b5563",
                    fontWeight: 500,
                  }}
                >
                  NEURAL PREVIEW
                </span>
                <span style={{ color: "#4f8ef7", fontSize: 16 }}>✦</span>
              </div>

              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 20px",
                  lineHeight: 1.2,
                  letterSpacing: "-0.5px",
                }}
              >
                Executive
                <br />
                Summary
              </h2>

              {/* Quote */}
              <div
                style={{
                  background: "#0d1018",
                  border: "1px solid #1e2535",
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 18,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: "#9ca3af",
                    margin: 0,
                    lineHeight: 1.65,
                    fontStyle: "italic",
                  }}
                >
                  "{selected.summary}"
                </p>
              </div>

              {/* Confidence */}
              {selected.confidence && (
                <div style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.18em",
                        color: "#4b5563",
                        fontWeight: 500,
                      }}
                    >
                      AI CONFIDENCE SCORE
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#d1d5db",
                      }}
                    >
                      {selected.confidence}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 3,
                      background: "#1e2535",
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 2,
                        background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                        width: `${selected.confidence}%`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Detail text */}
              <p
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  lineHeight: 1.75,
                  marginBottom: 22,
                }}
              >
                {selected.detail}
              </p>

              {/* Evac + Impact */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: "#4b5563",
                      margin: "0 0 5px",
                      fontWeight: 500,
                    }}
                  >
                    EVAC PRIORITY
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      margin: 0,
                      color:
                        selected.evacPriority === "URGENT"
                          ? "#ef4444"
                          : selected.evacPriority === "HIGH"
                            ? "#f97316"
                            : selected.evacPriority === "MODERATE"
                              ? "#f59e0b"
                              : "#6b7280",
                    }}
                  >
                    {selected.evacPriority}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: "#4b5563",
                      margin: "0 0 5px",
                      fontWeight: 500,
                    }}
                  >
                    IMPACT RADIUS
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#d1d5db",
                      margin: 0,
                    }}
                  >
                    {selected.impactRadius}
                  </p>
                </div>
              </div>

              {/* Export PDF */}
              <button
                className="btn-export"
                onClick={() => showToast("PDF export initiated.")}
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: 10,
                  borderRadius: 10,
                  background: "#192035",
                  border: "1px solid #2a3a58",
                  color: "#93c5fd",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 14 }}>⬡</span> EXPORT FULL PDF
              </button>

              {/* Resend */}
              <button
                className="btn-resend"
                onClick={() => showToast("Resent to admins.")}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 10,
                  background: "transparent",
                  border: "1px solid #1e2535",
                  color: "#6b7280",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.15s",
                }}
              >
                ✉ RESEND TO ADMINS
              </button>

              {/* Spacer */}
              <div style={{ flex: 1, minHeight: 28 }} />

              {/* Neural Engine Status */}
              <div style={{ borderTop: "1px solid #1e2330", paddingTop: 18 }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: "#4b5563",
                    marginBottom: 14,
                    fontWeight: 500,
                  }}
                >
                  NEURAL ENGINE STATUS
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "#1a1e2a",
                      border: "1px solid #252932",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    🤖
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#d1d5db",
                        margin: "0 0 3px",
                      }}
                    >
                      OpenAI GPT-4o Integration
                    </p>
                    <p style={{ fontSize: 11, color: "#4ade80", margin: 0 }}>
                      • Latency: 420ms
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
