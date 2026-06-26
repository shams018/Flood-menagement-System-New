import { Router } from "express";
import { Alert } from "../models/Alert.js";
import { Ngo } from "../models/Ngo.js";
import { VictimRegistration } from "../models/VictimRegistration.js";
import { MapResource } from "../models/MapResource.js";
import { Notification } from "../models/Notification.js";

export function createAnalyticsRouter({ requireAuth }) {
  const router = Router();

  router.get("/summary", async (_req, res, next) => {
    try {
      const [totalVictims, rescueTeams, sheltersActive, activeAlerts] =
        await Promise.all([
          VictimRegistration.countDocuments(),
          MapResource.countDocuments({
            $or: [
              { type_label: { $regex: /rescue/i } },
              { category: { $regex: /rescue|team/i } },
            ],
          }),
          MapResource.countDocuments({ category: "shelter" }),
          Alert.countDocuments({
            $or: [
              { source: { $nin: ["automated"] } },
              { source: { $exists: false } },
              {
                $and: [
                  { source: "automated" },
                  { expiresAt: { $gt: new Date() } },
                ],
              },
            ],
          }),
        ]);

      res.json({
        totalVictims,
        rescueTeams,
        sheltersActive,
        activeAlerts,
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/", requireAuth, async (_req, res, next) => {
    try {
      const [alertsCount, ngosCount, victimsCount, notificationsCount] =
        await Promise.all([
          Alert.countDocuments({}),
          Ngo.countDocuments({}),
          VictimRegistration.countDocuments({}),
          Notification.countDocuments({}),
        ]);

      res.json({
        alerts: alertsCount,
        ngos: ngosCount,
        victims: victimsCount,
        notifications: notificationsCount,
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
