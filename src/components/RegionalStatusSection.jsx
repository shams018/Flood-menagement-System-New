const stats = [
  { icon: "o", value: "1,248", label: "REGISTERED VICTIMS", highlight: true },
  { icon: "+", value: "45", label: "RESCUE TEAMS ACTIVE" },
  { icon: "*", value: "82", label: "SHELTERS AVAILABLE" },
  { icon: "!", value: "12", label: "ACTIVE ALERTS", alert: true },
];

function RegionalStatusSection() {
  return (
    <section className="flex flex-col gap-6 py-8 px-6 bg-slate-900">
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .pulse-glow { animation: pulseGlow 2s infinite; }
        .slide-up { animation: slideUp 0.5s ease-out; }
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
        }
      `}</style>

      <article className="bg-slate-800 rounded-lg p-6 border border-slate-700 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
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
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full font-semibold text-sm hover:bg-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500 pulse-glow" />
            WATCH
          </button>
        </div>

        <div className="flex items-center gap-4 mt-6 mb-4">
          <span className="text-5xl font-black text-blue-400 transition-transform duration-300 hover:scale-110">
            04
          </span>
          <span className="text-gray-400 uppercase text-sm">
            ACTIVE SECTORS UNDER REVIEW
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden transition-all duration-300 hover:bg-slate-600">
          <span className="h-full w-1/3 bg-blue-500 block transition-all duration-500 hover:w-2/3 relative shimmer-effect" />
        </div>
      </article>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <article
            key={item.label}
            className={`bg-slate-700 rounded-lg p-4 text-center border transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl ${
              item.highlight
                ? "border-blue-500 bg-slate-700/80 hover:border-blue-400 hover:shadow-blue-500/30 hover:bg-slate-700"
                : item.alert
                  ? "border-red-500 bg-red-500/10 hover:border-red-400 hover:shadow-red-500/30 hover:bg-red-500/20"
                  : "border-slate-600 hover:border-slate-500 hover:shadow-slate-500/20"
            }`}
            style={{
              animation: `slideUp 0.5s ease-out ${idx * 0.1}s backwards`,
            }}
          >
            <span className="text-2xl font-bold text-gray-400 transition-transform duration-300 inline-block hover:scale-125 hover:rotate-12">
              {item.icon}
            </span>
            <strong className="block text-xl text-white mt-2 transition-colors duration-300 hover:text-blue-400">
              {item.value}
            </strong>
            <p className="text-xs text-gray-400 uppercase tracking-wide mt-1 transition-colors duration-300 hover:text-gray-300">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RegionalStatusSection;
