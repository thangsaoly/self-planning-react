import rateLimit from "express-rate-limit";

const baseOptions = {
  standardHeaders: true, // RateLimit-* headers so the frontend can react
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      status: "error",
      message: "Too many requests. Please slow down and try again later.",
    });
  },
};

/** Global API ceiling: protects the DB from runaway loops. */
export const apiLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 300,
});

/** Auth endpoints: brute-force protection (per IP). */
export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true, // only failed attempts count
});

/** Chat: every request is a paid LLM call — apply a firm per-user budget. */
export const chatLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 60,
});
