export async function onRequestPost(context) {
  try {
    // Helper to load JSON from /public/data/scraped/
    async function load(name) {
      const url = `${context.request.origin}/data/scraped/${name}.json`;
      const res = await fetch(url);
      return res.ok ? res.json() : [];
    }

    // Load scraped data
    const beltline = await load("beltline-news");
    const skateGlobal = await load("skate-news-global");
    const skateLocal = await load("skate-news-local");
    const skateNational = await load("skate-news-national");

    // Disciplines (you will add more scrapers later)
    const disciplines = {
      longboard: skateGlobal,
      rollerskate: skateLocal,
      inline: skateNational,
      bmx: skateGlobal,
      surf: skateNational,
      snowboard: skateLocal
    };

    // Pick 3 random disciplines
    const keys = Object.keys(disciplines);
    const selected = keys.sort(() => 0.5 - Math.random()).slice(0, 3);

    const disciplineSections = selected.map(key => {
      const items = disciplines[key] || [];
      const top = items[0] || {
        title: `No ${key} news available`,
        snippet: "",
        url: ""
      };

      return {
        title: key.toUpperCase(),
        body: `${top.title}\n\n${top.snippet}`,
        link: top.url
      };
    });

    // Build newsletter
    const newsletter = {
      dateTime: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
      title: "Boardwalk Newsletter – Auto Generated",

      paragraphs: [
        beltline[0]?.snippet || "No BeltLine updates available.",
        skateGlobal[0]?.snippet || "No global skate news available."
      ],

      sections: [
        {
          title: "BeltLine News",
          body: beltline[0]?.title || "No BeltLine news available."
        },
        {
          title: "Skate Global",
          body: skateGlobal[0]?.title || "No global skate news available."
        },
        {
          title: "Skate National",
          body: skateNational[0]?.title || "No national skate news available."
        },
        {
          title: "Skate Local",
          body: skateLocal[0]?.title || "No local skate news available."
        },
        ...disciplineSections.map(s => ({
          title: s.title,
          body: s.body
        }))
      ],

      links: [
        ...(beltline[0]?.url ? [{ label: "BeltLine Source", url: beltline[0].url }] : []),
        ...(skateGlobal[0]?.url ? [{ label: "Global Skate Source", url: skateGlobal[0].url }] : []),
        ...(skateNational[0]?.url ? [{ label: "National Skate Source", url: skateNational[0].url }] : []),
        ...(skateLocal[0]?.url ? [{ label: "Local Skate Source", url: skateLocal[0].url }] : [])
      ],

      qrCodes: [],

      ending: "Stay sharp. Stay moving. – Boardwalk Clay",

      video: {
        type: "none",
        url: "",
        placement: "bottom",
        caption: ""
      },

      fontFamily: "Inter",
      paperStyle: "",
      textColor: "#f5f2e9",
      textBgColor: "#0b0906",
      showLogo: true,
      showSignature: true
    };

    return Response.json({ newsletter });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
