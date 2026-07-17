# 快速评估 — 2026-07-17 轻量化检测首轮

> 检索范围:2025–2026 轻量化 UAV/小目标检测(条件计算/截短backbone/端侧部署视角)
> 深度评估另见:HashEye_SciRep2026.md / EFSI-DETR_arXiv2026.md

---

## 1. DroneScan-YOLO (arXiv 2604.13278, 2026)

**一句话**:YOLOv8s + 1280 输入 + **stride-4 P2 分支(MSFD, 仅 +114.6K 参数/+1.1%)** + RPA-Block 动态 filter 剪枝(lazy 余弦相似度更新, 10-epoch warm-up),VisDrone **mAP50 55.3 / mAP50-95 35.6, 96.7 FPS**。

- Recall 0.374→0.518;bicycle AP50 +187%(0.114→0.328)——P2 分支对稀有小类收益巨大
- 剪枝疑似结构化通道剪枝(摘要未确认空间/通道维;全文未细读)
- **对项目**:①#6 SLE 的 YOLOv8 侧强佐证——P2 分支 +1.1% 参数换 +16.6 mAP50(含 1280 分辨率混杂因素,不可全归 P2);②"高分辨率输入 + P2 + 剪枝控成本"= #6+#5 组合的既有粗糙版,Related Work 需划界(其剪枝是**通道维静态**,#5 是**空间维输入自适应**)
- 处置:**快速评估即可**,若后续 #6 进实验阶段再回读全文

## 2. 检索面观察(轻量化赛道 2026)

- **动态/输入自适应成为主流词汇**:DTAH 动态任务对齐头、DEConv 专家卷积、RPA 动态剪枝、HashEye 空间剪枝——"input-adaptive"泛滥,但**特征级空间稀疏化(#5 本体)仍无人做**(HashEye 输入级/RPA 通道级/DEConv 核选择级)
- 轻量注意力家族(LSKA/EMA/ESE/极化线性注意力)+ 动态损失(SD loss/Win-IoU)为常见涨点组合,创新密度低
- 其余检索命中(RE-YOLO 3.2MB/150FPS、AeroVision-DET 14.57M、A2C2fLite 2.0M/5.7GFLOPs、小目标蜂群检测 ASoC 2026)均为模块组合型,无条件计算,不单独评估
- **UFO-DETR (arXiv 2602.22712)**:LSKNet backbone + DynFreq-C3 频域增强,UAV tiny objects——频域浪潮可能的第 6 篇,留待下轮判断是否值得深读

## 结论
轻量化赛道对项目的净信息:**#5/#11 的特征级条件计算空白在 2026 轻量化文献中依然成立**;P2 分支价值第 3 次独立验证(DM-EFS/FMC-DETR/DroneScan);判据家族+1(LSH);工程共识形成——"GPU 稀疏要么输入级稠密重排(HashEye),要么通道级结构化(RPA),逐点 masked conv 无人采用"→ v3.0 推理路径修正的依据。

*检索日期: 2026-07-17*
