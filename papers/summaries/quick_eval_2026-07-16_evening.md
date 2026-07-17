# 快速评估：2026-07-16 晚间检索新增

---

## 1. YOLO26 STAL — 技术细节已确认 ✅

> 论文：YOLO26 (arXiv 2606.03748) | 来源：ar5iv HTML 全文

### STAL 机制（完整理解）

**问题**：TAL 的候选锚点筛选要求锚点中心落在 GT 框内。对于尺寸小于特征图 stride 的极小目标，GT 框内可能完全不包含任何锚点中心 → 零正样本 → 无梯度。

**方案**：在**候选筛选阶段**使用膨胀后的代理框 $\tilde{g}_i$：
$$\tilde{d}_i = \begin{cases} s_{\text{ref}}, & d_i < s_{\min} \\ d_i, & \text{otherwise} \end{cases}$$

- $s_{\min} = 8$（最小 stride），$s_{\text{ref}} = 16$（第二级 stride）
- 膨胀**仅影响候选筛选 mask**，不影响回归目标和 task-aligned scoring
- "检测器仍然针对真实目标范围进行优化"

### 实验结果（YOLO11s + COCO）

| 方法 | s_ref | AP | AP_S | AP_M | AP_L |
|------|-------|-----|------|------|------|
| TAL | - | 46.6 | 29.0 | 51.4 | 63.9 |
| STAL | 8 | 46.6 | 27.7 | 51.6 | 63.8 |
| **STAL** | **16** | **46.8** | **29.6** | **51.6** | **63.8** |
| STAL | 32 | 46.5 | 28.3 | 51.3 | 63.7 |

> s_ref=8 太弱、s_ref=32 过度膨胀 → 16 最优（恰好是下一级 stride）

### 对项目的影响

| 维度 | 评估 |
|------|------|
| **与 Idea#12 (KLD) 的关系** | **互补，非竞争！** STAL 解决候选筛选阶段"有无正样本"的问题；KLD 解决正样本质量评估阶段"如何更好度量匹配度"的问题。两者作用于标签分配的不同阶段 → 可叠加使用 |
| **对 #6 SLE baseline 的影响** | STAL 是 YOLO26 的默认组件，可直接整合到 #6 的 YOLO11 SLE baseline 中 → 作为"升级版 baseline" |
| **工程难度** | 极低（修改候选框尺寸判断逻辑，~20 行代码） |
| **行动** | #6 baseline 实现时默认启用 STAL；#12 KLD 在 STAL 基础上叠加 |

---

## 2. Mask-Guided Feature Distillation (IEEE 2026 会议)

> "Distillation-Based Compression from YOLOv5x to YOLOv5n" | 桂林 2026.04

### 核心机制

- **Mask 生成方式**：基于 anchor-GT IoU + teacher objectness score
- **蒸馏位置**：Neck 融合特征层 + 检测头输出
- **Teacher→Student**：YOLOv5x → YOLOv5n
- **结果**：mAP@0.5 +2.51, Precision +12.28

### 对 Idea#7 的影响

| 维度 | Mask-Guided (IEEE'26) | Idea#7 (语义熵加权) |
|------|----------------------|---------------------|
| 权重来源 | Teacher objectness + IoU | CLIP 语义熵 |
| 粒度 | 框级（per-anchor） | 空间级（per-token） |
| 适用场景 | 通用检测 | 小目标检测（天然高熵→高权重） |
| 额外模型 | 不需要（仅用 teacher 自身信号） | 需要 VLM（CLIP 嵌入） |

> **关键区分**：Mask-Guided 用 "teacher 自己觉得哪里重要"，Idea#7 用 "VLM 语义视角觉得哪里不确定"——两者判据来源不同，但都做"加权蒸馏"。**Mask-Guided 应作为 Idea#7 的 Related Work baseline**。

---

## 3. NSSA (Scientific Reports 2026) — ⚠️ 付费墙，仅摘要

> "Dynamic Element-Activated Non-Semantic Sparse Attention for Remote Sensing Small Object Detection"

### 已知信息（来自搜索摘要）

- **三大组件**：NSSA（非语义稀疏注意力）+ DyT 跨层通道注意力 + 扩散小波卷积
- **NSSA 核心**：在局部 patch 内计算自注意力，聚焦纹理/边缘（非语义）→ 改进遮挡小目标
- **数据集**：VisDrone + AI-TODv2
- **发表**：Scientific Reports (Nature) 2026.03

### 对 Idea#11 的影响

- NSSA 的 "非语义稀疏注意力" 将稀疏性与非语义（纹理/边缘）结合 → 这与 #11 的 "频域判据（非语义）→ 稀疏化 P2 计算" 有**概念相似性**
- **但 NSSA 仍做特征增强**（稀疏注意力→更好的特征），不是条件计算（频域→跳过冗余计算）
- ⚠️ NSSA 的位置在 Nature Scientific Reports → 若它也提 "非语义判据引导计算分配" 则对 #11 构成竞争 → 需要全文确认
- 当前判断：基于摘要信息，NSSA 是另一个 "频域+稀疏化但做特征增强" 的工作 → **不改变 #11 差异化判断**

---

## 4. 其他轻量化/蒸馏/注意力论文

| 论文 | 核心 | 与项目关系 |
|------|------|-----------|
| **LCW-YOLO** (2025) | Wavelet Pooling + CGBlock + LDHead in YOLOv11 | 小波池化在 YOLO Neck → 但属于模块拼装型，不做条件计算 |
| **LGHVSS-Mamba YOLO** (2026) | Mamba + YOLO11, VisDrone +7.7% | Mamba 架构进入 YOLO → 架构趋势信号，但不直接竞争 |
| **LYA-YOLO** (2025) | 参数-85%, FLOPs-70% on VisDrone | 极致轻量化 → 可作为边缘部署参考 |
| **SARD** (CVPR 2026) | Structure-Aware 蒸馏（分割） | 结构重要性图→蒸馏权重 → 与 #7 蒸馏加权思路相似，但在分割领域 |
| **SF-DETR** (2026) | 空频协同 + 极性感知注意力 | DETR 专属，不做条件计算 → 不威胁 |
| **EMSANet** (2026) | 跨层对齐注意力 + 上下文差分聚焦 | 注意力型特征增强 → 不直接竞争 |

---

## 5. 总结

### 关键发现

| 优先级 | 发现 | 行动 |
|--------|------|------|
| 🔴 | **YOLO26 STAL 细节已完全理解** → 与 #12 互补而非竞争 | #6 baseline 默认启用；#12 叠加设计 |
| 🟡 | **Mask-Guided Distillation** → #7 的新 Related Work baseline（teacher objectness vs VLM entropy） | #7 设计文档补充引用 |
| 🟡 | **NSSA** → 非语义稀疏注意力，需全文确认是否威胁 #11 | 暂挂；若获全文再评估 |
| 🟢 | 轻量化/蒸馏/注意力各方向均有新作但均为"特征增强"型 → #5/#11/#7 的"条件计算"差异化保持 |

### 累计论文状态

- 已读/深度总结：**26 篇**
- 快速评估：**+2 篇**（FDConv, YOLOv12） + **本次新增 ~8 篇轻量级/蒸馏扫描** → 实际新增高相关评估：**STAL(技术细节确认) + Mask-Guided Distillation(Related Work) + NSSA(待全文)**
- 总覆盖：~36 篇（含快速扫描）

---

*Generated: 2026-07-16 晚间 | Agent: Claude Code*
