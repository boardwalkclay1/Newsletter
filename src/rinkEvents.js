import fs from 'node:fs';
import path from 'node:path';

function loadJson(file) {
  const p = path.join(process.cwd(), 'data', file);
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

export function getLocalRinkEvents() {
  return loadJson('rink-events-local.json');
}

export function getNationalRinkEvents() {
  return loadJson('rink-events-national.json');
}

export function getGlobalRinkEvents() {
  return loadJson('rink-events-global.json');
}

export function splitLocalByType(events) {
  return {
    adultNights: events.filter(e => e.type === 'adult-night'),
    familyKids: events.filter(e => e.type === 'family-kids'),
    major: events.filter(e => e.type === 'major-event')
  };
}
