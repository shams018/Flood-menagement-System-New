import { Router } from "express";
import { Alert } from "../models/Alert.js";
import { Ngo } from "../models/Ngo.js";
import { VictimRegistration } from "../models/VictimRegistration.js";
import { Notification } from "../models/Notification.js";

export function createSearchRouter({ requireAuth }) {
  const router = Router();

  router.get("/", requireAuth, async (req, res, next) => {
    try {
      const q = String(req.query.q || "").trim();
      if (!q) return res.json({ results: {} });
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const textQuery = { $text: { $search: q } };
      const textProjection = { score: { $meta: "textScore" } };

      const [alerts, ngos, victims, notifications] = await Promise.all([
        Alert.find(textQuery, textProjection)
          .sort({ score: { $meta: "textScore" } })
          .limit(20)
          .lean()
          .catch(async () =>
            Alert.find({
              $or: [
                { "payload.title": regex },
                { "payload.body": regex },
                { "payload.subtitle": regex },
                { "payload.badgePrimary": regex },
                { "payload.badgeSecondary": regex },
              ],
            })
              .limit(20)
              .lean(),
          ),
        Ngo.find(textQuery, textProjection)
          .sort({ score: { $meta: "textScore" } })
          .limit(20)
          .lean()
          .catch(async () =>
            Ngo.find({
              $or: [{ name: regex }, { location: regex }, { type: regex }],
            })
              .limit(20)
              .lean(),
          ),
        VictimRegistration.find(textQuery, textProjection)
          .sort({ score: { $meta: "textScore" } })
          .limit(20)
          .lean()
          .catch(async () =>
            VictimRegistration.find({
              $or: [
                { victim_name: regex },
                { father_name: regex },
                { incident_location: regex },
                { description: regex },
              ],
            })
              .limit(20)
              .lean(),
          ),
        Notification.find(textQuery, textProjection)
          .sort({ score: { $meta: "textScore" } })
          .limit(20)
          .lean()
          .catch(async () =>
            Notification.find({ $or: [{ title: regex }, { body: regex }] })
              .limit(20)
              .lean(),
          ),
      ]);

      const mapped = {
        alerts: alerts.map((a) => ({
          id: a._id.toString(),
          title: a.payload?.title || a.payload?.badgePrimary || "Alert",
          excerpt: a.payload?.subtitle || a.payload?.body || "",
        })),
        ngos: ngos.map((n) => ({
          id: n._id.toString(),
          name: n.name,
          location: n.location,
        })),
        victims: victims.map((v) => ({
          id: v._id.toString(),
          name: v.victim_name,
          location: v.incident_location,
        })),
        notifications: notifications.map((n) => ({
          id: n._id.toString(),
          title: n.title,
          body: n.body,
        })),
      };

      res.json({ results: mapped });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
