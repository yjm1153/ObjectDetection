/* ============================================================
 * 目标检测科研系统 · 核心引擎 (app.js)
 * 包含通用缓存请求、Markdown 解析器、模态窗控制和路由机制。
 * ============================================================ */

const $main = document.getElementById('main');
const cache = {};
let currentView = 'overview';

// 获取配置元数据
const CONFIG = window.DASHBOARD_CONFIG || { paths: {}, sidebarNav: [] };

/* ---------- 数据获取（带自动表格修补防御） ---------- */
async function fetchText(path) {
  if (cache[path] !== undefined) return cache[path];
  const resp = await fetch(encodeURI('/' + path), { cache: 'no-store' });
  if (!resp.ok) throw new Error(path + ' (HTTP ' + resp.status + ')');
  
  let text = await resp.text();
  // 1. 统一换行符:CRLF 文件会使 ^...$ 类正则(如排行表匹配)失效
  text = text.replace(/\r\n/g, '\n');
  
  // 2. 健壮性防御：自动修补表格行漏闭合 "|" 的情况，防止正则截断白屏
  text = text.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && !trimmed.endsWith('|') && trimmed.length > 2) {
      return line + ' |';
    }
    return line;
  }).join('\n');

  cache[path] = text;
  return text;
}

/* ---------- 基础转义与行解析工具 ---------- */
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMd(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^\w*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

function splitTableRow(line) {
  const PH = '@@PIPE@@';
  line = line.replace(/\\\|/g, PH);
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.split(PH).join('|').trim());
}

/* ---------- Markdown 正文渲染 ---------- */
function mdBody(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const listStack = [];
  let i = 0;

  function closeLists(toDepth) { while (listStack.length > toDepth) out.push('</' + listStack.pop() + '>'); }

  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      closeLists(0);
      const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>');
      continue;
    }
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      closeLists(0);
      const header = splitTableRow(line); i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(splitTableRow(lines[i])); i++; }
      let html = '<div class="tbl-wrap"><table><thead><tr>' + header.map(c => '<th>' + inlineMd(c) + '</th>').join('') + '</tr></thead><tbody>';
      for (const r of rows) html += '<tr>' + r.map(c => '<td>' + inlineMd(c) + '</td>').join('') + '</tr>';
      html += '</tbody></table></div>';
      out.push(html); continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) { closeLists(0); out.push('<h' + h[1].length + '>' + inlineMd(h[2]) + '</h' + h[1].length + '>'); i++; continue; }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { closeLists(0); out.push('<hr>'); i++; continue; }
    if (/^\s*>/.test(line)) {
      closeLists(0); const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push('<blockquote>' + buf.map(inlineMd).join('<br>') + '</blockquote>'); continue;
    }
    const li = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
    if (li) {
      const depth = Math.min(Math.floor(li[1].length / 2), 3) + 1;
      const type = /\d/.test(li[2]) ? 'ol' : 'ul';
      while (listStack.length > depth) out.push('</' + listStack.pop() + '>');
      while (listStack.length < depth) { out.push('<' + type + '>'); listStack.push(type); }
      let content = li[3];
      const task = content.match(/^\[([ xX])\]\s*(.*)/);
      if (task) content = '<input type="checkbox" disabled' + (task[1] !== ' ' ? ' checked' : '') + '>' + inlineMd(task[2]);
      else content = inlineMd(content);
      out.push('<li>' + content + '</li>'); i++; continue;
    }
    if (/^\s*$/.test(line)) { closeLists(0); i++; continue; }
    closeLists(0); out.push('<p>' + inlineMd(line) + '</p>'); i++;
  }
  closeLists(0);
  return '<div class="md">' + out.join('\n') + '</div>';
}

function mdToHtml(md) { return mdBody(md); }

/* ---------- Markdown 章节 → 卡片流 ---------- */
function mdToSectionCards(md, opts = {}) {
  const { collapseThreshold = 0, iconMap = {} } = opts;
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let preTitle = '', preLines = [];
  for (let i = 0; i < lines.length; i++) {
    const h2 = lines[i].match(/^## (.+)/);
    if (h2) {
      if (preTitle || preLines.length) sections.push({ title: preTitle, bodyLines: preLines });
      preTitle = h2[1]; preLines = [];
    } else { preLines.push(lines[i]); }
  }
  sections.push({ title: preTitle, bodyLines: preLines });
  if (!sections.length) return '<div class="empty-state">暂无内容</div>';

  function pickIcon(title) {
    if (!title) return '';
    for (const [key, icon] of Object.entries(iconMap)) { if (title.includes(key)) return icon; }
    return '';
  }

  let html = '<div class="section-cards">';
  for (const sec of sections) {
    const bodyMd = sec.bodyLines.join('\n').trim();
    if (!sec.title && !bodyMd) continue;
    const bodyHtml = bodyMd ? mdBody(bodyMd) : '';
    const lineCount = sec.bodyLines.length;
    const shouldFold = collapseThreshold > 0 && lineCount > collapseThreshold;

    if (!sec.title) {
      html += '<div class="sec-card"><div class="sec-body">' + (bodyHtml || '<p style="color:var(--text-sub);">—</p>') + '</div></div>';
      continue;
    }
    const icon = pickIcon(sec.title);
    if (shouldFold) {
      html += '<div class="sec-card"><details class="sec-fold" open><summary>' +
        '<span class="sec-arrow">▶</span>' + (icon ? '<span class="sec-icon">' + icon + '</span>' : '') +
        '<span>' + inlineMd(sec.title) + '</span>' +
        '<span class="sec-badge">' + lineCount + ' 行</span></summary>' +
        '<div class="sec-body">' + bodyHtml + '</div></details></div>';
    } else {
      html += '<div class="sec-card"><div class="sec-header-static">' +
        (icon ? '<span class="sec-icon">' + icon + '</span>' : '') +
        '<span>' + inlineMd(sec.title) + '</span></div>' +
        '<div class="sec-body">' + bodyHtml + '</div></div>';
    }
  }
  html += '</div>';
  return html;
}

/* ---------- Markdown 结构解析提取工具 ---------- */
function extractSection(md, title) {
  const hit = splitSections(md).find(s => s.title.startsWith(title));
  return hit ? hit.body.trim() : null;
}

function splitSections(md) {
  return md.split(/^## /m).slice(1).map(p => {
    const nl = p.indexOf('\n');
    return { title: p.slice(0, nl < 0 ? p.length : nl).trim(), body: nl < 0 ? '' : p.slice(nl + 1) };
  });
}

function countCheckboxes(md) {
  const done = (md.match(/^\s*- \[[xX]\]/gm) || []).length;
  const todo = (md.match(/^\s*- \[ \]/gm) || []).length;
  return { done, todo, total: done + todo };
}

function parseListItems(md) {
  if (!md) return [];
  const items = [];
  for (const line of md.split('\n')) {
    let m = line.match(/^\s*(\d+)\.\s+(.*)/);
    if (m) { items.push({ num: m[1], text: m[2], isNumbered: true }); continue; }
    m = line.match(/^\s*[-*]\s+(.*)/);
    if (m) items.push({ num: null, text: m[1], isNumbered: false });
  }
  return items;
}

/* ---------- 基础卡片组件工厂 ---------- */
function makeItemCard(num, bodyHtml, cls) {
  return '<div class="item-card' + (cls ? ' ' + cls : '') + '">' +
    '<div class="ic-num">' + esc(String(num)) + '</div>' +
    '<div class="ic-body">' + bodyHtml + '</div></div>';
}

function makeItemCardWithTitle(num, title, desc, cls) {
  return '<div class="item-card' + (cls ? ' ' + cls : '') + '">' +
    '<div class="ic-num">' + esc(String(num)) + '</div>' +
    '<div class="ic-body"><div class="ic-title">' + inlineMd(title) + '</div>' +
    (desc ? '<div class="ic-desc">' + inlineMd(desc) + '</div>' : '') + '</div></div>';
}

function makeTaskCard(done, text, cls) {
  return '<div class="task-card' + (done ? ' done' : '') + (cls ? ' ' + cls : '') + '">' +
    '<div class="tc-box">' + (done ? '✓' : '') + '</div>' +
    '<div class="tc-body">' + inlineMd(text) + '</div></div>';
}

/* ---------- 模态弹窗系统与站内 md 跳转劫持 ---------- */
function resolveMdPath(base, href) {
  const parts = ((base ? base + '/' : '') + href).split('/');
  const out = [];
  for (const p of parts) {
    if (!p || p === '.') continue;
    if (p === '..') out.pop(); else out.push(p);
  }
  return out.join('/');
}

function ensureMdModal() {
  let overlay = document.getElementById('md-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'md-modal-overlay';
    overlay.innerHTML = '<div id="md-modal">' +
      '<div class="mm-head"><div class="mm-title"></div>' +
      '<button class="mm-close" title="关闭">✕</button></div>' +
      '<div class="mm-body"></div></div>';
    overlay.addEventListener('click', e => { if (e.target === overlay) closeMdViewer(); });
    overlay.querySelector('.mm-close').addEventListener('click', closeMdViewer);
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  return overlay;
}

function openHtmlModal(title, html, base) {
  const overlay = ensureMdModal();
  overlay.querySelector('.mm-title').textContent = title;
  const body = overlay.querySelector('.mm-body');
  body.dataset.base = base || '';
  body.innerHTML = html;
  body.scrollTop = 0;
}

async function openMdViewer(path) {
  const overlay = ensureMdModal();
  overlay.querySelector('.mm-title').textContent = '📄 ' + path;
  const body = overlay.querySelector('.mm-body');
  body.dataset.base = path.split('/').slice(0, -1).join('/');
  body.innerHTML = '<div class="loading">加载中…</div>';
  try {
    const md = await fetchText(path);
    body.innerHTML = mdToSectionCards(md, { collapseThreshold: 10 });
    body.scrollTop = 0;
  } catch (e) {
    body.innerHTML = '<div class="error-box">⚠️ 无法读取 ' + esc(path) + ': ' + esc(e.message) + '</div>';
  }
}

function closeMdViewer() {
  const overlay = document.getElementById('md-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMdViewer(); });

document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || /^(https?:|mailto:|#)/i.test(href) || !/\.md(#|$)/i.test(href)) return;
  e.preventDefault();
  e.stopPropagation();
  const baseEl = a.closest('[data-base]');
  openMdViewer(resolveMdPath(baseEl ? baseEl.dataset.base : '', href.split('#')[0]));
}, true);

/* ---------- 顶部栏元数据加载 ---------- */
async function loadTopbar() {
  try {
    const readme = await fetchText(CONFIG.paths.readme);
    const stage = readme.match(/\*\*阶段\*\*[:：]\s*`?([^`\n(（]+)/);
    document.getElementById('stage-badge').textContent = '阶段:' + (stage ? stage[1].trim() : '未知');
    const upd = readme.match(/Last Update[:：]\s*([0-9-]+)/);
    document.getElementById('last-update').textContent = upd ? '系统最近更新:' + upd[1] : '';
  } catch (e) { document.getElementById('stage-badge').textContent = '离线'; }
}

/* ---------- 页面导航路由器与视图挂载 ---------- */
const views = {}; // 由各独立的视图 JS 运行时向此对象注册渲染逻辑

async function setView(id) {
  currentView = id;
  closeMdViewer(); 
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === id));
  
  // 查找配置中的菜单信息
  const menuItem = CONFIG.sidebarNav.find(item => item.id === id) || { title: '未知视图', sub: '' };
  
  $main.innerHTML = '<div class="view-title">' + menuItem.title + '</div><div class="view-sub">' + menuItem.sub +
    '</div><div id="view-body"><div class="loading">加载中…</div></div>';
    
  try {
    const renderFn = views[id];
    if (renderFn) {
      await renderFn(document.getElementById('view-body'));
    } else {
      throw new Error('未找到 ' + id + ' 视图的渲染引擎');
    }
  }
  catch (e) {
    document.getElementById('view-body').innerHTML =
      '<div class="error-box"><strong>⚠️ 加载失败:</strong> ' + esc(e.message) +
      '<br>请通过 <code>启动研究面板.bat</code> 打开（需要本地 HTTP 服务）。</div>';
  }
}

function refresh() {
  location.hash = currentView;
  location.reload();
}

// 注册导航点击行为
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(el =>
    el.addEventListener('click', () => setView(el.dataset.view)));
  loadTopbar();
  const initView = location.hash.replace('#', '');
  setView(views[initView] ? initView : 'overview');
});
