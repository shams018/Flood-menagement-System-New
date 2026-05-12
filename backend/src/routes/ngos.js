import { Router } from "express";
import { Ngo } from "../models/Ngo.js";

export function createNgosRouter() {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const rows = await Ngo.find().sort({ _id: 1 }).lean();
      const ngos = rows.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        type: r.type,
        status: r.status,
        status_color_class: r.status_color_class,
        location: r.location,
        contact: r.contact,
        is_active: Boolean(r.is_active),
      }));
      res.json({ ngos });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
