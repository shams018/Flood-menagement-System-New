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

  router.post("/", async (req, res, next) => {
    try {
      const {
        name,
        type,
        status,
        status_color_class,
        location,
        contact,
        is_active,
      } = req.body;

      if (
        !name ||
        !type ||
        !status ||
        !status_color_class ||
        !location ||
        !contact
      ) {
        return res.status(400).json({ error: "Missing required NGO fields." });
      }

      const created = await Ngo.create({
        name,
        type,
        status,
        status_color_class,
        location,
        contact,
        is_active: Boolean(is_active),
      });

      res.status(201).json({
        ngo: {
          id: created._id.toString(),
          name: created.name,
          type: created.type,
          status: created.status,
          status_color_class: created.status_color_class,
          location: created.location,
          contact: created.contact,
          is_active: Boolean(created.is_active),
        },
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
