import fs from "fs";

export function saveJson(path, data) {
  try {
    const dir = path.split("/").slice(0, -1).join("/");
    fs.mkdirSync(dir, { recursive: true });

    const tmp = path + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tmp, path);
  } catch (err) {
    console.error("saveJson error:", err);
  }
}
