export default function ActionButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center transition-all group ${
        disabled
          ? "bg-slate-800/30 cursor-not-allowed opacity-50"
          : "bg-slate-800/50 hover:bg-slate-900"
      }`}
    >
      <Icon
        size={20}
        className={`mb-3 transition-colors ${
          disabled ? "text-gray-600" : "text-gray-400 group-hover:text-blue-400"
        }`}
      />
      <span
        className={`text-[9px] font-black uppercase tracking-wider ${
          disabled ? "text-gray-600" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
