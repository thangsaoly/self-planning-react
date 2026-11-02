import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRouter from "./routes/api.js";
import { sequelize } from "./models/index.js";
import { config } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";

const app = express();
const PORT = config.port;

// --- Security middleware -------------------------------------------------
// Security headers (in dev, helmet loosens CSP for Vite's HMR websocket)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow /img + remote images
    contentSecurityPolicy: config.isProduction ? undefined : false,
  })
);

// CORS allowlist: origins come from CLIENT_URL (comma-separated). Requests
// without an Origin header (curl, mobile apps, same-origin) are always allowed.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.clientOrigins.includes(origin) || (!config.isProduction && origin.startsWith("http://localhost"))) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// --- Routes ----------------------------------------------------------------
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the Self-Planning Travel Planner API",
    status: "active",
    documentation: "/api"
  });
});

app.use("/api", apiLimiter, apiRouter);

// Fallback error handler for undefined routes
app.use((req, res, _next) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  // Malformed JSON bodies are client errors, not server faults.
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "Malformed JSON body",
    });
  }

  if (err.message?.startsWith("Origin") && err.message.includes("CORS")) {
    return res.status(403).json({ status: "error", message: "Origin not allowed" });
  }

  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "An internal server error occurred"
  });
});

// Validate external service creds BEFORE binding the port: chat can't work
// without a key, so warn loudly instead of failing every request with 502.
if (!config.openrouter.apiKey) {
  console.warn("[chat] OPENROUTER_API_KEY is not set — /api/chat will respond 503 until it is configured.");
}

// Test connection and sync database tables
sequelize.authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    // Sync models (create-if-missing only). `alter: true` was removed: on SQLite it
    // rewrites tables via positional `INSERT INTO <table>_backup SELECT ...` copies,
    // and a stale `users_backup` left by an interrupted migration made every startup
    // crash with "NOT NULL constraint failed: users_backup.createdAt". Run explicit
    // migrations when model columns actually change.
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database tables synchronized successfully.");
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running in ${config.nodeEnv} mode on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database or sync tables:", err);
    process.exit(1);
  });
