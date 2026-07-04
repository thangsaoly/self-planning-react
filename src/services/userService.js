/**
 * userService.js
 * Centralized API layer for all user-related operations.
 * All functions return { success: boolean, data?: any, error?: string }
 */

const BASE_URL = "/api";

/** Build headers with Authorization token */
const headers = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/**
 * Fetch current user profile.
 */
export async function getProfile(token) {
  try {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      headers: headers(token),
    });
    if (response.status === 401) return { success: false, unauthorized: true };
    const result = await response.json();
    if (response.ok && result.status === "success") {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message || "Failed to load profile" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

/**
 * Update user profile (name/email).
 */
export async function updateProfile(token, profileData) {
  try {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify(profileData),
    });
    if (response.status === 401) return { success: false, unauthorized: true };
    const result = await response.json();
    if (response.ok && result.status === "success") {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message || "Failed to update profile" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

/**
 * Change user password.
 */
export async function changePassword(token, passwordData) {
  try {
    const response = await fetch(`${BASE_URL}/user/password`, {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify(passwordData),
    });
    if (response.status === 401) return { success: false, unauthorized: true };
    const result = await response.json();
    if (response.ok && result.status === "success") {
      return { success: true };
    }
    return { success: false, error: result.message || "Failed to change password" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

/**
 * Authenticate user & get token.
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (response.ok && result.status === "success") {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message || "Login failed" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

/**
 * Register a new user.
 */
export async function signup(fullname, email, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, password }),
    });
    const result = await response.json();
    if (response.ok && result.status === "success") {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message || "Registration failed" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}
