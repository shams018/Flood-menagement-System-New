import { Router } from "express";
import mongoose from "mongoose";
import { ChatMessage } from "../models/ChatMessage.js";
import { User } from "../models/User.js";
import {
  getAIResponse,
  getSimpleFallbackResponse,
  isAIServiceAvailable,
} from "../services/aiChatService.js";

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

      // Generate AI response for general and support channels
      if (ch === "support" || ch === "general") {
        setTimeout(async () => {
          try {
            // Get recent conversation history for context
            const recentMessages = await ChatMessage.find({
              channel: ch,
            })
              .sort({ _id: -1 })
              .limit(10)
              .lean();

            const conversationHistory = recentMessages
              .reverse()
              .slice(0, -1)
              .map((m) => ({
                body: m.body,
                is_ai_message: Boolean(m.is_ai_message),
              }));

            let aiResponseText;
            if (isAIServiceAvailable()) {
              const aiResult = await getAIResponse(
                String(body).trim(),
                conversationHistory,
              );
              if (aiResult.success) {
                aiResponseText = aiResult.message;
              } else if (aiResult.isConfigError) {
                aiResponseText = getSimpleFallbackResponse(String(body).trim());
              } else {
                aiResponseText =
                  "I encountered an issue processing your request. Please try again.";
              }
            } else {
              aiResponseText = getSimpleFallbackResponse(String(body).trim());
            }

            // Save AI response
            const aiDoc = await ChatMessage.create({
              channel: ch,
              user: null,
              author_label: "Sentinel AI Assistant",
              body: aiResponseText,
              is_own_highlight: false,
              is_ai_message: true,
            });

            const aiMessage = {
              id: aiDoc._id.toString(),
              channel: aiDoc.channel,
              author_label: aiDoc.author_label,
              body: aiDoc.body,
              is_own_highlight: Boolean(aiDoc.is_own_highlight),
              is_ai_message: Boolean(aiDoc.is_ai_message),
              created_at: aiDoc.created_at?.toISOString?.() || null,
            };

            if (typeof emitChatMessage === "function") {
              emitChatMessage(ch, aiMessage);
            }
          } catch (aiError) {
            console.error("Error generating AI response:", aiError);
          }
        }, 500); // Small delay to make it feel more natural
      }

      res.status(201).json({ message });
    } catch (e) {
      next(e);
    }
  });

  // New endpoint to check AI service status
  router.get("/ai/status", async (req, res) => {
    res.json({
      aiAvailable: isAIServiceAvailable(),
      message: isAIServiceAvailable()
        ? "AI service is active"
        : "AI service is using fallback responses",
    });
  });

  return router;
}
