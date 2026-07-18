# 快速评估：密集遮挡 L1 + DETR DX1 文献检索（2026-07-18）

> 双线并行检索轮：🔴密集遮挡方向（最薄弱优先）+ 🟪DETR专属论文补读（DX1）
> 共命中 25+ 篇候选论文，经相关性筛选后记录 22 篇

---

## 🔴 密集遮挡方向 — 13 篇核心命中

### 一、标签分配（Label Assignment）— 3 篇

#### 1. DALA: Density-aware Adaptive Label Assignment for End-to-End Dense Detection in Drone Images
- **来源**: Liu et al., Expert Systems with Applications 2026
- **链接**: https://www.sciencedirect.com/science/article/abs/pii/S0957417426020981
- **核心方法**: 按空间密度将目标分为密集/稀疏两类 → 密集用 O2O 避免重复预测、稀疏用 Decreasing LA 逐步减少正样本
- **验证**: FCOS/RetinaNet/ATSS/GFL on VisDrone/COCO/CrowdHuman
- **关联**: 🔴密集遮挡 — 直接相关。**首个将密度显式建模进标签分配的工作**，也是本项目密集方向的核心 Gap 候选
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 2. FSS: Focusing on Suboptimal Samples for Detector-Agnostic Label Assignment
- **来源**: ScienceDirect 2026
- **核心方法**: 将标签分配重构为选择高质量次优样本→渐进优化→最优；实例概率矩阵+Gaussian-prior dynamic-k；**零推理开销**
- **验证**: 50.8 AP single-model single-scale
- **关联**: 密集场景下次优样本被误杀→FSS 通过概率矩阵保留边界样本
- **判据**: ⚡快速评估 → 推荐🔬深读（与 #12 KLD 互补）

#### 3. RFAssigner: A Generic Label Assignment Strategy for Dense Object Detection
- **来源**: Guan et al., arXiv 2026
- **核心方法**: 增强密集检测器多尺度学习能力的通用标签分配，无辅助模块即可 SOTA
- **关联**: 密集遮挡 — 多尺度标签分配
- **判据**: ⚡快速评估 → 关注，待全文

---

### 二、遮挡感知损失函数 — 4 篇

#### 4. Occlusion Perception Loss (OPL) — "Insight any invisible"
- **来源**: Expert Systems with Applications 2025/2026
- **链接**: https://www.sciencedirect.com/science/article/abs/pii/S0957417425030805
- **核心方法**: 显式遮挡感知学习范式：从 GT bbox 重叠区域提取遮挡图 + 高斯模糊 → Occlusion Perception Decoder 监督 → 预测遮挡区域语义
- **关键数字**: 遮挡目标召回率 **95.4%**（+22.6%）
- **关联**: 🔴密集遮挡 — 直接相关。首个显式建模遮挡语义的损失函数方向
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 5. DOMino-YOLO: OAR-Loss (Occlusion-Aware Repulsion Loss)
- **来源**: 2025/2026, UAV vehicle detection
- **核心方法**: 将传统 Repulsion Loss + Visibility-Weighted Classification Loss → 同时抑制冗余预测 + 强调严重遮挡目标
- **关联**: Repulsion Loss 2025 变体，结合遮挡可见度权重
- **判据**: ⚡快速评估 → 推荐🔬深读（Repulsion Loss 演进线核心节点）

#### 6. FragmentAware Focal Loss (FAFL) — Compositional Loss Framework
- **来源**: IEEE Conference May 2026
- **核心方法**: 五组件组合式损失：Visibility-weighted cls loss + Feature consistency regularization + Geometric alignment loss + Entropic regularization + Attention-guided weighting
- **关键数字**: 50% 遮挡下 89.7% mAP vs Focal Loss 58.3%（**+53.9% 相对提升**）
- **关联**: 遮挡损失的理论框架——五组件中"Entropic regularization"与 #5 熵判据有潜在交叉
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 7. Focal-EIoU Loss + Occlusion Aware Context Attention
- **来源**: Scientific Reports 2026, THz imaging
- **核心方法**: Focal-EIoU 替换 CIoU → 减少简单样本关注度 + Occlusion Aware Context Attention
- **关键数字**: mAP50 75.5%→83.7%
- **关联**: 部分相关 — 损失函数层面
- **判据**: ⚡快速评估 → 关注但不优先

---

### 三、密集场景 NMS/后处理 — 2 篇

#### 8. NWD-Soft-NMS (MFF-YOLO)
- **来源**: 2025, aerial small-object detection
- **核心方法**: Normalized Wasserstein Distance 替代 IoU 进 Soft-NMS 衰减函数
- **关键数字**: VisDrone **+9.0% mAP**
- **关联**: 🔴密集遮挡 — Soft-NMS 2025 变体，NWD 距离度量对小目标敏感
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 9. SCS-YOLO: Occlusion-Robust Detection Based on YOLO12
- **来源**: Springer 2026
- **核心方法**: ACmix attention + Gaussian Soft-NMS
- **关键数字**: 挑战类别 +24.24%–42.89%
- **关联**: 密集场景 NMS 改进
- **判据**: ⚡快速评估 → 关注但不优先

---

### 四、UAV 密集遮挡检测架构 — 4 篇

#### 10. DRONet: Occlusion-Mastering Multi-Object Detection for UAVs
- **来源**: ScienceDirect 2026
- **核心方法**: OAKB（KAN+GRAM 多项式展开增强遮挡/碎片目标判别）+ PSI（部分卷积跨尺度通道混合）+ SDEA（可扩展膨胀高效聚合）
- **关键数字**: VisDrone **50.1% mAP@0.5** @ 60 FPS
- **关联**: 🔴密集遮挡 — VisDrone 密集场景专用架构
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 11. HEdge-MamYOLO: High-Frequency Edge + Mamba for Drone Small-Object Detection
- **来源**: IEEE April 2026
- **核心方法**: FM-CHFEM（频域+Mamba 协同高频增强模块）→ 提取遮挡目标高频边缘 + Mamba 全局选择性扫描 + 空间相似性修复
- **关键数字**: VisDrone **52.5% mAP50**（本次检索 VisDrone 最高）
- **关联**: 🔴密集遮挡 × 频域 — 频域+Mamba 联合处理遮挡
- **判据**: ⚡快速评估 → 推荐🔬深读（频域+Mamba 新范式）

#### 12. GCS-DETR: Global Context-Driven Detection with Occlusion Suppression
- **来源**: Multimedia Systems May 2026
- **核心方法**: FreqDyNet（频域动态骨干轻量滤波）+ OAM-FPN（小波变换+自适应多分支融合+混合注意力）+ NWD-MPDIoU loss
- **关键数字**: VisDrone +3.0–3.5%, RT-DETR 基座, 参数 −20.6%, Jetson Orin Nano 实时
- **关联**: 🔴密集遮挡 × DETR — DETR 架构下的遮挡抑制方案
- **判据**: ⚡快速评估 → 推荐🔬深读（DETR + 频域 + 遮挡三交叉）

#### 13. Aero-LiteNet: Robust Aerial Small Object Detection
- **来源**: Scientific Reports 2026
- **核心方法**: CASAM（跨维空间小目标注意力）+ NAIoU（邻域感知 IoU，惩罚密集场景过度重叠）
- **关键数字**: 48.1% mAP@50, RK3588 INT8 @ 53 FPS
- **关联**: 密集遮挡 — NAIoU loss 直接针对密集重叠场景
- **判据**: ⚡快速评估 → 关注但不优先

---

## 🟪 DETR DX1 方向 — 9 篇核心命中

### 五、DETR × 密集遮挡/Query 冲突 — 4 篇

#### 14. Adaptive Query Allocation for Dense Object Detection in Deformable Transformers
- **来源**: Ha et al., Results in Engineering 2025
- **链接**: https://www.sciencedirect.com/science/article/pii/S2590123025036163
- **核心方法**: 密度图引导的动态 query 选择机制 → 密集区域多分配 query、稀疏区域少分配；基于 Deformable DETR
- **关联**: 🟪DETR×密集 — **直接命中 DETR query 冲突方向**。与 DQ-DETR/D3Q/Dome-PAQI 的区别：密度图显式输入（非学习式分档）
- **判据**: ⚡快速评估 → 推荐🔬深读（DETR 密集 query 分配新方案，需与 DQ-DETR/D3Q/Dome-PAQI 划界）

#### 15. Pe-DETR: Densely Different Queries for Pedestrian Detection
- **来源**: Computer Engineering 2026
- **核心方法**: Dino-DETR + Swin Transformer-L → 密集不同 query 处理密集行人场景，"不引入无效相似 query"
- **关键数字**: CrowdHuman +3.7 AP@0.5 / +4.5 AP
- **关联**: 🟪DETR×密集 — DETR 密集行人检测，query 差异化策略
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 16. SCOPE-DETR: Surveillance Context-Oriented Perception-Enhanced Transformer
- **来源**: Digital Signal Processing 2026
- **核心方法**: 温度参数化动态调节空间注意力分布 + 通道能量抑制 → 防止密集区域注意力稀释
- **关联**: 🟪DETR×密集 — Cross-Attn 层面的注意力稀释解决方案
- **判据**: ⚡快速评估 → 推荐🔬深读（Cross-Attn 分析视角，与 #30 的 token 判据互补）

#### 17. RT-DETR-DV: Dense Vehicle Feature Separation
- **来源**: Ou et al., 广东工业大学学报 2026
- **核心方法**: DVFS 模块 — FPN 分支显式分离重叠车辆特征，解决多目标竞争同一 query 表示
- **关联**: 🟪DETR×密集 — 特征分离解决 query 冲突
- **判据**: ⚡快速评估 → 关注但不优先（中文期刊）

---

### 六、DETR × OBB 旋转检测 — 3 篇

#### 18. RS-DETR: Rotation and Semantic Co-Aware Transformer
- **来源**: Engineering Applications of AI 2025
- **核心方法**: RSCA（旋转-语义协同注意力双分支解码器）+ ACA-FE（自适应上下文聚合特征增强）+ mask-constrained Hungarian matching
- **性能**: DIOR-R/DOTA-v1.0/DOTA-v2.0 SOTA
- **关联**: 🟪DETR×OBB — O² 以外的 DETR 旋转检测新方案，双分支解码器设计可与 #30 判据交叉
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 19. RO²-DETR: Rotation-Equivariant Oriented Detection Transformer
- **来源**: ISPRS Journal of Photogrammetry and Remote Sensing 2025
- **核心方法**: 1D 旋转等变卷积核（圆周平滑）+ 定向可变形解码器（2D 高斯分布嵌入）+ o2m 匹配
- **性能**: DOTA 77.82% / HRSC2016 97.47% / DIOR-R 66.43%
- **关联**: 🟪DETR×OBB — 旋转等变 backbone + 定向 decoder，比 O² 更深入旋转建模
- **判据**: ⚡快速评估 → 推荐🔬深读

#### 20. Hausdorff Distance Matching with Adaptive Query Denoising for Rotated DETR
- **来源**: WACV 2025
- **核心方法**: Hausdorff 距离→匈牙利匹配代价（解决角度边界不连续）+ Adaptive Query Denoising（选择性去噪）
- **性能**: DOTA-v2.0 +4.18 / DOTA-v1.5 +4.59 / DIOR-R +4.99 AP50
- **关联**: 🟪DETR×OBB + Bipartite Matching — 旋转框二分匹配改进
- **判据**: ⚡快速评估 → 推荐🔬深读

---

### 七、DETR 机制分析/理论 — 2 篇

#### 21. Dynamic DETR: Not All Tokens Matter All The Time (ICML 2025)
- **来源**: Cheng et al., Northwestern Polytechnical University, ICML 2025
- **核心方法**: 多级 token 稀疏化——低层用近端聚合（保留空间完整性）、高层用整体策略（捕获全局上下文）+ 中心距离正则化
- **关键发现**: token 重要性随 encoder 层级变化——低层需保留空间完整性，高层可大幅稀疏化
- **关联**: 🟪B轨 — **概念红线上已标记但无深读**，对 #30 token 判据的 encoder 层级分布有直接参考价值
- **判据**: ⚡快速评估 → **必须🔬深读**（概念红线缺口填补，对 #30 判据层级分布有直接指导）

#### 22. Predictive Imbalance in Bipartite Matching (IEEE Dec 2025)
- **来源**: IEEE 2025
- **核心方法**: 识别二分匹配中的预测不平衡（高分类置信度常伴随低定位精度）→ LAD loss 对齐分类分数与定位精度 + 简化三角 loss
- **性能**: 51.5 AP ResNet-50 COCO 无额外计算开销
- **关联**: 🟪B轨 Bipartite Matching 稳定性 — 首次定量分析分类-定位不一致对匹配稳定性的影响
- **判据**: ⚡快速评估 → 推荐🔬深读（二分匹配稳定性 Gap 的核心文献）

---

## 补充快速关注（不占深读配额）

- **PPM-YOLOv11** (MDPI Sensors 2026): P2 头 + MultiSEAM 遮挡补偿注意力, VisDrone 40.9%
- **MAF-YOLO** (IEEE 2025/2026): P2 高分辨率头 + RAAF-FPN, +6.4% mAP50
- **EIVE** (arXiv June 2026): DETR Cross-Attn 作为实例级可解释性信号——可作为 Cross-Attn 分析工具
- **Salience DETR** (CVPR 2024→2026影响): 尺度无关显著性监督 + 层级 query 过滤——scale-aware query 初始化
- **MR-DETR** (2025): AQAS 自适应 query 分配——密度动态调整 query 数
- **Fair-DETR** (2025-2026): 双强约束 query 选择 + 自适应多尺度注意力编码器
- **DisCo DETR** (AAAI 2026): 距离感知多视图对比预训练——二分匹配稳定性（预训练视角）
- **LoRA-DETR** (AAAI 2026): 多样化标签分配策略集成到 DETR——训练时多分支推理时丢弃
- **Detection Transformers Under the Knife** (BMVC 2025): DETR 消融研究——Cross-Attn 关键性分析

---

## 深读优先级排序

| 优先级 | 论文 | 方向 | 理由 |
|--------|------|------|------|
| **P0** | Dynamic DETR (ICML 2025) | DETR 机制 | 概念红线缺口，对 #30 token 层级分布直接指导 |
| **P0** | DALA (ESA 2026) | 密集遮挡 | 首个密度显式建模标签分配，密集方向核心 Gap |
| **P0** | OPL (ESA 2025/2026) | 密集遮挡 | 首个显式遮挡感知损失，开启遮挡 loss 线 |
| **P1** | Adaptive Query Allocation (2025) | DETR×密集 | 直接命中 DETR query 冲突，需与 DQ-DETR/D3Q 划界 |
| **P1** | Pe-DETR (2026) | DETR×密集 | DETR 密集行人检测，query 差异化策略 |
| **P1** | SCOPE-DETR (2026) | DETR×密集 | Cross-Attn 注意力稀释，与 #30 互补 |
| **P1** | DOMino-YOLO OAR-Loss | 密集遮挡 | Repulsion Loss 2025 演进核心节点 |
| **P1** | DRONet (2026) | 密集遮挡 | VisDrone 密集场景专用架构，50.1% mAP |
| **P1** | HEdge-MamYOLO (2026) | 密集遮挡 | 频域+Mamba 新范式，52.5% VisDrone 最高 |
| **P1** | FAFL (IEEE 2026) | 密集遮挡 | 五组件遮挡损失框架，"Entropic regularization"×#5 交叉 |
| **P1** | RS-DETR (2025) | DETR×OBB | O² 以外 DETR 旋转方案，双分支 decoder |
| **P1** | Hausdorff Distance Matching (WACV 2025) | DETR×OBB+匹配 | 旋转框二分匹配改进 |
| **P2** | Predictive Imbalance (IEEE 2025) | DETR 匹配 | 分类-定位不一致定量分析 |
| **P2** | RO²-DETR (ISPRS 2025) | DETR×OBB | 旋转等变 DETR，深入旋转建模 |
| **P2** | GCS-DETR (2026) | 密集×DETR×频域 | 三交叉但可能过于工程化 |
| **P2** | NWD-Soft-NMS MFF-YOLO (2025) | 密集遮挡 | Soft-NMS 2025 变体，VisDrone +9.0% |
| **P2** | RFAssigner (2026) | 密集遮挡 | 通用多尺度标签分配 |
| **P2** | FSS (2026) | 密集遮挡 | 次优样本聚焦，50.8 AP |

---

## 初步 Gap 确认

### 🔴 密集遮挡方向 Gap 初判

| Gap | 状态 | 证据 |
|-----|------|------|
| 密度感知标签分配（Dense vs Sparse 不同策略） | **空白确认** | DALA 是首个密度显式建模进 LA 的工作(2026)，本项目可做首个密度感知 + 频域判据组合 |
| 遮挡感知 Repulsion Loss 2025 演进 | **空白确认** | DOMino-YOLO OAR-Loss 是 Repulsion Loss 2025 唯一可见变体；未见将频域判据引入排斥损失的工作 |
| Soft-NMS + 可学习距离度量 | **有基础但可切入** | NWD-Soft-NMS 2025 已验证 +9.0%；频域距离度量进 NMS 仍是空白 |
| 遮挡特征恢复 × 频域 | **空白确认** | HEdge-MamYOLO 用频域+Mamba 恢复遮挡边缘，但无人做频域判据→选择性恢复 |

### 🟪 DETR DX1 Gap 初判

| Gap | 状态 | 证据 |
|-----|------|------|
| DETR Query 冲突 → 密度自适应 query | **有竞争但可切入** | Adaptive Query Allocation(密度图)/Pe-DETR(query差异化)/SCOPE-DETR(注意力温度调控)——但都未引入免监督频域判据 |
| DETR × OBB 旋转检测 | **有基础可扩展** | RS-DETR(双分支decoder)/RO²-DETR(旋转等变)/Hausdorff Matching(匹配改进)——O²以外的新方案，但无人做 OBB×频域判据 |
| Cross-Attn 分析→encoder 冗余量化 | **新方向** | EIVE(可解释性)/BMVC 2025 消融——Cross-Attn 分析工具可用于 DETR 专属理论框架 |
| Bipartite Matching 稳定性（小目标/密集） | **可切入** | Predictive Imbalance(LAD loss)/Hausdorff Matching——但都未针对密集小目标场景 |
| DETR Encoder 动态 token 稀疏化 | **竞争激烈** | Dynamic DETR(ICML 2025)/MGS(MLSP 2025)/Sparse DETR——#30 需与 Dynamic DETR 显式划界 |

---

> 产出时间: 2026-07-18 | 下一动作: 按优先级启动深读（P0→P1→P2）
