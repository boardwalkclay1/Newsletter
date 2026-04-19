import fetch from "node-fetch";
import cheerio from "cheerio";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/longboard-news.json";

async function scrapeLongboardMag() {
  const url = "https://longboardmagazine.eu/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article, .post").each((i, el) => {
    const title = $(el).find("h2 a").text().trim();
    const link = $(el).find("h2 a").attr("href");
    const snippet = $(el).find("p").first().text().trim();
    const date = $(el).find("time").attr("datetime") || "";

    if (title && link) {
      items.push({
        title,
        url: link,
        source: "Longboard Magazine EU",
        snippet,
        date
      });
    }
  });

  return items;
}

async function scrapeSilverfish() {
  const url = "https://silverfishlongboarding.com/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article, .post").each((i, el) => {
    const title = $(el).find("h2, h3").text().trim();
    const link = $(el).find("a").attr("href");
    const snippet = $(el).find("p").first().text().trim();

    if (title && link) {
      items.push({
        title,
        url: link,
        source: "Silverfish Longboarding",
        snippet,
        date: ""
      });
    }
  });

  return items;
}

async function scrapeReddit() {
  const url = "https://www.reddit.com/r/longboarding/new.json?limit=30";
  const json = await (await fetch(url)).json();
  const items = [];

  json.data.children.forEach(post => {
    const p = post.data;

    items.push({
      title: p.title,
      url: `https://reddit.com${p.permalink}`,
      source: "Reddit r/longboarding",
      snippet: p.selftext?.slice(0, 200) || "",
      date: new Date(p.created_utc * 1000).toISOString()
    });
  });

  return items;
}

async function scrapeYouTube() {
  const url = "https://www.youtube.com/feeds/videos.xml?search_query=longboarding";
  const xml = await (await fetch(url)).text();

  const items = [];
  const entries = xml.split("<entry>").slice(1);

  entries.forEach(entry => {
    const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
    const link = entry.match(/<link rel="alternate" href="(.*?)"/)?.[1];
    const date = entry.match(/<published>(.*?)<\/published>/)?.[1];

    if (title && link) {
      items.push({
        title,
        url: link,
        source: "YouTube Longboarding",
        snippet: "",
        date
      });
    }
  });

  return items;
}

async function main() {
  const existing = loadJson(OUT, []);

  const all = [
    ...(await scrapeLongboardMag()),
    ...(await scrapeSilverfish()),
    ...(await scrapeReddit()),
    ...(await scrapeYouTube())
  ];

  const deduped = all.filter(
    (v, i, a) => a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated longboard-news.json with", deduped.length, "items");
}

main().catch(console.error);
