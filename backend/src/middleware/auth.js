import jwt from "jsonwebtoken";

export function createAuthMiddleware(jwtSecret) {
  function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = header.slice(7);
    try {
      const payload = jwt.verify(token, jwtSecret);
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
  }

  function optionalAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }
    try {
      const payload = jwt.verify(header.slice(7), jwtSecret);
      req.user = { id: payload.sub, email: payload.email };
    } catch {
      req.user = null;
    }
    next();
  }

  return { requireAuth, optionalAuth };
}

export function verifySocketToken(token, jwtSecret) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret);
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
