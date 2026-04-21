import fetch from "node-fetch";
import cheerio from "cheerio";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/snow-news.json";
const UA = { headers: { "User-Agent": "Mozilla/5.0" } };

async function scrapeSnowboarder() {
  try {
    const html = await (await fetch("https://www.snowboarder.com/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .post").each((i, el) => {
      const title = $(el).find("h2, h3").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://www.snowboarder.com${link}`,
          source: "Snowboarder.com",
          snippet,
          date: ""
        });
      }
    });

    return items;
  } catch {
    return [];
  }
}

async function scrapeWhitelines() {
  try {
    const html = await (await fetch("https://whitelines.com/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .post").each((i, el) => {
      const title = $(el).find("h2, h3").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://whitelines.com${link}`,
          source: "Whitelines",
          snippet,
          date: ""
        });
      }
    });

    return items;
  } catch {
    return [];
  }
}

async function main() {
  const all = [
    ...(await scrapeSnowboarder()),
    ...(await scrapeWhitelines())
  ];

  const deduped = all.filter(
    (v, i, a) =>
      a.findIndex(t => t.url === v.url) === i &&
      a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated snow-news.json with", deduped.length, "items");
}

main().catch(console.error);
