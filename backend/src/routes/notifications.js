import { Router } from "express";
import { Notification } from "../models/Notification.js";
import { Alert } from "../models/Alert.js";

function mapAlertToNotification(alert) {
  const kind = String(alert.kind || "").toLowerCase();
  const type = kind.includes("emergency")
    ? "emergency"
    : kind.includes("warning") ||
        kind.includes("watch") ||
        kind.includes("priority")
      ? "system"
      : "social";
  const accentColor =
    type === "emergency" ? "red" : type === "system" ? "blue" : "yellow";
  const actionText = type === "social" ? "Go To Chat" : "View Alert";
  const body =
    alert.payload?.body ||
    alert.payload?.subtitle ||
    alert.payload?.summary ||
    "A new notification has been generated from the latest alert.";

  return {
    type,
    title:
      alert.payload?.title ||
      alert.payload?.badgePrimary ||
      "Flood Alert Update",
    body,
    actionText,
    accentColor,
    route: "/alerts",
    read: false,
    priority: alert.priority ?? 100,
    alertRef: alert._id,
    time:
      alert.payload?.timeLabel ||
      alert.payload?.assessedAt ||
      alert.payload?.subtitle ||
      "Just now",
  };
}

async function syncNotificationsFromAlerts() {
  const alerts = await Alert.find({
    $or: [
      { source: { $nin: ["automated"] } },
      { source: { $exists: false } },
      {
        $and: [{ source: "automated" }, { expiresAt: { $gt: new Date() } }],
      },
    ],
  })
    .sort({ priority: 1, sort_order: 1, _id: -1 })
    .lean();

  if (!alerts.length) return;

  const alertIds = alerts.map((alert) => alert._id.toString());
  const existingAlertRefs = await Notification.distinct("alertRef", {
    alertRef: { $in: alerts.map((alert) => alert._id) },
  });
  const existingRefStrings = existingAlertRefs.map((ref) => String(ref));

  const pending = alerts.filter(
    (alert) => !existingRefStrings.includes(alert._id.toString()),
  );
  if (!pending.length) return;

  const docs = pending.map(mapAlertToNotification);
  await Notification.insertMany(docs);
}

function buildRegionSummary(alerts) {
  const groups = alerts.reduce((acc, alert) => {
    const name =
      alert.payload?.placeLabel ||
      alert.payload?.badgeSecondary ||
      alert.payload?.subtitle ||
      "Global HQ";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groups)
    .slice(0, 4)
    .map(([name, count]) => ({ name, count: String(count).padStart(2, "0") }));
}

export function createNotificationsRouter({ requireAuth }) {
  const router = Router();

  router.get("/", requireAuth, async (req, res, next) => {
    try {
      await syncNotificationsFromAlerts();

      const filter = String(req.query.filter || "all").toLowerCase();
      const category = String(req.query.category || "all").toLowerCase();
      const query = {
        $or: [{ user: null }, { user: req.user.id }],
      };

      if (filter === "unread") query.read = false;
      if (category !== "all") query.type = category;

      let notifications = await Notification.find(query)
        .sort({ read: 1, priority: 1, createdAt: -1 })
        .lean();

      if (filter === "critical") {
        notifications = notifications.filter(
          (item) => item.accentColor === "red",
        );
      }

      const total = await Notification.countDocuments({
        $or: [{ user: null }, { user: req.user.id }],
      });
      const unread = await Notification.countDocuments({
        $and: [
          { $or: [{ user: null }, { user: req.user.id }] },
          { read: false },
        ],
      });
      const critical = await Notification.countDocuments({
        $and: [
          { $or: [{ user: null }, { user: req.user.id }] },
          { accentColor: "red" },
        ],
      });

      const alertRows = await Alert.find({}).lean();
      const regions = buildRegionSummary(alertRows);

      res.json({
        notifications,
        stats: { total, unread, critical },
        regions,
      });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id/read", requireAuth, async (req, res, next) => {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      if (notification.user && String(notification.user) !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }
      notification.read = true;
      await notification.save();
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.put("/mark-all-read", requireAuth, async (req, res, next) => {
    try {
      await Notification.updateMany(
        {
          $and: [
            { $or: [{ user: null }, { user: req.user.id }] },
            { read: false },
          ],
        },
        { $set: { read: true } },
      );
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
