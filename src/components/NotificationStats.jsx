export default function NotificationStats({ stats }) {
  return (
    <section>
      <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-white mb-6">
        Notification Stats
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
          <p className="text-3xl text-white font-black font-mono">
            {stats.unread}
          </p>
          <p className="text-[9px] uppercase font-bold text-gray-600 mt-1">
            Unread
          </p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
          <p className="text-3xl text-red-500 font-black font-mono">
            {stats.critical}
          </p>
          <p className="text-[9px] uppercase font-bold text-gray-600 mt-1">
            Critical
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase font-bold text-gray-600">
          System Health
        </span>
        <span className="text-[10px] uppercase font-bold text-blue-400">
          Optimal
        </span>
      </div>
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="w-[85%] h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      </div>
    </section>
  );
}
