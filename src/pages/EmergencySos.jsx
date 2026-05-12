import React, { useState } from "react";
import { Shield, PlusSquare, Truck, Users } from "lucide-react";
import StatusItem from "../components/StatusItem";
import ActionButton from "../components/ActionButton";
import SOSChatPanel from "../components/SOSChatPanel";

// --- Main Component ---

export default function SOSDashboard() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    {
      id: 1,
      role: "dispatcher",
      text: "Sentinel Protocol engaged. We have your coordinates. Are you in immediate danger?",
      time: "14:02:45",
    },
    {
      id: 2,
      role: "user",
      text: "Trapped in building 4. Rising water levels.",
      time: "14:03:02",
    },
  ]);

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
            time="14:02:11 GMT"
            status="complete"
          />
          <StatusItem
            label="Triangulating Location"
            time="14:02:25 GMT"
            status="complete"
          />
          <StatusItem
            label="Dispatching Unit Alpha"
            time="IN PROGRESS"
            status="active"
          />
          <StatusItem label="ETA Confirmed" time="PENDING" status="pending" />
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

        <div className="relative group cursor-pointer">
          <div className="absolute -inset-8 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-slate-800/50 rounded-[3rem] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(15,23,42,0.5)] border-[6px] border-slate-700/60 mt-6 mb-6">
            <span className="text-red-900 text-[80px] leading-none mb-2">
              ✻
            </span>
            <span className="text-red-900 text-3xl font-black uppercase tracking-tight">
              Initiate SOS
            </span>
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
                  34.0522° N
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-600 mb-2">
                  Longitude
                </p>
                <p className="text-3xl text-white font-mono font-medium">
                  118.2437° W
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
            <ActionButton icon={PlusSquare} label="Medical Unit" />
            <ActionButton icon={Shield} label="Police Support" />
            <ActionButton icon={Truck} label="Fire Dept." />
            <ActionButton icon={Users} label="Rescue Squad" />
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-full lg:w-80 flex flex-col gap-4">
        {/* Map Feed Placeholder */}
        <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5 h-44 relative group">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />{" "}
            LIVE FEED
          </div>
          <div className="w-full h-full opacity-20 grayscale bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-118.2437,34.0522,12/400x300?access_token=YOUR_TOKEN')] bg-cover" />
          <div className="absolute bottom-4 left-4">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
              Active Zone
            </p>
            <p className="text-white text-sm font-bold">Sector 7-Alpha</p>
          </div>
        </div>

        {/* Chat Interface */}
        <SOSChatPanel
          chat={chat}
          msg={msg}
          setMsg={setMsg}
          onSend={() => setMsg("")}
        />
      </aside>
    </div>
  );
}
