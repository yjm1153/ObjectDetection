# Dynamic DETR: Dynamic Token Aggregation Towards Efficient Detection Transformers

> ICML 2025 (PMLR Vol.267, pp.10144–10158) | Jiacheng Cheng, Xiwen Yao, Xiang Yuan, Junwei Han (NWPU)
> 状态: 🔬深读 | 关联 Idea: 🟪 #30 #24 #33(新) #34(新) | PDF: [PMLR](https://raw.githubusercontent.com/mlresearch/v267/main/assets/cheng25i/cheng25i.pdf) | ICML: [Poster 46036](https://icml.cc/virtual/2025/poster/46036)

---

## 1. 问题 / 动机

### 核心矛盾
DETR 检测器的 encoder 是计算瓶颈（Deformable DETR 中 encoder 占 49% FLOPs 但只贡献 11% AP），根本原因在于 token 数量冗余——FPN 多尺度特征图展开后 token 总量 N = sum(H_l × s_l) 巨大，self-attention 的 O(N_q · C^2 + N_q · K · C^2) 与 N_q 正相关。

### 为什么现有 token 稀疏化方法不够？

| 不足 | 具体表现 |
|------|---------|
| **静态稀疏化** | Sparse DETR / Focus DETR 对所有层级使用统一的固定保留率 ρ，忽视 token 重要性随层级和 encoder 深度的动态变化 |
| **粗粒度丢弃策略** | 基于全局 patch 评分→丢弃，缺乏层级差异化 |
| **补偿模块冗余** | 为缓解信息损失而引入辅助模块，增加参数量且限制通用性 |
| **忽视层级迁移规律** | 没人发现"重要 token 随 encoder 深度从低层向高层迁移"这一结构特性 |

### 作者的核心洞察（Figure 2/4）

通过对 Deformable DETR 的 attention weights 可视化，发现一个关键规律：**在浅层 encoder block，重要 token 集中在低金字塔层级（Level 1–2），随着 encoder 加深，重要性逐渐向高层级（Level 3–4）迁移**。这被作者称为"importance migration"——意味着任何固定不变的保留率配置都注定是次优的。

---

## 2. 旧方法缺陷详析

| 方法 | 机制 | 在 Dynamic DETR 视角下的不足 |
|------|------|---------------------------|
| **Sparse DETR** (ICLR'22) | 用 decoder attention map 选 top-ρ% 显著 token | 固定 ρ；依赖 decoder 反馈（额外开销）；Focus DETR 实证 DAM 不可靠，常遗漏前景区域 |
| **Lite DETR** (CVPR'23) | 简化 token 层级（减少低层 token 数量） | 静态设计，未利用层级间重要性差异；在 LVIS/PASCAL 上显著落后 |
| **Focus DETR** (ICCV'23) | 前景 token 选择器 + 多类别评分预测器 | 保留率 ~30% 但仍是全局固定；需要额外前景评分模块 |
| **PnP DETR** (ICCV'21) | 基于重要性评分选择性更新 token | 与 Sparse DETR 同类问题：评分机制粗粒度、无层级感知 |
| **Token Merging (ToMe)** | 基于余弦相似度合并相似 token | 应用于 ViT 分类/分割，在 DETR 检测中忽视 token 层级关系→次优匹配→显著掉点 |

**共性缺陷：** 所有方法都是"扁平化"的——将不同层级的 token 当作同质实体处理，未利用 FPN 层级间的空间分辨率与语义抽象度差异。

---

## 3. 核心创新：三组件协同

Dynamic DETR = **动态保留率分配** + **层级差异化聚合（近端 vs 整体）** + **中心距离正则化**

### 3.1 动态 Token 保留率分配（Dynamic Token Aggregation, DTA）

**不是学习式判据，而是基于统计分布的动态重排**：

1. **离线统计阶段**：在 COCO val-set 上统计各金字塔层级在不同 encoder stage 的 attention weight 分布（取 top 75% attention weight，计算各层级占比）
2. **提取重要性排序**：对 stage s 得到重要性排序索引 I^s = (i_1, i_2, ..., i_L)，表示 R_{i1} > R_{i2} > ... > R_{iL}
3. **在线推理阶段**：将基础保留率向量 ρ = (ρ_1, ρ_2, ..., ρ_L) 按 I^s 重排，得到 stage-specific 的 ρ^s = ρ[I^s]
4. **每层实际保留数**：K_l = N_l × ρ^s_l

**关键性质**：
- **判据本质**：基于 attention weight 的**统计先验**，非可学习参数，但需要离线统计（依赖模型和数据集）
- **动态性来源**：不是每张图自适应（输入级），而是**stage 级**自适应——同一 stage 内固定，跨 stage 变化
- **超参数**：ρ 向量（4 个值）需对每个模型手动调参（Table 6 展示了 5 组配置的扫描）
- **基础配置**：所有实验的默认 ρ 以 (0.5, 0.4, 0.3, 0.2) 起步，最优因模型而异；DINO 用 (0.5, 0.4, 0.3, 0.2)，Deformable DETR 用 (0.4, 0.3, 0.2, 0.1)

**Encoder 分三阶段**：6 blocks → Stage1(N1=2), Stage2(N2=3), Stage3(N3=1)，每 stage 出口做一次 token 聚合。

### 3.2 多级 Token 聚合（Multi-level Token Aggregation, MTA）

**设计哲学**：低层 token（空间丰富、语义稀疏）和高层 token（语义密集、全局感受野）需要截然不同的聚合方式。

#### (a) 低层 Proximal Aggregation (l ≤ L-1)：保空间完整性

**步骤**：
1. 将 level-l tokens Z_l ∈ R^{N_l×C} 重映射回空间维度 C×H_l×s_l
2. 按窗口大小 n = 2^{l-1} 划分为 M 个局部 patch（每个 patch 含 n×n 个 token）——n 与 FPN 层级分辨率自然对齐，**超参数自由**
3. 在每个 patch 内构建全连接二分图，边权重 e_{i,j} = (z_i · z_j) / (||z_i||_2 · ||z_j||_2)（余弦相似度）
4. 计算每个 patch 的平均语义一致性 w_m = (1/(n×n)) Σ_i Σ_j e_{i,j}
5. 对所有 patch 按 w_m 降序排列，选取 top-M' 个"高质量"patch 保留
6. 在每个入选 patch 内，n² 个 token 合并为一个 super token（取代 patch 右下角 token），未入选的 patch 内 token 全部保留（不合并）
7. M' 的计算：M' = N_l · (1 - ρ^s_l) / (n² - 1)
8. 合并策略：**Mean pooling**（消融显示 Mean > Max > Sum > Retain）

**示例**：Level-2（输入 H×s = 50×50, N_2=2500），n=2（窗口 2×2=4 token），M=625 个 patch。若 ρ^s_2=0.3 → M' = 2500×(1-0.3)/(4-1) ≈ 583。

#### (b) 高层 Holistic Aggregation (l = L)：捕获全局上下文

**步骤**：
1. 计算全 token 间的余弦相似度矩阵 A ∈ R^{N_l×N_l}（式 5 同）
2. 定义第 i 个 token 的重要性分数：γ_i = (1/N_l) Σ_{j=1, j≠i}^{N_l} (1 / e_{i,j})
   - **语义：γ_i 越大 → 该 token 与其他 token 平均相似度越低 → 包含更多独特信息 → 更重要**
3. 按 γ_i 降序排列，取前 K_l = N_l × ρ^s_L 个 token 标记为"重要"(V)，其余为"不重要"(U)
4. **Affinity Matching 与 Aggregation**（Algorithm 1）：
   - 构建 U→V 的亲合矩阵 A_{i2u}
   - 对每个不重要 token u_j，找 top-T 个最相似的重要 token（T=3，消融最优）
   - 若 top-T 中有 token 属于 V，则将 u_j 的信息聚合到该重要 token（Mean pooling）
   - **一对多匹配**：一个不重要 token 可被聚合到多个重要 token（T≥1）

**与 Proximal Aggregation 的本质区别**：
| 维度 | Proximal（低层） | Holistic（高层） |
|------|-----------------|-----------------|
| 搜索空间 | 局部窗口（n×n） | 全局（全 token） |
| 聚合方向 | 窗口内 n²→1 super token | 不重要→重要（信息注入） |
| 保留的 token | 入选 patch 的 super token + 未入选 patch 所有 token | 仅重要 token（V） |
| 设计动机 | 低层 token 空间冗余高，邻近 token 语义相似→直接合并 | 高层 token 有全局感受野，相关 token 可能跨空间分布→须全局搜索 |

### 3.3 表征中心距离正则化（Representational Center-distance Regularization, RCDR）

**公式**：
```
ν_pre = E_{p_pre}[f(Z)]      # 非稀疏化表示的中心（均值）
ν_post = E_{p_post}[f(Ẑ)]     # 稀疏化后表示的中心（均值）
L_align = ||ν_pre - ν_post||₂
L_total = L_det + λ · L_align    # λ = 0.1（默认，消融最优）
```

**设计动机**：作者假设稀疏化前后的特征分布应保持 i.i.d. 对齐。如果没有正则化，encoder 的稀疏化输出可能与检测头预期分布产生偏差。

**效果**：+0.6 AP（from 49.6→50.2），零额外计算开销（仅在训练期生效）。

---

## 4. 关键实验数字

### 4.1 主实验（Table 1, COCO 2017 val, ResNet-50, 多尺度特征）

| Model | 配置 | AP | FLOPs(G) | FLOPs 节省 | FPS | ΔAP |
|-------|------|-----|---------|-----------|-----|-----|
| D-DETR (baseline) | 50ep | 47.0 | 179.0 | — | 19.1 | — |
| + Sparse DETR | 50ep | 46.0 | 121.0 | ↓32.4% | 23.2 | −1.0 |
| + Lite DETR | 50ep | 45.8 | 108.0 | ↓39.7% | 24.0 | −1.2 |
| **+ Dynamic DETR** | **50ep** | **46.0** | **107.9** | **↓39.7%** | **25.2** | **−1.0** |
| DINO (baseline) | 36ep | 50.9 | 244.5 | — | 14.4 | — |
| + Sparse DETR | 36ep | 48.2 | 152.0 | ↓37.8% | 20.2 | −2.7 |
| + Lite DETR | 36ep | 50.4 | 151.0 | ↓38.2% | 23.2 | −0.5 |
| + Focus DETR | 36ep | 50.4 | 154.0 | ↓37.0% | 20.0 | −0.5 |
| **+ Dynamic DETR** | **36ep** | **50.2** | **141.7** | **↓42.0%** | **23.2** | **−0.7** |
| DAB-D-DETR + Dynamic | 50ep | 45.8 | 131.8 | ↓44.0% | 22.6 | −1.1 |
| DN-D-DETR + Dynamic | 50ep | 47.7 | 139.8 | ↓39.6% | 23.0 | −0.9 |
| H-D-DETR + Dynamic | 36ep | 49.1 | 123.6 | ↓47.4% | 9.3 | −0.9 |

**核心结论**：在所有 DETR 变体上，Dynamic DETR 以最少的 FLOPs 实现最好的精度保留。对 DINO 做到 −42% FLOPs 仅 −0.7 AP，优于所有竞争方法。

### 4.2 其他数据集

| 数据集 | Model | AP/mAP | FLOPs(G) | 结论 |
|--------|-------|--------|----------|------|
| LVIS v1.0 | Dynamic DINO | 23.4 (AP) / 33.4 (AP_f) | 146.6 | 最低 FLOPs + 最高 FPS (22.5)；AP_f 最优（尾部类受益） |
| PASCAL VOC 2007 | Dynamic DINO | 63.8 (mAP) | 135.2 | 高于所有轻量变体，仅 56% 计算 |
| COCO + Swin-T | Dynamic DINO | 49.9 AP | 149.4 | 与 Focus DINO 同 AP (49.9)，FLOPs 更低 (149.4 vs 156.9) |

### 4.3 消融实验（Table 5, DINO, COCO）

| 配置 | AP | FLOPs(G) | 关键发现 |
|------|-----|----------|---------|
| 随机选择+动态比例（无MTA） | 46.6 | 134.7 | 没有合适的 token 聚合策略，即使保留率对，也会严重掉点（−3.6 vs full） |
| 静态 ρ=0.3（有MTA, 无DTA） | 48.2 | 140.6 | 固定保留率比动态版低 1.4 AP |
| + Holistic w/o Affinity Matching | 49.8 | 140.2 | 不加亲合匹配，高层聚合效果打折扣 |
| + Holistic w/ Affinity Matching（无RCDR） | 49.6 | 141.7 | 全组件但无正则化 |
| **Full Dynamic DETR** | **50.2** | **141.7** | DTA + MTA(w/ AM) + RCDR 完整版 |

**各组件贡献**：
- DTA（动态 vs 静态 ρ）：+1.4 AP
- MTA（层级聚合 vs 随机选择）：+3.6 AP
- Affinity Matching in Holistic：+0.4 AP
- RCDR：+0.6 AP

### 4.4 保留率敏感度（Table 6, Appendix）

ρ 从 (0.4, 0.3, 0.2, 0.1) → (0.8, 0.7, 0.6, 0.5) 时：
- D-DETR：FLOPs +29.7% (107.9→140.0)，AP +0.8 (46.0→46.8)
- DINO：FLOPs +42.9% (132.6→189.5)，AP +0.9 (49.9→50.8)

**结论**：精度边际收益 << FLOPs 增长——稀疏化是高 ROI 操作。

---

## 5. 局限分析

1. **判据非输入自适应**：DTA 的保留率分配基于离线统计先验（COCO val-set attention weight 分布），非每图计算——面对分布外输入（如航拍、密集场景）可能分配不当。Retention ratio ρ 需要针对每个模型单独调参。
2. **Encoder 分三阶段是固定超参数**：N1=2/N2=3/N3=1 没有理论依据或数据集自适应——在小目标为主的 VisDrone 中低层 stage 可能需要更多 token。
3. **未在极端小目标场景验证**：COCO/LVIS/PASCAL VOC 均非小目标专项基准。VisDrone/AI-TOD 零实验——在密集小目标场景（每图数百目标），浅层 token 重要性可能远高于 COCO 经验，其"重要性从低层向高层迁移"的核心假设可能失效。
4. **FLOPs 节省在 encoder 内**：backbone 和 decoder 仍保持稠密计算——整体算力节省比例受 backbone 占比限制。对轻量 backbone (HGNetv2 等)，encoder 占比可能更低。
5. **合并策略可能丢失细粒度定位信息**：Proximal Aggregation 中 n²→1 super token 本质上是空间下采样，对小目标边界定位可能有负面影响——虽然作者强调 Mean pooling 最优，但无小目标专项消融。
6. **与检测头解耦未验证**：RCDR 的 i.i.d. 假设源于 federated learning (Gao et al. 2024)，其在目标检测中的理论基础薄弱。

---

## 6. 可改进之处

1. **免训练重要性判据替代统计先验**：用空域高通能量 / 局部异常度等零参数频谱判据实时计算 token 重要性，替代离线统计 attention weight——消除模型/数据集依赖，实现真正的输入自适应
2. **小目标场景 stage 边界自适应**：让 encoder 分阶段本身（N1/N2/N3）也变得可学习或密度自适应——在密集小目标场景自动将更多 block 分配给浅层
3. **Backbone-Encoder 联合稀疏化**：当前只在 encoder 内做 token 聚合，浅层 backbone 输出的 token 已经包含大量背景冗余——在 backbone 末端（进入 encoder 前的 C3-C5 特征图）提前做一次轻量 token 筛选
4. **Proximal Aggregation 的细粒度控制**：当前窗口内 n²→1 合并对所有入选 patch 一视同仁——可对不同平均相似度的 patch 用不同的合并策略（高相似度→合并，中等→保留部分，低→全保留）
5. **频域判据 vs 学习式判据的对比**：Dynamic DETR 的 importance score (γ_i) 基于余弦相似度（learning-free），可与基于频谱能量的判据做系统对比——特别是在小目标场景下哪种判据更敏感

---

## 7. 可研究方向 (≥3 个)

### 方向 1：频谱判据驱动的 DETR token 动态聚合（与 #30 直接交叉）

**动机**：Dynamic DETR 的 DTA 判据本质是"基于 attention weight 离线统计→静态重排"，非输入自适应。而小目标的高频能量/空域梯度异常天然可作为 token 重要性的免训练判据，且具有输入级自适应能力。

**方案概要**：将 DTA 的 ρ^s_l 分配机制替换为"每图实时计算频谱统计量→动态分配各层保留率"，例如：对每张图计算各层级特征图的平均高频能量比例 → 高能量层级自动获得更高保留率。

**与 Dynamic DETR 的关系**：互补增强——保留其出色的 MTA（Proximal×Holistic 双轨策略）和 RCDR 正则化，仅替换判据来源。

### 方向 2：多级稀疏化的信息瓶颈理论解释（与 #24 交叉）

**动机**：Dynamic DETR 的三阶段逐步稀疏化 + 从低层到高层的重要性迁移，恰符合信息瓶颈框架的"逐步压缩—保留 task-relevant 信息"范式。但目前缺乏理论分析。

**方案概要**：用 IB 形式化 Dynamic DETR 各阶段的 I(X; T_stage) vs I(T_stage; Y) trade-off，证明：(a) 低层保留更多 spatial detail (高 I(X;T)) → 符合 Proximal Aggregation 设计；(b) 高层逐步压缩→低 I(X;T) 高 I(T;Y) → 符合 Holistic Aggregation 设计。可能导出一个理论最优的 {ρ^1, ρ^2, ρ^3} 配置。

### 方向 3：DETR 小目标特化的 token 聚合粒度设计

**动机**：Dynamic DETR 的 Proximal Aggregation 窗口大小 n=2^{l-1} 基于 FPN 层级间的自然分辨率关系，但在小目标场景（VisDrone 中 ~10×10 像素目标），窗口 2×2 在 Level-2 (~50×50 特征图) 上覆盖 ~4% 特征图面积——仍可能合并掉小目标对应的 token。

**方案概要**：引入小目标密度感知的自适应窗口大小：在目标密度高的区域减小窗口（甚至不做合并），在背景区域正常合并。可用 DINOv2 patch feature 的 PCA 第一主成分作为密度先验（免训练）。

### 方向 4（附加）：学习式判据 vs 免训练判据的系统对比

**动机**：Dynamic DETR 证明了 token 稀疏化的可行性，但其判据处于"离线统计先验"的中间地带——既不是端到端可学习（如 Sparse DETR 的 DAM），也不是完全免训练（如频域能量）。需要系统理解哪种判据范式在 DETR 架构下最优。

**方案概要**：四组判据的对照实验——(a) Dynamic DETR 的统计先验 (baseline)；(b) 可学习 router（如 Token Cropr 式单 query）；(c) 频谱免训练判据（S1 空域高通代理，#30 方案）；(d) 混合：统计先验初始化 + 在线频谱微调。在 COCO + VisDrone 上评估三种稀疏率下的 AP-效率 trade-off。

---

## 8. 与本项目关联分析

### 8.1 与 #30（免监督频谱判据→DETR token 条件计算）的关系

**判据性质对比**：

| 维度 | Dynamic DETR | #30 方案 (S1 空域高通代理) |
|------|-------------|--------------------------|
| 判据来源 | Attention weight 离线统计（COCO val-set） | 逐图实时频谱/梯度计算 |
| 学习性 | **非学习式**（统计先验），但依赖模型和数据集 | **免训练**（物理先验），模型无关 |
| 自适应粒度 | Stage 级（3 阶段） | 样本级（每图） |
| 泛化性 | 弱——换模型/数据集需重新统计 | 强——物理规律跨越数据分布 |
| 额外开销 | 零（推理时仅查表） | 微小（一次 Sobel/拉普拉斯算子） |

**撞车评估**：**不构成撞车**。关键区分——
- Dynamic DETR 的"动态"是**架构级**（across stages），#30 的"动态"是**输入级**（per-image）
- Dynamic DETR 的判据依赖**先验统计**（需训练集 attention weight），#30 的判据是**零先验物理量**
- Dynamic DETR 的 MTA 机制（Proximal+Holistic 双轨）对 #30 是**互补参考**——#30 可沿用其窗口划分架构，仅替换判据源

**具体到 #30 技术方案**：
- **S1 空域高通代理判据**可与 Dynamic DETR 的 Proximal Aggregation 融合：用 S1 响应替代 w_m（patch 平均相似度）作为"该 patch 是否值得保留"的判据
- Dynamic DETR 的 RCDR 正则化可直接引入 #30——稀疏化前后特征对齐对任何 token 稀疏化方法都有益
- **关键优势**：#30 的免训练判据消除了 Dynamic DETR 最大的弱点（需离线统计 + 每模型单独调 ρ）

### 8.2 与 Dome-DETR MWAS 的关系

| 维度 | Dynamic DETR MTA | Dome-DETR MWAS |
|------|-----------------|----------------|
| 判据来源 | Attention weight 统计 → 重要性排序 | DeFE 密度头（GT 密度图监督学习） |
| 稀疏化粒度 | 层级 + 窗口内合并 | 窗口级掩码（mask/unmask） |
| 窗口设计 | n=2^{l-1}（FPN 自然对齐） | 固定窗口 |
| 是否保留 token 关系 | 是（合并/亲合注入） | 否（直接丢弃） |
| 监督需求 | 无（仅离线统计） | 需要 GT 框→密度图 |
| 端到端 | 是 | 否（保留 NMS） |
| GFLOPs 效果 | 降低 40–47% | 升高 37%（加浅层特征换精度） |

**核心区别**：Dynamic DETR 是**净省算力**（所有实验 GFLOPs 下降），Dome-DETR 是**加特征+控成本**（GFLOPs 不降反升）。#30 的叙事更接近 Dynamic DETR 的"净省"路线。

### 8.3 与 #24（信息瓶颈形式化）的关系

Dynamic DETR 的三阶段逐步稀疏化天然契合 IB 框架：
- Stage 1 (N1=2 blocks)：浅层 block，低层 attention 权重大 → 高 I(X; T)，保留 spatial detail
- Stage 2 (N2=3 blocks)：中层 block，重要性过渡 → I(X; T) 逐步下降，I(T; Y) 上升
- Stage 3 (N3=1 block)：深层 block，高层 attention 权重大 → 低 I(X; T)，高 I(T; Y)

这为 #24 提供了一个**具体的工程案例**：可以逆向推导出 Dynamic DETR 隐含的 IB trade-off 曲线，然后与 #30 的频谱判据在 IB 框架下做理论对比。

### 8.4 是否构成 #30 撞车风险？

**结论：不构成撞车，但构成"概念红线邻居"**——需要清晰划界。

| 维度 | 评估 |
|------|------|
| 判据性质 | Dynamic DETR = 统计先验（免学习但非免训练）；#30 = 物理先验（免训练） |
| 技术重叠 | MTA 的双轨聚合是通用架构组件，非 Dynamic DETR 独有；#30 可直接复用 Proximal+Holistic 框架 |
| 空白确认 | Dynamic DETR 未使用任何频谱/梯度信息 → "频谱判据+token 条件计算"空白仍成立 |
| 需注意 | 若审稿人将 Dynamic DETR 的 attention weight 统计视为"一种免训练判据"，则 #30 的 novelty 论证需更精细——**必须在论文中显式对比 Dynamic DETR 并证明频谱判据的输入级自适应优势** |

**建议**：将 Dynamic DETR 列为 #30 的 **SOTA baseline**（替代 Sparse DETR 作为 token 稀疏化的主力对照），并显式消融"将 Dynamic DETR 的 attention 统计替换为 S1 频谱判据"的增益。

---

## 9. 小结

Dynamic DETR 是 DETR 高效推理方向的一个高质量工程贡献，核心价值在于：(1) 发现了"重要性跨层迁移"的结构规律；(2) 提出了层级差异化的 token 聚合范式（Proximal vs Holistic），在多个 DETR 变体上实现 40–47% FLOPs 节省 + <1% AP 损失；(3) 设计精巧的 RCDR 正则化以零额外推理代价提升 0.6 AP。

对本项目 B轨 的核心价值：**确认了 DETR token 稀疏化通路的可行性上限**（−42% FLOPs, −0.7 AP），为 #30 提供了最强的直接竞争基线和方法论参考。其最大的弱点（判据非输入自适应）正是 #30 的切入点。

**定位**：B轨 token 稀疏化方向的 **SOTA baseline**，与 #30 构成"统计先验 vs 物理先验"的互补对照。
