import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Attach user details to request
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      const message = error.name === "TokenExpiredError" ? "Session expired, please log in again" : "Not authorized, token failed";
      return res.status(401).json({
        status: "error",
        message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Not authorized, no token",
    });
  }
};
