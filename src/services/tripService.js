/**
 * tripService.js
 * Centralized API layer for all trip-related operations.
 * All functions return { success: boolean, data?: any, error?: string }
 */

const BASE_URL = "/api";

/** Build headers with Authorization token */
const headers = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/**
 * Fetch all trips for the authenticated user.
 * @returns {{ success, data: { visitingTrips, upcomingTrips, visitedTrips }, error }}
 */
export async function fetchTrips(token) {
  const response = await fetch(`${BASE_URL}/trips`, {
    headers: headers(token),
  });
  const result = await response.json();
  if (response.status === 401) return { success: false, unauthorized: true };
  if (response.ok && result.status === "success") {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.message || "Failed to load trips" };
}

/**
 * Create a new trip.
 * @returns {{ success, data: Trip, error }}
 */
export async function createTrip(token, tripData) {
  const response = await fetch(`${BASE_URL}/trips`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(tripData),
  });
  const result = await response.json();
  if (response.status === 401) return { success: false, unauthorized: true };
  if (response.ok && result.status === "success") {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.message || "Failed to create trip" };
}

/**
 * Update an existing trip.
 * @returns {{ success, data: Trip, error }}
 */
export async function updateTrip(token, id, tripData) {
  const response = await fetch(`${BASE_URL}/trips/${id}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(tripData),
  });
  const result = await response.json();
  if (response.status === 401) return { success: false, unauthorized: true };
  if (response.ok && result.status === "success") {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.message || "Failed to update trip" };
}

/**
 * Delete a trip by ID.
 * @returns {{ success, error }}
 */
export async function deleteTrip(token, id) {
  const response = await fetch(`${BASE_URL}/trips/${id}`, {
    method: "DELETE",
    headers: headers(token),
  });
  const result = await response.json();
  if (response.status === 401) return { success: false, unauthorized: true };
  if (response.ok && result.status === "success") {
    return { success: true };
  }
  return { success: false, error: result.message || "Failed to delete trip" };
}
