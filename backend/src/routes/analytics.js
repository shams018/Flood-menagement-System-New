import { Router } from "express";
import { Alert } from "../models/Alert.js";
import { Ngo } from "../models/Ngo.js";
import { VictimRegistration } from "../models/VictimRegistration.js";
import { Notification } from "../models/Notification.js";

export function createAnalyticsRouter({ requireAuth }) {
  const router = Router();

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
