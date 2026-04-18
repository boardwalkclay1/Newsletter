// ===============================
// STATE
// ===============================
const state = {
  dateTime: new Date().toLocaleString(),
  title: "",
  paragraphs: ["", ""],
  sections: [],
  ending: "",
  links: [],
  qrCodes: [],
  video: {
    type: "none",
    url: "",
    placement: "top",
    caption: ""
  },
  fontFamily: "Great Vibes",
  paperStyle: "",
  textColor: "#2b1b0f",
  textBgColor: "#fdf5e6",
  showLogo: true,
  showSignature: true,
  ribbonStyle: "red"
};

// ===============================
// PAPER + FONT OPTIONS
// ===============================
const PAPER_STYLES = {
  "": "",
  "Parchment 1": "https://i.imgur.com/8pQJY8G.jpeg",
  "Parchment 2": "https://i.imgur.com/0m3Yw8k.jpeg",
  "Parchment 3": "https://i.imgur.com/1YQk0qG.jpeg",
  "Old Book Page": "https://i.imgur.com/8m1uQ0T.jpeg",
  "Cream Texture": "https://i.imgur.com/4z0tq1N.jpeg",
  "Antique Rough": "https://i.imgur.com/7Yp8m4x.jpeg",
  "Warm Tan": "https://i.imgur.com/2uX8p9F.jpeg",
  "Ivory Smooth": "https://i.imgur.com/3Qe1t8K.jpeg",
  "Burnt Edge": "https://i.imgur.com/5rY8k2S.jpeg",
  "Handmade Fiber": "https://i.imgur.com/9cW8t1L.jpeg"
};

const FONT_STYLES = [
  "Great Vibes",
  "Playfair Display",
  "Cormorant Garamond",
  "Lora",
  "Merriweather",
  "Dancing Script",
  "Cinzel",
  "Marcellus SC",
  "Uncial Antiqua",
  "Lobster",
  "Inter",
  "Montserrat",
  "Poppins",
  "Roboto Slab",
  "Crimson Text",
  "Spectral",
  "Alegreya",
  "Old Standard TT",
  "Tangerine",
  "Arizonia"
];

// ===============================
// ELEMENT REFERENCES
// ===============================
const previewDateTime = document.getElementById("previewDateTime");
const previewTitle = document.getElementById("previewTitle");
const previewParagraphs = document.getElementById("previewParagraphs");
const previewSections = document.getElementById("previewSections");
const previewLinks = document.getElementById("previewLinks");
const previewQRCodes = document.getElementById("previewQRCodes");
const previewEnding = document.getElementById("previewEnding");
const previewVideo = document.getElementById("previewVideo");
const previewSignature = document.getElementById("previewSignature");
const previewLogo = document.getElementById("previewLogo");
const previewBody = document.getElementById("previewBody");

// ===============================
// BUILD PAPER + FONT SELECTORS
// ===============================
function buildSelectors() {
  const paperSelect = document.getElementById("paperStyle");
  const fontSelect = document.getElementById("fontFamily");

  // Paper styles
  Object.entries(PAPER_STYLES).forEach(([label, url]) => {
    const opt = document.createElement("option");
    opt.value = url;
    opt.textContent = label || "Clean / None";
    paperSelect.appendChild(opt);
  });

  // Fonts
  FONT_STYLES.forEach(font => {
    const opt = document.createElement("option");
    opt.value = font;
    opt.textContent = font;
    fontSelect.appendChild(opt);
  });
}

// ===============================
// BASIC FIELD BINDINGS
// ===============================
function bindBasicFields() {
  document.getElementById("dateTime").value = state.dateTime;

  const bind = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      state[key] = e.target.value;
      renderPreview();
    });
  };

  bind("dateTime", "dateTime");
  bind("title", "title");

  document.getElementById("p1").addEventListener("input", (e) => {
    state.paragraphs[0] = e.target.value;
    renderPreview();
  });

  document.getElementById("p2").addEventListener("input", (e) => {
    state.paragraphs[1] = e.target.value;
    renderPreview();
  });

  document.getElementById("ending").addEventListener("input", (e) => {
    state.ending = e.target.value;
    renderPreview();
  });

  // Paper style
  document.getElementById("paperStyle").addEventListener("change", (e) => {
    state.paperStyle = e.target.value;
    renderPreview();
  });

  // Font style
  document.getElementById("fontFamily").addEventListener("change", (e) => {
    state.fontFamily = e.target.value;
    renderPreview();
  });

  // Colors
  document.getElementById("textColor").addEventListener("input", (e) => {
    state.textColor = e.target.value;
    renderPreview();
  });

  document.getElementById("textBgColor").addEventListener("input", (e) => {
    state.textBgColor = e.target.value;
    renderPreview();
  });

  // Toggles
  document.getElementById("showLogo").addEventListener("change", (e) => {
    state.showLogo = e.target.checked;
    renderPreview();
  });

  document.getElementById("showSignature").addEventListener("change", (e) => {
    state.showSignature = e.target.checked;
    renderPreview();
  });

  // Video
  document.getElementById("videoType").addEventListener("change", (e) => {
    state.video.type = e.target.value;

    document.getElementById("videoUrlField").style.display =
      state.video.type === "embed" ? "block" : "none";

    document.getElementById("videoUploadField").style.display =
      state.video.type === "upload" ? "block" : "none";

    renderPreview();
  });

  document.getElementById("videoUrl").addEventListener("input", (e) => {
    state.video.url = e.target.value;
    renderPreview();
  });

  document.getElementById("videoFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      state.video.url = URL.createObjectURL(file);
      renderPreview();
    }
  });

  document.getElementById("videoPlacement").addEventListener("change", (e) => {
    state.video.placement = e.target.value;
    renderPreview();
  });

  document.getElementById("videoCaption").addEventListener("input", (e) => {
    state.video.caption = e.target.value;
    renderPreview();
  });

  // Publish button
  document.getElementById("publishBtn").addEventListener("click", () => {
    triggerAction("build_newsletter", { newsletter: state });
  });
}

// ===============================
// ESCAPE HTML
// ===============================
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ===============================
// VIDEO HTML
// ===============================
function buildVideoHtml() {
  if (state.video.type === "none" || !state.video.url) return "";

  if (state.video.type === "embed") {
    let src = state.video.url.trim();
    if (src.includes("youtube.com/watch")) {
      const id = new URL(src).searchParams.get("v");
      if (id) src = `https://www.youtube.com/embed/${id}`;
    }

    return `
      <div class="bw-video">
        <iframe src="${escapeHtml(src)}" allowfullscreen></iframe>
        ${state.video.caption ? `<div class="bw-video-caption">${escapeHtml(state.video.caption)}</div>` : ""}
      </div>
    `;
  }

  if (state.video.type === "upload") {
    return `
      <div class="bw-video">
        <video controls>
          <source src="${escapeHtml(state.video.url)}" type="video/mp4">
        </video>
        ${state.video.caption ? `<div class="bw-video-caption">${escapeHtml(state.video.caption)}</div>` : ""}
      </div>
    `;
  }

  return "";
}

// ===============================
// PAPER BACKGROUND
// ===============================
function getPaperBackground() {
  if (!state.paperStyle) {
    return state.textBgColor;
  }
  return `url('${state.paperStyle}')`;
}

// ===============================
// RENDER PREVIEW
// ===============================
function renderPreview() {
  previewDateTime.textContent = state.dateTime;
  previewLogo.style.display = state.showLogo ? "block" : "none";

  previewTitle.textContent = state.title || "Boardwalk Newsletter";

  previewBody.style.background = getPaperBackground();
  previewBody.style.color = state.textColor;
  previewBody.style.fontFamily = `'${state.fontFamily}', serif`;

  previewParagraphs.innerHTML = state.paragraphs
    .filter((p) => p.trim())
    .map((p) => `<p class="bw-paragraph indent">${escapeHtml(p)}</p>`)
    .join("");

  previewSections.innerHTML = state.sections
    .filter((s) => s.title || s.body)
    .map(
      (s) => `
      <section class="bw-section">
        <h2 class="bw-section-title">${escapeHtml(s.title)}</h2>
        <p class="bw-paragraph indent">${escapeHtml(s.body)}</p>
      </section>
    `
    )
    .join("");

  previewLinks.innerHTML = state.links.length
    ? `
      <section class="bw-links">
        <h3 class="bw-section-title">Links & Portals</h3>
        <ul>
          ${state.links
            .filter((l) => l.url)
            .map(
              (l) =>
                `<li><a href="${escapeHtml(l.url)}" target="_blank">${escapeHtml(
                  l.label || l.url
                )}</a></li>`
            )
            .join("")}
        </ul>
      </section>
    `
    : "";

  previewQRCodes.innerHTML = state.qrCodes.length
    ? `
      <section class="bw-links">
        <h3 class="bw-section-title">QR Codes</h3>
        <ul>
          ${state.qrCodes
            .filter((q) => q.url)
            .map(
              (q) =>
                `<li>${escapeHtml(q.label || "")} – ${escapeHtml(q.url)}</li>`
            )
            .join("")}
        </ul>
      </section>
    `
    : "";

  previewEnding.innerHTML = state.ending
    ? `<section class="bw-signoff"><p class="bw-paragraph indent">${escapeHtml(
        state.ending
      )}</p></section>`
    : "";

  previewVideo.innerHTML = buildVideoHtml();

  previewSignature.style.display = state.showSignature ? "block" : "none";
}

// ===============================
// PUBLISH ACTION (CLOUDFLARE FUNCTION)
// ===============================
async function triggerAction(action, payload = {}) {
  await fetch("/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload })
  });

  alert(`Triggered: ${action}`);
}

// ===============================
// INIT
// ===============================
buildSelectors();
bindBasicFields();
renderPreview();
