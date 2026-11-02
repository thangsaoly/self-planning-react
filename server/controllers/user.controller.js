import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User } from "../models/index.js";

const MIN_PASSWORD_LENGTH = 8;
const isValidEmail = (email) => typeof email === "string" && /^\S+@\S+\.\S+$/.test(email.trim());

/**
 * Get current user profile.
 * @route   GET /api/user/profile
 */
export const getProfile = async (req, res) => {
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
    console.error("Get profile error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

/**
 * Update user profile.
 * @route   PUT /api/user/profile
 */
export const updateProfile = async (req, res) => {
  const { fullname, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (email) {
      const normalized = String(email).trim().toLowerCase();
      if (!isValidEmail(normalized)) {
        return res.status(400).json({ status: "error", message: "Please provide a valid email address" });
      }
      if (normalized !== user.email.toLowerCase()) {
        const emailExists = await User.findOne({ where: { email: { [Op.like]: normalized } } });
        if (emailExists) {
          return res.status(400).json({ status: "error", message: "Email already in use" });
        }
      }
      user.email = normalized;
    }

    if (fullname) user.fullname = String(fullname).trim();

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
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ status: "error", message: "Email already in use" });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

/**
 * Update user password.
 * @route   PUT /api/user/password
 */
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (typeof newPassword !== "string" || newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        status: "error",
        message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (typeof oldPassword !== "string") {
      return res.status(400).json({ status: "error", message: "Old password is required" });
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
    console.error("Change password error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
