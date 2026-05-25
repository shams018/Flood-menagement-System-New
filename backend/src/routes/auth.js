import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";

export function createAuthRouter(jwtSecret) {
  const router = Router();

  const getJwt = (safe) =>
    jwt.sign(
      { sub: safe.id, email: safe.email, role: safe.role || "User" },
      jwtSecret,
      { expiresIn: "7d" },
    );

  router.post("/register", async (req, res, next) => {
    try {
      const { email, password, fullName, phone, role } = req.body || {};
      if (!email || !password || !fullName) {
        return res
          .status(400)
          .json({ error: "Email, password, and full name are required" });
      }
      if (String(password).length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters" });
      }
      const password_hash = bcrypt.hashSync(String(password), 10);
      const normalizedRole = String(role || "User").trim();
      const normalizedEmail = String(email).toLowerCase().trim();
      const isAdminRole = normalizedRole.toLowerCase() === "admin";

      const existingUser =
        (await Admin.findOne({ email: normalizedEmail })) ||
        (await User.findOne({ email: normalizedEmail }));
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const model = isAdminRole ? Admin : User;
      const record = await model.create({
        email: normalizedEmail,
        password_hash,
        full_name: String(fullName).trim(),
        phone: phone ? String(phone) : null,
        role: isAdminRole ? "Admin" : "User",
      });

      const safe = record.toJSON();
      const token = getJwt(safe);
      return res.status(201).json({ token, user: safe });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ error: "Email already registered" });
      }
      return next(e);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      const normalizedEmail = String(email).toLowerCase().trim();
      let user = await Admin.findOne({ email: normalizedEmail }).select(
        "+password_hash",
      );
      let source = user ? "admin" : "user";
      if (!user) {
        user = await User.findOne({ email: normalizedEmail }).select(
          "+password_hash",
        );
      }
      if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const safe = user.toJSON();
      const token = getJwt(safe);
      res.json({ token, user: safe, source });
    } catch (e) {
      next(e);
    }
  });

  router.post("/forgot-password", async (req, res, next) => {
    try {
      const { email } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const normalizedEmail = String(email).toLowerCase().trim();
      const user =
        (await Admin.findOne({ email: normalizedEmail })) ||
        (await User.findOne({ email: normalizedEmail }));
      if (!user) {
        return res.status(200).json({
          message:
            "If that email exists in our system, a password reset link has been sent.",
        });
      }

      console.log(
        `[sentinel-backend] forgot-password requested for ${normalizedEmail}`,
      );
      return res.status(200).json({
        message:
          "If that email exists in our system, a password reset link has been sent.",
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/me", async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }
    try {
      const payload = jwt.verify(header.slice(7), jwtSecret);
      const prefersAdmin =
        String(payload.role || "User").toLowerCase() === "admin";
      let user = prefersAdmin
        ? await Admin.findById(payload.sub)
        : await User.findById(payload.sub);
      if (!user) {
        user = prefersAdmin
          ? await User.findById(payload.sub)
          : await Admin.findById(payload.sub);
      }
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      res.json({ user: user.toJSON() });
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }
      next(e);
    }
  });

  router.put("/me", async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }
    try {
      const payload = jwt.verify(header.slice(7), jwtSecret);
      const prefersAdmin =
        String(payload.role || "User").toLowerCase() === "admin";
      let user = prefersAdmin
        ? await Admin.findById(payload.sub)
        : await User.findById(payload.sub);
      if (!user) {
        user = prefersAdmin
          ? await User.findById(payload.sub)
          : await Admin.findById(payload.sub);
      }
      if (!user) return res.status(401).json({ error: "User not found" });

      const { fullName, phone } = req.body || {};
      if (fullName) user.full_name = String(fullName).trim();
      if (phone !== undefined) user.phone = phone ? String(phone).trim() : null;
      await user.save();
      res.json({ user: user.toJSON() });
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }
      next(e);
    }
  });

  return router;
}
