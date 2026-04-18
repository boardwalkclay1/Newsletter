import fs from 'node:fs';
import path from 'node:path';
import { buildNewsletterData } from '../src/mainNewsletterData.js';
import { renderNewsletter } from '../src/renderNewsletter.js';
import { saveJson } from '../backend/lib/saveJson.js';
import { loadJson } from '../backend/lib/loadJson.js';

async function main() {
  const state = await buildNewsletterData({});
  const html = renderNewsletter(state);

  const now = new Date();
  const id = now.toISOString().slice(0, 10);
  const issuesDir = path.join(process.cwd(), 'public', 'issues');
  if (!fs.existsSync(issuesDir)) fs.mkdirSync(issuesDir, { recursive: true });

  const htmlPath = path.join(issuesDir, `issue-${id}.html`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  const index = loadJson('data/issues/index.json', []);
  const meta = {
    id,
    title: state.title || `Boardwalk Newsletter – ${id}`,
    summary: state.summary || '',
    createdAt: now.toISOString()
  };
  const updatedIndex = [...index.filter(i => i.id !== id), meta];
  saveJson('data/issues/index.json', updatedIndex);

  console.log('Built issue', id);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
