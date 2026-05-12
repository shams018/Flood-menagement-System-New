import { Router } from "express";
import { Alert } from "../models/Alert.js";

export function createAlertsRouter() {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const now = new Date();
      const rows = await Alert.find({
        $or: [
          { source: { $nin: ["automated"] } },
          { source: { $exists: false } },
          {
            $and: [{ source: "automated" }, { expiresAt: { $gt: now } }],
          },
        ],
      })
        .sort({ priority: 1, sort_order: 1, _id: -1 })
        .lean();

      const alerts = rows.map((r) => ({
        id: r._id.toString(),
        kind: r.kind,
        source: r.source || "seed",
        payload: r.payload,
      }));
      res.json({ alerts, total: alerts.length });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
