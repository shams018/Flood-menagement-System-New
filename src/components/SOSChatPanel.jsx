import { Radio, Send } from "lucide-react";

export default function SOSChatPanel({ chat, msg, setMsg, onSend }) {
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
            Connected
          </p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {chat.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed font-medium ${
                m.role === "user"
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-[#2a2a2a] text-gray-300 rounded-tl-none"
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-gray-600 mt-2 font-mono">
              {m.time}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Type message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all pr-12"
          />
          <button
            type="button"
            onClick={onSend}
            className="absolute right-2 top-2 p-2 text-gray-500 hover:text-white transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
