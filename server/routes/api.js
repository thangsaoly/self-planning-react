import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Trip } from "../models/index.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "super_secret_key_self_planning_travel_planner_2026",
    { expiresIn: "30d" }
  );
};

// @route   GET /api
// @desc    Test API endpoint
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Express API is working!",
    data: [],
  });
});

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post("/auth/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please fill in all fields",
    });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "Email is already registered",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: {
          name: user.fullname,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during registration",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please provide email and password",
    });
  }

  try {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          name: user.fullname,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during login",
    });
  }
});

// @route   GET /api/user/profile
// @desc    Get current user profile
router.get("/user/profile", protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.json({
      status: "success",
      data: {
        name: user.fullname,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
router.put("/user/profile", protect, async (req, res) => {
  const { fullname, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ status: "error", message: "Email already in use" });
      }
      user.email = email;
    }

    if (fullname) user.fullname = fullname;

    await user.save();

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        name: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// @route   PUT /api/user/password
// @desc    Update user password
router.put("/user/password", protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// @route   GET /api/trips
// @desc    Fetch all user trips
router.get("/trips", protect, async (req, res) => {
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
});

// @route   POST /api/trips
// @desc    Create a new trip
router.post("/trips", protect, async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      userId: req.user.id,
    };

    // Remove client-generated IDs if any, let Sequelize handle UUID creation
    if (tripData.id && tripData.id.startsWith("visiting-") || tripData.id?.startsWith("upcoming-") || tripData.id?.startsWith("visited-")) {
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
});

// @route   PUT /api/trips/:id
// @desc    Update a trip
router.put("/trips/:id", protect, async (req, res) => {
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
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
router.delete("/trips/:id", protect, async (req, res) => {
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
});

// @route   POST /api/chat
// @desc    Chat with AI Assistant using user's trips as context
router.post("/chat", protect, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ status: "error", message: "Messages array is required" });
    }

    // Fetch user context
    const trips = await Trip.findAll({
      where: { userId: req.user.id },
      attributes: ['name', 'travelStatus', 'travelType', 'startDate', 'endDate', 'costs', 'itinerary', 'todos', 'packing']
    });

    // Create a compact string representation of the trips
    const contextData = trips.map(t => {
      let costSum = 0;
      if (t.costs && Array.isArray(t.costs)) {
        costSum = t.costs.reduce((sum, c) => sum + (c.amount || 0), 0);
      }
      return `Trip: ${t.name} (${t.travelStatus})
Type: ${t.travelType}
Dates: ${t.startDate || 'TBD'} to ${t.endDate || 'TBD'}
Total Cost: $${costSum}
Todos: ${t.todos ? t.todos.filter(todo => !todo.isDone).length + ' pending' : 'None'}
Packing: ${t.packing ? t.packing.filter(p => !p.isPacked).length + ' items pending' : 'None'}
`;
    }).join("\n---\n");

    const systemPrompt = `You are "Pisey", a highly advanced, friendly, and proactive AI Travel Assistant integrated into the 'Self-Planning Travel Planner'.
Your goal is to help the user plan their trips, organize itineraries, calculate costs, and provide actionable travel advice.

**GUIDELINES:**
1. **Be Concise & Structured:** Use Markdown extensively (bolding, bullet points, numbered lists) to make your answers easy to read. Do not output massive walls of text.
2. **Contextual Awareness:** The user's current trips are provided below. Refer to them directly when relevant. If they ask about costs, sum them up accurately.
3. **Proactive Advice:** If a trip is missing packing items or a detailed itinerary, suggest some specific items based on the 'travelType'.
4. **Tone:** Enthusiastic, professional, and encouraging.

**USER'S CURRENT TRIPS CONTEXT:**
${contextData || "The user currently has no trips planned. Encourage them to create a new plan!"}
`;

    // Add the system prompt to the beginning of the messages array
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        max_tokens: 400,
        messages: apiMessages,
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("OpenRouter API Error:", errData);
      return res.status(502).json({ status: "error", message: "Failed to communicate with AI provider", details: errData });
    }

    const data = await response.json();
    
    // Extract the content or fallback to an error message if the model returns nothing
    const replyContent = data?.choices?.[0]?.message?.content?.trim();
    const finalReply = replyContent || "I'm sorry, I couldn't process that request properly. Could you try asking in a different way?";

    res.json({
      status: "success",
      data: {
        reply: finalReply
      }
    });

  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ status: "error", message: "Internal server error during chat" });
  }
});

export default router;
