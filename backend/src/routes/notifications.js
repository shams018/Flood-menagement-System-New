import { Router } from "express";
import mongoose from "mongoose";

// Simple in-memory notifications for demo - in production, you'd use a database
const notifications = [
  {
    id: "1",
    type: "emergency",
    title: "Flash Flood Warning - Sector 4",
    time: "2 Minutes Ago",
    body: "Sensor readings indicate rapid water rise in the North Valley catchment. Evacuation protocols for low-lying zones are now active. Immediate movement required.",
    actionText: "View Alert",
    accentColor: "red",
    read: false,
    priority: "critical",
  },
  {
    id: "2",
    type: "system",
    title: "New Impact Report Generated",
    time: "15 Minutes Ago",
    body: "AI Protocol Sentinel has finalized the damages assessment for the Sector 7 storm event. Report #SR-7729 is ready for command review.",
    actionText: "Download PDF",
    accentColor: "blue",
    read: false,
    priority: "normal",
  },
  {
    id: "3",
    type: "social",
    title: "NGO Message: Global Relief Corp",
    time: "1 Hour Ago",
    body: '"Ground teams are 5 miles from Sector 4 checkpoint. Requesting clearance for medical convoy." — Sarah Miller, Logistics Lead.',
    actionText: "Go To Chat",
    accentColor: "yellow",
    read: false,
    priority: "normal",
  },
  {
    id: "4",
    type: "system",
    title: "Evacuation Complete: Zone B",
    time: "3 Hours Ago",
    body: "All registered residents in Zone B have reached the designated safety shelters. Sector status updated to CLEAR.",
    actionText: "View Logs",
    accentColor: "gray",
    read: true,
    priority: "normal",
  },
];

export function createNotificationsRouter({ requireAuth }) {
  const router = Router();

  router.get("/", requireAuth, async (req, res, next) => {
    try {
      const filter = req.query.filter || "all";
      let filteredNotifications = notifications;

      if (filter === "unread") {
        filteredNotifications = notifications.filter((n) => !n.read);
      } else if (filter === "critical") {
        filteredNotifications = notifications.filter(
          (n) => n.priority === "critical",
        );
      }

      const stats = {
        total: notifications.length,
        unread: notifications.filter((n) => !n.read).length,
        critical: notifications.filter((n) => n.priority === "critical").length,
      };

      res.json({
        notifications: filteredNotifications,
        stats,
        regions: [
          { name: "Sector 4", count: "08" },
          { name: "Sector 7", count: "04", checked: true },
          { name: "Sector 9", count: "02" },
          { name: "Global HQ", count: "01" },
        ],
      });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id/read", requireAuth, async (req, res, next) => {
    try {
      const notification = notifications.find((n) => n.id === req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      notification.read = true;
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  router.put("/mark-all-read", requireAuth, async (req, res, next) => {
    try {
      notifications.forEach((n) => (n.read = true));
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
