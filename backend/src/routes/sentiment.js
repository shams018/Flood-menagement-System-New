import { Router } from "express";
import { SocialPost } from "../models/SocialPost.js";
import { Alert } from "../models/Alert.js";

export function createSentimentRouter({ requireAuth } = {}) {
  const router = Router();

  // Overview: panic score, counts, active regions
  router.get("/overview", async (req, res, next) => {
    try {
      // recent posts (last 60 minutes)
      const since = new Date(Date.now() - 1000 * 60 * 60);
      const recent = await SocialPost.find({
        created_at: { $gte: since },
      }).lean();

      const panicScore = Math.min(
        100,
        Math.round(
          recent.reduce((sum, p) => {
            const base =
              p.urgency === "urgent" ? 20 : p.urgency === "attention" ? 11 : 6;
            const verified = p.verified ? 1.15 : 1;
            return sum + base * verified;
          }, 0),
        ),
      );

      const urgentRequests = recent.filter(
        (p) => p.urgency === "urgent",
      ).length;
      const activeRegions = [
        ...new Set(recent.map((p) => p.region).filter(Boolean)),
      ];

      // Recent automated alerts
      const now = new Date();
      const alerts = await Alert.find({
        $or: [
          { source: { $nin: ["automated"] } },
          { source: { $exists: false } },
          { $and: [{ source: "automated" }, { expiresAt: { $gt: now } }] },
        ],
      })
        .sort({ priority: 1, sort_order: 1, _id: -1 })
        .limit(10)
        .lean();

      res.json({
        panicScore,
        urgentRequests,
        activeRegions,
        recentCount: recent.length,
        alerts: alerts.map((a) => ({
          id: a._id.toString(),
          kind: a.kind,
          payload: a.payload,
        })),
      });
    } catch (e) {
      next(e);
    }
  });

  // Feed: paginated social posts
  router.get("/feed", async (req, res, next) => {
    try {
      const q = String(req.query.q || "").trim();
      const region = req.query.region;
      const page = Math.max(1, Number(req.query.page) || 1);
      const perPage = Math.min(100, Number(req.query.perPage) || 25);

      const filter = {};
      if (q) filter.$text = { $search: q };
      if (region) filter.region = region;

      const total = await SocialPost.countDocuments(filter);
      const rows = await SocialPost.find(filter)
        .sort({ created_at: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean();

      res.json({
        posts: rows.map((r) => ({ id: r._id.toString(), ...r })),
        total,
        page,
        perPage,
      });
    } catch (e) {
      next(e);
    }
  });

  // Create/ingest a social post (open to services, requireAuth optional)
  router.post(
    "/post",
    requireAuth ? requireAuth : (req, res, next) => next(),
    async (req, res, next) => {
      try {
        const body = req.body || {};
        if (!body.message)
          return res.status(400).json({ error: "message required" });

        const doc = await SocialPost.create({
          message: String(body.message),
          user_handle: body.user_handle || null,
          user_label: body.user_label || null,
          hashtags: Array.isArray(body.hashtags) ? body.hashtags : [],
          region: body.region || null,
          urgency: body.urgency || "info",
          verified: Boolean(body.verified),
          meta: body.meta || {},
        });
        res.json({
          ok: true,
          post: { id: doc._id.toString(), ...doc.toJSON() },
        });
      } catch (e) {
        next(e);
      }
    },
  );

  // Admin actions (declare emergency, dismiss false positive)
  router.post(
    "/action",
    requireAuth ? requireAuth : (req, res, next) => next(),
    async (req, res, next) => {
      try {
        const { action, reason, region } = req.body || {};
        if (!action) return res.status(400).json({ error: "action required" });

        if (action === "declare_emergency") {
          // Create an Alert record for admin ops
          const a = await Alert.create({
            kind: "emergency",
            payload: {
              title: "Emergency declared",
              body: reason || "Manual declaration",
              region,
            },
            source: "automated",
            priority: 10,
          });
          return res.json({ ok: true, alert: { id: a._id.toString() } });
        }

        if (action === "dismiss_false_positive") {
          // create a low-priority note alert or just acknowledge
          return res.json({ ok: true, message: "False positive dismissed" });
        }

        res.status(400).json({ error: "unknown action" });
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
}
