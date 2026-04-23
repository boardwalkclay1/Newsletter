// ===============================
// STATE
// ===============================
let state = {
  dateTime: "",
  title: "",
  paragraphs: ["", ""],
  sections: [],
  links: [],
  qrCodes: [],
  ending: "",
  video: {
    type: "none",
    url: "",
    placement: "top",
    caption: ""
  },
  fontFamily: "",
  paperStyle: "",
  textColor: "#2b1b0f",
  textBgColor: "#fdf5e6",
  showLogo: true,
  showSignature: true
};

const $ = id => document.getElementById(id);

// ===============================
// LIVE BINDING HELPERS
// ===============================
function bindInput(id, setter) {
  const el = $(id);
  if (!el) return;
  el.addEventListener("input", () => {
    setter(el.value);
    renderPreview();
  });
}

function bindCheckbox(id, setter) {
  const el = $(id);
  if (!el) return;
  el.addEventListener("change", () => {
    setter(el.checked);
    renderPreview();
  });
}

function bindSelect(id, setter) {
  const el = $(id);
  if (!el) return;
  el.addEventListener("change", () => {
    setter(el.value);
    renderPreview();
  });
}

// ===============================
// RENDER PREVIEW
// ===============================
function renderPreview() {
  $("previewDateTime").textContent = state.dateTime;
  $("previewTitle").textContent = state.title;

  $("previewParagraphs").innerHTML = state.paragraphs
    .filter(p => p.trim())
    .map(p => `<p class="bw-paragraph">${p}</p>`)
    .join("");

  $("previewSections").innerHTML = state.sections
    .map(s => `
      <section class="bw-section">
        <h2 class="bw-section-title">${s.title || ""}</h2>
        <p class="bw-paragraph">${s.body || ""}</p>
      </section>
    `)
    .join("");

  $("previewLinks").innerHTML = state.links.length
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

  $("previewQRCodes").innerHTML = state.qrCodes.length
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

  $("previewEnding").innerHTML = state.ending
    ? `<p class="bw-paragraph">${state.ending}</p>`
    : "";

  // Video
  if (state.video.type === "none" || !state.video.url.trim()) {
    $("previewVideo").innerHTML = "";
  } else {
    let src = state.video.url.trim();
    if (src.includes("youtube.com/watch")) {
      const id = new URL(src).searchParams.get("v");
      if (id) src = `https://www.youtube.com/embed/${id}`;
    }
    $("previewVideo").innerHTML = `
      <div class="bw-video">
        <iframe src="${src}" allowfullscreen></iframe>
        ${state.video.caption ? `<div class="bw-video-caption">${state.video.caption}</div>` : ""}
      </div>
    `;
  }

  $("previewLogo").style.display = state.showLogo ? "block" : "none";
  $("previewSignature").style.display = state.showSignature ? "block" : "none";

  const preview = $("preview");
  preview.style.fontFamily = state.fontFamily || "inherit";
  preview.style.color = state.textColor;
  preview.style.background = state.textBgColor;
}

// ===============================
// FORM BINDINGS
// ===============================
function initBindings() {
  bindInput("dateTime", v => (state.dateTime = v));
  bindInput("title", v => (state.title = v));

  bindInput("p1", v => (state.paragraphs[0] = v));
  bindInput("p2", v => (state.paragraphs[1] = v));

  bindInput("ending", v => (state.ending = v));

  bindSelect("videoType", v => (state.video.type = v));
  bindInput("videoUrl", v => (state.video.url = v));
  bindSelect("videoPlacement", v => (state.video.placement = v));
  bindInput("videoCaption", v => (state.video.caption = v));

  bindSelect("fontFamily", v => (state.fontFamily = v));
  bindSelect("paperStyle", v => (state.paperStyle = v));
  bindInput("textColor", v => (state.textColor = v));
  bindInput("textBgColor", v => (state.textBgColor = v));

  bindCheckbox("showLogo", v => (state.showLogo = v));
  bindCheckbox("showSignature", v => (state.showSignature = v));
}

// ===============================
// DYNAMIC BLOCKS
// ===============================
$("addSectionBtn").addEventListener("click", () => {
  const index = state.sections.length;
  state.sections.push({ title: "", body: "" });

  const div = document.createElement("div");
  div.className = "section-block";
  div.innerHTML = `
    <input class="section-title" placeholder="Section Title">
    <textarea class="section-body" placeholder="Section Body"></textarea>
  `;
  $("sectionsContainer").appendChild(div);

  div.querySelector(".section-title").addEventListener("input", e => {
    state.sections[index].title = e.target.value;
    renderPreview();
  });

  div.querySelector(".section-body").addEventListener("input", e => {
    state.sections[index].body = e.target.value;
    renderPreview();
  });
});

$("addLinkBtn").addEventListener("click", () => {
  const index = state.links.length;
  state.links.push({ label: "", url: "" });

  const div = document.createElement("div");
  div.className = "link-block";
  div.innerHTML = `
    <input class="link-label" placeholder="Label">
    <input class="link-url" placeholder="URL">
  `;
  $("linksContainer").appendChild(div);

  div.querySelector(".link-label").addEventListener("input", e => {
    state.links[index].label = e.target.value;
    renderPreview();
  });

  div.querySelector(".link-url").addEventListener("input", e => {
    state.links[index].url = e.target.value;
    renderPreview();
  });
});

$("addQrBtn").addEventListener("click", () => {
  const index = state.qrCodes.length;
  state.qrCodes.push({ label: "", url: "" });

  const div = document.createElement("div");
  div.className = "qr-block";
  div.innerHTML = `
    <input class="qr-label" placeholder="Label">
    <input class="qr-url" placeholder="URL">
  `;
  $("qrContainer").appendChild(div);

  div.querySelector(".qr-label").addEventListener("input", e => {
    state.qrCodes[index].label = e.target.value;
    renderPreview();
  });

  div.querySelector(".qr-url").addEventListener("input", e => {
    state.qrCodes[index].url = e.target.value;
    renderPreview();
  });
});

// ===============================
// GENERATE BUTTON (GITHUB DISPATCH)
// ===============================
$("generateBtn").addEventListener("click", async () => {
  await fetch("/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "build_newsletter",
      payload: state
    })
  });

  alert("Newsletter generation triggered.");
});

// ===============================
// PUBLISH BUTTON (GITHUB DISPATCH)
// ===============================
$("publishBtn").addEventListener("click", async () => {
  await fetch("/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "build_newsletter",
      payload: state
    })
  });

  alert("Newsletter published.");
});

// ===============================
// INIT
// ===============================
initBindings();
renderPreview();
