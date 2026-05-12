const NavItem = ({ icon: Icon, label, active, badge }) => (
  <div
    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-white/10 text-white shadow-sm"
        : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
    )}
  </div>
);

export default NavItem;
