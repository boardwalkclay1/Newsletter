import fetch from "node-fetch";
import cheerio from "cheerio";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/skate-news-global.json";
const UA = { headers: { "User-Agent": "Mozilla/5.0" } };

async function scrapeSkateNewsWire() {
  try {
    const html = await (await fetch("https://skatenewswire.com/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $(".jeg_post").each((i, el) => {
      const title = $(el).find(".jeg_post_title a").text().trim();
      const link = $(el).find(".jeg_post_title a").attr("href") || "";
      const snippet = $(el).find(".jeg_post_excerpt").text().trim();
      const date = $(el).find("time").attr("datetime") || "";

      if (title && link) {
        items.push({
          title,
          url: link,
          source: "SkateNewsWire",
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

async function scrapeBeMag() {
  try {
    const html = await (await fetch("https://be-mag.com/", UA)).text();
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
          url: link.startsWith("http") ? link : `https://be-mag.com${link}`,
          source: "Be-Mag",
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

async function scrapeReddit() {
  try {
    const json = await (await fetch("https://www.reddit.com/r/skateboarding/new.json?limit=20", UA)).json();
    return json.data.children.map(post => {
      const p = post.data;
      return {
        title: p.title,
        url: `https://reddit.com${p.permalink}`,
        source: "Reddit r/skateboarding",
        snippet: p.selftext?.slice(0, 200) || "",
        date: new Date(p.created_utc * 1000).toISOString()
      };
    });
  } catch {
    return [];
  }
}

async function main() {
  const all = [
    ...(await scrapeSkateNewsWire()),
    ...(await scrapeBeMag()),
    ...(await scrapeJenkem()),
    ...(await scrapeThrasher()),
    ...(await scrapeReddit())
  ];

  const deduped = all.filter(
    (v, i, a) =>
      a.findIndex(t => t.url === v.url) === i &&
      a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated skate-news-global.json with", deduped.length, "items");
}

main().catch(console.error);
