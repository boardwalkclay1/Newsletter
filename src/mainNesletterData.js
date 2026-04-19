// src/mainNewsletterData.js

import {
  getLocalRinkEvents,
  getNationalRinkEvents,
  getGlobalRinkEvents,
  splitLocalByType
} from './rinkEvents.js';

import { getRandomSegment } from './beltlineMap.js';
import { getRandomRestaurants } from './beltlineRestaurants.js';

export async function buildNewsletterData(options = {}) {
  const {
    segmentId = null,
    restaurantCount = 3,
    manualContent = {}
  } = options;

  // BeltLine map segment
  const beltlineMap = getRandomSegment();

  // Restaurants (async now)
  const beltlineRestaurants = await getRandomRestaurants(
    restaurantCount,
    segmentId || beltlineMap?.id
  );

  // Rink events (these are still local JSON, so sync is fine)
  const localEventsRaw = getLocalRinkEvents();
  const { adultNights, familyKids, major } = splitLocalByType(localEventsRaw);

  const rinkEventsNational = getNationalRinkEvents();
  const rinkEventsGlobal = getGlobalRinkEvents();

  return {
    title: manualContent.title || 'Boardwalk Newsletter',
    dateTime: manualContent.dateTime || new Date().toLocaleString(),
    paragraphs: manualContent.paragraphs || [],
    sections: manualContent.sections || [],
    ending: manualContent.ending || '',
    links: manualContent.links || [],
    qrCodes: manualContent.qrCodes || [],
    video: manualContent.video || { type: 'none' },

    beltlineMap,
    beltlineRestaurants,

    rinkEventsLocalAdult: adultNights,
    rinkEventsLocalFamily: familyKids,
    rinkEventsLocalMajor: major,
    rinkEventsNational,
    rinkEventsGlobal,

    theme: manualContent.theme || 'old-scroll',
    fontStyle: manualContent.fontStyle || 'old-english',
    textColor: manualContent.textColor || '#2b1b0f',
    textBgColor: manualContent.textBgColor || '#fdf5e6',
    showLogo: manualContent.showLogo ?? true,
    showSignature: manualContent.showSignature ?? true
  };
}
