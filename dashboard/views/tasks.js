/* ============================================================
 * 视图：任务渲染器 (views/tasks.js)
 * ============================================================ */

window.taskFilter = window.taskFilter || 'all';

views['tasks'] = async function(el) {
  const paths = window.DASHBOARD_CONFIG.paths;
  const tasks = await fetchText(paths.tasks);
  const tc = countCheckboxes(tasks);
  const pct = tc.total ? Math.round(tc.done / tc.total * 100) : 0;
  const sections = splitSections(tasks).filter(s => /- \[/.test(s.body));

  let html = '<div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:10px;align-items:center;">' +
    '<strong style="font-size:15px;">总体进度</strong><span style="font-size:14px;color:var(--text-sub);">' +
    tc.done + ' / ' + tc.total + '（' + pct + '%）</span></div>' +
    '<div class="progress"><div class="fill" style="width:' + pct + '%"></div></div></div>';

  html += '<div class="filter-bar">' +
    ['all|全部', 'todo|进行中', 'done|已完成'].map(f => {
      const [key, label] = f.split('|');
      return '<button class="filter-btn' + (window.taskFilter === key ? ' active' : '') +
        '" onclick="window.taskFilter=\'' + key + '\';setView(\'tasks\')">' + label + '</button>';
    }).join('') + '</div>';

  for (const sec of sections) {
    const items = [];
    for (const line of sec.body.split('\n')) {
      const m = line.match(/^\s*- \[([ xX])\]\s*(.*)/);
      if (m) items.push({ done: m[1] !== ' ', text: m[2] });
    }
    const filtered = items.filter(it => window.taskFilter === 'all' || (window.taskFilter === 'done') === it.done);
    if (!filtered.length) continue;
    const secDone = items.filter(i => i.done).length;

    html += '<div class="section-label"><span>' + esc(sec.title) + '</span>' +
      '<span class="sl-count">' + secDone + '/' + items.length + '</span></div>';
    html += '<div class="item-cards">' +
      filtered.map(it => makeTaskCard(it.done, it.text)).join('') +
      '</div>';
  }
  el.innerHTML = html;
};
