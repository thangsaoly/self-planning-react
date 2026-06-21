import jwt from "jsonwebtoken";

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
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_key_self_planning_travel_planner_2026"
      );

      // Attach user details to request
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({
        status: "error",
        message: "Not authorized, token failed",
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
