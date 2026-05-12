const CHANNELS = [
  { id: "general", label: "General", hint: "All logged-in operators" },
  { id: "support", label: "Support & HQ", hint: "Reach our response team" },
];

function Sidebar({ activeChannel, onSelectChannel }) {
  return (
    <div className="w-64 bg-slate-800/50 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-sm font-bold tracking-wide text-blue-400">
          PROTOCOL ALPHA
        </h1>
        <p className="text-xs text-gray-500 mb-6">Flood Monitoring</p>

        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
          Channels
        </p>
        <div className="space-y-2">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChannel(ch.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeChannel === ch.id
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-transparent"
              }`}
            >
              <span className="text-sm font-semibold block">#{ch.label}</span>
              <span className="text-[10px] text-gray-500">{ch.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-gray-500 leading-relaxed mt-6">
        Messages are stored on the server and broadcast live to everyone in the
        same channel — use Support for coordination with HQ.
      </p>
    </div>
  );
}

export default Sidebar;
