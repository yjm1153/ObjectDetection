# Dome-DETR: Density-Oriented Feature-Query Manipulation for Efficient Tiny Object Detection

> arXiv 2505.05741 (2025, USTC, 投稿 ACM MM 格式) | 深读日期: 2026-07-17
> 读因: #5-D 查新检索命中 — **#5-D 的最强直接竞品**(判据→掩码→encoder token 稀疏 + query 预算自适应,D-FINE 底座,VisDrone/AI-TOD 主战场)
> 代码: 声明 accept 后放出(截至阅读时未放)

---

## 一句话

在 D-FINE 上加一个 0.8M 的密度预测头(DeFE),用密度热图同时驱动 **浅层特征的掩码窗口注意力稀疏化(MWAS)** 和 **query 数量/位置的自适应分配(PAQI)**,AI-TOD-V2 34.6(+3.3)/ VisDrone val 39.0(+2.5, 800×800)双 SOTA。

## 三组件

### A. DeFE(Density-Focal Extractor)— 判据来源
- 取**最浅层** backbone 特征 → 级联 depthwise separable conv(dilation 1/2/3)→ 通道注意力 → 1 通道 sigmoid 密度热图
- **需要 GT 监督**:密度图 GT = 以每个目标中心为核心的高斯核(核尺寸 ∝ bbox 尺寸)
- 专用损失 DRFL:α=√d_gt 位置加权 MSE + β·𝟙(低估)·d_gt 惩罚密集区漏检
- 仅 +0.8M 参数

### B. MWAS(Masked Window Attention Sparsification)— encoder token 稀疏化
- 密度图 → 自适应阈值二值掩码(T_init=0.05,ΔT 递减直到至少激活一个前景窗,保底机制)
- 浅层特征划窗(H/W=10 最优)→ 窗口级 max-pool 掩码 → **只有前景窗参与注意力**
- APE(Axis Permuted Encoder):窗内 MSA → 轴置换 MSA(跨窗长程交互)→ FFN

### C. PAQI(Progressive Adaptive Query Initialization)— query 预算自适应
- Top-K_M 候选 → 拆分:核心 K_N 保底 + 弹性 (K_M−K_N)
- 弹性 query 用密度高响应掩码过滤(背景 query 丢弃)
- **Dynamic NMS**:IoU 阈值 = IoU_N + S_final×(IoU_M−IoU_N)(0.4/0.9 最优)— 密集区松、稀疏区严

## 关键数字

| 模型 | Params | GFLOPs(⋆输入依赖平均) | AI-TOD-V2 test AP | VisDrone val AP |
|---|---|---|---|---|
| D-FINE-S | 11.6M | 112.4 | 30.1 | 31.2 |
| **Dome-S** | 13.2M | **154.2⋆** | **33.3 (+3.2)** | **33.5 (+2.3)** |
| D-FINE-L | 34M | 327.5 | 31.3 | 36.5 |
| **Dome-L** | 36M | **376.4⋆** | **34.6 (+3.3)** | **39.0 (+2.5)** |

- 增益集中在 APvt/APt(+3.7/+4.6),越小收益越大
- 消融(AI-TOD-V2, S 档):基线 30.1 → +DeFE+MWAS 31.2 → +DeFE+PAQI 32.1 → 全量 33.3(组件互补)
- 对照:DQ-DETR 1782⋆ GFLOPs / 35.2 → Dome-L 376⋆ / 39.0(碾压)

## ⚠️ 攻击面(划界可用)

1. **GFLOPs 不降反升**:Dome-S 154.2 vs D-FINE-S 112.4(+37%)——MWAS 不是"净省算力",而是"把新引入的浅层高分辨率特征的代价控制住"。定位是**加算力换精度、稀疏化控成本**,不是效率方法
2. **判据需 GT 监督**:DeFE 需要高斯密度图 GT + 专用 DRFL 损失 + 0.8M 模块,跨数据集需重训判据头
3. **保留 NMS**(Dynamic NMS 且带 IoU_N/IoU_M/T_init 三个超参)——破坏 DETR 端到端性,与"消除手工组件"的谱系叙事相悖
4. GFLOPs 输入依赖(⋆平均值),密集场景最坏开销未报告;时延/FPS 全文未报告

## 与本项目关系

1. **❌ 判死 #5-D**:「判据→掩码→浅层 token 稀疏 + query 预算自适应」结构被完整占据,且底座(D-FINE)、数据集(VisDrone/AI-TOD)与 B轨规划完全重叠。#5-D 若做"语义熵替换密度判据"= 判据替换型薄增量,查新不过审 → 详见 [detr_derivative_novelty_check.md](../../Ideas/detr_derivative_novelty_check.md)
2. **✅ 反哺 #11-D(→#30)**:证明「判据驱动浅层 token 稀疏化」通路在 D-FINE 上有效(+2.5~3.3);#30 的差异点 = 判据免监督零参数(频谱统计)vs DeFE(0.8M+GT 密度+DRFL)
3. **⚠️ 修正 detr_map 结构空白①**:"全线无 P2"不再成立——Dome 已用最浅层特征(stages 1-4 四尺度)+MWAS 控制成本;#6/#14 的"首次 DETR 浅层"新颖性消失,SLE 跨架构验证价值收窄为"结构对照"
4. **B轨 SOTA 参照更新**:VisDrone val 39.0(800×800)为当前已读 DETR 系最高;但注意其分辨率 800 vs 多数工作 640,对照需谨慎
5. **#26 佐证**:D-FINE 底座仅 1 层 encoder(Dome 沿用)——encoder 冗余结论再次被工程实践确认
6. **#24 佐证**:前景占比极低(Fig.2 遥感/无人机 vs COCO 对照)= 信息瓶颈论的又一定量动机

---
*Read: 2026-07-17 | 来源: ar5iv (arXiv 2505.05741)*
