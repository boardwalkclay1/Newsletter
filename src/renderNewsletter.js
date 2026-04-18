export function renderNewsletter(state) {
  // PAPER BACKGROUND (supports full URLs)
  const paperBackground = state.paperStyle
    ? `url('${state.paperStyle}')`
    : state.textBgColor;

  // VIDEO BLOCK
  function buildVideo() {
    if (!state.video || state.video.type === "none" || !state.video.url) return "";

    let src = state.video.url.trim();

    // Convert YouTube watch → embed
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

  // LINKS
  const linksHtml = state.links?.length
    ? `
      <section class="bw-links">
        <h3>Links & Portals</h3>
        <ul>
          ${state.links
            .filter(l => l.url)
            .map(l => `<li><a href="${l.url}" target="_blank">${l.label || l.url}</a></li>`)
            .join("")}
        </ul>
      </section>
    `
    : "";

  // QR CODES
  const qrHtml = state.qrCodes?.length
    ? `
      <section class="bw-links">
        <h3>QR Codes</h3>
        <ul>
          ${state.qrCodes
            .filter(q => q.url)
            .map(q => `<li>${q.label || ""} – ${q.url}</li>`)
            .join("")}
        </ul>
      </section>
    `
    : "";

  // SECTIONS
  const sectionsHtml = state.sections
    ?.filter(s => s.title || s.body)
    .map(
      s => `
      <section class="bw-section">
        <h2>${s.title}</h2>
        <p>${s.body}</p>
      </section>
    `
    )
    .join("") || "";

  // PARAGRAPHS
  const paragraphsHtml = state.paragraphs
    ?.filter(p => p.trim())
    .map(p => `<p class="bw-paragraph">${p}</p>`)
    .join("") || "";

  // VIDEO PLACEMENT
  const videoTop = state.video?.placement === "top" ? buildVideo() : "";
  const videoBottom = state.video?.placement === "bottom" ? buildVideo() : "";

  // SIGNATURE
  const signatureHtml = state.showSignature
    ? `<div class="bw-signature">Boardwalk Clay</div>`
    : "";

  // LOGO
  const logoHtml = state.showLogo
    ? `<img src="/assets/logo-boardwalk.png" class="bw-logo">`
    : "";

  // FINAL HTML
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${state.title || "Boardwalk Newsletter"}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Google Font -->
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(state.fontFamily)}&display=swap" rel="stylesheet">

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
    .bw-links ul { padding-left: 1.2rem; }
    .bw-video iframe { width: 100%; height: 315px; border: none; }
    .bw-signature { margin-top: 3rem; font-size: 1.4rem; text-align: right; }
  </style>
</head>

<body>

  ${logoHtml}

  <h1 class="bw-title">${state.title}</h1>
  <div class="bw-date">${state.dateTime}</div>

  ${videoTop}
  ${paragraphsHtml}
  ${sectionsHtml}
  ${linksHtml}
  ${qrHtml}

  ${state.ending ? `<p class="bw-paragraph">${state.ending}</p>` : ""}

  ${videoBottom}
  ${signatureHtml}

</body>
</html>
`;
}
