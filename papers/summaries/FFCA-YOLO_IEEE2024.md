# FFCA-YOLO: Feature Enhancement, Fusion and Context Aware YOLO

> IEEE TGRS 2024 | 基于 YOLOv5 的遥感小目标检测 | 无 arXiv 版本

## 一句话总结
YOLOv5 + 三个即插即用模块（FEM/FFM/SCAM），VEDAI 0.748 / AI-TOD 0.617 / USOD 0.909 mAP50。

---

## 三大模块

### FEM (Feature Enhancement Module)
- 多分支膨胀卷积扩展感受野
- 受 RFB-s 启发（仅两分支膨胀卷积，更轻量）
- 残差连接保留关键小目标特征

### FFM (Feature Fusion Module)
- BiFPN 结构 + **CRC (Channel Re-weighting)** 策略
- 自适应加权多尺度通道信息
- 不增加计算量

### SCAM (Spatial Context Aware Module)
- GAP + GMP 全局上下文建模
- 三并行分支：通道上下文 / 1×1 线性变换 / QK 分支（跨通道+跨空间）
- Hadamard 积融合 → 抑制背景混淆

### L-FFCA-YOLO（轻量版）
- PConv + CSPFasterBlock 重构
- 参数：7.12M → 5.04M（-30%）
- 推理：107 FPS

---

## 实验结果

| Dataset | mAP50 |
|---------|-------|
| VEDAI | 0.748 |
| AI-TOD | 0.617 |
| USOD (自建, 99.9% 物体<32px) | 0.909 |

---

## 评估

- **与本项目关系**: 低
- **理由**: FEM/FFM/SCAM 是通用特征增强模块，不涉及 P2 检测头、条件计算、频域门控、VLM 引导
- **价值**: YOLO 遥感小目标 baseline 参考；SCAM 的全局上下文建模可作 Attention 条目
- **威胁等级**: 低（与 Idea #5/#11/#20 方向不重叠）
- **推荐**: 快速评估 ✅，不安排深度阅读

---

*Read: 2026-07-16 | 快速评估（基于搜索+论文摘要）*
