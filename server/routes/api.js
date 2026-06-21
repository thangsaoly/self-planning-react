import express from "express";

const router = express.Router();

// @route   GET /api
// @desc    Test API endpoint
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Express API is working!",
    data: []
  });
});

// @route   POST /api/auth/login
// @desc    Stub for user login
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please provide email and password"
    });
  }

  // Return a mock user token and user data
  res.json({
    status: "success",
    message: "Login successful",
    data: {
      user: {
        name: email.split("@")[0],
        email: email
      },
      token: "mock-jwt-token-string"
    }
  });
});

// @route   POST /api/auth/signup
// @desc    Stub for user signup
router.post("/auth/signup", (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please fill in all fields"
    });
  }

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: {
      user: {
        name: fullname,
        email: email
      },
      token: "mock-jwt-token-string"
    }
  });
});

// @route   GET /api/trips
// @desc    Stub for fetching user trips
router.get("/trips", (req, res) => {
  res.json({
    status: "success",
    message: "Trips retrieved successfully",
    data: {
      visitingTrips: [],
      upcomingTrips: [],
      visitedTrips: []
    }
  });
});

export default router;
