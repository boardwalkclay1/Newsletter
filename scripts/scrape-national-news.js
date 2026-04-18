import { loadJson } from '../backend/lib/loadJson.js';
import { saveJson } from '../backend/lib/saveJson.js';

async function main() {
  const national = loadJson('data/scraped/skate-news-national.json', []);
  const sample = {
    title: 'Sample U.S. Skate Event',
    url: 'https://example.com/us-skate',
    source: 'National',
    snippet: 'Replace with real national skate news.',
    date: new Date().toISOString().slice(0, 10)
  };
  saveJson(
    'data/scraped/skate-news-national.json',
    [...national.filter(n => n.title !== sample.title), sample]
  );
  console.log('Updated skate-news-national.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
