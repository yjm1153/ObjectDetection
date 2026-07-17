# FcaNet: Frequency Channel Attention Networks (ICCV 2021)

> Qin et al. | ICCV 2021 | ⚠️ pre-2025, 路径三 P1

## One-Liner
GAP=最低频DCT分量 → 通道注意力只看到 DC 信息 → 多频谱注意力揭示不同通道对**不同频率的敏感性** → 为 #11 开辟通道维度的频域稀疏化。

## 核心数学

### GAP 是 2D DCT 的特例
2D DCT 基函数：
```
B_{h,w}^{u,v} = cos(πu/H · (h+½)) · cos(πv/W · (w+½))
```
当 u=0, v=0（最低频）：
```
f_{0,0} = Σ_x · cos(0) · cos(0) = Σ_x = GAP · H · W
```
→ **GAP 只捕获了 DC 分量**。通道注意力丢掉了所有 AC 信息。

### 多频谱通道注意力
1. 输入 X∈R^{C×H×W} 沿通道分 n 组：[X⁰, X¹, ..., Xⁿ⁻¹]
2. 每组 Xⁱ 用**不同的 DCT 频率索引** [u_i, v_i] 压缩：
   ```
   Freqⁱ = Σ_{h,w} Xⁱ_{:,h,w} · B_{h,w}^{u_i,v_i}
   ```
3. 拼接 Freq∈R^C → FC → ReLU → FC → Sigmoid → 通道权重
4. **与 SENet 参数完全相同**（DCT 基是预计算常量，零额外参数）

### 频率选择策略
| 策略 | 原理 | 最优 K |
|------|------|--------|
| FcaNet-LF | 选最低 K 个频率 | K=2（已超 SENet）|
| FcaNet-TS | 逐个评估 49 个频率(7×7)，选 Top-K | **K=16** |
| FcaNet-NAS | 连续松弛 + softmax 搜索 | 自动 |

### 关键发现
> "Nearly all frequency components (except the highest one) have very small gaps (≤0.5% Top-1) between the lowest one"

→ 中频分量**单独用**接近 GAP 性能，但**联合用**超越任何单分量
→ **不同频率分量提供互补信息**

> "Deep networks prefer low-frequency information"

→ 但偏好不等于最优——中高频额外提供 GAP 看不到的信息

## 实验
- Backbone: ResNet-34/50/101/152
- ImageNet 224², DCT grid 7×7（最小特征图 7×7）
- 计算开销 vs SENet: +0.04%~0.13%（可忽略）
- **固定 DCT 基** 性能优于**可学习**的压缩张量 → 数学结构 > 数据驱动

---

## 对本项目的启示

### Idea#20/#21: 频域通道-空间双维稀疏化

**FcaNet 的直接推广**：
```
P2 每个 token 在当前层的 channel attention：
- 传统（GAP）: 只用 DC 分量 → 对所有空间位置一视同仁
- FcaNet 扩展：对不同通道组用不同频率压缩 → 揭示"哪些通道对哪些频率敏感"

→ 对于 P2 门控：
  - 空间维度（#11）: 高频能量异常 → 小目标候选位置 → 空间稀疏化
  - 通道维度（新增）: DCT 频谱特征 → 哪些通道需要激活 → 通道稀疏化
  → 双维稀疏 = 空间选择 + 通道选择
```

### 技术方案
```
1. P2 token 周围 patch → 2D DCT → 频谱向量 S ∈ R^K
2. S 的前几维 (低频) 决定是否进入通道组 → 背景 token 低频高（平坦）→ 剪
3. S 的高频分量决定是否需要精细处理 → 纹理/边缘/小物体 → 保留
4. 输出：空间×通道 双维 mask → 控制后续计算
```

### 与 #11 的关系
- #11 当前方案：空间维度的高频能量门控
- FcaNet 启示：通道维度可同时稀疏化（不同通道处理不同频率 → 某些通道对小目标无贡献 → 可剪）
- #20 = #11 + FcaNet 通道频域选择 → "双维稀疏化"
- **差异化**: 频域浪潮 4 篇（SET/DERNet/SFDNet/FMC-DETR）全部做特征增强，无人做通道维度的频域条件计算

### 参数成本
- DCT 基预计算常量 → 零额外参数
- 通道分组只需在注意力 FC 层前插入 → ~几行代码改动
- "We can change a few lines of code in the calculation to implement our method within existing channel attention methods"（原文）

### 关键引用
- 引用 "GAP = 最低频 DCT 特例" → 证明传统通道注意力信息损失
- 引用多频谱互补发现 → 证明不同通道需要不同频率信息
- 作为 #11/#20 的频域工具理论基础

---
*Pre-2025 (ICCV 2021) | 路径三 P1 | Read 2026-07-16*
