import express from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.put("/password", protect, changePassword);

export default router;
