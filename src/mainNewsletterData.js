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

  // BeltLine map segment (sync)
  const beltlineMap = getRandomSegment();

  // Restaurants (async)
  const beltlineRestaurants = await getRandomRestaurants(
    restaurantCount,
    segmentId || beltlineMap?.id
  );

  // Rink events (async now)
  const localEventsRaw = await getLocalRinkEvents();
  const { adultNights, familyKids, major } = splitLocalByType(localEventsRaw);

  const rinkEventsNational = await getNationalRinkEvents();
  const rinkEventsGlobal = await getGlobalRinkEvents();

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
