import fetch from "node-fetch";
import cheerio from "cheerio";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/roller-news.json";
const UA = { headers: { "User-Agent": "Mozilla/5.0" } };

async function scrapePlanetRollerSkate() {
  try {
    const html = await (await fetch("https://planetrollerskate.com/blog/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .post").each((i, el) => {
      const title = $(el).find("h2 a, h3 a").text().trim();
      const link = $(el).find("h2 a, h3 a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();
      const date = $(el).find("time").attr("datetime") || "";

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://planetrollerskate.com${link}`,
          source: "Planet Roller Skate",
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

async function scrapeMoxi() {
  try {
    const html = await (await fetch("https://moxiskates.com/blogs/news", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .article").each((i, el) => {
      const title = $(el).find("h2, h3").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://moxiskates.com${link}`,
          source: "Moxi Skates",
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

async function scrapeReddit() {
  try {
    const json = await (await fetch("https://www.reddit.com/r/Rollerskating/new.json?limit=30", UA)).json();
    return json.data.children.map(post => {
      const p = post.data;
      return {
        title: p.title,
        url: `https://reddit.com${p.permalink}`,
        source: "Reddit r/Rollerskating",
        snippet: p.selftext?.slice(0, 200) || "",
        date: new Date(p.created_utc * 1000).toISOString()
      };
    });
  } catch {
    return [];
  }
}

async function scrapeYouTube() {
  try {
    const xml = await (await fetch("https://www.youtube.com/feeds/videos.xml?search_query=roller+skating", UA)).text();
    const items = [];

    xml.split("<entry>").slice(1).forEach(entry => {
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1]?.trim();
      const link = entry.match(/href="(.*?)"/)?.[1];
      const date = entry.match(/<published>(.*?)<\/published>/)?.[1];

      if (title && link) {
        items.push({
          title,
          url: link,
          source: "YouTube Roller Skating",
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
    ...(await scrapePlanetRollerSkate()),
    ...(await scrapeMoxi()),
    ...(await scrapeReddit()),
    ...(await scrapeYouTube())
  ];

  const deduped = all.filter(
    (v, i, a) =>
      a.findIndex(t => t.url === v.url) === i &&
      a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated roller-news.json with", deduped.length, "items");
}

main().catch(console.error);
