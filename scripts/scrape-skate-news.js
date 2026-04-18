import { loadJson } from '../backend/lib/loadJson.js';
import { saveJson } from '../backend/lib/saveJson.js';

async function main() {
  const local = loadJson('data/scraped/skate-news-local.json', []);
  const sampleLocal = {
    title: 'Sample Atlanta Skate News',
    url: 'https://example.com/atl-skate',
    source: 'Local',
    snippet: 'Replace with real ATL skate news.',
    date: new Date().toISOString().slice(0, 10)
  };
  saveJson(
    'data/scraped/skate-news-local.json',
    [...local.filter(n => n.title !== sampleLocal.title), sampleLocal]
  );
  console.log('Updated skate-news-local.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
