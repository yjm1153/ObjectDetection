# 快速评估 — 2026-07-16 文献第二轮

## MDI-YOLO (Scientific Reports, Feb 2026)
> Shi et al. | 基于 YOLOv8n 的轻量 Transformer-CNN 融合

### 核心技术
- **C2f-MCC**：通道分组策略，一半 MHSA-CGLU（全局），一半 CNN（局部），替换 backbone 6/8 层
- **DFA**：Coordinate Attention + 全局平均池化分支
- **Inner-Shape-IoU**：Shape-IoU + Inner-IoU 联合

### VisDrone 结果
- mAP@0.5: +4.0%, mAP@0.5:0.95: +2.5%（vs YOLOv8n, 参数几乎不变）

### 评估
- **与本项目关系**: 中低
- **理由**: C2f-MCC 是 backbone 局部改进, 不涉及 P2 检测头/条件计算/频域门控
- **价值**: 作为 YOLO 轻量化 baseline 参考；DFA 注意力机制可作 Neck 选型对比
- **推荐**: 快速评估 ✅，不安排深度阅读
- **威胁等级**: 低（与 Idea #5/#11/#20 不重叠）

---

## SFS-DETR (CVPR 2026 Findings, June 2026)
> Jia et al. | 空间-频域联合选择的 UAV 检测 DETR

### 核心技术（基于摘要+搜索）
- **SSFN (Selective Spatial-Frequency Network)**：联合空间+频域自适应选择主干
- **SAF (Semantic-Aligned Fusion)**：多尺度特征语义对齐融合
- **MFE (Multi-branch Feature Enhancer)**：并行增强分支

### 数据集
- VisDrone, UAVDT, CODrone, UAVVaste, SIMD

### 评估
- **与本项目关系**: 中等
- **理由**: 
  - 空间-频域联合选择与 Idea #11 共享动机
  - 但是 DETR 架构（非 YOLO）
  - 全文无法获取（无 arXiv），技术细节不足
- **价值**: 确认"空间-频域联合选择"方向热度（CVPR 2026 Findings）
- **推荐**: 快速评估 ✅，待全文公开后重新评估
- **威胁等级**: 低-中（方向重叠但架构不同, 全文不可访问无法确认具体实现）
- **注**: 这是第二篇 CVPR 2026 频域-UAV 检测论文（第一篇为 SpTopoNet, 事件相机）

---

## SA-Matching DETR (CVPR 2026 Findings)
> Yang et al. | 轻量 Transformer + Scale Adaptive Matching

### 核心技术
- **Partial ViT**：部分通道自注意力（通道分解），66.7M 参数 85.2% ImageNet
- **Scale Adaptive Matching**：根据物体尺度自适应扩展 GT 框（大物体缩小框→减少假负，小物体扩大框→减少假正）
- COCO 54.8% mAP, 84M params

### 评估
- **与本项目关系**: 中低
- **理由**: Scale Adaptive Matching 机制可为 #6 (SLE) 的标签分配策略提供参考
- **推荐**: 快速评估 ✅，不安排深度阅读
- **威胁等级**: 低

---

## 总结

| 论文 | 深度 | 与项目关系 | 新建Idea？ |
|------|------|-----------|-----------|
| MDI-YOLO | 快速 | 低（baseline参考） | 否 |
| SFS-DETR | 快速（受限） | 中（方向确认） | 否 |
| SA-Matching DETR | 快速 | 低 | 否 |

本轮新发现论文中 DFIR-DETR 价值最高（已深度阅读 ✅），其余三篇作为方向确认/baseline 参考即可。
