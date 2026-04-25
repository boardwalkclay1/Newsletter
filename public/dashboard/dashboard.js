// ===============================
// LOAD NEWSLETTER (DRAFT FIRST, THEN LATEST)
// ===============================
async function loadNewsletter() {
  try {
    // Try DRAFT first
    let res = await fetch("/data/issues/draft.json", { cache: "no-store" });

    if (res.ok) {
      const text = await res.text();
      if (text.trim()) {
        const data = JSON.parse(text);
        state = { ...state, ...data };
        renderPreview();
        console.log("Loaded draft.json");
        return;
      }
    }

    console.warn("No valid draft.json found. Trying latest.json...");

    // Try LATEST next
    res = await fetch("/data/issues/latest.json", { cache: "no-store" });

    if (res.ok) {
      const text = await res.text();
      if (text.trim()) {
        const data = JSON.parse(text);
        state = { ...state, ...data };
        renderPreview();
        console.log("Loaded latest.json");
        return;
      }
    }

    console.warn("No valid latest.json found. Starting with blank state.");

  } catch (err) {
    console.error("Error loading newsletter:", err);
  }
}
