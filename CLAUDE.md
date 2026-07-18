# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目性质

这不是代码工程，而是**AI 辅助的 Object Detection 科研项目**。当前处于文献调研→方向设计阶段，无训练代码、无实验脚本，纯文档驱动。Agent 的角色是自主推进科研流程，不是聊天机器人。

## 启动流程（每次启动严格按序）

1. 读 [README.md](README.md) → 恢复项目状态
2. 读 [TASKS.md](TASKS.md) → 找第一个未完成任务
3. 读 [AGENT.md](AGENT.md) → 加载行为规范
4. 读 [WORKFLOW.md](WORKFLOW.md) → 加载状态机
5. 读 Knowledge Base/ → 恢复知识状态
6. 读 Ideas/ → 恢复 Idea 状态
7. 读 Decision/ → 恢复决策状态
8. 读 Research/ → 恢复研究记录
9. 读 [Rules/](Rules/) → 加载质量标准
10. 分析当前状态 → 决定工作方向

## 研究架构：YOLO 为主 + DETR 交叉融合

用户于 2026-07-18 策略修订（推翻 2026-07-17 双轨并行决策）：

| 角色 | 定位 | 基线 | 主 Idea |
|------|------|------|---------|
| 🟦 YOLO 主线 | **唯一主战场** | YOLO11 + Ultralytics | #5 语义熵引导P2稀疏化、#11 高频能量引导P2稀疏化 |
| 🟪 DETR 交叉融合 | **副线·灵感源**（仅判据/概念层） | D-FINE (选型初判) | #30 免监督频谱判据（判据层通用，可服务YOLO） |

Idea 分类约定：🟦 = YOLO主线、🟪 = DETR交叉融合（副线）、⬜ = 通用理论。详见 [innovation_ranking.md](Ideas/innovation_ranking.md) 🧭 区块。

DETR 论文阅读新原则：每篇必须通过「YOLO 迁移过滤器」——"这对 YOLO 有什么用？"→ 能迁移就记录，不能就跳过（不进KB，不生成Idea）。

## 关键目录与约定

| 目录/文件 | 用途 |
|-----------|------|
| `Knowledge Base/` | 12类结构化知识 (backbone/neck/head/loss/attention/training/augmentation/dataset/compare/timeline/sota/research_gap + future_work + detr_map)。**只放提炼后的理解，不复制论文内容** |
| `papers/summaries/` | 单篇论文深度总结，必须包含：问题/动机/旧方法缺陷/创新/局限/可改进之处/≥3个可研究方向 |
| `papers/database.md` | 全项目文献结构化索引，八大主题分区×关联Idea×类型标记。每轮新增论文**追加一行** |
| `Ideas/` | Idea 候选池。candidate.md = 详情，innovation_ranking.md = 排序，validated.md = 已验证，discarded.md = 已抛弃 |
| `Decision/` | 决策记录：idea_selection / innovation_score / feasibility / risk_assessment / paper_selection / research_strategy / decision_history |
| `Research/` | 研究日志 journal.md（记录思考/失败/方向转变）+ research_history.md |
| `Prompts/` | 可复用 Prompt 模板（read_paper / summarize_paper / build_knowledge / compare_papers / design_direction / weekly_review 等） |

## 核心工作流

状态机（WORKFLOW.md）：`INIT → LITERATURE → KNOWLEDGE → RESEARCH_GAP → IDEA → DESIGN → INIT`（无限循环）。每步完成自动进入下一步。

### 论文阅读协议（AGENT.md，每篇必须完整执行）

1. 阅读全文 → 2. 生成 Summary → 3. 更新 Knowledge Base → 4. 更新 Compare → 5. 更新 Timeline → 6. 更新 Research Gap → 7. 提出≥3个 Candidate Ideas → 8. 多维度评分 → 9. 更新 Decision → 10. 更新 Journal → 11. 更新 README → 12. 更新 TASKS → 13. 继续下一篇（不停止）

### Idea Pipeline

Paper → Knowledge → Compare → Timeline → Research Gap → Candidate Idea → Evaluation → Validated Idea → Design Direction。**每个 Idea 必须完整分析：为什么想到？解决什么问题？创新在哪？与已有方法区别？风险？**

### 决策协议（不允许见一个 Idea 就建议开始）

分析已有工作 → 评估 Novelty → 评估 Risk → 评估 Feasibility → 综合评分排序 → 只有评分最高的方向才能建议进入下一阶段。

### Self Check（每项工作结束后逐项检查）

README → TASKS → Knowledge Base → Ideas → Decision → Research Journal。遗漏立即补充。

## 重要约定

### 文献来源标记
用户提供的文献及其衍生内容（database 条目/Summary/Idea注记）须标注 **【自】**；Agent 自主检索的文献不打标。初始投喂6篇（SEEN-DA/SEMA-YOLO/SFIDM/ACM-Coder/ALGS/GCA2Net），衍生 Idea #5–#12/#15。

### 文献抓取规则
以 2025+ 论文为主力。Pre-2025 关键基础方法可主动抓取（需标注年份），用于提供理论框架/技术基线/差异化判据。

### 实验类任务暂缓
实验模块未设计完成，所有实验类任务（训练/推理/CPU 分析/特征统计）全部 ⏸ 暂缓。只执行文献/文档/知识库类工作。

### 文风与质量
- 每篇论文必须产生新知识、新问题、新创新点，不能只写摘要
- Knowledge Base 只放提炼后的理解，不复制论文内容
- TASKS 永远不能空，完成一项立即新增下一项
- 所有 Markdown 统一格式、标题、编号、表格

## 项目当前状态快照

- **阶段**：文献调研→方向设计（47篇已读，35篇深读总结）
- **Knowledge Base**：12/12 全部完成 + detr_map B轨技术地图
- **Idea Pipeline**：26个候选（🟦15 / 🟪#30主+#14对照 / ⬜10）、0个已验证、**双轨设计文档栈闭环**（#5 v3.0 + #11 v1.1 + #7 技术基线 + #30 v1.0）
- **主要 Gap**：P2特征层稀疏化/条件计算（A轨确认空白）、频域判据→DETR token条件计算（B轨确认空白，⚠️ "DETR无浅层"已失效）
- **实验类**：全部 ⏸ 暂缓（无GPU/数据集/实验模块未设计）
- **跟踪项**：🔔 HF-DETR（SSMG判据→#30撞车裁决）+ Unmasking the Tiny（已降级普通近邻）+ Dome-DETR（已放码）
