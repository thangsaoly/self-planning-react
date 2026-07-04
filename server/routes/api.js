import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import tripRouter from "./trip.routes.js";
import chatRouter from "./chat.routes.js";

const router = express.Router();

/**
 * @route   GET /api
 * @desc    Test API endpoint
 */
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Express API is working!",
    data: [],
  });
});

// Mount modular sub-routers
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/trips", tripRouter);
router.use("/chat", chatRouter);

export default router;
