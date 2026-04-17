const paths = {
  subscribers: '/data/subscribers.json',
  issuesIndex: '/data/issues/index.json',
  beltlineNews: '/data/scraped/beltline-news.json',
  skateLocal: '/data/scraped/skate-news-local.json',
  skateNational: '/data/scraped/skate-news-national.json',
  skateGlobal: '/data/scraped/skate-news-global.json',
  deliveryLogs: '/data/delivery/logs.json'
};

async function loadJson(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(path + ' not found');
    return await res.json();
  } catch {
    return null;
  }
}

function renderSubscribers(subscribers) {
  const tbody = document.getElementById('subscribersTableBody');
  if (!subscribers || !subscribers.length) {
    tbody.innerHTML = '<tr><td colspan="5">No subscribers yet.</td></tr>';
    return;
  }

  document.getElementById('statSubscribers').textContent = subscribers.length;

  tbody.innerHTML = subscribers
    .slice()
    .reverse()
    .map(sub => {
      const channels = [];
      if (sub.channels?.email) channels.push('Email');
      if (sub.channels?.sms) channels.push('SMS');
      if (sub.channels?.app) channels.push('App');

      const topics = [];
      if (sub.preferences?.topics?.beltline) topics.push('BeltLine');
      if (sub.preferences?.topics?.skatingLocal) topics.push('ATL Skating');
      if (sub.preferences?.topics?.skatingNational) topics.push('US Skating');
      if (sub.preferences?.topics?.skatingGlobal) topics.push('Global');

      return `
        <tr>
          <td>${sub.email || ''}</td>
          <td>${sub.phone || ''}</td>
          <td>${channels.join(', ') || '-'}</td>
          <td>${topics.join(', ') || '-'}</td>
          <td>${(sub.createdAt || '').slice(0, 10)}</td>
        </tr>
      `;
    })
    .join('');
}

function renderIssues(issues) {
  const list = document.getElementById('issuesList');
  if (!issues || !issues.length) {
    list.innerHTML = '<li>No issues yet.</li>';
    return;
  }

  document.getElementById('statIssues').textContent = issues.length;

  list.innerHTML = issues
    .slice()
    .reverse()
    .map(issue => {
      const date = issue.createdAt?.slice(0, 10) || issue.id;
      return `<li><a href="/issues/issue-${issue.id}.html" target="_blank">${issue.title}</a> <span>(${date})</span></li>`;
    })
    .join('');
}

function renderDeliveryLogs(logs) {
  const stat = document.getElementById('statLastDelivery');
  if (!logs || !logs.length) {
    stat.textContent = 'No sends yet';
    return;
  }
  const last = logs[logs.length - 1];
  stat.textContent = `${last.issueId} @ ${last.sentAt}`;
}

function renderNewsTab(tab, items) {
  const container = document.getElementById('newsContainer');
  if (!items || !items.length) {
    container.innerHTML = '<p class="hint">No news scraped yet for this tab.</p>';
    return;
  }

  container.innerHTML = items
    .slice()
    .reverse()
    .map(n => `
      <div class="bw-news-item">
        <a href="${n.url}" target="_blank">${n.title}</a>
        <div class="hint">${n.source || ''} · ${n.date || ''}</div>
        <div>${n.snippet || ''}</div>
      </div>
    `)
    .join('');
}

async function setupNewsTabs() {
  const [beltline, local, national, global] = await Promise.all([
    loadJson(paths.beltlineNews),
    loadJson(paths.skateLocal),
    loadJson(paths.skateNational),
    loadJson(paths.skateGlobal)
  ]);

  const state = { beltline, local, national, global };

  const buttons = document.querySelectorAll('.bw-tabs button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (tab === 'beltline') renderNewsTab('beltline', state.beltline || []);
      if (tab === 'local') renderNewsTab('local', state.local || []);
      if (tab === 'national') renderNewsTab('national', state.national || []);
      if (tab === 'global') renderNewsTab('global', state.global || []);
    });
  });

  renderNewsTab('beltline', state.beltline || []);
}

async function init() {
  const [subs, issues, logs] = await Promise.all([
    loadJson(paths.subscribers),
    loadJson(paths.issuesIndex),
    loadJson(paths.deliveryLogs)
  ]);

  renderSubscribers(subs || []);
  renderIssues(issues || []);
  renderDeliveryLogs(logs || []);

  setupNewsTabs();
}

init();
