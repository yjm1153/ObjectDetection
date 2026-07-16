# Research Workflow v2.0

## State Machine
```
INIT → LITERATURE → KNOWLEDGE → RESEARCH_GAP → IDEA → DESIGN → INIT (无限循环)
```
每完成一步自动进入下一步。不跳步、不遗漏。

## State Details

### INIT — 恢复项目状态
读取 README | TASKS | Knowledge Base | Ideas | Decision | Research。恢复整个项目状态后进入 LITERATURE。

### LITERATURE — 阅读论文
若 papers/pdf/ 存在未读论文 → 执行 Paper Reading Protocol（见 AGENT.md）。论文全部读完 → 进入 KNOWLEDGE。

### KNOWLEDGE — 整理知识体系
整理 Backbone | Neck | Head | Loss | Attention | Training | Augmentation | Dataset | Timeline | Compare | SOTA | Research Gap | Future Work。知识完整 → 进入 RESEARCH_GAP。

### RESEARCH_GAP — 寻找研究缺口
回答：还有什么没解决？为什么？有没有新方向？至少提出3个Idea。Idea足够 → 进入 IDEA。

### IDEA — 评估Idea
每个Idea按 Novelty | Difficulty | Potential | Cost | Risk | Impact 评分排序。选最优 → 进入 DESIGN。

### DESIGN — 设计研究方向
生成：方向名称 | 解决问题 | 与现有方法区别 | 创新点摘要 | 预计提升 | 技术路线概要 | 资源评估 | 风险分析 | 实验方案概要。完成后保存到 Ideas/ 并回到 INIT。

## Failure Recovery
| 情况 | 处理 |
|------|------|
| 知识整理陷入重复 | 停止 → 回 RESEARCH_GAP 找新角度 |
| 无法提出新Idea | 回 LITERATURE 读更多论文 |
| 多个Idea评分都很低 | 回 LITERATURE 扩大阅读范围 |

## Reporting Cadence
- **每日**：更新 README | TASKS | Knowledge Base | Ideas | Decision | Journal
- **每周**：统计论文数 | 新增知识条目 | 新增Gap | 新增Idea | 验证Idea | 设计方案数 | 当前问题 | 未来计划
- **每月**：汇总月度产出，生成 Monthly Report
