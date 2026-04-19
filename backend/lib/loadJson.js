import fs from "fs";

export function loadJson(path, fallback = []) {
  try {
    if (!fs.existsSync(path)) return fallback;
    const raw = fs.readFileSync(path, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("loadJson error:", err);
    return fallback;
  }
}
