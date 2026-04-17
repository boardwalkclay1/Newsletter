// src/beltlineRestaurants.js
import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.join(process.cwd(), 'data', 'beltline-restaurants.json');

function loadRestaurants() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const list = JSON.parse(raw);
  return Array.isArray(list) ? list : [];
}

/**
 * Get all restaurants.
 */
export function getAllRestaurants() {
  return loadRestaurants();
}

/**
 * Get restaurants for a specific BeltLine segment.
 * Example segmentId: "eastside-01"
 */
export function getRestaurantsBySegment(segmentId) {
  return loadRestaurants().filter(r => r.segmentId === segmentId);
}

/**
 * Get N random restaurants (optionally filtered by segment).
 */
export function getRandomRestaurants(count = 3, segmentId = null) {
  let list = loadRestaurants();
  if (segmentId) {
    list = list.filter(r => r.segmentId === segmentId);
  }
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
