import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import RightPanel from "../components/RightPanel";

function ChatDashboard() {
  const [channel, setChannel] = useState("support");

  return (
    <div className="flex h-screen bg-slate-900 text-gray-200">
      <Sidebar activeChannel={channel} onSelectChannel={setChannel} />
      <ChatArea channel={channel} />
      <RightPanel channel={channel} />
    </div>
  );
}

export default ChatDashboard;
