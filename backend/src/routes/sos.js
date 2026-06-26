import { Router } from "express";
import mongoose from "mongoose";
import { Alert } from "../models/Alert.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { Notification } from "../models/Notification.js";

export function createSosRouter({ requireAuth }, emitChatMessage) {
  const router = Router();

  router.post("/initiate", requireAuth, async (req, res, next) => {
    try {
      const { latitude, longitude, message } = req.body || {};
      if (!latitude || !longitude) {
        return res
          .status(400)
          .json({ error: "Location coordinates are required" });
      }

      // Create a unique SOS channel
      const channelId = `sos-${req.user.id}-${Date.now()}`;

      // Create an emergency alert
      const alertDoc = await Alert.create({
        kind: "emergency_sos",
        source: "user",
        priority: 10,
        payload: {
          title: "Emergency SOS Signal",
          subtitle: `User ${req.user.email} at ${latitude}, ${longitude}`,
          summary: message || "Emergency SOS initiated by user",
          placeLabel: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          assessedAt: new Date().toISOString(),
        },
      });

      // Send initial chat message
      const user = await User.findById(req.user.id);
      const authorLabel = user?.full_name || user?.email || "User";
      const initialMessage = await ChatMessage.create({
        channel: channelId,
        user: new mongoose.Types.ObjectId(req.user.id),
        author_label: authorLabel,
        body: message || "EMERGENCY SOS: I need immediate assistance!",
        is_own_highlight: false,
      });

      // Emit to dispatcher channel
      const dispatcherMessage = {
        id: initialMessage._id.toString(),
        channel: channelId,
        author_label: authorLabel,
        body: initialMessage.body,
        is_own_highlight: false,
        created_at: initialMessage.created_at?.toISOString?.() || null,
      };
      if (typeof emitChatMessage === "function") {
        emitChatMessage(channelId, dispatcherMessage);
      }

      // Create and send notification to all admins
      try {
        const admins = await Admin.find({});
        if (admins.length > 0) {
          // Generate map image URL (static map from OpenStreetMap)
          const mapImageUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:${longitude},${latitude}&zoom=14&marker=lonlat:${longitude},${latitude};color:%23ff0000`;
          
          const notifications = await Notification.insertMany(
            admins.map((admin) => ({
              user: admin._id,
              type: "emergency",
              title: "🚨 Emergency SOS Signal",
              body: `${authorLabel} (${user?.email || "Unknown"}) triggered SOS at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              actionText: "View SOS",
              accentColor: "red",
              route: "/alerts",
              priority: 1,
              alertRef: alertDoc._id,
              imageUrl: mapImageUrl,
              location: {
                latitude,
                longitude,
                placeName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              },
              sosData: {
                channel: channelId,
                emergencyType: "sos_initiated",
                userEmail: user?.email || "Unknown",
                userName: authorLabel,
              },
            }))
          );

          // Emit notifications to admins via WebSocket
          notifications.forEach((notif, idx) => {
            const adminNotification = {
              id: notif._id.toString(),
              user: notif.user.toString(),
              type: notif.type,
              title: notif.title,
              body: notif.body,
              actionText: notif.actionText,
              accentColor: notif.accentColor,
              route: notif.route,
              read: notif.read,
              priority: notif.priority,
              imageUrl: notif.imageUrl,
              location: notif.location,
              sosData: notif.sosData,
              created_at: notif.createdAt?.toISOString?.() || null,
            };
            if (typeof emitChatMessage === "function") {
              emitChatMessage(`admin-${admins[idx]._id}`, {
                type: "notification",
                data: adminNotification,
              });
            }
          });
        }
      } catch (notifError) {
        console.error("Error creating admin notifications:", notifError);
      }

      res.status(201).json({
        sos: {
          id: alertDoc._id.toString(),
          channel: channelId,
          location: { latitude, longitude },
          message: initialMessage.body,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.post("/request/:type", requireAuth, async (req, res, next) => {
    try {
      const { type } = req.params;
      const { channel } = req.body || {};
      if (!channel) {
        return res.status(400).json({ error: "Channel is required" });
      }

      const user = await User.findById(req.user.id);
      const authorLabel = user?.full_name || user?.email || "User";

      let requestMessage = "";
      let notificationTitle = "";
      switch (type) {
        case "medical":
          requestMessage = "Requesting medical unit assistance";
          notificationTitle = "🚑 Medical Unit Requested";
          break;
        case "police":
          requestMessage = "Requesting police support";
          notificationTitle = "🚔 Police Support Requested";
          break;
        case "fire":
          requestMessage = "Requesting fire department assistance";
          notificationTitle = "🚒 Fire Department Requested";
          break;
        case "rescue":
          requestMessage = "Requesting rescue squad assistance";
          notificationTitle = "🆘 Rescue Squad Requested";
          break;
        default:
          return res.status(400).json({ error: "Invalid request type" });
      }

      // Create chat message
      const doc = await ChatMessage.create({
        channel,
        user: new mongoose.Types.ObjectId(req.user.id),
        author_label: authorLabel,
        body: requestMessage,
        is_own_highlight: false,
      });

      const message = {
        id: doc._id.toString(),
        channel: doc.channel,
        author_label: doc.author_label,
        body: doc.body,
        is_own_highlight: Boolean(doc.is_own_highlight),
        created_at: doc.created_at?.toISOString?.() || null,
      };
      if (typeof emitChatMessage === "function") {
        emitChatMessage(channel, message);
      }

      // Create and send notification to all admins
      try {
        const admins = await Admin.find({});
        if (admins.length > 0) {
          // Generate map image URL (static map)
          const mapImageUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:${req.body.longitude || 0},${req.body.latitude || 0}&zoom=14&marker=lonlat:${req.body.longitude || 0},${req.body.latitude || 0};color:%23ff0000`;
          
          const notifications = await Notification.insertMany(
            admins.map((admin) => ({
              user: admin._id,
              type: "emergency",
              title: notificationTitle,
              body: `${authorLabel} (${user?.email || "Unknown"}) is requesting ${type} assistance`,
              actionText: "View SOS",
              accentColor: "red",
              route: "/alerts",
              priority: 1,
              imageUrl: mapImageUrl,
              location: {
                latitude: req.body.latitude || null,
                longitude: req.body.longitude || null,
                placeName: `${req.body.latitude?.toFixed(4) || "N/A"}, ${req.body.longitude?.toFixed(4) || "N/A"}`,
              },
              sosData: {
                channel,
                emergencyType: type,
                userEmail: user?.email || "Unknown",
                userName: authorLabel,
              },
            }))
          );

          // Emit notifications to admins via WebSocket
          notifications.forEach((notif, idx) => {
            const adminNotification = {
              id: notif._id.toString(),
              user: notif.user.toString(),
              type: notif.type,
              title: notif.title,
              body: notif.body,
              actionText: notif.actionText,
              accentColor: notif.accentColor,
              route: notif.route,
              read: notif.read,
              priority: notif.priority,
              imageUrl: notif.imageUrl,
              location: notif.location,
              sosData: notif.sosData,
              created_at: notif.createdAt?.toISOString?.() || null,
            };
            if (typeof emitChatMessage === "function") {
              emitChatMessage(`admin-${admins[idx]._id}`, {
                type: "notification",
                data: adminNotification,
              });
            }
          });
        }
      } catch (notifError) {
        console.error("Error creating admin notifications:", notifError);
      }

      res.status(201).json({ message });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
