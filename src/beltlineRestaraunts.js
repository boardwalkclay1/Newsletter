// src/beltlineRestaurants.js

// Loads restaurants from /public/data/beltline-restaurants.json
async function loadRestaurants() {
  const url = `${globalThis.location?.origin || ""}/data/beltline-restaurants.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const list = await res.json();
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error("Failed to load restaurants:", err);
    return [];
  }
}

/**
 * Get all restaurants.
 */
export async function getAllRestaurants() {
  return await loadRestaurants();
}

/**
 * Get restaurants for a specific BeltLine segment.
 */
export async function getRestaurantsBySegment(segmentId) {
  const list = await loadRestaurants();
  return list.filter(r => r.segmentId === segmentId);
}

/**
 * Get N random restaurants (optionally filtered by segment).
 */
export async function getRandomRestaurants(count = 3, segmentId = null) {
  let list = await loadRestaurants();

  if (segmentId) {
    list = list.filter(r => r.segmentId === segmentId);
  }

  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
