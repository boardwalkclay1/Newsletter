// ===============================
// DASHBOARD STATE
// ===============================
const state = {
  dateTime: new Date().toLocaleString(),
  title: '',
  paragraphs: ['', ''],
  sections: [],
  ending: '',
  links: [],
  qrCodes: [],
  video: {
    type: 'none',
    url: '',
    placement: 'top',
    caption: '',
  },
  theme: 'old-scroll',

  // NEW FONT FAMILY SYSTEM
  fontFamily: 'Great Vibes',

  textColor: '#2b1b0f',
  textBgColor: '#fdf5e6',
  showLogo: true,
  showSignature: true,
};

// ===============================
// ELEMENTS
// ===============================
const previewEl = document.getElementById('preview');
const sectionsContainer = document.getElementById('sectionsContainer');
const linksContainer = document.getElementById('linksContainer');
const qrContainer = document.getElementById('qrContainer');

document.getElementById('dateTime').value = state.dateTime;

// ===============================
// BASIC FIELD BINDINGS
// ===============================
function bindBasicFields() {
  const bind = (id, key) => {
    document.getElementById(id).addEventListener('input', e => {
      state[key] = e.target.value;
      renderPreview();
    });
  };

  bind('dateTime', 'dateTime');
  bind('title', 'title');

  document.getElementById('p1').addEventListener('input', e => {
    state.paragraphs[0] = e.target.value;
    renderPreview();
  });

  document.getElementById('p2').addEventListener('input', e => {
    state.paragraphs[1] = e.target.value;
    renderPreview();
  });

  document.getElementById('ending').addEventListener('input', e => {
    state.ending = e.target.value;
    renderPreview();
  });

  // Theme
  document.getElementById('theme').addEventListener('change', e => {
    state.theme = e.target.value;
    renderPreview();
  });

  // NEW FONT FAMILY
  document.getElementById('fontFamily').addEventListener('change', e => {
    state.fontFamily = e.target.value;
    renderPreview();
  });

  // Colors
  document.getElementById('textColor').addEventListener('input', e => {
    state.textColor = e.target.value;
    renderPreview();
  });

  document.getElementById('textBgColor').addEventListener('input', e => {
    state.textBgColor = e.target.value;
    renderPreview();
  });

  // Logo + Signature
  document.getElementById('showLogo').addEventListener('change', e => {
    state.showLogo = e.target.checked;
    renderPreview();
  });

  document.getElementById('showSignature').addEventListener('change', e => {
    state.showSignature = e.target.checked;
    renderPreview();
  });

  // Video
  document.getElementById('videoType').addEventListener('change', e => {
    state.video.type = e.target.value;
    document.getElementById('videoUrlField').style.display =
      state.video.type === 'embed' ? 'block' : 'none';
    renderPreview();
  });

  document.getElementById('videoUrl').addEventListener('input', e => {
    state.video.url = e.target.value;
    renderPreview();
  });

  document.getElementById('videoPlacement').addEventListener('change', e => {
    state.video.placement = e.target.value;
    renderPreview();
  });

  document.getElementById('videoCaption').addEventListener('input', e => {
    state.video.caption = e.target.value;
    renderPreview();
  });
}

// ===============================
// ADD SECTION
// ===============================
function addSection() {
  const index = state.sections.length;
  state.sections.push({ title: '', body: '' });

  const wrapper = document.createElement('div');
  wrapper.className = 'bw-field';
  wrapper.innerHTML = `
    <label>Section ${index + 1} Title</label>
    <input type="text" data-section-title="${index}">
    <label>Section ${index + 1} Body</label>
    <textarea data-section-body="${index}"></textarea>
  `;
  sectionsContainer.appendChild(wrapper);

  wrapper.querySelector(`[data-section-title="${index}"]`).addEventListener('input', e => {
    state.sections[index].title = e.target.value;
    renderPreview();
  });

  wrapper.querySelector(`[data-section-body="${index}"]`).addEventListener('input', e => {
    state.sections[index].body = e.target.value;
    renderPreview();
  });
}

document.getElementById('addSectionBtn').addEventListener('click', addSection);

// ===============================
// ADD LINK
// ===============================
function addLink() {
  const index = state.links.length;
  state.links.push({ label: '', url: '' });

  const row = document.createElement('div');
  row.className = 'bw-field';
  row.innerHTML = `
    <div class="bw-inline-row">
      <input type="text" placeholder="Label" data-link-label="${index}">
      <input type="text" placeholder="URL" data-link-url="${index}">
    </div>
  `;
  linksContainer.appendChild(row);

  row.querySelector(`[data-link-label="${index}"]`).addEventListener('input', e => {
    state.links[index].label = e.target.value;
    renderPreview();
  });

  row.querySelector(`[data-link-url="${index}"]`).addEventListener('input', e => {
    state.links[index].url = e.target.value;
    renderPreview();
  });
}

document.getElementById('addLinkBtn').addEventListener('click', addLink);

// ===============================
// ADD QR
// ===============================
function addQr() {
  const index = state.qrCodes.length;
  state.qrCodes.push({ label: '', url: '' });

  const row = document.createElement('div');
  row.className = 'bw-field';
  row.innerHTML = `
    <div class="bw-inline-row">
      <input type="text" placeholder="QR Label" data-qr-label="${index}">
      <input type="text" placeholder="QR URL" data-qr-url="${index}">
    </div>
  `;
  qrContainer.appendChild(row);

  row.querySelector(`[data-qr-label="${index}"]`).addEventListener('input', e => {
    state.qrCodes[index].label = e.target.value;
    renderPreview();
  });

  row.querySelector(`[data-qr-url="${index}"]`).addEventListener('input', e => {
    state.qrCodes[index].url = e.target.value;
    renderPreview();
  });
}

document.getElementById('addQrBtn').addEventListener('click', addQr);

// ===============================
// ESCAPE HTML
// ===============================
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===============================
// VIDEO HTML
// ===============================
function buildVideoHtml() {
  if (state.video.type !== 'embed' || !state.video.url) return '';

  let src = state.video.url.trim();

  if (src.includes('youtube.com/watch')) {
    const id = new URL(src).searchParams.get('v');
    if (id) src = `https://www.youtube.com/embed/${id}`;
  }

  return `
    <div class="bw-video medieval-frame">
      <iframe src="${escapeHtml(src)}" frameborder="0" allowfullscreen></iframe>
      ${state.video.caption ? `<div class="bw-video-caption">${escapeHtml(state.video.caption)}</div>` : ''}
    </div>
  `;
}

// ===============================
// RENDER PREVIEW
// ===============================
function renderPreview() {
  const themeClass = `theme-${state.theme}`;
  const fontFamilyStyle = `font-family: '${state.fontFamily}', serif;`;

  const paragraphsHtml = state.paragraphs
    .filter(p => p.trim())
    .map(p => `<p class="bw-paragraph indent">${escapeHtml(p)}</p>`)
    .join('');

  const sectionsHtml = state.sections
    .filter(s => s.title || s.body)
    .map(s => `
      <section class="bw-section">
        <h2 class="bw-section-title">${escapeHtml(s.title)}</h2>
        <p class="bw-paragraph indent">${escapeHtml(s.body)}</p>
      </section>
    `)
    .join('');

  const linksHtml = state.links.length
    ? `
      <section class="bw-links">
        <h3 class="bw-section-title">Links & Portals</h3>
        <ul>
          ${state.links
            .filter(l => l.url)
            .map(l => `<li><a href="${escapeHtml(l.url)}" target="_blank">${escapeHtml(l.label || l.url)}</a></li>`)
            .join('')}
        </ul>
      </section>
    `
    : '';

  const qrHtml = state.qrCodes.length
    ? `
      <section class="bw-links">
        <h3 class="bw-section-title">QR Codes</h3>
        <ul>
          ${state.qrCodes
            .filter(q => q.url)
            .map(q => `<li>${escapeHtml(q.label || '')} – ${escapeHtml(q.url)}</li>`)
            .join('')}
        </ul>
      </section>
    `
    : '';

  const videoHtml = buildVideoHtml();

  let bodyInner = `
    <h1 class="bw-title">${escapeHtml(state.title || 'Boardwalk Newsletter')}</h1>
    ${paragraphsHtml}
    ${sectionsHtml}
    ${linksHtml}
    ${qrHtml}
    <section class="bw-signoff">
      <p class="bw-paragraph indent">${escapeHtml(state.ending)}</p>
    </section>
  `;

  if (videoHtml) {
    bodyInner = state.video.placement === 'top'
      ? videoHtml + bodyInner
      : bodyInner + videoHtml;
  }

  previewEl.className = `boardwalk-newsletter ${themeClass}`;
  previewEl.setAttribute('style', fontFamilyStyle);

  previewEl.innerHTML = `
    <header class="bw-header">
      <div class="bw-logo-date">
        ${state.showLogo ? '<img src="assets/logo-boardwalk.png" class="bw-logo">' : ''}
        <div class="bw-date-time">${escapeHtml(state.dateTime)}</div>
      </div>
      <div class="bw-ribbon">
        <span class="bw-ribbon-text">Boardwalk Newsletter</span>
        <span class="bw-gold-stamp"></span>
      </div>
    </header>

    <main class="bw-body" style="background:${state.textBgColor}; color:${state.textColor}; ${fontFamilyStyle}">
      ${bodyInner}
    </main>

    <footer class="bw-footer">
      ${state.showSignature ? '<div class="bw-signature">Boardwalk Clay</div>' : ''}
    </footer>
  `;
}

// ===============================
// INIT
// ===============================
bindBasicFields();
renderPreview();
