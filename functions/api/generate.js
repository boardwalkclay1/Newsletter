export async function onRequestPost(context) {
  // 1. RUN YOUR SCRAPERS
  // Replace these with your real scraping functions or API calls.
  const headlines = await context.env.NEWS_SCRAPER.fetch();
  const markets = await context.env.MARKET_SCRAPER.fetch();
  const sports = await context.env.SPORTS_SCRAPER.fetch();
  const weather = await context.env.WEATHER_SCRAPER.fetch();

  // 2. BUILD THE NEWSLETTER OBJECT
  const newsletter = {
    dateTime: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),

    title: `Boardwalk Newsletter – ${new Date().toLocaleDateString()}`,

    paragraphs: [
      `Here’s your morning rundown. Markets opened with ${markets.summary}.`,
      `Top story today: ${headlines.top}.`
    ],

    sections: [
      {
        title: "Market Update",
        body: markets.details
      },
      {
        title: "Top Headlines",
        body: headlines.all.join("\n\n")
      },
      {
        title: "Sports",
        body: sports.summary
      },
      {
        title: "Weather",
        body: weather.summary
      }
    ],

    links: [
      { label: "Full Market Report", url: markets.url },
      { label: "Top Headlines", url: headlines.url }
    ],

    qrCodes: [
      { label: "Boardwalk Portal", url: "https://boardwalkclay.com" }
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

  // 3. RETURN THE NEWSLETTER TO THE DASHBOARD
  return Response.json({ newsletter });
}
