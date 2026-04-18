import { loadJson } from '../backend/lib/loadJson.js';
import { saveJson } from '../backend/lib/saveJson.js';

async function main() {
  const existing = loadJson('data/scraped/beltline-news.json', []);

  // TODO: replace with real scraping
  const sample = {
    title: 'Sample BeltLine Headline',
    url: 'https://beltline.org/',
    source: 'BeltLine',
    snippet: 'Replace this with real scraped content.',
    date: new Date().toISOString().slice(0, 10)
  };

  const updated = [...existing.filter(n => n.title !== sample.title), sample];
  saveJson('data/scraped/beltline-news.json', updated);
  console.log('Updated beltline-news.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
