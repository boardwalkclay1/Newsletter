// scripts/saveIssue.js

import fs from "fs";
import path from "path";
import { saveJson } from "../backend/lib/saveJson.js";

export function saveIssue(issueData, html) {
  const issuesDir = "public/data/issues";
  fs.mkdirSync(issuesDir, { recursive: true });

  const id = Date.now().toString(); // unique issue ID
  const issueFolder = path.join(issuesDir, id);
  fs.mkdirSync(issueFolder, { recursive: true });

  // Save JSON + HTML
  saveJson(path.join(issueFolder, "issue.json"), issueData);
  fs.writeFileSync(path.join(issueFolder, "issue.html"), html, "utf8");

  // Update latest
  saveJson(path.join(issuesDir, "latest.json"), issueData);
  fs.writeFileSync(path.join(issuesDir, "latest.html"), html, "utf8");

  return { id, path: issueFolder };
}
