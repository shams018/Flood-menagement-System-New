import { ShieldAlert, Settings, Users } from "lucide-react";
import NavItem from "./NavItem";

export default function NotificationSidebar({
  activeCategory,
  onCategorySelect,
  onMarkAllRead,
}) {
  return (
    <aside className="w-64 border-r border-white/5 p-6 min-h-[calc(100vh-64px)] flex flex-col justify-between bg-slate-800/50">
      <div>
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-white mb-6">
          Notifications
        </h2>
        <div className="space-y-1">
          <NavItem
            icon={ShieldAlert}
            label="Emergency"
            active={activeCategory === "emergency"}
            onClick={() => onCategorySelect?.("emergency")}
            badge
          />
          <NavItem
            icon={Settings}
            label="System"
            active={activeCategory === "system"}
            onClick={() => onCategorySelect?.("system")}
          />
          <NavItem
            icon={Users}
            label="Social"
            active={activeCategory === "social"}
            onClick={() => onCategorySelect?.("social")}
          />
          <NavItem
            icon={Users}
            label="All"
            active={activeCategory === "all"}
            onClick={() => onCategorySelect?.("all")}
          />
        </div>
      </div>
      <button
        onClick={onMarkAllRead}
        className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-white/5 hover:text-white transition-all"
      >
        Mark All Read
      </button>
    </aside>
  );
}
