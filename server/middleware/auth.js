import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token)
      return res.status(401).json({ message: "Authentication required" });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(500).json({ message: "JWT secret not configured" });

    const payload = jwt.verify(token, secret);
    if (!payload || !payload.id)
      return res.status(401).json({ message: "Invalid token" });

    // attach user id
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
