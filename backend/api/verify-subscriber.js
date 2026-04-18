import { loadJson } from "../lib/loadJson.js";
import { saveJson } from "../lib/saveJson.js";

async function main() {
  try {
    // Read token from stdin
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    const token = chunks.join("").trim();

    if (!token) {
      console.log("No token provided to verification script.");
      return;
    }

    // Load subscribers
    const subs = loadJson("data/subscribers.json", []);
    if (!Array.isArray(subs)) {
      console.log("Subscriber file is not an array. Aborting.");
      return;
    }

    // Find matching subscriber
    const match = subs.find(s => s.verifyToken === token);

    if (!match) {
      console.log("No subscriber found for token:", token);
      return;
    }

    // Update subscriber
    match.verified = true;
    delete match.verifyToken;

    // Save updated list
    saveJson("data/subscribers.json", subs);

    console.log("Subscriber verified:", match.email || match.phone || match.id);

  } catch (err) {
    console.error("Verification script failed:", err);
  }
}

main();
