import { Router } from "express";
import { MapResource } from "../models/MapResource.js";

export function createMapRouter() {
  const router = Router();

  router.get("/resources", async (req, res, next) => {
    try {
      const category = req.query.category;
      let query = {};
      if (category === "shelters" || category === "shelter") {
        query = { category: "shelter" };
      } else if (category === "medical") {
        query = { category: "medical" };
      }
      const rows = await MapResource.find(query).sort({ _id: 1 }).lean();
      const resources = rows.map((r) => ({
        id: r._id.toString(),
        category: r.category,
        type_label: r.type_label,
        name: r.name,
        status: r.status,
        status_color_class: r.status_color_class,
        distance_label: r.distance_label,
        capacity_text: r.capacity_text,
        is_critical: Boolean(r.is_critical),
        lat: r.lat,
        lng: r.lng,
      }));
      res.json({ resources });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
