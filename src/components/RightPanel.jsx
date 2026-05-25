function RightPanel({ channel }) {
  const isSupport = channel === "support";
  return (
    <div className="w-full max-w-[330px] shrink-0 bg-slate-950/95 p-5 rounded-3xl border border-white/10 shadow-2xl shadow-black/20">
      <h3 className="text-sm text-gray-400 mb-3">LIVE DESK</h3>

      <div className="bg-slate-900/90 p-4 rounded-3xl mb-4 border border-slate-700/80">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
          {isSupport ? "Sentinel HQ" : "Command net"}
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">
          {isSupport
            ? "Operators monitor this channel during incidents. Be concise: location, need, contact."
            : "Share field updates and sensor notes. All authenticated users see the same thread in real time."}
        </p>
      </div>

      <h3 className="text-sm text-gray-400 mb-3">NGO RESPONDERS</h3>

      <div className="space-y-2">
        <div className="bg-slate-900/90 p-3 rounded-3xl border border-slate-700/80">
          RESCUE_RED_CROSS
        </div>
        <div className="bg-slate-900/90 p-3 rounded-3xl border border-slate-700/80">
          UN_RELIEF_OPS
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs text-gray-400">SESSION</p>
        <div className="h-2 bg-gray-700 rounded mt-2">
          <div className="h-2 bg-blue-500 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default RightPanel;
