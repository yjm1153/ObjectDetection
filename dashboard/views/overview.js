/* ============================================================
 * 视图：总览渲染器 (views/overview.js)
 * ============================================================ */

views['overview'] = async function(el) {
  const paths = window.DASHBOARD_CONFIG.paths;
  const trackMeta = window.DASHBOARD_CONFIG.trackMeta;

  const [readme, tasks, ranking] = await Promise.all([
    fetchText(paths.readme), 
    fetchText(paths.tasks),
    fetchText(paths.ranking).catch(() => ''),
  ]);

  // 统计数值
  const papersRead = (readme.match(/\|\s*已读论文\s*\|\s*(\d+)/) || [])[1] || '—';
  let candidates = '—', candidatesDetail = '';
  const pipeSec = extractSection(readme, 'Idea Pipeline');
  if (pipeSec) {
    const rows = pipeSec.split('\n').filter(l => /^\s*\|/.test(l) && !/---/.test(l));
    if (rows.length >= 2) {
      const raw = (splitTableRow(rows[1])[0] || '').trim();
      const m = raw.match(/^(\d+)\s*[（(](.+)[）)]$/);
      if (m) { candidates = m[1]; candidatesDetail = m[2].replace(/\\ /g, ''); }
      else candidates = raw || '—';
    }
  }
  let kbText = '—', kbPct = 0;
  const kbSec = extractSection(readme, 'Knowledge Base Status');
  if (kbSec) {
    const done = (kbSec.match(/✅/g) || []).length;
    const total = done + (kbSec.match(/⬜/g) || []).length;
    if (total > 0) { kbText = done + '/' + total; kbPct = Math.round(done / total * 100); }
  }
  const tc = countCheckboxes(tasks);
  const taskText = tc.total ? tc.done + '/' + tc.total : '—';
  const taskPct = tc.total ? Math.round(tc.done / tc.total * 100) : 0;

  // Rank 1
  let rank1Html = '';
  const ideaSec = extractSection(readme, 'Current Ideas');
  if (ideaSec) {
    const rows = ideaSec.split('\n').filter(l => /^\s*\|/.test(l) && !/---/.test(l));
    if (rows.length >= 2) {
      const c = splitTableRow(rows[1]);
      const r1Num = (c[0] || '').match(/\d+/); 
      const r1Track = r1Num ? (parseTrackMap(ranking)[r1Num[0]] || null) : null;
      
      const trackChip = r1Track && trackMeta[r1Track] ? 
        '<span class="track-chip ' + trackMeta[r1Track].cls + '">' + trackMeta[r1Track].chip + '</span>' : '';
        
      rank1Html = '<div class="card highlight-card" style="display:flex;align-items:center;gap:16px;padding:20px 26px;">' +
        '<div style="font-size:36px;">⭐</div>' +
        '<div style="flex:1;"><div style="font-size:13px;color:var(--text-sub);margin-bottom:4px;">当前最优候选 Idea（Rank 1）</div>' +
        '<div style="font-size:17px;font-weight:700;">#' + esc(c[0]) + ' ' + inlineMd(c[1] || '') + ' ' + trackChip + '</div>' +
        '<div style="color:var(--text-sub);font-size:13.5px;margin-top:4px;">' + inlineMd(c[2] || '') + '</div></div></div>';
    }
  }

  // Roadmap
  let roadmapHtml = '';
  const rmSec = extractSection(readme, 'Roadmap');
  if (rmSec) {
    const rows = rmSec.split('\n').filter(l => /^\s*\|/.test(l) && !/---/.test(l)).slice(1);
    roadmapHtml = rows.map(r => {
      const c = splitTableRow(r);
      const status = c[1] || '';
      const cls = status.includes('✅') ? 'done' : (status.includes('🟨') ? 'doing' : '');
      const icon = cls === 'done' ? '✓' : (cls === 'doing' ? '●' : '○');
      return '<div class="step ' + cls + '"><div class="dot">' + icon + '</div>' +
        '<div class="st-label">' + inlineMd(c[0] || '') + '</div>' +
        '<div class="st-status">' + inlineMd(status) + '</div></div>';
    }).join('');
  }

  // 渲染独立的条目卡片
  function renderItemCards(md) {
    if (!md) return '<div class="empty-state">暂无</div>';
    const items = parseListItems(md);
    if (!items.length) return mdBody(md);
    return '<div class="item-cards">' + items.map((it, i) =>
      makeItemCard(i + 1, inlineMd(it.text))
    ).join('') + '</div>';
  }

  const nextSteps = extractSection(readme, 'Next Steps');
  const problems  = extractSection(readme, 'Current Problems');
  const gaps      = extractSection(readme, 'Key Research Gap');

  el.innerHTML =
    '<div class="grid grid-4">' +
      '<div class="stat-card"><div class="num">' + papersRead + '</div><div class="label">📄 已读论文</div></div>' +
      '<div class="stat-card"><div class="num" style="font-size:34px;">' + candidates + '</div>' +
        (candidatesDetail ? '<div style="font-size:11px;color:var(--text-sub);margin-top:4px;line-height:1.5;word-break:break-all;">' + esc(candidatesDetail) + '</div>' : '') +
        '<div class="label">💡 候选 Idea</div></div>' +
      '<div class="stat-card"><div class="num" style="font-size:34px;">' + kbText + '</div><div class="label">📚 知识库完成</div>' +
        '<div class="progress"><div class="fill" style="width:' + kbPct + '%"></div></div></div>' +
      '<div class="stat-card"><div class="num" style="font-size:34px;">' + taskText + '</div><div class="label">✅ 任务完成</div>' +
        '<div class="progress"><div class="fill" style="width:' + taskPct + '%"></div></div></div>' +
    '</div>' +
    rank1Html +
    '<div class="grid grid-2">' +
      '<div class="card"><h3 class="card-title">🗺️ Roadmap</h3>' + (roadmapHtml || '<p style="color:var(--text-sub);">暂无</p>') + '</div>' +
      '<div class="card"><h3 class="card-title">👣 Next Steps</h3>' + renderItemCards(nextSteps) + '</div>' +
      '<div class="card"><h3 class="card-title">❗ Current Problems</h3>' + renderItemCards(problems) + '</div>' +
      '<div class="card"><h3 class="card-title">🕳️ Key Research Gap</h3>' + renderItemCards(gaps) + '</div>' +
    '</div>';
};

// 辅助解析双轨分类映射
function parseTrackMap(ranking) {
  const map = {};
  const lineOf = marker => (ranking.split('\n').find(l => l.includes('> - ') && l.includes(marker)) || '');
  const pairs = [['🟦', 'a'], ['🟪', 'b'], ['⬜', 'c'], ['🟠', 'd']];
  for (const [marker, track] of pairs) {
    const line = lineOf(marker).split('。')[0];
    for (const m of line.matchAll(/#(\d+)(?!\d)(?!-D)/g)) {
      if (!(m[1] in map)) map[m[1]] = track;
    }
  }
  return map;
}
