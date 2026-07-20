/* ============================================================
 * 视图：知识库渲染器 (views/kb.js)
 * ============================================================ */

window.showKB = async function(idx) {
  const paths = window.DASHBOARD_CONFIG.paths;
  const kbFiles = window.DASHBOARD_CONFIG.kbFiles;
  const iconMaps = window.DASHBOARD_CONFIG.iconMaps;

  document.querySelectorAll('.kb-card').forEach((c, i) => c.classList.toggle('selected', i === idx));
  const k = kbFiles[idx];
  
  openHtmlModal(k.icon + ' ' + k.name + '（' + paths.kbDir + k.file + '）',
    '<div class="loading">加载中…</div>', paths.kbDir.replace(/\/$/, ''));
    
  const body = document.querySelector('#md-modal .mm-body');
  try {
    const md = await fetchText(paths.kbDir + k.file);
    body.innerHTML = mdToSectionCards(md, {
      collapseThreshold: 8,
      iconMap: iconMaps.kb
    });
    body.scrollTop = 0;
  } catch (e) {
    body.innerHTML = '<div class="error-box">⚠️ 无法读取 ' + esc(k.file) + ': ' + esc(e.message) + '</div>';
  }
};

views['kb'] = async function(el) {
  const paths = window.DASHBOARD_CONFIG.paths;
  const kbFiles = window.DASHBOARD_CONFIG.kbFiles;

  const contents = await Promise.all(kbFiles.map(k =>
    fetchText(paths.kbDir + k.file).catch(() => null)));
    
  let grid = '<div class="kb-grid">' + kbFiles.map((k, idx) => {
    const c = contents[idx];
    const filled = c !== null && c.length > 400;
    return '<div class="kb-card" data-idx="' + idx + '" onclick="window.showKB(' + idx + ')">' +
      '<span class="kb-status">' + (c === null ? '❌' : (filled ? '✅' : '⬜')) + '</span>' +
      '<div class="kb-icon">' + k.icon + '</div>' +
      '<div class="kb-name">' + k.name + '</div>' +
      '<div class="kb-file">' + k.file + '</div></div>';
  }).join('') + '</div>';
  
  el.innerHTML = grid + '<div class="card empty-state" style="margin-top:16px;">👆 点击上方卡片弹窗查看详情</div>';
};
