# CrowdDet: Detection in Crowded Scenes — One Proposal, Multiple Predictions

> **Venue**: CVPR 2020 Oral | **Authors**: Xuangeng Chu, Anlin Zheng, Xiangyu Zhang, Jian Sun (旷视 Megvii)
> **类型**: 🔬 深读（经典补读·密集遮挡 L2） | **日期**: 2026-07-18
> **关联 Idea**: #35 频域遮挡先验 / DOMino-YOLO OAR-Loss / DETR set prediction vs CrowdDet set prediction

---

## 一、问题与动机

### 核心问题：单个 Proposal 无法区分高度重叠的不同实例

传统 proposal-based 检测器**每个 proposal 只预测一个实例**。在密集人群中：
- 相邻 proposal 提取的特征高度相似（重叠 > 70% 的个体共享大部分感受野）
- 期望模型从几乎相同的特征中区分不同个体 → 本质困难的任务
- 两个高度重叠的 GT 到同一 proposal 的 IoU 几乎相同 → 标签分配的 ambiguity

**关键洞察**：与其让相近的 proposal 各自区分不同个体（难），不如让每个 proposal 预测「它能看到的所有实例」的集合（易）。

---

## 二、核心创新：EMD Loss + Set NMS

### 2.1 实例集合定义

对每个 proposal b_i，其 GT 实例集合为与 b_i 的 IoU ≥ θ 的所有 GT：

$$G(b_i) = \{ g_j \in G \mid \text{IoU}(b_i, g_j) \geq \theta \}$$

每个 proposal 预测 K 个实例：

$$P(b_i) = \{(c_i^{(1)}, l_i^{(1)}), (c_i^{(2)}, l_i^{(2)}), \ldots, (c_i^{(K)}, l_i^{(K)})\}$$

论文取 **K=2**（消融显示 K>2 收益递减而开销增大）。

---

### 2.2 EMD Loss（Earth Mover's Distance Loss）

**核心思想**：在 K! 种排列中，寻找预测集与 GT 集之间的最优一对一匹配：

$$L_{b_i} = \min_{\pi \in \Pi} \sum_{k=1}^{K} \left[ \mathcal{L}_{cls}(c_i^{(k)}, g_{\pi_k}) + \mathcal{L}_{reg}(l_i^{(k)}, g_{\pi_k}) \right]$$

其中 Π 是 {1,2,...,K} 的所有排列，π_k 是第 k 个预测匹配的 GT 索引。

**Dummy Boxes 机制**：当 |G(b_i)| < K（proposal 看到的 GT 不足 K 个），剩余槽位填充为背景（不计算回归损失）。与 DETR 的 ∅ 填充机制相同。

**当 K=1**：Π 只有一种排列，直接退化为标准单实例损失。

---

### 2.3 Set NMS

**前提**：EMD Loss 保证同一 proposal 内的 K 个预测互不重复 → 重复只会出现在**不同 proposal 之间**。

**算法**（伪代码）：

```
Set_NMS(B, θ_nms):
  D ← ∅
  按置信度降序排列 B
  while B ≠ ∅:
    b_m ← B 中置信度最高的框
    D ← D ∪ {b_m}; B ← B \ {b_m}
    for each b_i in B:
      if proposal_id(b_i) == proposal_id(b_m):
        continue                          // ★ 同源跳过
      if IoU(b_m, b_i) ≥ θ_nms:
        B ← B \ {b_i}                     // 异源+高重叠 → 抑制
  return D
```

**与标准 NMS 的唯一差异**：第 8-9 行的同源检测。其他逻辑完全相同。

---

### 2.4 Refinement Module (RM) — 可选

- 将第一轮预测结果与 RoI 特征拼接 → 第二轮精炼预测
- 目的：纠正第一轮的假阳性
- 消融显示 RM 贡献 +0.4% AP，属于锦上添花

---

## 三、实验结果

### CrowdHuman（密集人群·主战场）

| 方法 | AP | MR⁻² | JI | 密集召回率 |
|------|:--:|:----:|:--:|:--------:|
| FPN-Res50 Baseline | 86.6 | 42.4 | 79.6 | — |
| +EMD Loss (K=2) | 90.0 | 41.7 | 82.1 | +8.9% |
| +EMD + Set NMS | 90.3 | 41.4 | 82.3 | — |
| +EMD + Set NMS + RM | **90.3–91.0** | **41.0** | **82.5** | — |

### CityPersons

| 方法 | MR⁻² |
|------|:----:|
| Baseline (FPN-Res50) | 11.0 |
| +CrowdDet | **10.0** (−1.0) |

### MS-COCO

| 方法 | AP |
|------|:--:|
| Baseline | — |
| +CrowdDet (K=2) | **+1.0** |

COCO 上仍有提升 → CrowdDet 不会对稀疏场景产生负面影响。

---

## 四、关键消融

- **EMD Loss vs 标准 Loss（K=1）**：K=2 的 EMD Loss 单独使用 → AP +4.5%
- **Set NMS vs 标准 NMS**：Set NMS 单独使用 → AP +0.2%（仅后处理增益有限，需与 EMD Loss 联合）
- **EMD + Set NMS 联合**：才是完整的 CrowdDet 方案（训练+推理协同）
- **K=2 vs K=3**：K=3 增益 < 0.2% AP，但计算增加 50% → K=2 是最佳性价比

---

## 五、局限与可改进之处

1. **仅适用 proposal-based 检测器**（Faster R-CNN 系列）→ YOLO 一阶段无显式 proposal，无法直接迁移
2. **K 值是静态超参**（固定 K=2）→ 密集区 K=3/稀疏区 K=1 的自适应 K 选择是明显改进方向
3. **EMD Loss 的 O(K!) 匹配复杂度** — K=2 时只有 2 种排列，但 K=3→6 种、K=4→24 种，不可扩展
4. **预测实例间无显式互斥约束** — EMD 匹配后每个预测独立回归，同一 proposal 的两个预测可能收敛到同一实例（虽然 EMD 的匹配机制隐含抑制了这种情况，但无硬约束）
5. **对 proposal 质量敏感** — 如果 proposal 位置偏差大，G(b_i) 为空 → 退化为背景

---

## 六、与项目的关系

### 与 DOMino-YOLO OAR-Loss 的对比

| 维度 | CrowdDet EMD Loss | DOMino-YOLO OAR-Loss |
|------|-------------------|---------------------|
| 遮挡处理策略 | proposal 预测多个实例 | RepLoss 推开预测框 |
| 标注需求 | 无额外标注 | 需要 VOD-UAV 五级遮挡标签 |
| 适用检测器 | 两阶段 only | YOLO 一阶段 |
| NMS 协同 | Set NMS（源头防误杀） | 标准 NMS（RepBox 提前布局） |

**关键洞察**：两条路线互补而非竞争：
- EMD Loss → 解决「同一区域多个实例的检测能力」
- RepLoss → 解决「预测框定位不准导致 NMS 误杀」

### 对 #35 的启发
- EMD Loss 的 dummy box 填充机制 → #35 频域遮挡先验可作为「是否需要 K>1 预测」的判据
- 高频能量高的区域 → 大概率多实例重叠 → K=2 or more
- 低频平滑区域 → 单个实例 → K=1（省算力）

### 对 DETR 交叉融合的启发
- CrowdDet 的 "One Proposal → Set Prediction" 与 DETR 的 "Image → Set Prediction" 在哲学上同源（都用了 Hungarian/EMD 式最优匹配）
- CrowdDet 在 **proposal 层面**做集合预测，DETR 在**图像层面** — CrowdDet 的局部集合比 DETR 的全局集合更适配 YOLO 架构

---

## 七、可研究方向（≥3 个）

1. **自适应 K 选择**：用频域/熵判据估计 proposal/网格单元的「实例密度」→ 密集区 K=2-3 / 稀疏区 K=1 → 实现算力-精度的动态平衡。这是 EMD Loss 原作者留下的最明显改进空间
2. **YOLO 一阶段 EMD 适配**：将 EMD 思想从 proposal 级搬到 grid cell 级——每个 P2 网格预测 K 个实例而非 1 个（针对高分辨率 P2 特征图），匹配 YOLO 的密集预测范式。关键挑战：P2 网格数 = 160×160 = 25600，需要高效的 dummy 机制
3. **EMD + RepLoss 融合**：proposal 内 EMD 匹配多个实例 + proposal 间 RepBox 推开不同目标的预测框 = 完整的密集检测训练方案。两条经典路线首次融合
4. **频域密度估计算子**：用局部频谱特征估计 proposal/网格的实例密度 → 替代固定 θ 阈值的 G(b_i) 定义 → 动态确定匹配范围
