import fetch from "node-fetch";
import cheerio from "cheerio";
import { loadJson } from "../backend/lib/loadJson.js";
import { saveJson } from "../backend/lib/saveJson.js";

const OUT = "public/data/scraped/snow-news.json";

async function scrapeSnowboarder() {
  const url = "https://www.snowboarder.com/";
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
        source: "Snowboarder.com",
        snippet,
        date: ""
      });
    }
  });

  return items;
}

async function scrapeWhitelines() {
  const url = "https://whitelines.com/";
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const items = [];

  $("article, .post").each((i, el) => {
    const title = $(el).find("h2, h3").text().trim();
    const link = $(el).find("a").attr("href");
    const snippet = $(el).find("p").first().text().trim
