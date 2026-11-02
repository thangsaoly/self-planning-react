/**
 * Centralized environment config. Fails fast at startup when required
 * variables are missing, and is the single source of truth for secrets
 * (no hardcoded fallbacks anywhere else).
 */
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET is missing or too short (<32 chars). Set a strong secret in server/.env — tokens can be forged without it."
  );
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  dbStorage: process.env.DB_STORAGE || "./database.sqlite",
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: "30d",
  /** Comma-separated allowlist of frontend origins (CORS). */
  clientOrigins: (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:4173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || "openrouter/free",
    maxTokens: Number(process.env.OPENROUTER_MAX_TOKENS) || 1024,
    timeoutMs: 30_000,
  },
};

export default config;
