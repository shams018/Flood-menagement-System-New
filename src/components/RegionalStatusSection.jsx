const stats = [
  { icon: "o", value: "1,248", label: "REGISTERED VICTIMS", highlight: true },
  { icon: "+", value: "45", label: "RESCUE TEAMS ACTIVE" },
  { icon: "*", value: "82", label: "SHELTERS AVAILABLE" },
  { icon: "!", value: "12", label: "ACTIVE ALERTS", alert: true },
];

function RegionalStatusSection() {
  return (
    <section className="flex flex-col gap-6 py-8 px-6 bg-slate-900">
      <article className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              GLOBAL RISK PROFILE
            </p>
            <h2 className="text-2xl font-bold text-white mt-2">
              REGIONAL STATUS
            </h2>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full font-semibold text-sm hover:bg-yellow-500/30 transition-colors"
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            WATCH
          </button>
        </div>

        <div className="flex items-center gap-4 mt-6 mb-4">
          <span className="text-5xl font-black text-blue-400">04</span>
          <span className="text-gray-400 uppercase text-sm">
            ACTIVE SECTORS UNDER REVIEW
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <span className="h-full w-1/3 bg-blue-500 block" />
        </div>
      </article>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((item) => (
          <article
            key={item.label}
            className={`bg-slate-700 rounded-lg p-4 text-center border transition-colors ${
              item.highlight
                ? "border-blue-500 bg-slate-700/80"
                : item.alert
                  ? "border-red-500 bg-red-500/10"
                  : "border-slate-600"
            }`}
          >
            <span className="text-2xl font-bold text-gray-400">
              {item.icon}
            </span>
            <strong className="block text-xl text-white mt-2">
              {item.value}
            </strong>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RegionalStatusSection;
