// scripts/build-newsletter.js
// SUPPORTS: DRAFT MODE, LIVE MODE, AUTO-PUBLISH WITH TIME WINDOW

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import { buildNewsletterData } from "../src/mainNewsletterData.js";
import { renderNewsletter } from "../src/renderNewsletter.js";
import { saveJson } from "../backend/lib/saveJson.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Flags
const isLiveFlag = process.argv.includes("--live");
const isDraftFlag = process.argv.includes("--draft");

// Default mode = draft
let mode = isLiveFlag ? "live" : "draft";

// Load dashboard content
const dashboardPath = path.join(__dirname, "../public/data/dashboard-newsletter.json");
let manualContent = {};

if (fs.existsSync(dashboardPath)) {
  try {
    manualContent = JSON.parse(fs.readFileSync(dashboardPath, "utf8"));
    console.log("Using dashboard manual content");
  } catch (err) {
    console.error("Failed to parse dashboard content:", err);
  }
}

// AUTO-PUBLISH LOGIC
if (!isLiveFlag && !isDraftFlag) {
  if (manualContent.autoPublish) {
    const now = dayjs();
    const start = dayjs(manualContent.autoPublishStart);
    const end = dayjs(manualContent.autoPublishEnd);

    if (now.isAfter(start) && now.isBefore(end)) {
      console.log("Auto-publish window active → switching to LIVE mode");
      mode = "live";
    } else {
      console.log("Auto-publish enabled but outside allowed window → staying in DRAFT mode");
    }
  }
}

async function main() {
  console.log(`Building newsletter in ${mode.toUpperCase()} mode...`);

  const data = await buildNewsletterData({ manualContent });
  const html = renderNewsletter(data);

  const issuesDir = path.join(__dirname, "../public/data/issues");
  fs.mkdirSync(issuesDir, { recursive: true });

  // DRAFT MODE
  if (mode === "draft") {
    saveJson(path.join(issuesDir, "draft.json"), data);
    fs.writeFileSync(path.join(issuesDir, "draft.html"), html, "utf8");
    console.log("Draft written.");
  }

  // LIVE MODE
  if (mode === "live") {
    const id = Date.now().toString();
    const issueDir = path.join(issuesDir, id);
    fs.mkdirSync(issueDir, { recursive: true });

    saveJson(path.join(issueDir, "issue.json"), data);
    fs.writeFileSync(path.join(issueDir, "issue.html"), html, "utf8");

    saveJson(path.join(issuesDir, "latest.json"), data);
    fs.writeFileSync(path.join(issuesDir, "latest.html"), html, "utf8");

    console.log("Live issue published:", id);
  }

  // Cleanup dashboard file
  if (fs.existsSync(dashboardPath)) {
    fs.unlinkSync(dashboardPath);
  }

  console.log(`Newsletter build complete (${mode.toUpperCase()})`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
