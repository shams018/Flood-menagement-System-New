import { Router } from "express";
import mongoose from "mongoose";
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
      } else if (category === "rescue") {
        query = { category: "rescue" };
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

  router.post("/resources", async (req, res, next) => {
    try {
      const {
        category,
        type_label,
        name,
        status,
        status_color_class,
        distance_label,
        capacity_text,
        is_critical,
        lat,
        lng,
      } = req.body || {};

      if (!category || !name || !status) {
        return res.status(400).json({
          error: "Category, name, and status are required to create a resource",
        });
      }

      const resource = await MapResource.create({
        category,
        type_label: type_label || name,
        name,
        status,
        status_color_class: status_color_class || "bg-blue-400",
        distance_label: distance_label || "",
        capacity_text: capacity_text || "",
        is_critical: Boolean(is_critical),
        lat: lat ?? null,
        lng: lng ?? null,
      });

      res.status(201).json({
        resource: {
          id: resource._id.toString(),
          category: resource.category,
          type_label: resource.type_label,
          name: resource.name,
          status: resource.status,
          status_color_class: resource.status_color_class,
          distance_label: resource.distance_label,
          capacity_text: resource.capacity_text,
          is_critical: Boolean(resource.is_critical),
          lat: resource.lat,
          lng: resource.lng,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.put("/resources/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }

      const update = req.body || {};
      const resource = await MapResource.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      }).lean();

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      res.json({
        resource: {
          id: resource._id.toString(),
          category: resource.category,
          type_label: resource.type_label,
          name: resource.name,
          status: resource.status,
          status_color_class: resource.status_color_class,
          distance_label: resource.distance_label,
          capacity_text: resource.capacity_text,
          is_critical: Boolean(resource.is_critical),
          lat: resource.lat,
          lng: resource.lng,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/resources/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid resource ID" });
      }

      const resource = await MapResource.findByIdAndDelete(id).lean();
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      res.json({ message: "Resource deleted" });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
