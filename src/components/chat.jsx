import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import RightPanel from "./RightPanel";

function ChatDashboard() {
  return (
    <div className="flex h-screen bg-slate-900  text-gray-200">
      <Sidebar />
      <ChatArea />
      <RightPanel />
    </div>
  );
}

export default ChatDashboard;
