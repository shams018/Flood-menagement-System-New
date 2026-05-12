import React, { useState, useEffect } from "react";
import NotificationHeader from "../components/NotificationHeader";
import NotificationSidebar from "../components/NotificationSidebar";
import NotificationFilters from "../components/NotificationFilters";
import NotificationFeed from "../components/NotificationFeed";
import NotificationStats from "../components/NotificationStats";
import NotificationRegions from "../components/NotificationRegions";
import { API_BASE } from "../lib/config";
import { useAuth } from "../context/AuthContext";

// --- Main Dashboard ---

const NotificationsPage = () => {
  const { token } = useAuth();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, critical: 0 });
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter, token]);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/api/notifications?filter=${filter}`,
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
        // Update local state
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setStats((prev) => ({ ...prev, unread: 0 }));
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
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
    <div className="min-h-screen bg-slate-900 text-gray-400 font-sans selection:bg-blue-500/30">
      <NotificationHeader />
      <div className="flex">
        <NotificationSidebar onMarkAllRead={markAllAsRead} />
        <main className="flex-1 p-10 max-w-5xl">
          <div className="mb-10">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
              Notifications
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                Operational flow and tactical warnings from Sector 4 - Sector 9.
              </p>
              <NotificationFilters filter={filter} onFilterChange={setFilter} />
            </div>
          </div>
          <NotificationFeed notifications={notifications} />
        </main>
        <aside className="w-80 p-8 space-y-8 bg-slate-800/50">
          <NotificationStats stats={stats} />
          <NotificationRegions regions={regions} />
        </aside>
      </div>
    </div>
  );
};

export default NotificationsPage;
