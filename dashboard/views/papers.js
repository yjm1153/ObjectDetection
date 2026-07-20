/* ============================================================
 * 视图：论文分类渲染器 (views/papers.js)
 * ============================================================ */

window.classifyData = null;
window.classifyFilter = window.classifyFilter || 'all';

// 从分类视图点击论文卡片 → 弹窗查看 summary
window.showClassifyPaper = async function(name, encFile) {
  const paths = window.DASHBOARD_CONFIG.paths;
  const iconMaps = window.DASHBOARD_CONFIG.iconMaps;
  const file = decodeURIComponent(encFile);
  
  openHtmlModal('📑 ' + name + '（' + file + '）', '<div class="loading">加载中…</div>', paths.summariesDir.replace(/\/$/, ''));
  const body = document.querySelector('#md-modal .mm-body');
  try {
    const md = await fetchText(paths.summariesDir + file);
    body.innerHTML = mdToSectionCards(md, {
      collapseThreshold: 10,
      iconMap: iconMaps.paperSummary
    });
    body.scrollTop = 0;
  } catch (e) {
    body.innerHTML = '<div class="error-box">⚠️ 无法读取: ' + esc(e.message) + '</div>';
  }
};

async function loadClassifyData() {
  if (window.classifyData) return window.classifyData;
  const paths = window.DASHBOARD_CONFIG.paths;
  try {
    const json = await fetchText(paths.classification);
    window.classifyData = JSON.parse(json);
    return window.classifyData;
  } catch (e) { return null; }
}

/* 计算论文主分类优先级: f > v > p > c+i > c|i > x */
function primaryCat(tags) {
  if (!tags) return 'arxiv';
  if (tags.includes('f')) return 'self';
  if (tags.includes('v')) return 'venue';
  if (tags.includes('p')) return 'pub';
  if (tags.includes('c') && tags.includes('i')) return 'dual';
  if (tags.includes('c') || tags.includes('i')) return 'single';
  return 'arxiv';
}

function renderTagBadge(code, std) {
  if (!std) return '';
  return '<span class="cls-tag ' + std.cls + '" title="' + esc(std.desc) + '">' +
    (std.icon || '') + ' ' + std.label + '</span>';
}

function renderClassifyTags(tags, standards) {
  if (!tags) return '';
  return [...tags].map(c => renderTagBadge(c, standards[c])).join('');
}

views['papers'] = async function(el) {
  const data = await loadClassifyData();
  if (!data) { el.innerHTML = '<div class="error-box">⚠️ 无法加载分类数据</div>'; return; }

  const { standards, categories, sections, papers } = data;

  const secMap = {};
  (sections || []).forEach(s => { secMap[s.idx] = s; });

  const catCount = {};
  categories.forEach(c => { catCount[c.id] = 0; });

  const grouped = {};
  categories.forEach(c => { grouped[c.id] = []; });

  (papers || []).forEach(p => {
    const cat = primaryCat(p.t);
    catCount[cat] = (catCount[cat] || 0) + 1;
    if (grouped[cat]) grouped[cat].push(p);
  });

  Object.values(grouped).forEach(arr => {
    arr.sort((a, b) => (b.y - a.y) || ((b.m || 0) - (a.m || 0)));
  });

  /* 统计栏 */
  const totalPapers = papers.length;
  let statsHtml = '<div class="cls-stats">';
  statsHtml += '<div class="cls-stat" style="cursor:default;"><div class="cs-num" style="color:var(--text);">' + totalPapers + '</div><div class="cs-label">📚 总计</div></div>';
  categories.forEach(cat => {
    const count = catCount[cat.id] || 0;
    const active = window.classifyFilter === 'all' || window.classifyFilter === cat.id;
    statsHtml += '<div class="cls-stat" onclick="window.classifyFilter=\'' + (active && window.classifyFilter !== 'all' ? 'all' : cat.id) +
      '\';setView(\'papers\')" style="' + (active ? 'border-color:' + cat.color + ';box-shadow:0 0 0 2px ' + cat.bg + ';' : '') + '">' +
      '<div class="cs-num" style="color:' + cat.color + ';">' + count + '</div>' +
      '<div class="cs-label">' + cat.icon + ' ' + cat.label + '</div></div>';
  });
  statsHtml += '</div>';

  /* 筛选提示 */
  let filterNote = '';
  if (window.classifyFilter !== 'all') {
    const activeCat = categories.find(c => c.id === window.classifyFilter);
    if (activeCat) {
      filterNote = '<div style="margin-bottom:14px;font-size:13px;color:var(--text-sub);">🔍 已筛选: <strong>' +
        activeCat.icon + ' ' + activeCat.label + '</strong> · ' + (catCount[window.classifyFilter] || 0) + ' 篇 ' +
        '<a href="javascript:window.classifyFilter=\'all\';setView(\'papers\')" style="color:var(--blue);cursor:pointer;">✕ 显示全部</a></div>';
    }
  }

  /* 渲染每个分类 */
  let bodyHtml = '';
  categories.forEach(cat => {
    if (window.classifyFilter !== 'all' && window.classifyFilter !== cat.id) return;
    const catPapers = grouped[cat.id] || [];
    if (!catPapers.length) return;

    bodyHtml += '<div class="cls-cat-header" style="background:' + cat.bg + ';color:' + cat.color + ';">' +
      '<span>' + cat.icon + '</span><span>' + cat.label + '</span>' +
      '<span style="font-size:12px;font-weight:400;opacity:.8;">' + cat.desc + '</span>' +
      '<span class="cch-count">' + catPapers.length + ' 篇</span></div>';

    bodyHtml += '<div class="cls-paper-cards">';
    catPapers.forEach(p => {
      const sec = secMap[p.s];
      const secLabel = sec ? (sec.emoji || '') + ' ' + sec.name : '';
      const venueCls = (p.t || '').includes('v') ? ' top' : '';
      const summaryFile = p.f || '';
      const hasSummary = summaryFile && !summaryFile.includes('quick_eval');

      bodyHtml += '<div class="cls-paper-card"' +
        (hasSummary ? ' onclick="window.showClassifyPaper(\'' + esc(p.n) + '\',\'' + encodeURIComponent(summaryFile) + '\')"' : '') +
        ' title="' + esc(p.d || '') + '">' +
        '<span class="cp-year">' + (p.y || '—') + (p.m ? '.' + String(p.m).padStart(2,'0') : '') + '</span>' +
        '<span class="cp-name">' + esc(p.n) + '</span>' +
        '<span class="cls-venue-badge' + venueCls + '">' + esc(p.v || '') + '</span>' +
        renderClassifyTags(p.t, standards) +
        '<span class="cp-desc">' + esc(p.d || '') + '</span>' +
        '<span class="cp-section">' + esc(secLabel) + '</span>' +
        (p.u ? '<a class="pp-origin" href="' + esc(p.u) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="font-size:10px;padding:2px 8px;">🔗</a>' : '') +
        '</div>';
    });
    bodyHtml += '</div>';
  });

  /* 图例 */
  const legendTags = Object.entries(standards).map(([k, v]) =>
    '<span class="cls-tag ' + v.cls + '" style="cursor:default;">' + (v.icon || '') + ' ' + v.label + '</span>'
  ).join(' ');

  el.innerHTML = statsHtml + filterNote +
    '<div style="margin-bottom:14px;font-size:12px;color:var(--text-sub);">🏷️ 标签: ' + legendTags +
    ' | 💡 点击论文卡片可查看详情; 🔗 跳转原文; 按主分类优先级: 【自】> 顶会 > 已发表 > 双重背书 > 单一背书 > 纯arXiv</div>' +
    '<div style="margin-bottom:6px;font-size:12px;color:var(--text-sub);">📌 每个分类内按时间从新到旧排列</div>' +
    bodyHtml;
};
