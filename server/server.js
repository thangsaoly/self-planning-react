import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRouter from "./routes/api.js";
import { sequelize } from "./models/index.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Self-Planning Travel Planner API",
    status: "active",
    documentation: "/api"
  });
});

app.use("/api", apiRouter);

// Fallback error handler for undefined routes
app.use((req, res, _next) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "An internal server error occurred"
  });
});

// Test connection and sync database tables
sequelize.authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    // Sync models
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database tables synchronized successfully.");
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database or sync tables:", err);
    process.exit(1);
  });
