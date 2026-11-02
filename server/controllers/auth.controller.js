import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User } from "../models/index.js";
import { config } from "../config/env.js";

const MIN_PASSWORD_LENGTH = 8;
const isValidEmail = (email) => typeof email === "string" && /^\S+@\S+\.\S+$/.test(email.trim());

/**
 * Generate JWT token.
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

/**
 * Find a user by email, case-insensitively (SQLite LIKE is ASCII-insensitive,
 * so legacy mixed-case rows still match lowercase input).
 */
const findUserByEmail = (email) =>
  User.findOne({ where: { email: { [Op.like]: email.trim().toLowerCase() } } });

/**
 * Register a new user.
 * @route   POST /api/auth/signup
 */
export const signup = async (req, res) => {
  let { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please fill in all fields",
    });
  }

  fullname = String(fullname).trim();
  email = String(email).trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ status: "error", message: "Please provide a valid email address" });
  }
  if (String(password).length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      status: "error",
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    });
  }

  try {
    // Check if user already exists
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "Email is already registered",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (unique index guards the check-then-create race)
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
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ status: "error", message: "Email is already registered" });
    }
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
    // Find user (normalized + case-insensitive fallback)
    const user = await findUserByEmail(email);
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
