import { loadJson } from '../backend/lib/loadJson.js';
import { saveJson } from '../backend/lib/saveJson.js';

async function main() {
  const global = loadJson('data/scraped/skate-news-global.json', []);
  const sample = {
    title: 'Sample Global Skate Event',
    url: 'https://example.com/global-skate',
    source: 'Global',
    snippet: 'Replace with real global skate news.',
    date: new Date().toISOString().slice(0, 10)
  };
  saveJson(
    'data/scraped/skate-news-global.json',
    [...global.filter(n => n.title !== sample.title), sample]
  );
  console.log('Updated skate-news-global.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
