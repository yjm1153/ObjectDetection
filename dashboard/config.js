/* ============================================================
 * 目标检测科研系统 · 配置文件 (config.js)
 * 剥离所有项目特定的路径、轨道、文件映射与文本元数据。
 * 便于将此 Agent 科研面板绿色迁移到任何其他项目。
 * ============================================================ */

window.DASHBOARD_CONFIG = {
  // 项目基本信息
  projectTitle: '目标检测科研系统 · 研究面板',

  // 数据源文件路径映射 (支持跨项目迁移时修改)
  paths: {
    readme: 'README.md',
    tasks: 'TASKS.md',
    ranking: 'Ideas/innovation_ranking.md',
    candidate: 'Ideas/candidate.md',
    decisions: 'Decision/decision_history.md',
    journal: 'Research/journal.md',
    classification: 'papers/classification.json',
    summariesDir: 'papers/summaries/',
    kbDir: 'Knowledge Base/'
  },

  // 侧边栏导航配置
  sidebarNav: [
    { id: 'overview',  title: '总览',       sub: '系统研究近况一览', icon: '📊' },
    { id: 'tasks',     title: '任务',       sub: '每个任务 = 一张卡片，按状态筛选', icon: '✅' },
    { id: 'ideas',     title: 'Ideas',      sub: '候选 Idea 排行与详情 · 🟦 A轨 YOLO / 🟪 B轨 DETR / ⬜ 双轨通用', icon: '💡' },
    { id: 'kb',        title: '知识库',     sub: '点击卡片查看详情', icon: '📚' },
    { id: 'papers',    title: '论文',       sub: '按质量标准分类的论文数据库 · 点击卡片可查看论文详情', icon: '📄' },
    { id: 'decisions', title: '决策与日志', sub: '研究决策与日志记录', icon: '🧭' }
  ],

  // A/B 轨道配置 (Ideas 视图使用)
  trackMeta: {
    a: {
      chip: 'A轨·YOLO',
      short: 'A轨',
      cls: 'track-a',
      name: '🟦 A轨 · YOLO 系 (21)',
      desc: '基线 YOLO11+Ultralytics;#5 v3.3 层级+空间双维/#11 v2.0 频域双模/#43 频域MoE路由/#38 频谱NMS'
    },
    b: {
      chip: 'B轨·DETR',
      short: 'B轨',
      cls: 'track-b',
      name: '🟪 B轨 · DETR 系 (4)',
      desc: '基线 D-FINE(选型初判);副线仅保留判据/概念层;#30 免监督频谱判据→token条件计算'
    },
    c: {
      chip: '双轨通用',
      short: '通用',
      cls: 'track-c',
      name: '⬜ C类 · 通用理论 (17)',
      desc: '判据层/理论框架与检测器解耦;#42 训练-推理解耦分析性论文(70%文档推演·最高可推进性)'
    },
    d: {
      chip: 'OBB',
      short: 'OBB',
      cls: 'track-d',
      name: '🟠 OBB · 旋转检测 (2)',
      desc: '#17 YOLO版ADR角度分布/#44 OBB旋转框双维LA(VALA→OBB扩展·FAA频域角度先验)'
    }
  },

  // 知识库配置 (KB 视图使用)
  kbFiles: [
    { file: 'backbone.md',     name: '主干网络',  icon: '🦴' },
    { file: 'neck.md',         name: '特征融合',  icon: '🔗' },
    { file: 'head.md',         name: '检测头',    icon: '🎯' },
    { file: 'attention.md',    name: '注意力',    icon: '👁️' },
    { file: 'loss.md',         name: '损失函数',  icon: '📉' },
    { file: 'training.md',     name: '训练策略',  icon: '🏋️' },
    { file: 'augmentation.md', name: '数据增强',  icon: '🎨' },
    { file: 'dataset.md',      name: '数据集',    icon: '🗂️' },
    { file: 'timeline.md',     name: '时间线',    icon: '🕐' },
    { file: 'compare.md',      name: '模型对比',  icon: '⚖️' },
    { file: 'sota.md',         name: 'SOTA 记录', icon: '🏅' },
    { file: 'research_gap.md', name: '研究缺口',  icon: '🕳️' },
    { file: 'future_work.md',  name: '未来工作',  icon: '🚀' },
    { file: 'detr_map.md',     name: 'B轨·DETR地图', icon: '🟪' }
  ],

  // Markdown 渲染时的关键字图标映射表 (全局通用)
  iconMaps: {
    kb: {
      'Model': '⚖️', '比较': '⚖️', '对比': '⚖️', 'Compare': '⚖️',
      '损失': '📉', 'Loss': '📉', '训练': '🏋️', 'Training': '🏋️',
      '数据': '🗂️', 'Dataset': '🗂️', '增强': '🎨',
      '注意力': '👁️', 'Attention': '👁️', '主干': '🦴', 'Backbone': '🦴', '网络': '🦴',
      'Neck': '🔗', '融合': '🔗', '检测头': '🎯', 'Head': '🎯',
      '时间': '🕐', 'Timeline': '🕐', 'SOTA': '🏅', '记录': '🏅',
      '缺口': '🕳️', 'Gap': '🕳️', 'Research': '🕳️', '未来': '🚀', 'Future': '🚀', '结论': '📌', '关键': '📌'
    },
    decisions: {
      '决策': '🧭', 'Decision': '🧭', '202': '📅'
    },
    paperSummary: {
      '论文': '📄', '一句话': '💡', '核心方法': '⚙️', '方法': '⚙️', '小目标': '🎯',
      '结果': '📊', '实验': '📊', '性能': '📊', '关系': '🔗', '本项目': '🔗',
      '借鉴': '💎', '参考': '💎', '总结': '📌', '结论': '📌', '局限': '⚠️'
    }
  }
};
