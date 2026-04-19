import fetch from "node-fetch";
import cheerio from "cheerio";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/beltline-news.json";

async function scrapeBeltlineOrg() {
  const url = "https://beltline.org/news/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article, .post-item").each((i, el) => {
    const title = $(el).find("h2, .post-title").text().trim();
    const link = $(el).find("a").attr("href");
    const snippet = $(el).find("p, .post-excerpt").first().text().trim();
    const date = $(el).find("time").attr("datetime") || "";

    if (title && link) {
      items.push({
        title,
        url: link.startsWith("http") ? link : `https://beltline.org${link}`,
        source: "BeltLine.org",
        snippet,
        date
      });
    }
  });

  return items;
}

async function scrapeCurbed() {
  const url = "https://atlanta.curbed.com/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article").each((i, el) => {
    const title = $(el).find("h2 a").text().trim();
    const link = $(el).find("h2 a").attr("href");
    const snippet = $(el).find("p").first().text().trim();
    const date = $(el).find("time").attr("datetime") || "";

    if (title && link && title.includes("BeltLine")) {
      items.push({
        title,
        url: link,
        source: "Curbed Atlanta",
        snippet,
        date
      });
    }
  });

  return items;
}

async function scrapeAJC() {
  const url = "https://www.ajc.com/search/?q=beltline";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article").each((i, el) => {
    const title = $(el).find("h3, h2").text().trim();
    const link = $(el).find("a").attr("href");
    const snippet = $(el).find("p").first().text().trim();
    const date = $(el).find("time").attr("datetime") || "";

    if (title && link) {
      items.push({
        title,
        url: link.startsWith("http") ? link : `https://www.ajc.com${link}`,
        source: "AJC",
        snippet,
        date
      });
    }
  });

  return items;
}

async function scrapeReddit() {
  const url = "https://www.reddit.com/r/Atlanta/search.json?q=beltline&sort=new";
  const json = await (await fetch(url)).json();
  const items = [];

  json.data.children.forEach(post => {
    const p = post.data;
    items.push({
      title: p.title,
      url: `https://reddit.com${p.permalink}`,
      source: "Reddit r/Atlanta",
      snippet: p.selftext?.slice(0, 200) || "",
      date: new Date(p.created_utc * 1000).toISOString()
    });
  });

  return items;
}

async function main() {
  const existing = loadJson(OUT, []);

  const all = [
    ...(await scrapeBeltlineOrg()),
    ...(await scrapeCurbed()),
    ...(await scrapeAJC()),
    ...(await scrapeReddit())
  ];

  const deduped = all.filter(
    (v, i, a) => a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated beltline-news.json with", deduped.length, "items");
}

main().catch(console.error);
