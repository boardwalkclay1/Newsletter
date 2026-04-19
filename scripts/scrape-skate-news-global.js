import fetch from "node-fetch";
import cheerio from "cheerio";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/skate-news-global.json";

async function scrapeSkateNewsWire() {
  const url = "https://skatenewswire.com/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $(".jeg_post").each((i, el) => {
    const title = $(el).find(".jeg_post_title a").text().trim();
    const link = $(el).find(".jeg_post_title a").attr("href");
    const snippet = $(el).find(".jeg_post_excerpt").text().trim();
    const date = $(el).find("time").attr("datetime") || "";

    if (title && link) {
      items.push({ title, url: link, source: "SkateNewsWire", snippet, date });
    }
  });

  return items;
}

async function scrapeBeMag() {
  const url = "https://be-mag.com/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article").each((i, el) => {
    const title = $(el).find("h2 a").text().trim();
    const link = $(el).find("h2 a").attr("href");
    const snippet = $(el).find("p").first().text().trim();
    const date = $(el).find("time").attr("datetime") || "";

    if (title && link) {
      items.push({ title, url: link, source: "Be-Mag", snippet, date });
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
      items.push({ title, url: link, source: "Jenkem", snippet, date });
    }
  });

  return items;
}

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

async function scrapeReddit() {
  const url = "https://www.reddit.com/r/skateboarding/new.json?limit=20";
  const json = await (await fetch(url)).json();
  const items = [];

  json.data.children.forEach(post => {
    const p = post.data;
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
    ...(await scrapeSkateNewsWire()),
    ...(await scrapeBeMag()),
    ...(await scrapeJenkem()),
    ...(await scrapeThrasher()),
    ...(await scrapeReddit())
  ];

  const deduped = all.filter(
    (v, i, a) => a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated skate-news-global.json with", deduped.length, "items");
}

main().catch(console.error);
