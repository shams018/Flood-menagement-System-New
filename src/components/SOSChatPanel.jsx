import { Radio, Send } from "lucide-react";

export default function SOSChatPanel({ chat, msg, setMsg, onSend, disabled }) {
  const handleSend = () => {
    if (!disabled && msg.trim()) {
      onSend();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !disabled) {
      handleSend();
    }
  };

  return (
    <div className="flex-1 bg-slate-800/50 rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
      <div className="p-4 bg-slate-800 flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Radio size={16} />
        </div>
        <div>
          <p className="text-xs font-black text-white uppercase tracking-tight leading-none">
            Dispatcher 402
          </p>
          <p className="text-[9px] text-blue-400 font-bold uppercase mt-1">
            {disabled ? "Disconnected" : "Connected"}
          </p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {chat.map((m) => {
          const text = m.body || m.text || "";
          const timeValue = m.created_at || m.time || null;
          const timestamp = timeValue
            ? new Date(timeValue).toLocaleTimeString()
            : "--:--";
          const fromUser =
            m.is_own_highlight || m.role === "user" || m.author_label === "You";

          return (
            <div
              key={m.id}
              className={`flex flex-col ${fromUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed font-medium ${
                  fromUser
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-[#2a2a2a] text-gray-300 rounded-tl-none"
                }`}
              >
                {text}
              </div>
              <span className="text-[10px] text-gray-600 mt-2 font-mono">
                {timestamp}
              </span>
            </div>
          );
        })}
        {chat.length === 0 && !disabled && (
          <div className="text-center text-gray-500 text-sm">
            No messages yet. Initiate SOS to start communication.
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabled) handleSend();
        }}
        className="p-4 bg-slate-800"
      >
        <div className="relative">
          <input
            type="text"
            placeholder={disabled ? "SOS not active" : "Type message..."}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all pr-12 ${
              disabled
                ? "border-gray-600 text-gray-600 cursor-not-allowed"
                : "border-white/5 focus:border-blue-500/50 text-white"
            }`}
          />
          <button
            type="submit"
            disabled={disabled || !msg.trim()}
            className={`absolute right-2 top-2 p-2 transition-colors ${
              disabled || !msg.trim()
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
