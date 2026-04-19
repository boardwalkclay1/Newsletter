import fetch from "node-fetch";
import cheerio from "cheerio";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/skate-news-national.json";

async function scrapeThrasher() {
  const url = "https://www.thrashermagazine.com/articles/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article").each((i, el) => {
    const title = $(el).find("h2 a").text().trim();
    const link = $(el).find("h2 a").attr("href");
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
}

async function scrapeJenkem() {
  const url = "https://www.jenkemmag.com/home/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article").each((i, el) => {
    const title = $(el).find("h2 a").text().trim();
    const link = $(el).find("h2 a").attr("href");
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
}

async function scrapeBerrics() {
  const url = "https://theberrics.com/news";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article, .news-item").each((i, el) => {
    const title = $(el).find("h2, h3").text().trim();
    const link = $(el).find("a").attr("href");
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
}

async function scrapeReddit() {
  const url = "https://www.reddit.com/r/skateboarding/new.json?limit=30";
  const json = await (await fetch(url)).json();
  const items = [];

  json.data.children.forEach(post => {
    const p = post.data;

    // Filter for US‑related content
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
}

async function main() {
  const existing = loadJson(OUT, []);

  const all = [
    ...(await scrapeThrasher()),
    ...(await scrapeJenkem()),
    ...(await scrapeBerrics()),
    ...(await scrapeReddit())
  ];

  const deduped = all.filter(
    (v, i, a) => a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated skate-news-national.json with", deduped.length, "items");
}

main().catch(console.error);
