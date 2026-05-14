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
  const [location, setLocation] = useState({
    latitude: 34.0522,
    longitude: -118.2437,
  });
  const [sosActive, setSosActive] = useState(false);
  const [sosChannel, setSosChannel] = useState(null);
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("idle"); // idle, locating, initiating, active
  const [error, setError] = useState("");

  const liveFeedMapSrc = useMemo(() => {
    const delta = 0.05;
    const left = location.longitude - delta;
    const right = location.longitude + delta;
    const top = location.latitude + delta;
    const bottom = location.latitude - delta;
    const url = new URL("https://www.openstreetmap.org/export/embed.html");
    url.searchParams.set("bbox", `${left},${bottom},${right},${top}`);
    url.searchParams.set("layer", "mapnik");
    url.searchParams.set(
      "marker",
      `${location.latitude},${location.longitude}`,
    );
    return url.toString();
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to get location. Using default coordinates.");
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setError("Geolocation not supported.");
    }
  }, []);

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
    <div className="min-h-screen bg-slate-900 text-gray-400 p-6 flex flex-col lg:flex-row gap-6 font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-72 flex flex-col gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 h-fit">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8">
            Emergency Response Status
          </h2>
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
          <StatusItem label="ETA Confirmed" time="PENDING" status="pending" />
          {error && <p className="text-red-400 text-xs mt-4">{error}</p>}
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            Signal Integrity
          </h2>
          <div className="flex items-end gap-1.5 h-16 mb-4">
            {[45, 80, 40, 100, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-400/40 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="text-[10px] font-mono uppercase text-gray-600">
            Uplink Stable | 450Mbps
          </p>
        </div>
      </aside>

      {/* CENTER STAGE */}
      <main className="flex-1 flex flex-col items-center justify-between py-4">
        <header className="text-center">
          <h1 className="text-6xl lg:text-6xl font-black text-white tracking-tighter italic">
            EMERGENCY SOS
          </h1>
          <p className="text-blue-500 text-xs font-bold tracking-[0.4em] uppercase mt-2">
            Sentinel Protocol Active • Sector 7
          </p>
        </header>

        <div className="relative group cursor-pointer" onClick={initiateSOS}>
          <div
            className={`absolute -inset-8 ${sosActive ? "bg-green-600/10" : "bg-red-600/10"} rounded-full blur-3xl ${sosActive ? "animate-pulse" : ""}`}
          />
          <div
            className={`relative w-64 h-64 lg:w-80 lg:h-80 bg-slate-800/50 rounded-[3rem] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(15,23,42,0.5)] border-[6px] ${sosActive ? "border-green-700/60" : "border-slate-700/60"} mt-6 mb-6`}
          >
            <span
              className={`text-8xl leading-none mb-2 ${sosActive ? "text-green-400" : "text-red-900"}`}
            >
              {sosActive ? "✓" : "✻"}
            </span>
            <span
              className={`text-3xl font-black uppercase tracking-tight ${sosActive ? "text-green-400" : "text-red-900"}`}
            >
              {sosActive ? "SOS Active" : "Initiate SOS"}
            </span>
            {status === "initiating" && (
              <p className="text-yellow-400 text-sm mt-2">Initiating...</p>
            )}
          </div>
        </div>

        <div className="w-full max-w-xl">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
            <p className="text-center text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Live Location Telemetry
            </p>
            <div className="grid grid-cols-2 gap-12 text-center">
              <div>
                <p className="text-[10px] uppercase text-gray-600 mb-2">
                  Latitude
                </p>
                <p className="text-3xl text-white font-mono font-medium">
                  {location.latitude.toFixed(4)}° N
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-600 mb-2">
                  Longitude
                </p>
                <p className="text-3xl text-white font-mono font-medium">
                  {location.longitude.toFixed(4)}° W
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
              <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider">
                Within 2.4 Meters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4  ">
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
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-full lg:w-80 flex flex-col gap-4">
        {/* Live Feed Map */}
        <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5 h-44 relative group">
          <iframe
            title="SOS live feed map"
            src={liveFeedMapSrc}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />{" "}
            LIVE FEED
          </div>
          <div className="absolute bottom-4 left-4">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
              Active Zone
            </p>
            <p className="text-white text-sm font-bold">
              {`Lat ${location.latitude.toFixed(3)}, Lon ${location.longitude.toFixed(3)}`}
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <SOSChatPanel
          chat={chat}
          msg={msg}
          setMsg={setMsg}
          onSend={sendMessage}
          disabled={!sosActive}
        />
      </aside>
    </div>
  );
}
