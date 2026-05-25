import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationHeader from "../components/NotificationHeader";
import NotificationSidebar from "../components/NotificationSidebar";
import NotificationFilters from "../components/NotificationFilters";
import NotificationFeed from "../components/NotificationFeed";
import NotificationStats from "../components/NotificationStats";
import NotificationRegions from "../components/NotificationRegions";
import { API_BASE } from "../lib/config";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";

// --- Main Dashboard ---

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, critical: 0 });
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter, category, token]);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/api/notifications?filter=${filter.toLowerCase()}&category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setStats(data.stats || { total: 0, unread: 0, critical: 0 });
      setRegions(data.regions || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/mark-all-read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setStats((prev) => ({ ...prev, unread: 0 }));
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const downloadNotificationPdf = (notification) => {
    const fileName = `${
      notification.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 40) ||
      "notification"
    }.pdf`;
    const contents = `Notification: ${notification.title}\n\n${notification.body}\n\n${notification.time}`;
    const blob = new Blob([contents], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleNotificationAction = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (notification.actionText === "View Alert") {
      navigate(ROUTES.alerts);
      return;
    }

    if (notification.actionText === "Go To Chat") {
      navigate(ROUTES.chat);
      return;
    }

    if (notification.actionText === "Download PDF") {
      downloadNotificationPdf(notification);
      return;
    }

    navigate(ROUTES.notifications);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-400 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-400 font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 selection:bg-blue-500/30">
      <NotificationHeader />
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <NotificationSidebar
            activeCategory={category}
            onCategorySelect={setCategory}
            onMarkAllRead={markAllAsRead}
          />
          <main className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.35em] text-blue-400/80">
                    Notification Hub
                  </p>
                  <h1 className="mt-4 text-4xl font-black text-white tracking-tight">
                    Alerts & updates
                  </h1>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    Operational flow and tactical warnings from Sector 4 -
                    Sector 9. Stay informed with the latest incident updates,
                    safety advisories, and system bulletins.
                  </p>
                </div>
                <NotificationFilters
                  filter={filter}
                  onFilterChange={setFilter}
                />
              </div>
            </section>

            <section className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                    Total Alerts
                  </p>
                  <p className="mt-4 text-4xl font-black text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                    Unread
                  </p>
                  <p className="mt-4 text-4xl font-black text-blue-400">
                    {stats.unread}
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                    Critical
                  </p>
                  <p className="mt-4 text-4xl font-black text-red-400">
                    {stats.critical}
                  </p>
                </div>
              </div>
              {notifications.length ? (
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/15">
                  <NotificationFeed
                    notifications={notifications}
                    onAction={handleNotificationAction}
                  />
                </div>
              ) : (
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-12 text-center shadow-2xl shadow-slate-950/15">
                  <p className="text-slate-300 text-lg font-semibold">
                    No notifications available right now.
                  </p>
                  <p className="mt-3 text-sm text-slate-500">
                    Subscribe to alerts or wait for new incident updates to
                    appear here.
                  </p>
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20">
              <NotificationStats stats={stats} />
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20">
              <NotificationRegions regions={regions} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
