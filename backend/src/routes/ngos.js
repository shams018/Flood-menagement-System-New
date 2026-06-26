import { Router } from "express";
import mongoose from "mongoose";
import { Ngo } from "../models/Ngo.js";

export function createNgosRouter({ requireAuth } = {}, emitNgoUpdate) {
  const router = Router();
  const authMiddleware =
    typeof requireAuth === "function"
      ? requireAuth
      : (_req, _res, next) => next();

  const requireAdmin = (req, res, next) => {
    if (String(req.user?.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    return next();
  };

  const buildNgoResponse = (doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
    status: doc.status,
    status_color_class: doc.status_color_class,
    location: doc.location,
    contact: doc.contact,
    notes: doc.notes || "",
    is_active: Boolean(doc.is_active),
    created_at: doc.created_at?.toISOString?.() || null,
    updated_at: doc.updated_at?.toISOString?.() || null,
  });

  const emitUpdate = (action, ngo) => {
    if (typeof emitNgoUpdate === "function") {
      emitNgoUpdate({ action, ngo });
    }
  };

  router.get("/", authMiddleware, async (req, res, next) => {
    try {
      const { search, type, status, active, page = 1, limit = 50 } = req.query;
      const filter = {};

      if (search) {
        filter.$text = { $search: String(search) };
      }
      if (type) {
        filter.type = new RegExp(String(type), "i");
      }
      if (status) {
        filter.status = new RegExp(String(status), "i");
      }
      if (typeof active !== "undefined") {
        filter.is_active = String(active).toLowerCase() === "true";
      }

      const pageNumber = Math.max(1, Number(page) || 1);
      const pageSize = Math.min(100, Math.max(10, Number(limit) || 50));
      const skip = (pageNumber - 1) * pageSize;

      const [total, rows] = await Promise.all([
        Ngo.countDocuments(filter),
        Ngo.find(filter)
          .sort({ is_active: -1, updated_at: -1, name: 1 })
          .skip(skip)
          .limit(pageSize)
          .lean(),
      ]);

      res.json({
        ngos: rows.map(buildNgoResponse),
        total,
        page: pageNumber,
        limit: pageSize,
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/summary", authMiddleware, async (_req, res, next) => {
    try {
      const [total, active, inactive, critical, activeHits] = await Promise.all(
        [
          Ngo.countDocuments(),
          Ngo.countDocuments({ is_active: true }),
          Ngo.countDocuments({ is_active: false }),
          Ngo.countDocuments({ status: /critical/i }),
          Ngo.countDocuments({ status: /active|deployed|responding/i }),
        ],
      );

      res.json({
        summary: {
          total,
          active,
          inactive,
          critical,
          activeHits,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
      const ngo = await Ngo.findById(req.params.id).lean();
      if (!ngo) {
        return res.status(404).json({ error: "NGO not found" });
      }
      res.json({ ngo: buildNgoResponse(ngo) });
    } catch (e) {
      next(e);
    }
  });

  router.post("/", authMiddleware, requireAdmin, async (req, res, next) => {
    try {
      const {
        name,
        type,
        status,
        status_color_class,
        location,
        contact,
        notes,
        is_active,
      } = req.body || {};

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
        name: String(name).trim(),
        type: String(type).trim(),
        status: String(status).trim(),
        status_color_class: String(status_color_class).trim(),
        location: String(location).trim(),
        contact: String(contact).trim(),
        notes: String(notes || "").trim(),
        is_active: Boolean(is_active),
      });

      const ngo = buildNgoResponse(created);
      emitUpdate("created", ngo);
      res.status(201).json({ ngo });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id", authMiddleware, requireAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid NGO identifier" });
      }

      const updateFields = {};
      [
        "name",
        "type",
        "status",
        "status_color_class",
        "location",
        "contact",
        "notes",
      ].forEach((field) => {
        if (field in req.body) {
          updateFields[field] = String(req.body[field]).trim();
        }
      });

      if ("is_active" in req.body) {
        updateFields.is_active = Boolean(req.body.is_active);
      }

      const updated = await Ngo.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) {
        return res.status(404).json({ error: "NGO not found" });
      }

      const ngo = buildNgoResponse(updated);
      emitUpdate("updated", ngo);
      res.json({ ngo });
    } catch (e) {
      next(e);
    }
  });

  router.patch("/:id", authMiddleware, requireAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid NGO identifier" });
      }

      const updateFields = {};
      [
        "name",
        "type",
        "status",
        "status_color_class",
        "location",
        "contact",
        "notes",
      ].forEach((field) => {
        if (field in req.body) {
          updateFields[field] = String(req.body[field]).trim();
        }
      });
      if ("is_active" in req.body) {
        updateFields.is_active = Boolean(req.body.is_active);
      }

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No update fields provided" });
      }

      const updated = await Ngo.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) {
        return res.status(404).json({ error: "NGO not found" });
      }

      const ngo = buildNgoResponse(updated);
      emitUpdate("updated", ngo);
      res.json({ ngo });
    } catch (e) {
      next(e);
    }
  });

  router.delete(
    "/:id",
    authMiddleware,
    requireAdmin,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid NGO identifier" });
        }

        const deleted = await Ngo.findByIdAndDelete(id).lean();
        if (!deleted) {
          return res.status(404).json({ error: "NGO not found" });
        }

        emitUpdate("deleted", { id: deleted._id.toString() });
        res.json({ success: true });
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
}
