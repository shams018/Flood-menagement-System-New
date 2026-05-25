import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cron from "node-cron";
import { connectMongo, seedIfEmpty } from "./db.js";
import { createAuthMiddleware, verifySocketToken } from "./middleware/auth.js";
import { createAuthRouter } from "./routes/auth.js";
import { createVictimsRouter } from "./routes/victims.js";
import { createMapRouter } from "./routes/map.js";
import { createAlertsRouter } from "./routes/alerts.js";
import { createNgosRouter } from "./routes/ngos.js";
import { createChatRouter } from "./routes/chat.js";
import { createFloodRouter } from "./routes/flood.js";
import { createNotificationsRouter } from "./routes/notifications.js";
import { createSearchRouter } from "./routes/search.js";
import { createAnalyticsRouter } from "./routes/analytics.js";
import { createSosRouter } from "./routes/sos.js";
import { createAdminRouter } from "./routes/admin.js";
import { User } from "./models/User.js";
import { ChatMessage } from "./models/ChatMessage.js";
import { Alert } from "./models/Alert.js";
import { syncMonitoredLocations } from "./jobs/syncWeatherAlerts.js";
import {
  getAIResponse,
  getSimpleFallbackResponse,
  isAIServiceAvailable,
} from "./services/aiChatService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET =
  process.env.JWT_SECRET || "dev-only-secret-change-in-production";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sentinel_flood";

if (!process.env.JWT_SECRET) {
  console.warn(
    "[sentinel-backend] JWT_SECRET not set; using insecure default for development",
  );
}

const { requireAuth, optionalAuth } = createAuthMiddleware(JWT_SECRET);

const app = express();
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

const uploadsDir = path.join(rootDir, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: FRONTEND_ORIGIN, credentials: true },
});

function emitChatMessage(channel, message) {
  io.to(`channel:${channel}`).emit("chat:message", message);
}

app.use("/api/auth", createAuthRouter(JWT_SECRET));
app.use("/api/victims", createVictimsRouter({ requireAuth, optionalAuth }));
app.use("/api/map", createMapRouter());
app.use("/api/alerts", createAlertsRouter());
app.use("/api/ngos", createNgosRouter());
app.use("/api/flood", createFloodRouter());
app.use("/api/chat", createChatRouter({ requireAuth }, emitChatMessage));
app.use("/api/notifications", createNotificationsRouter({ requireAuth }));
app.use("/api/search", createSearchRouter({ requireAuth }));
app.use("/api/analytics", createAnalyticsRouter({ requireAuth }));
app.use("/api/admin", createAdminRouter({ requireAuth }));
app.use("/api/sos", createSosRouter({ requireAuth }, emitChatMessage));

async function generateAIResponseForChannel(channel, originalBody) {
  if (channel !== "support" && channel !== "general") return;

  try {
    const recent = await ChatMessage.find({ channel })
      .sort({ _id: -1 })
      .limit(10)
      .lean();

    const conversationHistory = recent
      .reverse()
      .slice(0, -1)
      .map((m) => ({
        body: m.body,
        is_ai_message: Boolean(m.is_ai_message),
      }));

    let aiResponseText;
    if (isAIServiceAvailable()) {
      const aiResult = await getAIResponse(originalBody, conversationHistory);
      if (aiResult.success) {
        aiResponseText = aiResult.message;
      } else if (aiResult.isConfigError) {
        aiResponseText = await getSimpleFallbackResponse(originalBody);
      } else {
        aiResponseText =
          "I encountered an issue processing your request. Please try again.";
      }
    } else {
      aiResponseText = await getSimpleFallbackResponse(originalBody);
    }

    const aiDoc = await ChatMessage.create({
      channel,
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

    io.to(`channel:${channel}`).emit("chat:message", aiMessage);
  } catch (err) {
    console.error("AI support reply error:", err);
  }
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "sentinel-flood-backend",
    database: "mongodb",
    floodEngine: "open-meteo + rule-based",
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

io.use((socket, next) => {
  const user = verifySocketToken(socket.handshake.auth?.token, JWT_SECRET);
  if (!user) {
    return next(new Error("Unauthorized"));
  }
  socket.data.user = user;
  next();
});

io.on("connection", (socket) => {
  const user = socket.data.user;
  socket.on("join", (channel) => {
    const ch = String(channel || "general");
    socket.join(`channel:${ch}`);
  });

  socket.on("leave", (channel) => {
    const ch = String(channel || "");
    if (ch) socket.leave(`channel:${ch}`);
  });

  socket.on("chat:send", async ({ channel, body }) => {
    const ch = channel ? String(channel) : "general";
    if (!body || !String(body).trim()) return;
    try {
      const rowUser = await User.findById(user.id);
      const authorLabel = rowUser?.full_name || rowUser?.email || "Operator";
      const doc = await ChatMessage.create({
        channel: ch,
        user: new mongoose.Types.ObjectId(user.id),
        author_label: authorLabel,
        body: String(body).trim(),
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
      io.to(`channel:${ch}`).emit("chat:message", message);
      await generateAIResponseForChannel(ch, String(body).trim());
    } catch (e) {
      console.error(e);
    }
  });
});

async function main() {
  await connectMongo(MONGODB_URI);
  console.log("[sentinel-backend] Connected to MongoDB");
  await seedIfEmpty();
  await Alert.updateMany(
    {
      priority: { $exists: false },
      source: { $ne: "automated" },
    },
    { $set: { priority: 100 } },
  );
  httpServer.listen(PORT, () => {
    console.log(`Sentinel backend listening on http://localhost:${PORT}`);
  });

  syncMonitoredLocations().catch(console.error);
  cron.schedule("*/25 * * * *", () => {
    syncMonitoredLocations().catch(console.error);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
