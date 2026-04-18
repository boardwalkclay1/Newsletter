import fs from 'node:fs';
import path from 'node:path';

export function saveJson(relPath, data) {
  const full = path.join(process.cwd(), relPath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf8');
}
