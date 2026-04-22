import fetch from "node-fetch";
import cheerio from "cheerio";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/skate-news-national.json";
const UA = { headers: { "User-Agent": "Mozilla/5.0" } };

async function scrapeThrasher() {
  try {
    const html = await (await fetch("https://www.thrashermagazine.com/articles/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article").each((i, el) => {
      const title = $(el).find("h2 a").text().trim();
      const link = $(el).find("h2 a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();
      const date = $(el).find("time").attr("datetime") || "";

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://www.thrashermagazine.com${link}`,
          source: "Thrasher",
          snippet,
          date
        });
      }
    });

    return items;
  } catch {
    return [];
  }
}

async function scrapeJenkem() {
  try {
    const html = await (await fetch("https://www.jenkemmag.com/home/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article").each((i, el) => {
      const title = $(el).find("h2 a").text().trim();
      const link = $(el).find("h2 a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();
      const date = $(el).find("time").attr("datetime") || "";

      if (title && link) {
        items.push({
          title,
          url: link,
          source: "Jenkem",
          snippet,
          date
        });
      }
    });

    return items;
  } catch {
    return [];
  }
}

async function scrapeBerrics() {
  try {
    const html = await (await fetch("https://theberrics.com/news", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .news-item").each((i, el) => {
      const title = $(el).find("h2, h3").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();
      const date = $(el).find("time").attr("datetime") || "";

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://theberrics.com${link}`,
          source: "The Berrics",
          snippet,
          date
        });
      }
    });

    return items;
  } catch {
    return [];
  }
}

async function scrapeReddit() {
  try {
    const json = await (await fetch("https://www.reddit.com/r/skateboarding/new.json?limit=30", UA)).json();
    const items = [];

    json.data.children.forEach(post => {
      const p = post.data;

      // US‑related filter
      if (!/USA|US|America|NYC|LA|California|Texas|Florida|Chicago|Atlanta/i.test(p.title)) return;

      items.push({
        title: p.title,
        url: `https://reddit.com${p.permalink}`,
        source: "Reddit r/skateboarding",
        snippet: p.selftext?.slice(0, 200) || "",
        date: new Date(p.created_utc * 1000).toISOString()
      });
    });

    return items;
  } catch {
    return [];
  }
}

async function main() {
  const all = [
    ...(await scrapeThrasher()),
    ...(await scrapeJenkem()),
    ...(await scrapeBerrics()),
    ...(await scrapeReddit())
  ];

  const deduped = all.filter(
    (v, i, a) =>
      a.findIndex(t => t.url === v.url) === i &&
      a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated skate-news-national.json with", deduped.length, "items");
}

main().catch(console.error);
