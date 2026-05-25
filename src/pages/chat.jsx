import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import RightPanel from "../components/RightPanel";

function ChatDashboard() {
  const [channel, setChannel] = useState("support");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-gray-100">
      <Sidebar activeChannel={channel} onSelectChannel={setChannel} />
      <main className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="mb-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                User Dashboard
              </p>
              <h1 className="text-2xl font-semibold text-white">
                Chat Command Center
              </h1>
            </div>
            <p className="text-sm text-gray-400">
              Manage conversations, AI support, and live coordination in one
              place.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden xl:flex-row xl:gap-4">
          <div className="flex-1 overflow-hidden">
            <ChatArea channel={channel} />
          </div>
          <RightPanel channel={channel} />
        </div>
      </main>
    </div>
  );
}

export default ChatDashboard;
