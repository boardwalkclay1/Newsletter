import fs from "fs";

export function saveJson(path, data) {
  try {
    fs.mkdirSync(path.split("/").slice(0, -1).join("/"), { recursive: true });
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("saveJson error:", err);
  }
}
