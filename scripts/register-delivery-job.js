import fs from 'node:fs';
import path from 'node:path';

function main() {
  const now = new Date();
  const id = now.toISOString().slice(0, 10);

  const job = {
    issueId: id,
    createdAt: now.toISOString()
  };

  const dir = path.join(process.cwd(), 'data', 'delivery-queue');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const file = path.join(dir, `${id}.json`);
  fs.writeFileSync(file, JSON.stringify(job, null, 2), 'utf8');
  console.log('Registered delivery job for issue', id);
}

main();
