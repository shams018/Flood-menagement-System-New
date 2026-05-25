export default function NotificationRegions({ regions }) {
  return (
    <section>
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
        Region Filtering
      </h2>
      <div className="space-y-3">
        {regions.map((region) => (
          <div
            key={region.name}
            className="flex items-center justify-between p-3 bg-slate-900/90 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={region.checked || false}
                className="accent-blue-600 w-4 h-4 rounded border-white/10 bg-transparent"
              />
              <span className="text-xs text-white font-medium">
                {region.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded">
              {region.count}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors text-center">
        Clear Filters
      </button>
    </section>
  );
}
