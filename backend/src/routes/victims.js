import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { VictimRegistration } from "../models/VictimRegistration.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createVictimsRouter({ requireAuth, optionalAuth }) {
  const router = Router();
  const uploadRoot = path.join(__dirname, "../../uploads/victims");
  fs.mkdirSync(uploadRoot, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadRoot),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${Date.now()}-${safe}`);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 8 },
  });

  router.post(
    "/",
    requireAuth,
    upload.array("photos", 8),
    async (req, res, next) => {
      try {
        const { incidentLocation, lossType, description } = req.body || {};
        if (!incidentLocation || !lossType) {
          return res.status(400).json({
            error: "Incident location and type of loss are required",
          });
        }
        const photoPaths =
          req.files?.map((f) => `/uploads/victims/${f.filename}`) || [];
        const doc = await VictimRegistration.create({
          user: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null,
          incident_location: String(incidentLocation),
          loss_type: String(lossType),
          description: description ? String(description) : null,
          photo_paths: photoPaths,
        });
        const row = doc.toJSON();
        res.status(201).json({ registration: row });
      } catch (e) {
        next(e);
      }
    },
  );

  router.get("/", requireAuth, async (_req, res, next) => {
    try {
      const rows = await VictimRegistration.find()
        .sort({ _id: -1 })
        .limit(200)
        .lean();
      const registrations = rows.map((r) => ({
        id: r._id.toString(),
        user_id: r.user ? r.user.toString() : null,
        incident_location: r.incident_location,
        loss_type: r.loss_type,
        description: r.description,
        photo_paths: r.photo_paths || [],
        created_at: r.created_at?.toISOString?.() || null,
      }));
      res.json({ registrations });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
