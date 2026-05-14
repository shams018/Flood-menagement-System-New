import { Router } from "express";
import mongoose from "mongoose";
import { Alert } from "../models/Alert.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { User } from "../models/User.js";

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
      switch (type) {
        case "medical":
          requestMessage = "Requesting medical unit assistance";
          break;
        case "police":
          requestMessage = "Requesting police support";
          break;
        case "fire":
          requestMessage = "Requesting fire department assistance";
          break;
        case "rescue":
          requestMessage = "Requesting rescue squad assistance";
          break;
        default:
          return res.status(400).json({ error: "Invalid request type" });
      }

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

      res.status(201).json({ message });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
