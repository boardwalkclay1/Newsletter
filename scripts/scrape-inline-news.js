import fetch from "node-fetch";
import cheerio from "cheerio";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/inline-news.json";

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

    if (title && link && /blade|inline|skate/i.test(title)) {
      items.push({ title, url: link, source: "Be-Mag", snippet, date });
    }
  });

  return items;
}

async function scrapeOneBlading() {
  const url = "https://oneblademag.com/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article, .post").each((i, el) => {
    const title = $(el).find("h2 a, h3 a").text().trim();
    const link = $(el).find("a").attr("href");
    const snippet = $(el).find("p").first().text().trim();
    const date = $(el).find("time").attr("datetime") || "";

    if (title && link) {
      items.push({
        title,
        url: link,
        source: "OneBlading",
        snippet,
        date
      });
    }
  });

  return items;
}

async function scrapeReddit() {
  const url = "https://www.reddit.com/r/rollerblading/new.json?limit=30";
  const json = await (await fetch(url)).json();
  const items = [];

  json.data.children.forEach(post => {
    const p = post.data;
    items.push({
      title: p.title,
      url: `https://reddit.com${p.permalink}`,
      source: "Reddit r/rollerblading",
      snippet: p.selftext?.slice(0, 200) || "",
      date: new Date(p.created_utc * 1000).toISOString()
    });
  });

  return items;
}

async function scrapeYouTube() {
  const url = "https://www.youtube.com/feeds/videos.xml?search_query=inline+skating";
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
        source: "YouTube Inline",
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
    ...(await scrapeBeMag()),
    ...(await scrapeOneBlading()),
    ...(await scrapeReddit()),
    ...(await scrapeYouTube())
  ];

  const deduped = all.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);

  saveJson(OUT, deduped);
  console.log("Updated inline-news.json with", deduped.length, "items");
}

main().catch(console.error);
