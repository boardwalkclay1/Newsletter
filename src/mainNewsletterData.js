// src/mainNewsletterData.js

import { loadJson } from "../backend/lib/loadJson.js";

export async function buildNewsletterData(options = {}) {
  const { manualContent = {} } = options;

  // Load aggregated scraped data
  const scraped = loadJson("public/data/newsletter-source.json", {
    skateLocal: [],
    skateGlobal: [],
    skateNational: [],
    bmx: [],
    inline: [],
    roller: [],
    surf: [],
    snow: [],
    longboard: [],
    beltline: []
  });

  return {
    // Manual content
    title: manualContent.title || "Boardwalk Newsletter",
    dateTime: manualContent.dateTime || new Date().toLocaleString(),
    paragraphs: manualContent.paragraphs || [],
    sections: manualContent.sections || [],
    ending: manualContent.ending || "",
    links: manualContent.links || [],
    qrCodes: manualContent.qrCodes || [],
    video: manualContent.video || { type: "none" },

    // Scraped content
    skateLocal: scraped.skateLocal,
    skateGlobal: scraped.skateGlobal,
    skateNational: scraped.skateNational,
    bmx: scraped.bmx,
    inline: scraped.inline,
    roller: scraped.roller,
    surf: scraped.surf,
    snow: scraped.snow,
    longboard: scraped.longboard,
    beltline: scraped.beltline,

    // Style
    theme: manualContent.theme || "old-scroll",
    fontFamily: manualContent.fontFamily || "Old Standard TT",
    textColor: manualContent.textColor || "#2b1b0f",
    textBgColor: manualContent.textBgColor || "#fdf5e6",
    paperStyle: manualContent.paperStyle || "",
    showLogo: manualContent.showLogo ?? true,
    showSignature: manualContent.showSignature ?? true
  };
}
