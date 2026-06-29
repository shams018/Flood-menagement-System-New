import { Router } from "express";
import { runFloodAssessment } from "../services/floodAssessment.js";

export function createFloodRouter() {
  const router = Router();

  router.get("/assess", async (req, res, next) => {
    try {
      const q = req.query.q || req.query.place;
      const persist = req.query.persist !== "0";
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      const coords =
        Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
      const assessment = await runFloodAssessment(q, { persist, coords });
      res.json(assessment);
    } catch (e) {
      if (e.status) {
        return res.status(e.status).json({ error: e.message });
      }
      next(e);
    }
  });

  router.post("/assess", async (req, res, next) => {
    try {
      const q = req.body?.place || req.body?.q;
      const persist = req.body?.persist !== false;
      const lat = Number(req.body?.lat);
      const lon = Number(req.body?.lon);
      const coords =
        Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
      const assessment = await runFloodAssessment(q, { persist, coords });
      res.json(assessment);
    } catch (e) {
      if (e.status) {
        return res.status(e.status).json({ error: e.message });
      }
      next(e);
    }
  });

  return router;
}
