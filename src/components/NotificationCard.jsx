import {
  ShieldAlert,
  FileText,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const NotificationCard = ({
  type,
  title,
  time,
  body,
  actionText,
  actionIcon: ActionIcon,
  accentColor,
  read,
  onAction,
}) => {
  const colorMap = {
    red: "border-red-500 bg-red-500/5",
    blue: "border-blue-500 bg-blue-500/5",
    yellow: "border-yellow-500 bg-yellow-500/5",
    gray: "border-gray-600 bg-gray-600/5",
  };

  const iconMap = {
    red: <ShieldAlert className="text-red-500" size={20} />,
    blue: <FileText className="text-blue-500" size={20} />,
    yellow: <MessageSquare className="text-yellow-500" size={20} />,
    gray: <CheckCircle className="text-gray-500" size={20} />,
  };

  return (
    <div
      className={`relative flex gap-6 p-6 rounded-r-2xl border-l-4 ${colorMap[accentColor]} bg-[#161616] mb-4 group transition-all hover:bg-[#1c1c1c]`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center border border-white/5`}
      >
        {iconMap[accentColor]}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
          <div>
            <h3 className="text-white font-bold tracking-tight">{title}</h3>
            {!read ? (
              <span className="inline-flex mt-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                Unread
              </span>
            ) : null}
          </div>
          <span className="text-[10px] uppercase text-gray-500 font-mono tracking-widest">
            {time}
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-2xl">
          {body}
        </p>
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-blue-400 transition-colors"
        >
          {actionText} {ActionIcon && <ActionIcon size={12} />}
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
