import { Trip } from "../models/index.js";

/**
 * Fetch all user trips.
 * @route   GET /api/trips
 */
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    // Categorize trips by status to match the frontend expectations
    const visitingTrips = trips.filter((t) => t.travelStatus === "visiting");
    const upcomingTrips = trips.filter((t) => t.travelStatus === "upcoming");
    const visitedTrips = trips.filter((t) => t.travelStatus === "visited");

    res.json({
      status: "success",
      message: "Trips retrieved successfully",
      data: {
        visitingTrips,
        upcomingTrips,
        visitedTrips,
      },
    });
  } catch (error) {
    console.error("Fetch trips error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error fetching trips",
    });
  }
};

/**
 * Create a new trip.
 * @route   POST /api/trips
 */
export const createTrip = async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      userId: req.user.id,
    };

    // Remove client-generated IDs if any, let Sequelize handle UUID creation
    if (tripData.id && (tripData.id.startsWith("visiting-") || tripData.id.startsWith("upcoming-") || tripData.id.startsWith("visited-"))) {
      delete tripData.id;
    }

    const trip = await Trip.create(tripData);

    res.status(201).json({
      status: "success",
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error creating trip",
    });
  }
};

/**
 * Update a trip.
 * @route   PUT /api/trips/:id
 */
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!trip) {
      return res.status(404).json({
        status: "error",
        message: "Trip not found or unauthorized",
      });
    }

    // Update with req.body fields
    await trip.update(req.body);

    res.json({
      status: "success",
      message: "Trip updated successfully",
      data: trip,
    });
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error updating trip",
    });
  }
};

/**
 * Delete a trip.
 * @route   DELETE /api/trips/:id
 */
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!trip) {
      return res.status(404).json({
        status: "error",
        message: "Trip not found or unauthorized",
      });
    }

    await trip.destroy();

    res.json({
      status: "success",
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error deleting trip",
    });
  }
};
