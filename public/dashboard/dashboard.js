// ===============================
// STATE
// ===============================
let state = {
  dateTime: "",
  title: "",
  paragraphs: [],
  sections: [],
  links: [],
  qrCodes: [],
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

// ===============================
// HELPERS
// ===============================
function $(id) {
  return document.getElementById(id);
}

function updateState() {
  state.dateTime = $("dateTime").value;
  state.title = $("title").value;

  state.paragraphs = [
    $("p1").value,
    $("p2").value
  ];

  state.video.type = $("videoType").value;
  state.video.url = $("videoUrl").value;
  state.video.placement = $("videoPlacement").value;
  state.video.caption = $("videoCaption").value;

  state.fontFamily = $("fontFamily").value;
  state.paperStyle = $("paperStyle").value;
  state.textColor = $("textColor").value;
  state.textBgColor = $("textBgColor").value;

  state.showLogo = $("showLogo").checked;
  state.showSignature = $("showSignature").checked;
}

// ===============================
// RENDER PREVIEW
// ===============================
function renderPreview() {
  updateState();

  $("previewDateTime").textContent = state.dateTime;
  $("previewTitle").textContent = state.title;

  // Paragraphs
  $("previewParagraphs").innerHTML = state.paragraphs
    .filter(p => p.trim())
    .map(p => `<p>${p}</p>`)
    .join("");

  // Sections
  $("previewSections").innerHTML = state.sections
    .map(s => `<section><h2>${s.title}</h2><p>${s.body}</p></section>`)
    .join("");

  // Links
  $("previewLinks").innerHTML = state.links
    .map(l => `<p><a href="${l.url}" target="_blank">${l.label}</a></p>`)
    .join("");

  // QR Codes
  $("previewQRCodes").innerHTML = state.qrCodes
    .map(q => `<p>${q.label}: ${q.url}</p>`)
    .join("");

  // Ending
  $("previewEnding").innerHTML = state.ending ? `<p>${state.ending}</p>` : "";

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
      <div class="video-block">
        <iframe src="${src}" allowfullscreen></iframe>
        ${state.video.caption ? `<p>${state.video.caption}</p>` : ""}
      </div>
    `;
  }

  // Logo toggle
  $("previewLogo").style.display = state.showLogo ? "block" : "none";

  // Signature toggle
  $("previewSignature").style.display = state.showSignature ? "block" : "none";

  // Styles
  $("preview").style.fontFamily = state.fontFamily;
  $("preview").style.color = state.textColor;
  $("preview").style.background = state.paperStyle || state.textBgColor;
}

// ===============================
// ADD SECTION
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

// ===============================
// ADD LINK
// ===============================
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

// ===============================
// ADD QR
// ===============================
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
// GENERATE BUTTON
// ===============================
$("generateBtn").addEventListener("click", () => {
  renderPreview();
});

// ===============================
// PUBLISH BUTTON
// ===============================
$("publishBtn").addEventListener("click", async () => {
  updateState();

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
// INITIAL PREVIEW
// ===============================
renderPreview();
