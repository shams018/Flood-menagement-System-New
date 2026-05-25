export default function NotificationFilters({ filter, onFilterChange }) {
  return (
    <div className="bg-slate-900/80 p-1 rounded-3xl border border-white/10 flex gap-1">
      {["All", "Unread", "Critical"].map((t) => (
        <button
          key={t}
          onClick={() => onFilterChange(t)}
          className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
            filter === t
              ? "bg-blue-500 text-slate-100 shadow-lg shadow-blue-900/25"
              : "text-slate-300 hover:text-slate-100 hover:bg-white/5"
          }`}
        >
          {t}{" "}
          {t === "Critical" && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 ml-1" />
          )}
        </button>
      ))}
    </div>
  );
}
