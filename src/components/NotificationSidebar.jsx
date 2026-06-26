import {
  AlertTriangle,
  Monitor,
  MessageCircle,
  Layers,
  BarChart,
} from "lucide-react";
import NavItem from "./NavItem";

export default function NotificationSidebar({
  activeCategory,
  onCategorySelect,
  onMarkAllRead,
}) {
  return (
    <aside className="w-72 min-h-[calc(100vh-160px)] rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 flex flex-col justify-between shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-300 mb-6">
          Notifications
        </h2>
        <div className="space-y-3">
          <NavItem
            icon={AlertTriangle}
            label="Emergency"
            active={activeCategory === "emergency"}
            onClick={() => onCategorySelect?.("emergency")}
            badge
          />
          <NavItem
            icon={Monitor}
            label="System"
            active={activeCategory === "system"}
            onClick={() => onCategorySelect?.("system")}
          />
          <NavItem
            icon={MessageCircle}
            label="Social"
            active={activeCategory === "social"}
            onClick={() => onCategorySelect?.("social")}
          />
          <NavItem
            icon={Layers}
            label="All"
            active={activeCategory === "all"}
            onClick={() => onCategorySelect?.("all")}
          />
          <NavItem
            icon={BarChart}
            label="Analytics"
            active={activeCategory === "analytics"}
            onClick={() => onCategorySelect?.("analytics")}
          />
        </div>
      </div>
      <button
        onClick={onMarkAllRead}
        className="w-full py-3 rounded-2xl bg-slate-900/80 text-[10px] font-bold uppercase tracking-widest text-slate-200 hover:bg-slate-800 transition-all"
      >
        Mark All Read
      </button>
    </aside>
  );
}
