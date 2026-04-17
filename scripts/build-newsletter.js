import fs from 'node:fs';
import path from 'node:path';
import { buildNewsletterData } from '../src/mainNewsletterData.js';
import { renderNewsletter } from '../src/renderNewsletter.js';

async function main() {
  const data = await buildNewsletterData({
    manualContent: {}, // later: load from dashboard JSON if you want
  });

  const html = renderNewsletter(data);

  const now = new Date();
  const slug = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const outDir = path.join(process.cwd(), 'public', 'issues');
  const outFile = path.join(outDir, `issue-${slug}.html`);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');

  console.log(`Wrote newsletter: ${outFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
