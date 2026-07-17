# SViT: Revisiting Token Pruning for Object Detection and Instance Segmentation

> WACV 2024 | UZH Robotics and Perception Group | arXiv: 2306.07050

## 一句话总结
将 ViT token pruning 从分类扩展到检测/分割：**保留被剪 token 并可随时再激活**，仅 -0.3 AP，推理加速 34%。

---

## 核心机制

### 四大设计原则

| # | 原则 | 含义 | 实现 |
|---|------|------|------|
| (i) | **Token Preserving** | 被剪 token 保留在特征图中，不被删除 | 残差连接：不更新即保留原值 |
| (ii) | **Token Reactivation** | 被剪 token 可在任意后续层重新激活 | 每层独立 Gumbel Softmax 选择 |
| (iii) | **Dynamic Pruning Rate** | 每张图自适应保留比例 | Batch 维度平均的 ℒ_dynamic |
| (iv) | **2-layer MLP 足够** | 无需复杂门控网络 | C→C/4→2 MLP + Gumbel Softmax |

### Token 选择公式

```
p = Softmax(MLP(x)) ∈ R^(N×2),  x ∈ R^(N×C)
M = GumbelSoftmax(p) ∈ {0,1}^N
```

### Token 处理（含再激活）

```
x ← M ⊙ ViTBlock(x, M) + (1 − M) ⊙ x
```

- 训练时：将被剪 token 在注意力矩阵中的对应列置零
- 推理时：gather → 计算 → scatter back
- 门控模块置于第 4–12 层（共 9 个），**在 ViT block 之前**

### 动态剪枝率损失

```
ℒ_dynamic = (1/L) Σₗ ((1/(BN)) Σ_b Σₙ M_n^{b,l} − t^l)²
ℒ_total = ℒ_task + λ·ℒ_dynamic    (λ=4)
```

默认保留率（第 4–12 层）：`[70%, 70%, 70%, 49%, 49%, 49%, 34.3%, 34.3%, 34.3%]`

对比固定剪枝率损失（惩罚每张图都向同一比例靠拢）：
```
ℒ_fixed = (1/(LB)) Σₗ Σ_b ((1/N Σₙ M_{b,n}^l) − t^l)²
```

---

## 实验结果

### 核心结果（COCO, Mask R-CNN + ViT-Adapter）

| Model | APbox Δ | APmask Δ | 加速 |
|-------|---------|----------|------|
| DeiT dense | 45.8 / 40.9 | baseline | — |
| EViT | -1.3 / -1.1 | 基线 | ~30% |
| DynamicViT | -4.6 / -3.8 | 训练发散 | — |
| DynamicViT+prsv | -1.7 / -1.6 | 保留修复 | ~30% |
| **SViT** | **-0.3 / -0.2** | 最佳 | **34%** |

### 消融实验

| 动态率 | 再激活 | APbox | APmask |
|--------|--------|-------|--------|
| ✓ | ✓ | **45.5** | **40.7** |
| ✗ | ✓ | 45.1 | 40.2 |
| ✓ | ✗ | 45.1 | 40.4 |
| ✗ | ✗ | 44.9 | 40.2 |

- 再激活单独贡献：+0.4 APbox / +0.3 APmask
- 动态率单独贡献：+0.2
- 联合贡献：+0.6 / +0.5（超加性）

### 其他关键发现
- **50%+ 的再激活 token 在紧邻下一层被立即重用**
- 门控复杂度：2-layer MLP vs 复杂网络差异 < 0.1 AP
- 保留率过低（base < 0.6）时尾部三层剪枝过激进（保留率仅 0.216/0.125）
- 小物体前景 token 使用率可达 **90%**（热力图高度对齐物体轮廓）
- SViT-S ImageNet: 79.4% Top-1, 3.0 GFLOPS, 2246 img/s（vs. DeiT-S 1524 img/s, +47%）

---

## 与本项目的关系

### → Idea #5（语义熵引导 P2 稀疏化）

| SViT 概念 | → P2 场景映射 |
|-----------|-------------|
| Token Preserving（保留被剪 token） | P2 被剪 token 保留残差，供检测头使用 |
| Token Reactivation（再激活） | **误剪兜底机制**：语义熵误判 → 深层再激活 |
| Dynamic Pruning Rate（自适应率） | 每张图不同稀疏度（复杂场景多保留） |
| Gumbel Softmax 门控 | 替换为语义熵阈值门控 |
| 2-layer MLP 选择器 | 对比：语义熵（免训练）vs 学习门控（需训练） |

### 关键区别
- SViT 用于 ViT backbone 的全局自注意力 token
- Idea #5 用于 YOLO P2 检测头的空间特征 token
- **SViT 的再激活是学习到的 → Idea #5 可以考虑混合：语义熵初筛 + 可学习再激活**

### 直接启示
1. **Token Preserving → P2 稀疏化不应硬删除**：被门控判为"不重要"的 token 不宜直接置零，应保留残差连接
2. **Reactivation → 多阶段门控**：P2 处理可分两阶段——初筛（语义熵）→ 精炼（再激活）
3. **Dynamic Rate → 自适应稀疏度**：简单场景（少小目标）多剪，复杂场景少剪
4. **误剪恢复的量化证据**：再激活 +0.4 AP，证明误剪问题真实存在且可修复

---

## 代码
https://github.com/uzh-rpg/svit

---

*Read: 2026-07-16 | Agent deep-read via ar5iv*
