import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export function createAuthRouter(jwtSecret) {
  const router = Router();

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
      const user = await User.create({
        email: String(email).toLowerCase().trim(),
        password_hash,
        full_name: String(fullName).trim(),
        phone: phone ? String(phone) : null,
        role: String(role || "User"),
      });
      const safe = user.toJSON();
      const token = jwt.sign(
        { sub: safe.id, email: safe.email },
        jwtSecret,
        { expiresIn: "7d" },
      );
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
      const user = await User.findOne({
        email: String(email).toLowerCase().trim(),
      }).select("+password_hash");
      if (
        !user ||
        !bcrypt.compareSync(String(password), user.password_hash)
      ) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const safe = user.toJSON();
      const token = jwt.sign(
        { sub: safe.id, email: safe.email },
        jwtSecret,
        { expiresIn: "7d" },
      );
      res.json({ token, user: safe });
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
      const user = await User.findById(payload.sub);
      if (!user) return res.status(401).json({ error: "User not found" });
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
