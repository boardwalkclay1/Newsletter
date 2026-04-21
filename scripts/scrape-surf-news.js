import fetch from "node-fetch";
import cheerio from "cheerio";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/surf-news.json";
const UA = { headers: { "User-Agent": "Mozilla/5.0" } };

async function scrapeSurfline() {
  try {
    const html = await (await fetch("https://www.surfline.com/surf-news", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .sl-card").each((i, el) => {
      const title = $(el).find("h2, h3").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://www.surfline.com${link}`,
          source: "Surfline",
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

async function scrapeSurfer() {
  try {
    const html = await (await fetch("https://www.surfer.com/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .post").each((i, el) => {
      const title = $(el).find("h2, h3").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();

      if (title && link) {
        items.push({
          title,
          url: link.startsWith("http") ? link : `https://www.surfer.com${link}`,
          source: "Surfer.com",
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
    const json = await (await fetch("https://www.reddit.com/r/surfing/new.json?limit=30", UA)).json();
    return json.data.children.map(post => {
      const p = post.data;
      return {
        title: p.title,
        url: `https://reddit.com${p.permalink}`,
        source: "Reddit r/surfing",
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
    const xml = await (await fetch("https://www.youtube.com/feeds/videos.xml?search_query=surfing", UA)).text();
    const items = [];

    xml.split("<entry>").slice(1).forEach(entry => {
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1]?.trim();
      const link = entry.match(/href="(.*?)"/)?.[1];
      const date = entry.match(/<published>(.*?)<\/published>/)?.[1];

      if (title && link) {
        items.push({
          title,
          url: link,
          source: "YouTube Surf",
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
    ...(await scrapeSurfline()),
    ...(await scrapeSurfer()),
    ...(await scrapeReddit()),
    ...(await scrapeYouTube())
  ];

  const deduped = all.filter(
    (v, i, a) =>
      a.findIndex(t => t.url === v.url) === i &&
      a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated surf-news.json with", deduped.length, "items");
}

main().catch(console.error);
