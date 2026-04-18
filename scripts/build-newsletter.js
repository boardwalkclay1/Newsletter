import fs from 'node:fs';
import path from 'node:path';
import { buildNewsletterData } from '../src/mainNewsletterData.js';
import { renderNewsletter } from '../src/renderNewsletter.js';
import { saveJson } from '../backend/lib/saveJson.js';
import { loadJson } from '../backend/lib/loadJson.js';

async function main() {
  const dashboardJsonPath = 'data/dashboard-newsletter.json';

  let state;

  // ============================================================
  // 1. USE DASHBOARD PAYLOAD IF IT EXISTS
  // ============================================================
  if (fs.existsSync(dashboardJsonPath)) {
    try {
      const raw = fs.readFileSync(dashboardJsonPath, 'utf8');
      state = JSON.parse(raw);

      console.log('Using dashboard newsletter JSON');
    } catch (err) {
      console.error('Failed to parse dashboard JSON, falling back:', err);
      state = await buildNewsletterData({});
    }
  } else {
    // ============================================================
    // 2. FALLBACK: AUTO‑BUILD NEWSLETTER (old behavior)
    // ============================================================
    console.log('No dashboard JSON found — using auto‑build');
    state = await buildNewsletterData({});
  }

  // ============================================================
  // 3. RENDER HTML
  // ============================================================
  const html = renderNewsletter(state);

  // ============================================================
  // 4. ISSUE ID (timestamp‑based)
  // ============================================================
  const now = new Date();
  const id = now.getTime(); // unique numeric ID

  // ============================================================
  // 5. WRITE HTML FILE
  // ============================================================
  const issuesDir = path.join(process.cwd(), 'public', 'issues');
  if (!fs.existsSync(issuesDir)) fs.mkdirSync(issuesDir, { recursive: true });

  const htmlPath = path.join(issuesDir, `issue-${id}.html`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  console.log('Generated issue HTML:', htmlPath);

  // ============================================================
  // 6. UPDATE INDEX.JSON
  // ============================================================
  const indexPath = 'data/issues/index.json';
  const index = loadJson(indexPath, []);

  const meta = {
    id,
    title: state.title || `Boardwalk Newsletter – ${id}`,
    summary: state.summary || '',
    createdAt: now.toISOString()
  };

  const updatedIndex = [...index, meta];
  saveJson(indexPath, updatedIndex);

  console.log('Updated issue index');

  // ============================================================
  // 7. CLEAN UP DASHBOARD JSON (optional)
  // ============================================================
  try {
    if (fs.existsSync(dashboardJsonPath)) {
      fs.unlinkSync(dashboardJsonPath);
      console.log('Cleared dashboard JSON');
    }
  } catch (err) {
    console.warn('Could not delete dashboard JSON:', err);
  }

  console.log('Built issue', id);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
