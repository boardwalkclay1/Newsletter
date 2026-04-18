import fs from 'node:fs';
import path from 'node:path';
import { loadJson } from '../backend/lib/loadJson.js';
import { saveJson } from '../backend/lib/saveJson.js';

async function main() {
  const subs = loadJson('data/subscribers.json', []);
  const index = loadJson('data/issues/index.json', []);
  const logs = loadJson('data/delivery/logs.json', []);

  if (!index.length || !subs.length) {
    console.log('No issues or subscribers; nothing to send.');
    return;
  }

  const latest = index[index.length - 1];
  const issuePath = path.join(process.cwd(), 'public', 'issues', `issue-${latest.id}.html`);
  if (!fs.existsSync(issuePath)) {
    console.log('Latest issue HTML not found, aborting.');
    return;
  }

  const html = fs.readFileSync(issuePath, 'utf8');

  // TODO: integrate real email/SMS/push providers here.
  console.log(`Would send issue ${latest.id} to ${subs.length} subscribers.`);

  const logEntry = {
    issueId: latest.id,
    sentAt: new Date().toISOString(),
    subscriberCount: subs.length
  };

  logs.push(logEntry);
  saveJson('data/delivery/logs.json', logs);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
