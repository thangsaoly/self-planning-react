import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

/**
 * Generate JWT token.
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "super_secret_key_self_planning_travel_planner_2026",
    { expiresIn: "30d" }
  );
};

/**
 * Register a new user.
 * @route   POST /api/auth/signup
 */
export const signup = async (req, res) => {
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
};

/**
 * Authenticate user & get token.
 * @route   POST /api/auth/login
 */
export const login = async (req, res) => {
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
};
