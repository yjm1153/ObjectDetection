/* ============================================================
 * 视图：决策与日志渲染器 (views/decisions.js)
 * ============================================================ */

views['decisions'] = async function(el) {
  const paths = window.DASHBOARD_CONFIG.paths;
  const iconMaps = window.DASHBOARD_CONFIG.iconMaps;

  const [decision, journal] = await Promise.all([
    fetchText(paths.decisions),
    fetchText(paths.journal),
  ]);
  
  const decCards = mdToSectionCards(decision, {
    collapseThreshold: 6,
    iconMap: iconMaps.decisions
  });

  const entries = splitSections(journal).filter(s => /\d{4}-\d{2}-\d{2}/.test(s.title));
  let tlHtml;
  if (entries.length) {
    tlHtml = entries.map(s =>
      '<div class="timeline-entry"><div class="tl-dot"></div>' +
      '<div class="tl-date">📅 ' + esc(s.title) + '</div>' +
      '<div class="sec-card" style="margin-top:4px;"><div class="sec-body">' + mdBody(s.body) + '</div></div></div>'
    ).join('');
  } else {
    tlHtml = '<div class="card"><div class="sec-body">' + mdBody(journal) + '</div></div>';
  }

  el.innerHTML =
    '<div class="card"><h3 class="card-title">🧭 决策历史</h3>' + decCards + '</div>' +
    '<div class="card"><h3 class="card-title">📓 研究日志</h3>' + tlHtml + '</div>';
};
