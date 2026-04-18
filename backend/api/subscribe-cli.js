import { loadJson } from '../lib/loadJson.js';
import { saveJson } from '../lib/saveJson.js';

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const body = chunks.join('');
  if (!body) {
    console.error('No input JSON provided.');
    process.exit(1);
  }

  const sub = JSON.parse(body);
  const list = loadJson('data/subscribers.json', []);

  const exists = list.find(s => s.email && s.email === sub.email);
  if (exists) {
    Object.assign(exists, sub);
  } else {
    list.push(sub);
  }

  saveJson('data/subscribers.json', list);
  console.log('Subscriber saved. Total:', list.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
