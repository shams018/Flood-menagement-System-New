import { Router } from "express";
import mongoose from "mongoose";
import { ChatMessage } from "../models/ChatMessage.js";
import { User } from "../models/User.js";

export function createChatRouter({ requireAuth }, emitChatMessage) {
  const router = Router();

  router.get("/messages", async (req, res, next) => {
    try {
      const channel = String(req.query.channel || "general");
      const rows = await ChatMessage.find({ channel })
        .sort({ _id: 1 })
        .limit(500)
        .lean();
      const messages = rows.map((r) => ({
        id: r._id.toString(),
        channel: r.channel,
        author_label: r.author_label,
        body: r.body,
        is_own_highlight: Boolean(r.is_own_highlight),
        is_ai_message: Boolean(r.is_ai_message),
        created_at: r.created_at?.toISOString?.() || null,
      }));
      res.json({ messages });
    } catch (e) {
      next(e);
    }
  });

  router.post("/messages", requireAuth, async (req, res, next) => {
    try {
      const { body, channel } = req.body || {};
      if (!body || !String(body).trim()) {
        return res.status(400).json({ error: "Message body is required" });
      }
      const ch = channel ? String(channel) : "general";
      const user = await User.findById(req.user.id);
      const authorLabel = user?.full_name || user?.email || "Operator";
      const doc = await ChatMessage.create({
        channel: ch,
        user: new mongoose.Types.ObjectId(req.user.id),
        author_label: authorLabel,
        body: String(body).trim(),
        is_own_highlight: false,
        is_ai_message: false,
      });
      const message = {
        id: doc._id.toString(),
        channel: doc.channel,
        author_label: doc.author_label,
        body: doc.body,
        is_own_highlight: Boolean(doc.is_own_highlight),
        is_ai_message: Boolean(doc.is_ai_message),
        created_at: doc.created_at?.toISOString?.() || null,
      };
      if (typeof emitChatMessage === "function") {
        emitChatMessage(ch, message);
      }

      res.status(201).json({ message });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
