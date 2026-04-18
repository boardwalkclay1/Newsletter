import fs from 'node:fs';
import path from 'node:path';

export function loadJson(relPath, fallback = []) {
  const full = path.join(process.cwd(), relPath);
  if (!fs.existsSync(full)) return fallback;
  const raw = fs.readFileSync(full, 'utf8');
  return raw.trim() ? JSON.parse(raw) : fallback;
}
