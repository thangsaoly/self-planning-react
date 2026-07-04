import express from "express";
import { chatWithAssistant } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, chatWithAssistant);

export default router;
