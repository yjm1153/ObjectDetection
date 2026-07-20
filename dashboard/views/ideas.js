/* ============================================================
 * 视图：Ideas 渲染器 (views/ideas.js)
 * ============================================================ */

window.ideaDetailsMap = window.ideaDetailsMap || {};
window.candSectionList = window.candSectionList || [];
window.ideaTrackMap = window.ideaTrackMap || {};
window.ideaNameMap = window.ideaNameMap || {};
window.ideaTrackFilter = window.ideaTrackFilter || 'all';

window.setIdeaTrackFilter = function(f) {
  window.ideaTrackFilter = f;
  setView('ideas');
};

/* 排行卡片 → 弹窗展示该 Idea 的 candidate.md 详情 */
window.openIdeaModal = function(num) {
  const html = window.ideaDetailsMap[num];
  if (!html) return;
  const track = window.ideaTrackMap[num];
  const meta = track ? window.DASHBOARD_CONFIG.trackMeta[track] : null;
  const rawName = (window.ideaNameMap[num] || '#' + num).replace(/^\*+|\*+$/g, '');
  openHtmlModal('💡 ' + (meta ? meta.chip + ' · ' : '') + rawName + ' — 详情(candidate.md)', html, 'Ideas');
};

/* 候选 Idea 分组卡片 → 弹窗展示该分组全文 */
window.openCandModal = function(i) {
  const s = window.candSectionList[i];
  if (!s) return;
  openHtmlModal('📋 ' + s.title, mdBody(s.body), 'Ideas');
};

views['ideas'] = async function(el) {
  const paths = window.DASHBOARD_CONFIG.paths;
  const TRACK_META = window.DASHBOARD_CONFIG.trackMeta;

  const [ranking, candidate] = await Promise.all([
    fetchText(paths.ranking),
    fetchText(paths.candidate),
  ]);

  // 双轨分类:从 🧭 区块解析 Idea → 轨道 映射
  window.ideaTrackMap = parseTrackMap(ranking);

  // 解析 candidate.md 按 ### #N 提取每个 Idea 的详情
  const ideaDetails = {};
  const candParts = candidate.split(/^### #(\d+)/m);
  for (let i = 1; i < candParts.length; i += 2) {
    const num = candParts[i].trim();
    const body = (candParts[i + 1] || '').trim();
    if (num && body) {
      const bodyLines = body.split('\n');
      // 第一行是标题，后面是详情
      const detailMd = bodyLines.slice(1).join('\n').trim();
      ideaDetails[num] = detailMd ? mdBody(detailMd) : '';
    }
  }
  window.ideaDetailsMap = ideaDetails;

  // 解析排行表为卡片
  let rankCardsHtml = '';
  const tableMatch = ranking.match(/^\|.+\|[\s\S]*?((?:^\|.+\|$\n?)+)/m);
  if (tableMatch) {
    const dataRows = tableMatch[1].trim().split('\n').filter(l => /^\s*\|/.test(l) && !/---/.test(l));
    if (dataRows.length) {
      // 过滤前统计各轨道数量(图例用)
      const allRows = dataRows.map(r => {
        const c = splitTableRow(r);
        const idea = c[1] || '';
        const ideaNum = (idea.match(/#(\d+)/) || [])[1];
        const track = (ideaNum && window.ideaTrackMap[ideaNum]) || null;
        return { rank: parseInt(c[0]) || 0, idea, ideaNum, track,
          score: c[8] || '', novelty: c[2] || '', feasibility: c[5] || '', status: c[9] || '' };
      });

      // 存原始 Idea 名,供 openIdeaModal 标题使用
      window.ideaNameMap = {};
      allRows.forEach(r => { if (r.ideaNum) window.ideaNameMap[r.ideaNum] = r.idea.replace(/^\*+|\*+$/g, ''); });

      function legendHtml(){
        const counts = { a: 0, b: 0, c: 0, d: 0 };
        allRows.forEach(r => { if (r.track && counts[r.track] !== undefined) counts[r.track]++; });
        return '<div class="track-legend">' + ['a','b','c','d'].map(k => {
          const t = TRACK_META[k];
          if (!t) return '';
          const active = window.ideaTrackFilter === k;
          return '<div class="tl-card ' + t.cls + (active ? ' active' : '') + '"' +
            ' onclick="window.setIdeaTrackFilter(\'' + (active ? 'all' : k) + '\')"' +
            ' title="' + (active ? '点击取消筛选,显示全部' : '点击筛选 ' + t.name) + '"' +
            ' style="cursor:pointer;">' +
            '<div class="tl-icon">' + (k === 'a' ? '🟦' : k === 'b' ? '🟪' : k === 'd' ? '🟠' : '⬜') + '</div>' +
            '<div><div class="tl-name">' + t.name + '</div>' +
            '<div class="tl-desc">' + t.desc + '</div></div>' +
            '<div class="tl-count">' + counts[k] + '</div></div>';
        }).join('') + '<div style="font-size:12px;color:var(--text-sub);padding:6px 0 0 4px;">💡 点击轨道卡片可筛选排行</div></div>';
      }

      function trackChipHtml(track, mini) {
        const t = TRACK_META[track];
        if (!t) return '';
        return '<span class="track-chip ' + t.cls + '"' + (mini ? ' style="font-size:10px;padding:2px 8px;"' : '') + '>' + t.chip + '</span>';
      }

      const filteredRows = allRows.filter(r => window.ideaTrackFilter === 'all' || r.track === window.ideaTrackFilter);
      const filterNote = window.ideaTrackFilter !== 'all'
        ? '<div style="margin-bottom:10px;font-size:13px;color:var(--text-sub);">🔍 已筛选: ' +
          trackChipHtml(window.ideaTrackFilter, true) + ' · ' + filteredRows.length + '/' + allRows.length + ' 条 ' +
          '<a href="javascript:window.setIdeaTrackFilter(\'all\')" style="color:var(--blue);cursor:pointer;">✕ 显示全部</a></div>'
        : '';

      rankCardsHtml = legendHtml() + filterNote + '<div class="idea-cards">' + filteredRows.map(r => {
        const hasDetail = r.ideaNum && ideaDetails[r.ideaNum];
        const rankCls = r.rank === 1 ? 'rank1' : (r.rank === 2 ? 'rank2' : (r.rank === 3 ? 'rank3' : ''));
        const trackCls = r.track ? ('track-' + r.track) : '';
        return '<div class="idea-rank-card' + (rankCls ? ' ' + rankCls : '') + (trackCls ? ' ' + trackCls : '') + (hasDetail ? ' has-detail' : '') + '"' +
          (hasDetail ? ' data-idea="' + r.ideaNum + '" onclick="window.openIdeaModal(\'' + r.ideaNum + '\')"' : '') + '>' +
          '<div class="irk-rank">' + (r.rank === 1 ? '⭐' : (r.rank > 0 ? '#' + r.rank : '—')) + '</div>' +
          (r.track ? trackChipHtml(r.track) : '') +
          '<div class="irk-body">' +
          '<div class="irk-name">' + inlineMd(r.idea) + '</div>' +
          '<div class="irk-desc">' + inlineMd(r.status) + '</div>' +
          '</div>' +
          '<div class="irk-score">' + inlineMd(r.score) +
          '<small>Nov ' + esc(r.novelty) + ' · Feas ' + esc(r.feasibility) + '</small></div>' +
          (hasDetail ? '<button class="irk-detail-link" onclick="event.stopPropagation();window.openIdeaModal(\'' + r.ideaNum + '\')">📖 详情</button>' : '') +
          '</div>';
      }).join('') + '</div>';
    }
  }
  if (!rankCardsHtml) rankCardsHtml = mdBody(ranking);

  // 候选 Idea 分组 → 卡片行,点击弹窗查看
  const ideaSections = splitSections(candidate);
  window.candSectionList = ideaSections;

  function candTrackChips(bodyMd) {
    const nums = [...(bodyMd || '').matchAll(/### #(\d+)/g)].map(m => m[1]);
    const tracks = nums.map(n => window.ideaTrackMap[n]).filter(Boolean);
    const seen = new Set();
    return tracks.map(t => { if (seen.has(t)) return null; seen.add(t); return t; }).filter(Boolean)
      .map(t => { 
        const m = TRACK_META[t]; 
        return m ? '<span class="track-chip ' + m.cls + '" style="font-size:10px;padding:2px 8px;">' + m.chip + '</span>' : ''; 
      }).join('');
  }

  let candHtml;
  if (ideaSections.length) {
    candHtml = '<div class="paper-cards">' + ideaSections.map((s, i) => {
      const chips = candTrackChips(s.body);
      return '<div class="paper-card" onclick="window.openCandModal(' + i + ')">' +
        '<span class="pp-icon">💡</span>' +
        '<span class="pp-name">' + inlineMd(s.title) + '</span>' +
        chips +
        '<span style="color:var(--blue);font-size:13px;margin-left:4px;">查看 →</span></div>';
    }).join('') + '</div>';
  } else {
    candHtml = mdBody(candidate);
  }

  el.innerHTML =
    '<div class="card" data-base="Ideas"><h3 class="card-title">🏆 Innovation Ranking <small style="font-weight:400;font-size:12px;color:var(--text-sub)">点击卡片弹窗查看详情;文中链接可跳转</small></h3>' + rankCardsHtml + '</div>' +
    '<div class="card" data-base="Ideas"><h3 class="card-title">📋 候选 Idea 详情（按分组浏览）</h3>' + candHtml + '</div>';
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
