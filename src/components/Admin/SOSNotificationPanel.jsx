import React, { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Clock, User, X } from "lucide-react";
import { API_BASE } from "../../lib/config";
import { useAuth } from "../../context/AuthContext";

const SOSNotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [token]);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/api/notifications?filter=unread&category=emergency`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    try {
      await fetch(`${API_BASE}/api/notifications/${notifId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(
        notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Notification List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            {loading ? "Loading notifications..." : "No emergency notifications"}
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => setSelectedNotif(notif)}
              className={`p-4 rounded-lg cursor-pointer transition border-l-4 ${
                notif.accentColor === "red"
                  ? "border-red-500 bg-red-900/20 hover:bg-red-900/30"
                  : "border-yellow-500 bg-yellow-900/20 hover:bg-yellow-900/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-white">{notif.title}</h3>
                  <p className="text-sm text-slate-300 mt-1">{notif.body}</p>
                  {notif.sosData && (
                    <div className="mt-2 text-xs text-slate-400">
                      <p>
                        <User size={12} className="inline mr-1" />
                        {notif.sosData.userName} ({notif.sosData.userEmail})
                      </p>
                      {notif.location && (
                        <p>
                          <MapPin size={12} className="inline mr-1" />
                          {notif.location.placeName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notif.id);
                  }}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-red-500" />
                {selectedNotif.title}
              </h2>
              <button
                onClick={() => setSelectedNotif(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Map/Image */}
              {selectedNotif.imageUrl && (
                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  <img
                    src={selectedNotif.imageUrl}
                    alt="Emergency location"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Map+Not+Available";
                    }}
                  />
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase">
                    Message
                  </h3>
                  <p className="text-white mt-2">{selectedNotif.body}</p>
                </div>

                {selectedNotif.sosData && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase">
                        User Information
                      </h3>
                      <div className="mt-2 space-y-1 text-slate-300">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {selectedNotif.sosData.userName}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {selectedNotif.sosData.userEmail}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase">
                        Request Type
                      </h3>
                      <p className="text-white mt-2 capitalize">
                        {selectedNotif.sosData.emergencyType === "sos_initiated"
                          ? "Emergency SOS"
                          : selectedNotif.sosData.emergencyType}
                      </p>
                    </div>

                    {selectedNotif.location && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase">
                          Location
                        </h3>
                        <p className="text-white mt-2">
                          {selectedNotif.location.placeName}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Lat: {selectedNotif.location.latitude?.toFixed(4)} | Lng:{" "}
                          {selectedNotif.location.longitude?.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {selectedNotif.createdAt && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase">
                      Received
                    </h3>
                    <p className="text-slate-300 mt-2 flex items-center gap-2">
                      <Clock size={16} />
                      {new Date(selectedNotif.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    markAsRead(selectedNotif.id);
                    setSelectedNotif(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Mark as Read
                </button>
                {selectedNotif.sosData?.channel && (
                  <a
                    href={`/alerts?channel=${selectedNotif.sosData.channel}`}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition text-center"
                  >
                    View SOS Chat
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSNotificationPanel;
