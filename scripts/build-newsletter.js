// scripts/build-newsletter.js

import fs from "fs";
import path from "path";
import { buildNewsletterData } from "../src/mainNewsletterData.js";
import { renderNewsletter } from "../src/renderNewsletter.js";
import { saveJson } from "../backend/lib/saveJson.js";

async function main() {
  console.log("Building newsletter...");

  // Load manual content if dashboard provided it
  const dashboardPath = "public/data/dashboard-newsletter.json";
  let manualContent = {};

  if (fs.existsSync(dashboardPath)) {
    try {
      manualContent = JSON.parse(fs.readFileSync(dashboardPath, "utf8"));
      console.log("Using dashboard manual content");
    } catch (err) {
      console.error("Failed to parse dashboard content:", err);
    }
  }

  // Build data + HTML
  const data = await buildNewsletterData({ manualContent });
  const html = renderNewsletter(data);

  // Issue ID
  const id = Date.now().toString();
  const issueDir = path.join("public/data/issues", id);
  fs.mkdirSync(issueDir, { recursive: true });

  // Save JSON + HTML
  saveJson(path.join(issueDir, "issue.json"), data);
  fs.writeFileSync(path.join(issueDir, "issue.html"), html, "utf8");

  // Update latest
  saveJson("public/data/issues/latest.json", data);
  fs.writeFileSync("public/data/issues/latest.html", html, "utf8");

  // Cleanup dashboard file
  if (fs.existsSync(dashboardPath)) {
    fs.unlinkSync(dashboardPath);
  }

  console.log("Newsletter built:", id);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
