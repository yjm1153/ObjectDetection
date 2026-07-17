# ViCrop-Det: Spatial Attention Entropy Guided Cropping for Training-Free Small-Object Detection

> arXiv 2026.04 | Hui Wang, Hongze Li et al.
> 代码: 未公开 | 论文: arxiv.org/abs/2604.26806

---

## 1. 问题 (Problem)
DETR 类检测器在小目标上精度不足，根本原因是全局注意力在空间上被稀释（attention dilution）——小目标的特征信号被大范围背景淹没。现有方案（SAHI 均匀切片）在低不确定性背景区域浪费计算资源。**关键洞察：解码器的 cross-attention 分布本身包含"模型在哪里困惑"的信息**，可以作为免训练的路由图。

## 2. 方法 (Method)

### 2.1 Spatial Attention Entropy (SAE)
$$
\mathbf{A}[i] = \frac{1}{L N_h N_q} \sum_{l=1}^{L} \sum_{h=1}^{N_h} \sum_{q=1}^{N_q} (\mathbf{A}_{l,h})_{q,i}, \quad p_i = \frac{\mathbf{A}[i] + \varepsilon}{\sum_j (\mathbf{A}[j] + \varepsilon)}, \quad \hat{H}_s = -\frac{1}{\log N_k} \sum_{i} p_i \log p_i
$$
- 聚合所有 decoder 层/头/查询的 cross-attention → 归一化 → Shannon 熵
- $\hat{H}_s \to 0$：注意力集中（低歧义）| $\hat{H}_s \to 1$：注意力分散（高歧义）→ 小目标典型特征

### 2.2 推理管线
1. **Base forward pass** → 提取 cross-attention → 计算 SAE 热力图
2. **Early-exit gate**：若全局 $\hat{H}_s < 0.7$ 或 mean attention < 0.3 → 跳过优化
3. **多尺度滑窗**：scale ∈ {0.25, 0.5, 0.75} → 每窗口计算 $\sigma(w) = m(w) \cdot \hat{H}_s(w)$（联合歧义-显著性评分）
4. **Top-K 选择 + NMS**（K=5）→ 裁剪 → resize → 重检测
5. **熵感知分数增强**：$s_r \leftarrow s_r(1 + 0.2(\hat{H}_s(w) - 0.7))$
6. **分数融合**：$s_f = 0.7 s_o + 0.3 s_r$ → 最终 NMS

### 2.3 关键特性
- **免训练**：纯推理时包装器，不修改模型架构
- **DETR 专属**：依赖 decoder cross-attention
- **超参全部冻结**：跨数据集无需调整

## 3. 结果
| 数据集 | 基线 | ViCrop-Det | 提升 |
|--------|------|------------|------|
| VisDrone (RT-DETR-R50) | 37.5 | **38.9** | +1.4 mAP50 |
| DOTA-v1.5 (RT-DETR-R50) | 50.6 | **51.5** | +0.9 mAP50 |
| COCO APS | 34.8 | **36.9** | +2.1 AP |

- 延迟开销：20–25%（1.47–1.60× 快于 SAHI 均匀切片）
- COCO APM/APL 基本不变 → **仅精细化小目标**

## 4. 局限
1. **固定阈值**：τ_g=0.7, τ_w=0.7 可能需要数据集特定调参
2. **零注意力盲区**：base detector 完全不关注的目标永远无法恢复
3. **场景依赖开销**：密集场景裁剪更多 → 开销更大
4. **仅 DETR 架构**：需要 decoder cross-attention，YOLO 无法直接使用

## 5. 与 Idea#5 的关系分析

### 核心区别
| 维度 | ViCrop-Det | Idea#5 |
|------|-----------|--------|
| 熵来源 | Decoder cross-attention | VLM 语义嵌入 (CLIP) |
| 架构 | DETR 专属 | YOLO |
| 作用阶段 | 推理时 | 训练+推理（模型内部） |
| 操作粒度 | 图像级裁剪+重检测 | 特征级 P2 token 稀疏化 |
| 训练需求 | 免训练 | 需要训练门控模块 |

### 对本项目的启示
- ✅ **验证核心范式**：熵可以引导小目标计算分配 → Idea#5 的方向正确
- ✅ **可作佐证引用**：ViCrop-Det 从 attention 角度、Idea#5 从 semantic 角度，正交互补
- ⚠️ **"零注意力盲区"是关键差异点**：VLM 语义先验可以覆盖 base detector 未关注的目标 → Idea#5 比 ViCrop-Det 更全面
- ⚠️ **SAE 或可作 #5 的辅助判据**：语义熵 + 注意力熵 双门控

## 6. 分析维度
- **研究问题**：如何利用模型内在信号（注意力熵）免训练地改进小目标检测
- **创新点**：SAE 作为"内生探针" + 免训练自适应裁剪路由
- **局限**：DETR 专属；固定阈值；零注意力盲区
- **可借鉴**：SAE 作为辅助门控判据并入 Idea#5（语义熵主门控 + 注意力熵辅助）
- **可改进**：用 VLM 语义熵替代 attention 熵 → 覆盖零注意力盲区；嵌入模型内部而非推理时包装

---

*Summary generated: 2026-07-16 | Agent: Claude Code*
