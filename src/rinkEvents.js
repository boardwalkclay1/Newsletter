// src/rinkEvents.js

async function loadJson(file) {
  const url = `${globalThis.location?.origin || ""}/data/${file}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to load rink events:", file, err);
    return [];
  }
}

export async function getLocalRinkEvents() {
  return await loadJson("rink-events-local.json");
}

export async function getNationalRinkEvents() {
  return await loadJson("rink-events-national.json");
}

export async function getGlobalRinkEvents() {
  return await loadJson("rink-events-global.json");
}

export function splitLocalByType(events) {
  return {
    adultNights: events.filter(e => e.type === "adult-night"),
    familyKids: events.filter(e => e.type === "family-kids"),
    major: events.filter(e => e.type === "major-event")
  };
}
