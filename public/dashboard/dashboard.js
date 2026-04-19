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

  // Toggles
  $("previewLogo").style.display = state.showLogo ? "block" : "none";
  $("previewSignature").style.display = state.showSignature ? "block" : "none";

  // Style
  const preview = $("preview");
  preview.style.fontFamily = state.fontFamily || "inherit";
  preview.style.color = state.textColor;
  preview.style.background = state.textBgColor;
}

// ===============================
// FORM BINDINGS (LIVE AS YOU TYPE)
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
// DYNAMIC BLOCKS (SECTIONS / LINKS / QR)
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

  const titleInput = div.querySelector(".section-title");
  const bodyInput = div.querySelector(".section-body");

  titleInput.addEventListener("input", () => {
    state.sections[index].title = titleInput.value;
    renderPreview();
  });

  bodyInput.addEventListener("input", () => {
    state.sections[index].body = bodyInput.value;
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

  const labelInput = div.querySelector(".link-label");
  const urlInput = div.querySelector(".link-url");

  labelInput.addEventListener("input", () => {
    state.links[index].label = labelInput.value;
    renderPreview();
  });

  urlInput.addEventListener("input", () => {
    state.links[index].url = urlInput.value;
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

  const labelInput = div.querySelector(".qr-label");
  const urlInput = div.querySelector(".qr-url");

  labelInput.addEventListener("input", () => {
    state.qrCodes[index].label = labelInput.value;
    renderPreview();
  });

  urlInput.addEventListener("input", () => {
    state.qrCodes[index].url = urlInput.value;
    renderPreview();
  });
});

// ===============================
// GENERATE BUTTON = AUTO GENERATOR
// ===============================
$("generateBtn").addEventListener("click", async () => {
  // CALL YOUR AUTO-GENERATOR PIPELINE HERE
  // Adjust URL/action to match your backend
  const res = await fetch("/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "auto_generate_newsletter"
    })
  });

  const data = await res.json();
  // Expecting `data.newsletter` to be the full object

  const n = data.newsletter || {};

  // Fill state
  state.dateTime = n.dateTime || "";
  state.title = n.title || "";
  state.paragraphs = n.paragraphs || ["", ""];
  state.sections = n.sections || [];
  state.links = n.links || [];
  state.qrCodes = n.qrCodes || [];
  state.ending = n.ending || "";
  state.video = n.video || state.video;
  state.fontFamily = n.fontFamily || state.fontFamily;
  state.paperStyle = n.paperStyle || state.paperStyle;
  state.textColor = n.textColor || state.textColor;
  state.textBgColor = n.textBgColor || state.textBgColor;
  state.showLogo = n.showLogo ?? state.showLogo;
  state.showSignature = n.showSignature ?? state.showSignature;

  // Push into form fields so UI matches
  $("dateTime").value = state.dateTime;
  $("title").value = state.title;
  $("p1").value = state.paragraphs[0] || "";
  $("p2").value = state.paragraphs[1] || "";
  $("ending").value = state.ending || "";

  $("videoType").value = state.video.type;
  $("videoUrl").value = state.video.url || "";
  $("videoPlacement").value = state.video.placement || "top";
  $("videoCaption").value = state.video.caption || "";

  $("fontFamily").value = state.fontFamily;
  $("paperStyle").value = state.paperStyle;
  $("textColor").value = state.textColor;
  $("textBgColor").value = state.textBgColor;
  $("showLogo").checked = state.showLogo;
  $("showSignature").checked = state.showSignature;

  // Rebuild dynamic blocks (sections/links/qr) if you want full sync
  // For now, just re-render preview:
  renderPreview();
});

// ===============================
// PUBLISH BUTTON
// ===============================
$("publishBtn").addEventListener("click", async () => {
  // state is already live-bound
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
