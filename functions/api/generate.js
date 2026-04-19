export async function onRequestPost(context) {
  try {
    // ===============================
    // AUTO-GENERATED NEWSLETTER DATA
    // (Replace with your real scrapers later)
    // ===============================

    const now = new Date();

    const newsletter = {
      dateTime: now.toLocaleString("en-US", { timeZone: "America/New_York" }),
      title: `Boardwalk Newsletter – ${now.toLocaleDateString()}`,

      paragraphs: [
        "This is an automatically generated newsletter paragraph. Replace this with real scraped content.",
        "This is the second auto-generated paragraph. Replace this with real data."
      ],

      sections: [
        { title: "Market Update", body: "Auto-generated market summary goes here." },
        { title: "Top Headlines", body: "Auto-generated headlines go here." },
        { title: "Sports", body: "Auto-generated sports summary goes here." },
        { title: "Weather", body: "Auto-generated weather summary goes here." }
      ],

      links: [
        { label: "Boardwalk Clay", url: "https://boardwalkclay.com" }
      ],

      qrCodes: [
        { label: "Portal", url: "https://boardwalkclay.com" }
      ],

      ending: "Stay sharp. Stay moving. – Boardwalk Clay",

      video: {
        type: "embed",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        placement: "bottom",
        caption: "Daily Motivation"
      },

      fontFamily: "Inter",
      paperStyle: "",
      textColor: "#f5f2e9",
      textBgColor: "#0b0906",
      showLogo: true,
      showSignature: true
    };

    // ===============================
    // RETURN JSON (REQUIRED)
    // ===============================
    return Response.json({ newsletter });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: true, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
