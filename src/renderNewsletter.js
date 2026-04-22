// src/renderNewsletter.js

export function renderNewsletter(state) {
  const paperBackground = state.paperStyle
    ? `url('${state.paperStyle}')`
    : state.textBgColor;

  function buildVideo() {
    if (!state.video || state.video.type === "none" || !state.video.url) return "";

    let src = state.video.url.trim();

    if (src.includes("youtube.com/watch")) {
      const id = new URL(src).searchParams.get("v");
      if (id) src = `https://www.youtube.com/embed/${id}`;
    }

    return `
      <div class="bw-video">
        <iframe src="${src}" allowfullscreen></iframe>
        ${state.video.caption ? `<div class="bw-video-caption">${state.video.caption}</div>` : ""}
      </div>
    `;
  }

  function buildScrapedSection(title, items) {
    if (!items || !items.length) return "";
    return `
      <section class="bw-section">
        <h2>${title}</h2>
        <ul>
          ${items
            .map(
              i => `
            <li>
              <a href="${i.url}" target="_blank">${i.title}</a>
              ${i.source ? `<span class="bw-source">(${i.source})</span>` : ""}
            </li>`
            )
            .join("")}
        </ul>
      </section>
    `;
  }

  const scrapedHtml = `
    ${buildScrapedSection("Local Skate News", state.skateLocal)}
    ${buildScrapedSection("National Skate News", state.skateNational)}
    ${buildScrapedSection("Global Skate News", state.skateGlobal)}
    ${buildScrapedSection("BMX News", state.bmx)}
    ${buildScrapedSection("Inline Skating News", state.inline)}
    ${buildScrapedSection("Roller Skating News", state.roller)}
    ${buildScrapedSection("Surf News", state.surf)}
    ${buildScrapedSection("Snow News", state.snow)}
    ${buildScrapedSection("Longboard News", state.longboard)}
    ${buildScrapedSection("BeltLine News", state.beltline)}
  `;

  const paragraphsHtml = (state.paragraphs || [])
    .map(p => `<p class="bw-paragraph">${p}</p>`)
    .join("");

  const sectionsHtml = (state.sections || [])
    .map(
      s => `
      <section class="bw-section">
        <h2>${s.title}</h2>
        <p>${s.body}</p>
      </section>
    `
    )
    .join("");

  const linksHtml = (state.links || []).length
    ? `
      <section class="bw-section">
        <h2>Links</h2>
        <ul>
          ${state.links
            .map(l => `<li><a href="${l.url}" target="_blank">${l.label || l.url}</a></li>`)
            .join("")}
        </ul>
      </section>
    `
    : "";

  const qrHtml = (state.qrCodes || []).length
    ? `
      <section class="bw-section">
        <h2>QR Codes</h2>
        <ul>
          ${state.qrCodes
            .map(q => `<li>${q.label || ""} – ${q.url}</li>`)
            .join("")}
        </ul>
      </section>
    `
    : "";

  const videoTop = state.video?.placement === "top" ? buildVideo() : "";
  const videoBottom = state.video?.placement === "bottom" ? buildVideo() : "";

  const signatureHtml = state.showSignature
    ? `<div class="bw-signature">Boardwalk Clay</div>`
    : "";

  const logoHtml = state.showLogo
    ? `<img src="/assets/logo-boardwalk.png" class="bw-logo">`
    : "";

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${state.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    state.fontFamily
  )}&display=swap" rel="stylesheet">

  <style>
    body {
      margin: 0;
      font-family: '${state.fontFamily}', serif;
      background: ${paperBackground};
      background-size: cover;
      background-repeat: repeat;
      padding: 2rem;
      color: ${state.textColor};
    }

    .bw-logo { width: 140px; display: block; margin: 0 auto 1rem; }
    .bw-title { text-align: center; font-size: 2rem; margin-bottom: 1rem; }
    .bw-paragraph { margin: 1rem 0; line-height: 1.6; }
    .bw-section { margin: 2rem 0; }
    .bw-section h2 { margin-bottom: 0.5rem; }
    .bw-section ul { padding-left: 1.2rem; }
    .bw-video iframe { width: 100%; height: 315px; border: none; }
    .bw-signature { margin-top: 3rem; font-size: 1.4rem; text-align: right; }
    .bw-source { color: #777; font-size: 0.9rem; margin-left: 4px; }
  </style>
</head>

<body>

  ${logoHtml}

  <h1 class="bw-title">${state.title}</h1>
  <div class="bw-date">${state.dateTime}</div>

  ${videoTop}
  ${paragraphsHtml}
  ${sectionsHtml}

  ${scrapedHtml}

  ${linksHtml}
  ${qrHtml}

  ${state.ending ? `<p class="bw-paragraph">${state.ending}</p>` : ""}

  ${videoBottom}
  ${signatureHtml}

</body>
</html>
`;
}
