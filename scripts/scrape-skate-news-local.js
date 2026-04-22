import fetch from "node-fetch";
import cheerio from "cheerio";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/skate-news-local.json";
const UA = { headers: { "User-Agent": "Mozilla/5.0" } };

async function scrapeSkateparkOrg() {
  try {
    const html = await (await fetch("https://www.skatepark.org/news/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .post, .news-item").each((i, el) => {
      const title = $(el).find("h2 a").text().trim();
      const link = $(el).find("h2 a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();
      const date = $(el).find("time").attr("datetime") || "";

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://www.skatepark.org${link}`,
          source: "Skatepark.org",
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

async function scrapeATLBlogs() {
  try {
    const html = await (await fetch("https://www.atlantaskateboarding.com/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .post").each((i, el) => {
      const title = $(el).find("h2 a, h3 a").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://www.atlantaskateboarding.com${link}`,
          source: "Atlanta Skateboarding",
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

async function scrapeRedditATL() {
  try {
    const json = await (await fetch("https://www.reddit.com/r/Atlanta/new.json?limit=30", UA)).json();
    const items = [];

    json.data.children.forEach(post => {
      const p = post.data;
      if (!/skate|skatepark|skating|board|beltline/i.test(p.title)) return;

      items.push({
        title: p.title,
        url: `https://reddit.com${p.permalink}`,
        source: "Reddit r/Atlanta",
        snippet: p.selftext?.slice(0, 200) || "",
        date: new Date(p.created_utc * 1000).toISOString()
      });
    });

    return items;
  } catch {
    return [];
  }
}

async function scrapeYouTubeATL() {
  try {
    const xml = await (await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=UC8vATLskateparks", UA)).text();
    const items = [];

    xml.split("<entry>").slice(1).forEach(entry => {
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1]?.trim();
      const link = entry.match(/href="(.*?)"/)?.[1];
      const date = entry.match(/<published>(.*?)<\/published>/)?.[1];

      if (title && link) {
        items.push({
          title,
          url: link,
          source: "YouTube ATL Skate",
          snippet: "",
          date
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
    ...(await scrapeSkateparkOrg()),
    ...(await scrapeATLBlogs()),
    ...(await scrapeRedditATL()),
    ...(await scrapeYouTubeATL())
  ];

  const deduped = all.filter(
    (v, i, a) =>
      a.findIndex(t => t.url === v.url) === i &&
      a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated skate-news-local.json with", deduped.length, "items");
}

main().catch(console.error);
