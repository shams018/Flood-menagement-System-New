import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { VictimRegistration } from "../models/VictimRegistration.js";
import { Notification } from "../models/Notification.js";

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
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  });

  router.post(
    "/",
    requireAuth,
    upload.fields([
      { name: "photos", maxCount: 8 },
      { name: "idPhotos", maxCount: 2 },
    ]),
    async (req, res, next) => {
      try {
        const {
          incidentLocation,
          lossType,
          description,
          victimName,
          fatherName,
          phoneNumber,
          gender,
          age,
          cnicNumber,
          idType,
        } = req.body || {};

        if (
          !victimName ||
          !fatherName ||
          !phoneNumber ||
          !gender ||
          !age ||
          !cnicNumber
        ) {
          return res.status(400).json({
            error: "All personal information fields are required",
          });
        }
        if (!/^\d{10,15}$/.test(phoneNumber)) {
          return res.status(400).json({
            error: "Please enter a valid phone number (10-15 digits)",
          });
        }
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          return res.status(400).json({
            error: "Please enter a valid age (1-120)",
          });
        }
        if (!["Male", "Female", "Other"].includes(gender)) {
          return res.status(400).json({
            error: "Please select a valid gender",
          });
        }
        if (!incidentLocation || !lossType) {
          return res.status(400).json({
            error: "Incident location and type of loss are required",
          });
        }

        const photoPaths =
          req.files?.photos?.map((f) => `/uploads/victims/${f.filename}`) || [];
        const idPhotos = req.files?.idPhotos || [];

        if (idPhotos.length !== 2) {
          return res.status(400).json({
            error:
              "Please upload both front and back images of the government-issued ID",
          });
        }

        const [idFront, idBack] = idPhotos;
        const idFrontPath = `/uploads/victims/${idFront.filename}`;
        const idBackPath = `/uploads/victims/${idBack.filename}`;

        const doc = await VictimRegistration.create({
          user: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null,
          victim_name: String(victimName),
          father_name: String(fatherName),
          phone_number: String(phoneNumber),
          gender: String(gender),
          age: ageNum,
          cnic_number: String(cnicNumber),
          government_id_type: idType ? String(idType) : "CNIC",
          incident_location: String(incidentLocation),
          loss_type: String(lossType),
          description: description ? String(description) : null,
          photo_paths: photoPaths,
          id_front_path: idFrontPath,
          id_back_path: idBackPath,
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
        victim_name: r.victim_name,
        father_name: r.father_name,
        phone_number: r.phone_number,
        gender: r.gender,
        age: r.age,
        cnic_number: r.cnic_number,
        status: r.status || "Pending",
        government_id_type: r.government_id_type,
        incident_location: r.incident_location,
        loss_type: r.loss_type,
        description: r.description,
        photo_paths: r.photo_paths || [],
        id_front_path: r.id_front_path,
        id_back_path: r.id_back_path,
        created_at: r.created_at?.toISOString?.() || null,
      }));
      res.json({ registrations });
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id/status", requireAuth, async (req, res, next) => {
    try {
      if (String(req.user.role || "").toLowerCase() !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const status = String(req.body.status || "").trim();
      if (!["Pending", "Approved", "Rejected", "Responded"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const victim = await VictimRegistration.findById(req.params.id).lean();
      if (!victim) {
        return res.status(404).json({ error: "Victim registration not found" });
      }

      const updated = await VictimRegistration.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, lean: true },
      );

      if (status === "Approved" && victim.user) {
        await Notification.create({
          user: victim.user,
          type: "system",
          title: "Registration Approved",
          body: `Your victim registration has been approved by the administration.`,
          actionText: "View Notification",
          accentColor: "blue",
          route: "/notifications",
          read: false,
          priority: 50,
          time: new Date().toLocaleString(),
        });
      }

      res.json({ registration: updated });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
