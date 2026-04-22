import fs from "fs";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/newsletter-source.json";

function safe(path) {
  return loadJson(path, []);
}

async function main() {
  const data = {
    generatedAt: new Date().toISOString(),

    skateLocal: safe("public/data/scraped/skate-news-local.json"),
    skateGlobal: safe("public/data/scraped/skate-news-global.json"),
    skateNational: safe("public/data/scraped/skate-news-national.json"),

    bmx: safe("public/data/scraped/bmx-news.json"),
    inline: safe("public/data/scraped/inline-news.json"),
    roller: safe("public/data/scraped/roller-news.json"),

    surf: safe("public/data/scraped/surf-news.json"),
    snow: safe("public/data/scraped/snow-news.json"),

    longboard: safe("public/data/scraped/longboard-news.json"),
    beltline: safe("public/data/scraped/beltline-news.json")
  };

  saveJson(OUT, data);
  console.log("newsletter-source.json built");
}

main().catch(console.error);
