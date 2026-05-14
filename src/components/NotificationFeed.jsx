import { ChevronRight, Download, MessageSquare } from "lucide-react";
import NotificationCard from "./NotificationCard";

export default function NotificationFeed({ notifications, onAction }) {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          type={notification.type}
          title={notification.title}
          time={notification.time}
          body={notification.body}
          actionText={notification.actionText}
          actionIcon={
            notification.actionText === "View Alert"
              ? ChevronRight
              : notification.actionText === "Download PDF"
                ? Download
                : notification.actionText === "Go To Chat"
                  ? MessageSquare
                  : null
          }
          accentColor={notification.accentColor}
          read={notification.read}
          onAction={() => onAction?.(notification)}
        />
      ))}
    </div>
  );
}
