import fs from 'node:fs';
import path from 'node:path';
import { loadJson } from '../backend/lib/loadJson.js';
import { saveJson } from '../backend/lib/saveJson.js';

function main() {
  const issuesDir = path.join(process.cwd(), 'public', 'issues');
  if (!fs.existsSync(issuesDir)) {
    saveJson('data/issues/index.json', []);
    return;
  }

  const files = fs.readdirSync(issuesDir).filter(f => f.startsWith('issue-') && f.endsWith('.html'));
  const existing = loadJson('data/issues/index.json', []);

  const mapped = files.map(file => {
    const id = file.replace('issue-', '').replace('.html', '');
    const found = existing.find(i => i.id === id);
    return (
      found || {
        id,
        title: `Boardwalk Newsletter – ${id}`,
        summary: '',
        createdAt: `${id}T00:00:00.000Z`
      }
    );
  });

  saveJson('data/issues/index.json', mapped);
  console.log('Regenerated issue index');
}

main();
