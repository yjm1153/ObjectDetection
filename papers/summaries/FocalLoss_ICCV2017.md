# Focal Loss for Dense Object Detection (ICCV 2017)

> Lin, Goyal, Girshick, He, Dollár | ICCV 2017 | ⚠️ pre-2025, 路径三 P0

## One-Liner
"难例聚焦"原理可直译为计算分配语言 → 为 #5 提供统一理论框架，从 "engineering trick" 升维为 "理论驱动的设计选择"。

## 核心公式

### Focal Loss
```
FL(p_t) = -α_t · (1-p_t)^γ · log(p_t)
```
- **p_t** = p if y=1 else 1-p（模型对该样本正确的置信度）
- **α_t**: 类别平衡权重（正类 α, 负类 1-α）—— 处理**聚合**不平衡
- **(1-p_t)^γ**: 调制因子 —— 处理**个体**难易分化
- **γ=0**: 退化为标准 CE；**γ=2**: 最优，p_t=0.9样本损失×0.01，p_t≈0.968损失×0.001

### 核心洞察（原文）
> "The loss is automatically down-weighted for well-classified examples, so their contribution to total loss is small even if their number is large."

### 梯度分析
> "Unlike CE, the derivative is small as soon as x_t > 0" → 梯度只通过模型**不确定**的样本传播

## "不是鲁棒损失，是反鲁棒"
- Huber Loss: 降权 outlier（难样本）→ 对 noise 鲁棒
- Focal Loss: 降权 inlier（易样本）→ 聚焦 hard examples
- **方向相反**

## 关键消融

### α 单独（CE baseline）— ResNet-50-FPN COCO minival
| α | AP |
|---|-----|
| 0.50 | 30.2 |
| 0.75 | **31.1** ← 最优 |
| 0.99 | 28.7 |

### γ 联合（FL with best α per γ）
| γ | α | AP |
|---|-----|-----|
| 0 | 0.75 | 31.1 |
| 1.0 | 0.25 | 33.7 |
| 2.0 | 0.25 | **34.0** ← 最优 |
| 5.0 | 0.25 | 32.2 |

**"α 应随 γ 增大而减小"**：γ大时调制因子已做重加权，α 需降低

### vs OHEM
FL=36.0 AP vs OHEM=32.8 AP（+3.2）→ **软加权 > 硬采样**

### 鲁棒性
"Performance is fairly robust to exact γ/α settings" — 在 γ∈[0.5,5] 范围内 AP 变化 < 2.0

## 初始化技巧
```
bias_init = -log((1-π)/π), π=0.01
```
防止训练初期负样本淹没 → 对所有密集预测的类不平衡场景通用

## 泛化原理
> "Any loss function with similar properties as FL or FL* to be equally effective."

提出 FL*（shift-based）作为替代形式，得到相近结果 → **原理比公式重要**

---

## 对本项目的核心价值

### 🎯 Focal Computation：直接类比

| Focal Loss 概念 | → P2 计算分配 |
|----------------|--------------|
| CE loss (uniform weight) | Uniform FLOPs (每个 token 同算力) |
| 易分类样本 p_t→1 → 降权 | 易判别 token E(H)→0 → 降算力 |
| 难分类样本 p_t<0.5 → 保留 | 高不确定性 token E(H)→1 → 保留算力 |
| α 类别平衡 | 空间先验 (小目标区域 α↑) |
| γ 聚焦强度 | 稀疏化强度 (算力集中度) |
| OHEM (硬采样) | Token Cropr (硬剪枝) |
| Focal Loss (软降权) | Focal Computation (软分配) ← **我们的目标** |

### 直接公式翻译
```
L_focal_comp = Σ_{i∈Ω_P2} α(pos_i) · (1 - E(H_i))^γ · FLOPs_base
```
- **E(H_i)**: 归一化语义熵（0=确定背景，1=确定前景）
- **α(pos_i)**: 空间先验（小目标密集区 α 大）
- **γ**: 聚焦强度（γ=2 → 熵0.9 的 token 分配 1% baseline 算力）
- **FLOPs_base**: 每个 token 的基础计算量（P2 head 一次 forward）

### 理论叙事升级
> 当前 #5 叙事："我们想到用语义熵做稀疏化"
> Focal Computation 叙事："Focal Loss 的重心偏向原理为解决密集预测中的计算分配提供了成熟的数学框架——我们将其从**损失空间**推广到**计算空间**"

### 风险
- 此框架对熵的精度要求极高（若熵判别不准，Focal 反而放大偏差）
- 类比不等于等价（损失 vs 计算分配是不同的数学问题）
- 需要 P2 层熵分布的真实统计数据支撑

### 关键引用点
- 引用 Focal Loss 作为"hard example focusing 原则"的源头
- 强调"any loss function with similar properties is equally effective" → 证明我们不是简单借公式，而是借原理

---
*Pre-2025 (ICCV 2017) | 路径三 P0 | Read 2026-07-16*
