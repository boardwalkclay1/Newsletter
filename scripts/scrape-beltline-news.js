import fetch from "node-fetch";
import cheerio from "cheerio";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/beltline-news.json";
const UA = { headers: { "User-Agent": "Mozilla/5.0" } };

async function scrapeBeltlineOrg() {
  try {
    const html = await (await fetch("https://beltline.org/news/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article, .post-item").each((i, el) => {
      const title = $(el).find("h2, .post-title").text().trim();
      const link = $(el).find("a").attr("href") || "";
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
  } catch {
    return [];
  }
}

async function scrapeCurbed() {
  try {
    const html = await (await fetch("https://atlanta.curbed.com/", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article").each((i, el) => {
      const title = $(el).find("h2 a").text().trim();
      const link = $(el).find("h2 a").attr("href") || "";
      const snippet = $(el).find("p").first().text().trim();
      const date = $(el).find("time").attr("datetime") || "";

      if (title && link && /beltline/i.test(title)) {
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
  } catch {
    return [];
  }
}

async function scrapeAJC() {
  try {
    const html = await (await fetch("https://www.ajc.com/search/?q=beltline", UA)).text();
    const $ = cheerio.load(html);
    const items = [];

    $("article").each((i, el) => {
      const title = $(el).find("h3, h2").text().trim();
      const link = $(el).find("a").attr("href") || "";
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
  } catch {
    return [];
  }
}

async function scrapeReddit() {
  try {
    const json = await (await fetch("https://www.reddit.com/r/Atlanta/search.json?q=beltline&sort=new", UA)).json();
    return json.data.children.map(post => {
      const p = post.data;
      return {
        title: p.title,
        url: `https://reddit.com${p.permalink}`,
        source: "Reddit r/Atlanta",
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
    ...(await scrapeBeltlineOrg()),
    ...(await scrapeCurbed()),
    ...(await scrapeAJC()),
    ...(await scrapeReddit())
  ];

  const deduped = all.filter(
    (v, i, a) =>
      a.findIndex(t => t.url === v.url) === i &&
      a.findIndex(t => t.title === v.title) === i
  );

  saveJson(OUT, deduped);
  console.log("Updated beltline-news.json with", deduped.length, "items");
}

main().catch(console.error);
