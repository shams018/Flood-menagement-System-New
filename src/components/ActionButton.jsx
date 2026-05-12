export default function ActionButton({ icon: Icon, label }) {
  return (
    <button className=" bg-slate-800/50 hover:bg-slate-900 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center transition-all group">
      <Icon
        size={20}
        className="mb-3 text-gray-400 group-hover:text-blue-400 transition-colors"
      />
      <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
    </button>
  );
}
