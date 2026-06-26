import React, { useMemo, useState, useEffect } from "react";
import { Shield, PlusSquare, Truck, Users } from "lucide-react";
import StatusItem from "../components/StatusItem";
import ActionButton from "../components/ActionButton";
import SOSChatPanel from "../components/SOSChatPanel";
import { API_BASE } from "../lib/config";
import { useAuth } from "../context/AuthContext";

// --- Main Component ---

export default function SOSDashboard() {
  const { token, isAuthenticated } = useAuth();
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [manualLatitude, setManualLatitude] = useState("");
  const [manualLongitude, setManualLongitude] = useState("");
  const [manualError, setManualError] = useState("");
  const [sosActive, setSosActive] = useState(false);
  const [sosChannel, setSosChannel] = useState(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("idle"); // idle, locating, initiating, active
  const [error, setError] = useState("");

  const setResolvedLocation = (latitude, longitude) => {
    setLocation({ latitude, longitude });
    setLocationLoading(false);
    setLocationError("");
    setManualError("");
    setError("");
  };

  const fallbackToIp = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error("IP lookup failed");
      const data = await response.json();
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);
      if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
        setResolvedLocation(latitude, longitude);
        return;
      }
    } catch (fallbackError) {
      console.error("IP fallback error:", fallbackError);
    }
    setLocationLoading(false);
    setLocationError(
      "Unable to detect your location automatically. Please allow location access or enter coordinates manually.",
    );
  };

  const requestLocation = async () => {
    setLocationLoading(true);
    setLocationError("");
    setManualError("");
    if (!navigator.geolocation) {
      setLocationLoading(false);
      setLocationError("Geolocation is not supported by this browser.");
      await fallbackToIp();
      return;
    }

    // Try to get current position with a shorter timeout
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Geolocation success:", position.coords);
        setResolvedLocation(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      async (err) => {
        console.error(
          "Geolocation error code:",
          err.code,
          "message:",
          err.message,
        );
        let errorMsg = "Unable to get location. Trying IP fallback.";

        if (err.code === 1) {
          errorMsg =
            "Location access denied. Please allow location access in browser settings and retry.";
          setLocationLoading(false);
          setLocationError(errorMsg);
          return; // Don't fallback to IP on permission denial
        } else if (err.code === 2) {
          errorMsg = "Unable to determine your location. Trying IP fallback.";
        } else if (err.code === 3) {
          errorMsg = "Location request timed out. Trying IP fallback.";
        }

        setLocationError(errorMsg);
        await fallbackToIp();
      },
      geoOptions,
    );
  };

  const setManualLocation = () => {
    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setManualError(
        "Please enter valid numeric latitude and longitude values.",
      );
      return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setManualError(
        "Latitude must be between -90 and 90, longitude between -180 and 180.",
      );
      return;
    }
    setResolvedLocation(lat, lng);
    setManualError("");
  };

  useEffect(() => {
    console.log("SOS component mounted, requesting location...");
    requestLocation();
  }, []);

  const liveFeedMapSrc = useMemo(() => {
    const lat = location?.latitude ?? 20.0;
    const lng = location?.longitude ?? 0.0;
    const delta = 0.05;
    const left = lng - delta;
    const right = lng + delta;
    const top = lat + delta;
    const bottom = lat - delta;
    const url = new URL("https://www.openstreetmap.org/export/embed.html");
    url.searchParams.set("bbox", `${left},${bottom},${right},${top}`);
    url.searchParams.set("layer", "mapnik");
    url.searchParams.set("marker", `${lat},${lng}`);
    return url.toString();
  }, [location]);

  useEffect(() => {
    if (sosChannel) {
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [sosChannel]);

  const fetchChatMessages = async () => {
    if (!sosChannel || !token) return;
    try {
      const response = await fetch(
        `${API_BASE}/api/chat/messages?channel=${encodeURIComponent(sosChannel)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setChat(data.messages || []);
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || "Failed to load SOS chat messages.");
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
      setError("Unable to fetch SOS chat.");
    }
  };

  const initiateSOS = async () => {
    if (!isAuthenticated) {
      setError("Please login to initiate SOS.");
      return;
    }
    if (!location) {
      setError(
        "Location is not available yet. Please allow location access and try again.",
      );
      return;
    }
    setStatus("initiating");
    try {
      const response = await fetch(`${API_BASE}/api/sos/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          message: "EMERGENCY SOS: I need immediate assistance!",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.sos?.channel) {
        setSosChannel(data.sos.channel);
        setSosActive(true);
        setStatus("active");
        setError("");
      } else {
        setError(data.error || "Failed to initiate SOS.");
        setStatus("idle");
      }
    } catch (err) {
      console.error("SOS initiate error:", err);
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  };

  const sendMessage = async () => {
    if (!msg.trim() || !sosChannel || !token) return;
    try {
      const response = await fetch(`${API_BASE}/api/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: msg, channel: sosChannel }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMsg("");
        fetchChatMessages(); // Refresh immediately
      } else {
        setError(data.error || "Failed to send chat message.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Unable to send message.");
    }
  };

  const requestAssistance = async (type) => {
    if (!sosChannel || !token) return;
    try {
      const response = await fetch(`${API_BASE}/api/sos/request/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ channel: sosChannel }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        fetchChatMessages();
      } else {
        setError(data.error || "Failed to send assistance request.");
      }
    } catch (err) {
      console.error("Error requesting assistance:", err);
      setError("Unable to send assistance request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 selection:bg-blue-500/30">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          {/* LEFT SIDEBAR */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">
                    Emergency Response
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Current SOS channel status and readiness.
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.35em] ${sosActive ? "text-emerald-400" : "text-amber-300"}`}
                >
                  {sosActive ? "ACTIVE" : "STANDBY"}
                </span>
              </div>
              <div className="mt-8 space-y-4">
                <StatusItem
                  label="Signal Received"
                  time={sosActive ? new Date().toLocaleTimeString() : "PENDING"}
                  status={sosActive ? "complete" : "pending"}
                />
                <StatusItem
                  label="Triangulating Location"
                  time={
                    status === "locating"
                      ? "IN PROGRESS"
                      : sosActive
                        ? "COMPLETE"
                        : "PENDING"
                  }
                  status={
                    status === "locating"
                      ? "active"
                      : sosActive
                        ? "complete"
                        : "pending"
                  }
                />
                <StatusItem
                  label="Dispatching Unit Alpha"
                  time={sosActive ? "IN PROGRESS" : "PENDING"}
                  status={sosActive ? "active" : "pending"}
                />
                <StatusItem
                  label="ETA Confirmed"
                  time="PENDING"
                  status="pending"
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-6">{error}</p>}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                Signal Integrity
              </h2>
              <div className="grid grid-cols-5 gap-3 mb-6 h-20 items-end">
                {[45, 80, 40, 100, 60].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-full bg-sky-500/20"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Uplink Stable | 450 Mbps
              </p>
            </div>
          </aside>

          {/* CENTER STAGE */}
          <main className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-blue-300">
                    Emergency Control
                  </p>
                  <h1 className="mt-4 text-5xl font-black tracking-tight text-white">
                    EMERGENCY SOS
                  </h1>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    Sentinel Protocol Active • Sector 7. Trigger the emergency
                    channel to connect with responders and request immediate
                    assistance from nearby units.
                  </p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 text-center shadow-lg shadow-slate-950/20">
                  <div
                    className={`text-6xl font-black ${sosActive ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {sosActive ? "ACTIVE" : "STANDBY"}
                  </div>
                  <p className="mt-3 text-sm uppercase tracking-[0.3em] text-slate-500">
                    {sosActive
                      ? "SOS ENGAGED"
                      : status === "initiating"
                        ? "INITIATING..."
                        : "READY TO LAUNCH"}
                  </p>
                  <button
                    type="button"
                    onClick={initiateSOS}
                    className={`mt-8 w-full rounded-3xl py-4 text-sm font-black uppercase tracking-[0.3em] transition-all ${sosActive ? "bg-emerald-500 hover:bg-emerald-400" : "bg-red-500 hover:bg-red-400"}`}
                  >
                    {sosActive ? "Reconfirm Signal" : "Launch SOS"}
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-6">
                  Live Location Telemetry
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-slate-900/95 p-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-2">
                      Latitude
                    </p>
                    <p className="text-xl font-mono font-semibold text-white leading-tight">
                      {location
                        ? `${location.latitude.toFixed(2)}° N`
                        : locationLoading
                          ? "Loading..."
                          : "Unknown"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/95 p-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-2">
                      Longitude
                    </p>
                    <p className="text-xl font-mono font-semibold text-white leading-tight">
                      {location
                        ? `${Math.abs(location.longitude).toFixed(2)}° W`
                        : locationLoading
                          ? "Loading..."
                          : "Unknown"}
                    </p>
                  </div>
                </div>
                {location ? (
                  <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-emerald-300">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Within 2.4 meters
                  </div>
                ) : (
                  <div className="mt-6 space-y-4 rounded-3xl bg-slate-900/95 p-4 border border-amber-500 text-amber-200">
                    <p className="text-sm font-medium">
                      {locationError ||
                        "Location is not available yet. Please allow location access and try again."}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <button
                        type="button"
                        onClick={requestLocation}
                        className="inline-flex items-center justify-center rounded-3xl bg-amber-500 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-slate-950 transition hover:bg-amber-400"
                      >
                        Retry Location
                      </button>
                      <button
                        type="button"
                        onClick={setManualLocation}
                        className="inline-flex items-center justify-center rounded-3xl border border-amber-500 bg-transparent px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-amber-200 transition hover:bg-amber-500/20"
                      >
                        Use Manual Coordinates
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={manualLatitude}
                        onChange={(e) => setManualLatitude(e.target.value)}
                        placeholder="Latitude"
                        className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        value={manualLongitude}
                        onChange={(e) => setManualLongitude(e.target.value)}
                        placeholder="Longitude"
                        className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    {manualError && (
                      <p className="text-sm text-red-400">{manualError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-6">
                  Assistance Requests
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <ActionButton
                    icon={PlusSquare}
                    label="Medical Unit"
                    onClick={() => requestAssistance("medical")}
                    disabled={!sosActive}
                  />
                  <ActionButton
                    icon={Shield}
                    label="Police Support"
                    onClick={() => requestAssistance("police")}
                    disabled={!sosActive}
                  />
                  <ActionButton
                    icon={Truck}
                    label="Fire Dept."
                    onClick={() => requestAssistance("fire")}
                    disabled={!sosActive}
                  />
                  <ActionButton
                    icon={Users}
                    label="Rescue Squad"
                    onClick={() => requestAssistance("rescue")}
                    disabled={!sosActive}
                  />
                </div>
              </div>
            </section>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 overflow-hidden shadow-2xl shadow-slate-950/20">
              <div className="relative h-72">
                <iframe
                  title="SOS live feed map"
                  src={liveFeedMapSrc}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold text-white">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE FEED
                </div>
                <div className="absolute bottom-4 left-4 text-sm leading-tight">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">
                    Active Zone
                  </p>
                  <p className="text-sm text-slate-200 font-semibold">
                    {location
                      ? `Lat ${location.latitude.toFixed(3)}`
                      : "Lat unknown"}
                  </p>
                  <p className="text-sm text-slate-200 font-semibold">
                    {location
                      ? `Lon ${location.longitude.toFixed(3)}`
                      : "Lon unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">
                  SOS Chat
                </p>
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.35em] ${sosActive ? "text-emerald-400" : "text-slate-500"}`}
                >
                  {sosActive ? "Connected" : "Waiting"}
                </span>
              </div>
              <SOSChatPanel
                chat={chat}
                msg={msg}
                setMsg={setMsg}
                onSend={sendMessage}
                disabled={!sosActive}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
