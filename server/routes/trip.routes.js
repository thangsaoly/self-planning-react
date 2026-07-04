import express from "express";
import { getTrips, createTrip, updateTrip, deleteTrip } from "../controllers/trip.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(protect, getTrips)
  .post(protect, createTrip);

router.route("/:id")
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

export default router;
