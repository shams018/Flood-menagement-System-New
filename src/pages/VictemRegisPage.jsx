import React, { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";

const LOSS_TYPES = [
  { icon: Home, label: "House", value: "House" },
  { icon: Package, label: "Property", value: "Property" },
  { icon: PawPrint, label: "Livestock", value: "Livestock" },
  { icon: Leaf, label: "Crops", value: "Crops" },
];

const VictemRegisPage = () => {
  const [incidentLocation, setIncidentLocation] = useState(
    "Indus Basin District, Sector 4-B",
  );
  const [lossType, setLossType] = useState("House");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showThermalModal, setShowThermalModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, booting } = useAuth();

  useEffect(() => {
    if (!booting && !isAuthenticated) {
      navigate(ROUTES.login, { replace: true });
    }
  }, [booting, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!incidentLocation.trim()) {
      setError("Incident location is required.");
      return;
    }
    if (!lossType) {
      setError("Please select the type of loss.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description of the damage.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload at least one photo as evidence.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("incidentLocation", incidentLocation.trim());
      fd.append("lossType", lossType);
      fd.append("description", description.trim());
      files.forEach((file) => fd.append("photos", file));
      const res = await apiFetch("/api/victims", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("Registration saved. Reference ID: " + data.registration.id);
      setDescription("");
      setFiles([]);
    } catch (err) {
      setError(err.message || "Could not submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-[#E0E0E0] font-sans">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <section>
          <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6">
            <span className="text-white">Victim </span>
            <span className="text-[#A5C9FF]">Registration</span>
          </h1>
          <p className="max-w-3xl text-gray-400 text-lg leading-relaxed">
            Protocol Alpha: High-priority data collection for flood relief and
            emergency resource allocation. Please provide accurate details.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-3 mt-12">
          <div className="lg:col-span-2 rounded-[32px] border border-white/5 bg-slate-800/50 p-8 shadow-2xl">
            <div className="mb-10 border-b border-white/5 pb-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 text-sm font-mono text-gray-400">
                    02
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                      Mission Status
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Damage Assessment
                    </h2>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
                  Step 2 of 3
                </span>
              </div>
              <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>

            <form className="space-y-10" onSubmit={handleSubmit}>
              {status ? (
                <p
                  className={`text-sm rounded-2xl px-4 py-3 border ${
                    status.startsWith("Registration saved")
                      ? "text-green-300 border-green-800/50 bg-green-950/30"
                      : "text-red-300 border-red-800/50 bg-red-950/30"
                  }`}
                >
                  {status}
                </p>
              ) : null}
              {error ? (
                <p className="text-sm text-red-300 bg-red-950/40 border border-red-800/60 rounded-2xl px-4 py-3">
                  {error}
                </p>
              ) : null}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Incident Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="incidentLocation"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    className="w-full rounded-[20px] border border-gray-700 bg-[#1E1E1E] px-4 py-4 pl-14 text-gray-100 outline-none transition-colors focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Type of Loss
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {LOSS_TYPES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setLossType(item.value)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-6 text-center transition-all ${
                        lossType === item.value
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-transparent bg-[#1E1E1E] text-gray-400 hover:border-slate-700 hover:bg-[#252525]"
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the current situation and damage incurred..."
                  className="min-h-[10rem] w-full rounded-[24px] border border-gray-700 bg-[#1E1E1E] p-5 text-gray-100 outline-none transition-colors focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Visual Evidence (Upload Photos)
                </label>
                <label className="group rounded-[32px] border-2 border-dashed border-gray-800 bg-[#1A1A1A]/50 p-12 text-center transition-colors hover:bg-[#1A1A1A] cursor-pointer block">
                  <Upload className="mx-auto mb-4 h-8 w-8 text-gray-500 transition-colors group-hover:text-blue-400" />
                  <p className="text-sm font-medium text-gray-200 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[10px] uppercase tracking-tight text-gray-500">
                    JPEG, PNG up to 10MB each
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  />
                </label>
                {files.length > 0 ? (
                  <p className="text-xs text-gray-500 mt-2">
                    {files.length} file(s) selected
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-white"
                >
                  Previous Step
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-950 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Initialize Next Step"}
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-white/5 bg-slate-800/50 p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Data Verification</h3>
                <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
              <p className="text-xs leading-relaxed text-gray-400 mb-6">
                Our AI-driven{" "}
                <span className="text-blue-300">Sentinel Protocol</span>{" "}
                verifies submissions against satellite imagery and local sensor
                data for accelerated relief processing.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl bg-[#161616] p-4">
                  <Satellite className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                      Satellite Sync
                    </p>
                    <p className="text-xs font-semibold">Active - Sector 4</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-[#161616] p-4">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                      Priority Queue
                    </p>
                    <p className="text-xs font-semibold">Level 2 Emergency</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/5 bg-slate-800/50 p-6">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                Required Documentation
              </h3>
              <ul className="space-y-4">
                {[
                  "Valid Government Issued ID / CNIC",
                  "Proof of residence (Utility bills etc.)",
                  "Geotagged damage photos (Automated)",
                ].map((text) => (
                  <li key={text} className="flex gap-3 items-start">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-xs leading-tight text-gray-400">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="relative overflow-hidden rounded-[32px] border border-white/5 aspect-video bg-black">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-800/20 to-yellow-600/20"></div>

              {/* Simulated Thermal Satellite View */}
              <div className="absolute inset-0">
                <svg
                  viewBox="0 0 400 225"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Base terrain */}
                  <defs>
                    <radialGradient
                      id="thermalGradient"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
                      <stop
                        offset="30%"
                        stopColor="#ff6600"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="60%"
                        stopColor="#ffaa00"
                        stopOpacity="0.6"
                      />
                      <stop
                        offset="100%"
                        stopColor="#ffff00"
                        stopOpacity="0.5"
                      />
                    </radialGradient>
                    <filter id="thermalBlur">
                      <feGaussianBlur stdDeviation="2" />
                    </filter>
                  </defs>

                  {/* River/Lake areas - cooler blue tones */}
                  <path
                    d="M50,100 Q100,80 150,100 Q200,120 250,100 Q300,80 350,100 L350,225 L50,225 Z"
                    fill="#0066cc"
                    fillOpacity="0.6"
                    filter="url(#thermalBlur)"
                  />

                  {/* Flooded areas - warmer red/orange tones */}
                  <path
                    d="M80,120 Q120,110 160,125 Q200,140 240,130 Q280,120 320,135 L320,225 L80,225 Z"
                    fill="#ff3300"
                    fillOpacity="0.7"
                    filter="url(#thermalBlur)"
                  />

                  {/* Urban areas - mixed temperatures */}
                  <rect
                    x="100"
                    y="80"
                    width="40"
                    height="20"
                    fill="#ff6600"
                    fillOpacity="0.5"
                  />
                  <rect
                    x="200"
                    y="90"
                    width="35"
                    height="15"
                    fill="#ffaa00"
                    fillOpacity="0.6"
                  />
                  <rect
                    x="280"
                    y="85"
                    width="30"
                    height="18"
                    fill="#ff4400"
                    fillOpacity="0.5"
                  />

                  {/* Thermal hotspots */}
                  <circle
                    cx="150"
                    cy="110"
                    r="8"
                    fill="#ff0000"
                    fillOpacity="0.9"
                    filter="url(#thermalBlur)"
                  />
                  <circle
                    cx="220"
                    cy="125"
                    r="6"
                    fill="#ff3300"
                    fillOpacity="0.8"
                    filter="url(#thermalBlur)"
                  />
                  <circle
                    cx="300"
                    cy="115"
                    r="7"
                    fill="#ff2200"
                    fillOpacity="0.85"
                    filter="url(#thermalBlur)"
                  />

                  {/* Grid overlay for satellite effect */}
                  <defs>
                    <pattern
                      id="grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[9px] uppercase tracking-[0.3em] text-red-400 mb-1">
                  Thermal Satellite View
                </p>
                <h4 className="text-sm font-bold tracking-tight">
                  INCIDENT: ALPHA-902
                </h4>
                <p className="text-[8px] text-gray-400 mt-1">
                  Live thermal data • {new Date().toLocaleTimeString()}
                </p>
              </div>

              {/* Thermal Legend */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-3 h-1 bg-red-500 rounded"></div>
                  <span className="text-[8px] text-white">Hot</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-3 h-1 bg-orange-500 rounded"></div>
                  <span className="text-[8px] text-white">Warm</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 bg-blue-500 rounded"></div>
                  <span className="text-[8px] text-white">Cool</span>
                </div>
              </div>

              <button
                type="button"
                className="absolute bottom-4 right-4 rounded-md bg-black/50 p-2 backdrop-blur-md transition-colors hover:bg-white/10"
                title="Expand thermal view"
                onClick={() => setShowThermalModal(true)}
              >
                <Maximize2 className="h-4 w-4 text-white" />
              </button>
            </section>
          </aside>
        </div>

        {/* Thermal View Modal */}
        {showThermalModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Thermal Satellite Analysis
                  </h3>
                  <p className="text-sm text-gray-400">
                    INCIDENT: ALPHA-902 • Live thermal data •{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowThermalModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Close thermal view"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Expanded Thermal View */}
              <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-800/20 to-yellow-600/20"></div>

                {/* Larger Thermal Satellite View */}
                <div className="absolute inset-0 p-4">
                  <svg
                    viewBox="0 0 800 450"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Base terrain - larger scale */}
                    <defs>
                      <radialGradient
                        id="thermalGradientModal"
                        cx="50%"
                        cy="50%"
                        r="50%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ff0000"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset="30%"
                          stopColor="#ff6600"
                          stopOpacity="0.7"
                        />
                        <stop
                          offset="60%"
                          stopColor="#ffaa00"
                          stopOpacity="0.6"
                        />
                        <stop
                          offset="100%"
                          stopColor="#ffff00"
                          stopOpacity="0.5"
                        />
                      </radialGradient>
                      <filter id="thermalBlurModal">
                        <feGaussianBlur stdDeviation="3" />
                      </filter>
                    </defs>

                    {/* River/Lake areas - cooler blue tones */}
                    <path
                      d="M100,200 Q200,160 300,200 Q400,240 500,200 Q600,160 700,200 L700,450 L100,450 Z"
                      fill="#0066cc"
                      fillOpacity="0.6"
                      filter="url(#thermalBlurModal)"
                    />

                    {/* Flooded areas - warmer red/orange tones */}
                    <path
                      d="M160,240 Q240,220 320,250 Q400,280 480,260 Q560,240 640,270 L640,450 L160,450 Z"
                      fill="#ff3300"
                      fillOpacity="0.7"
                      filter="url(#thermalBlurModal)"
                    />

                    {/* Urban areas - mixed temperatures */}
                    <rect
                      x="200"
                      y="160"
                      width="80"
                      height="40"
                      fill="#ff6600"
                      fillOpacity="0.5"
                    />
                    <rect
                      x="400"
                      y="180"
                      width="70"
                      height="30"
                      fill="#ffaa00"
                      fillOpacity="0.6"
                    />
                    <rect
                      x="560"
                      y="170"
                      width="60"
                      height="36"
                      fill="#ff4400"
                      fillOpacity="0.5"
                    />

                    {/* Thermal hotspots - larger */}
                    <circle
                      cx="300"
                      cy="220"
                      r="16"
                      fill="#ff0000"
                      fillOpacity="0.9"
                      filter="url(#thermalBlurModal)"
                    />
                    <circle
                      cx="440"
                      cy="250"
                      r="12"
                      fill="#ff3300"
                      fillOpacity="0.8"
                      filter="url(#thermalBlurModal)"
                    />
                    <circle
                      cx="600"
                      cy="230"
                      r="14"
                      fill="#ff2200"
                      fillOpacity="0.85"
                      filter="url(#thermalBlurModal)"
                    />

                    {/* Additional hotspots */}
                    <circle
                      cx="180"
                      cy="280"
                      r="10"
                      fill="#ff5500"
                      fillOpacity="0.75"
                      filter="url(#thermalBlurModal)"
                    />
                    <circle
                      cx="520"
                      cy="260"
                      r="11"
                      fill="#ff1100"
                      fillOpacity="0.8"
                      filter="url(#thermalBlurModal)"
                    />

                    {/* Grid overlay for satellite effect */}
                    <defs>
                      <pattern
                        id="gridModal"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="1"
                          opacity="0.4"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridModal)" />
                  </svg>
                </div>

                {/* Enhanced Thermal Legend */}
                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                  <h4 className="text-sm font-bold text-white mb-3">
                    Thermal Scale
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-2 bg-red-500 rounded"></div>
                      <span className="text-xs text-white">
                        Hot Areas (≥35°C)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-2 bg-orange-500 rounded"></div>
                      <span className="text-xs text-white">
                        Warm Areas (25-35°C)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-2 bg-yellow-500 rounded"></div>
                      <span className="text-xs text-white">
                        Moderate (15-25°C)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-2 bg-blue-500 rounded"></div>
                      <span className="text-xs text-white">
                        Cool Areas (≤15°C)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis Info */}
                <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-slate-600 max-w-md">
                  <h4 className="text-sm font-bold text-white mb-2">
                    Analysis Summary
                  </h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <p>• 3 major thermal hotspots detected</p>
                    <p>• Flooded areas showing elevated temperatures</p>
                    <p>• Urban heat islands identified in Sector 4-B</p>
                    <p>• River systems maintaining baseline temperatures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default VictemRegisPage;
