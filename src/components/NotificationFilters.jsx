export default function NotificationFilters({ filter, onFilterChange }) {
  return (
    <div className="bg-slate-800/50 p-1 rounded-xl border border-white/5 flex gap-1">
      {["All", "Unread", "Critical"].map((t) => (
        <button
          key={t}
          onClick={() => onFilterChange(t)}
          className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            filter === t
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "text-gray-500 hover:text-gray-300"
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
