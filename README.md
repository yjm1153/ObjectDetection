# Object Detection Research Project v2.0 — 创新发现阶段

## Project Info
- **方向**：Object Detection（YOLO Series | RT-DETR | Transformer Detector | Small/Tiny Object Detection | Remote Sensing | Lightweight | Real-time | Knowledge Distillation | Model Compression）
- **基线**：YOLO11 + Ultralytics
- **数据集**：VisDrone（主）| COCO | DOTA | UAVDT | VOC

## Current Status
- **阶段**：`文献调研`（进度：🟩 12篇已读；实验类任务 ⏸ 暂缓——2026-07-15 用户决策：数据集/GPU 暂不提供）
- **文献模式**：arXiv 公开渠道自动抓取（**仅限 2025 年及以后论文**；更早论文待用户提供）
- **目标**：文献调研 → 知识库构建 → 研究缺口发现 → Idea 提出与评估 → 方向设计
- **本轮更新(2026-07-16)**：+5篇(累计12篇)；发现频域小目标 2025–2026 浪潮(SET/DERNet/SFDNet 三篇独立)← #11 novelty 上调；"坚持 YOLO"决策第三次确认(D3Q)；#5 新增 PBM 路线竞争论述

## Research Progress
| 指标 | 数量 |
|------|------|
| 已读论文 | 12 |
| 已总结论文 | 12 |
| 已对比论文 | 12 |
| SOTA 最近更新 | 是（2026-07-15）|

## Knowledge Base Status
| Backbone | Neck | Head | Loss | Attention | Training | Augmentation | Dataset | Timeline | Compare | Research Gap | Future Work |
|----------|------|------|------|-----------|----------|-------------|---------|----------|---------|-------------|-------------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⬜ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Idea Pipeline
| 候选Idea | 已验证Idea | 已设计方向 |
|----------|-----------|-----------|
| 12 | 0 | 0 |

## Current Ideas（按 innovation_ranking 排序）
| # | Idea | Status |
|---|------|--------|
| 5 | 语义熵引导的 P2 特征稀疏化（SEEN-DA×SEMA 交叉）| 候选 Rank1，**查新✅通过**，待熵-尺度预实验 |
| 7 | 语义熵图引导知识蒸馏 | 候选 Rank2 |
| 6 | SLE(P2头+截短backbone) 迁移 VisDrone | 候选，最先执行（baseline 地基）|
| 11 | 高频能量引导 P2 稀疏化（免 VLM）| 候选 Rank4，#5 备胎/对照，预实验共用 |
| 8 | 尺度感知语义熵（分层 prompt）| 候选，可并入 #5/#7 |
| 9 | GCP-ASFF vs AFPN 同基准对照 | 候选（吸收旧 Idea#1）|
| 12 | KLD 分布匹配分配迁移 P2 头 | 候选，#6 增强件同批执行 |
| 10 | RFA-ASFF 协同机制分析 | 候选，低优先 |
| 2–4 | Attention / 特征融合 / Loss 改进（旧）| 待具体化 |

## Current Problems
1. Small object accuracy is low → #5 #6 直接相关
2. Large computational cost → #5（稀疏化）直接相关
3. Backbone lacks feature interaction → SEEN-DA 的语义引导思路可借鉴
4. Need better Neck → #9 对照实验给出决策依据

## Key Research Gap（详见 Knowledge Base/research_gap.md）
- 语义信息（VLM 文本嵌入）从未进入实时检测器的特征提取/融合阶段
- P2 检测头的稀疏化/条件计算完全空白（**已查新验证**，2026-07-15）
- 交叉 Gap：熵引导的浅层特征稀疏化 = 精度与算力痛点同时求解
- 新增：频域信息只在图像级粗糙使用，高频能量作免训练空间先验空白（SFIDM 启发）
- 新增：开集检测（OVD）线与小目标线从未交汇——YOLO-World 无 P2、文本只进 P3–P5（结构层面再证 #5 Gap）
- ⚠️ **2026-07-16 新增**: 频域小目标检测 2025–2026 浪潮(3篇独立)——但全部做特征增强,无人做条件计算/稀疏化(=#11 差异化生命线)
- ⚠️ **2026-07-16 新增**: TinyFormer 的 PBM(跨层捷径)是 P2 头的替代方案——"稠密传递 vs 选择性传递"的路线竞争待回答

## Next Steps
1. 继续阅读（仅 2025+ 自动抓取）：频域方向确认无遗漏 → 2025–2026 小目标检测新作持续检索
2. ⏸ 待用户提供 PDF：DQ-DETR(ECCV 2024)、SViT、FcaNet/FreqFusion、FFCA-YOLO、DINO 系（2025 前）
3. ⏸ 暂缓（待数据集/GPU）：熵图+高频能量图预实验、SLE baseline 复现（#6+#12）、YOLOE 熵分布验证
4. #5 关键件更新(2026-07-16)：新增 PBM 路线竞争论述(稠密 vs 选择性传递)；SET 证伪"绝对高频判据"→加强语义判据叙事
5. #11 关键更新(2026-07-16)：Novelty ★★★★☆；判据修正为"高频局部异常度"；频域竞争者三篇均为特征增强→条件计算完全空白
6. "坚持 YOLO"三次确认(SEEN-DA/SEMA→RT-DETR 落后→D3Q 无压倒优势)构成完整证据链

## Roadmap
| 阶段 | 状态 |
|------|------|
| 1. 阅读论文 | 🟩 进行中（12篇）|
| 2. 总结论文 | 🟩 进行中（12篇）|
| 3. 构建知识库 | 🟨 骨架已填充 |
| 4. 分析研究缺口 | 🟨 5个Gap+1个交叉Gap（#5已查新）|
| 5. 提出并评估 Idea | 🟨 8个新候选已评分 |
| 6. 设计研究方向 | ⬜ |

## Records
| 类型 | 表格 |
|------|------|
| Idea 历史 | 见 Ideas/innovation_ranking.md |
| 阅读历史 | SEEN-DA（CVPR 2025）✅ \| SEMA-YOLO（RS 2025）✅ \| SFIDM（RS 2025）✅ \| RFLA（ECCV 2022）✅ \| YOLO-World（CVPR 2024）✅ \| YOLOE（arXiv 2025）✅ \| Token Cropr（CVPR 2025）✅ \| TinyFormer（arXiv 2026）✅ \| DERNet（arXiv 2026）✅ \| SET（CVPR 2025）✅ \| D3Q（JSTARS 2025）✅ \| SFDNet（ECCV 2026）✅ |
| 方向设计历史 | 暂无 |

---
*Last Update: 2026-07-15 | Maintainer: OpenCode Research Agent*
