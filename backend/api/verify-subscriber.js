import { loadJson } from "../lib/loadJson.js";
import { saveJson } from "../lib/saveJson.js";

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const token = chunks.join("").trim();

  const subs = loadJson("data/subscribers.json", []);
  const match = subs.find(s => s.verifyToken === token);

  if (match) {
    match.verified = true;
    delete match.verifyToken;
    saveJson("data/subscribers.json", subs);
    console.log("Subscriber verified:", match.email);
  } else {
    console.log("No subscriber found for token:", token);
  }
}

main();
