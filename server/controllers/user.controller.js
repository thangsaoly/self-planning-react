import bcrypt from "bcryptjs";
import { User } from "../models/index.js";

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
};

/**
 * Update user password.
 * @route   PUT /api/user/password
 */
export const changePassword = async (req, res) => {
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
};
