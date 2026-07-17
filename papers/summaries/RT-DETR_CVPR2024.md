# RT-DETR: DETRs Beat YOLOs on Real-time Object Detection

> CVPR 2024 | Baidu Inc + 北京大学 | arXiv: 2304.08069 | 🟪 B轨基础线(pre-2025 解锁授权,2026-07-17 双轨决策后补读)

## 一句话总结
**首个实时端到端检测器**:用混合编码器(AIFI+CCFF)解耦尺度内交互与跨尺度融合砍掉 Transformer encoder 瓶颈,用不确定性最小 query 选择提升初始 query 质量——COCO 53.1 AP/108 FPS(R50)全面超越同级 YOLO,且免 NMS。

---

## 核心机制

### 1. NMS 影响的定量分析(动机)
- NMS 两个超参(conf thr / IoU thr)同时影响精度与速度:YOLOv8 最佳精度配置(conf=0.001, IoU=0.7)下 EfficientNMS 核耗时 ~2.36ms
- conf 阈值 0.001→0.05:NMS 时间 2.36→1.06ms,但 AP 52.9→51.2(不稳定性来源)
- 建立**端到端速度基准**(含 NMS 的 T4+TensorRT FP16 平均时延);结论:anchor-free 比 anchor-based 快(预测框少 3 倍)

### 2. Efficient Hybrid Encoder(最大贡献)
- **瓶颈定位**:Deformable-DETR 中 encoder 占 49% GFLOPs 只贡献 11% AP;多尺度 token 拼接后序列过长
- **AIFI**(Attention-based Intra-scale Feature Interaction):**只对 S5 做单尺度自注意力**(1 层)——高层语义概念间的交互才有意义,低层特征做自注意力冗余且有害
- **CCFF**(CNN-based Cross-scale Feature Fusion):PANet 式 CNN 融合路径,fusion block = 两个 1×1 conv + N 个 RepBlock + element-wise add
- 变体消融(A→E):只对 S5 做尺度内交互(D_S5 vs D):**时延 −35% 且 AP +0.4**;最终 E 比 D:AP +1.5、时延 −24%
- ⚠️ **与 #5/SPA 的"浅层不剪"呼应**:RT-DETR 从架构层面认定"低层特征自注意力交互不必要"——但这是"不算注意力",不是"不传特征";与 #5 的 P2 特征选择性传递互补

### 3. Uncertainty-minimal Query Selection
- 旧 query selection 只按分类分数选 top-K(K=300)→ 选出"分类高但定位差"的特征
- 定义不确定性 **U(X) = ‖P(X) − C(X)‖**(定位分布与分类分布的差异),并入损失显式优化
- 效果:双高分(cls+IoU>0.5)特征占比 0.30%→0.67%;AP +0.8(47.9→48.7, 1×配置)

### 4. 灵活速度调节(DETR 独有优势)
- 多层 decoder 相邻层精度差随深度递减 → **推理时砍 decoder 层数免重训调速**:6层 53.1 AP/9.3ms → 用第5层 53.0 AP/8.8ms
- YOLO 系无对应能力(重训才能换档)

---

## 实验结果(COCO val2017, T4 TensorRT FP16, 640×640)

| 模型 | Params | GFLOPs | FPS | AP | **AP_S** |
|------|--------|--------|-----|-----|---------|
| RT-DETR-R18 (Dec3) | 20M | 60.7 | 217 | 46.5 | 28.4 |
| RT-DETR-R34 (Dec4) | 31M | 92.7 | 161 | 48.9 | 30.6 |
| RT-DETR-R50 | 42M | 136 | 108 | 53.1 | 34.8 |
| RT-DETR-R101 | 76M | 259 | 74 | 54.3 | 36.0 |
| YOLOv8-L(对照) | 43M | 165 | 71 | 52.9 | **35.3** |
| YOLOv8-X(对照) | 68M | 257 | 50 | 53.9 | 35.7 |
| DINO-Def-R50(对照) | 47M | 279 | 5 | 50.9 | 34.6 |

- vs DINO-Deformable-R50:**AP +2.2,FPS ×21**(108 vs 5)
- Objects365 预训练后:R18/R50/R101 = 49.2/55.3/56.2(+2.7/+2.2/+1.9)→ **DETR 系从大规模预训练获益远超 YOLO**
- 训练:4×V100,AdamW,6×(72 epoch),query=300,decoder 6 层

## ⚠️ 论文自认的 Limitation(对本项目最关键)
> "the performance on small objects is still inferior than the strong real-time detectors" —— RT-DETR-R50 AP_S 比 YOLOv8-L 低 0.5,R101 比 YOLOv7-X 低 0.9

**小目标是 RT-DETR 官方承认的短板** → B轨在 VisDrone 上的改进空间真实存在(也解释了为何 FMC-DETR/EFSI-DETR/DFIR-DETR 全在此发力)。

---

## 与本项目的关系

### → B轨基线选型
- RT-DETR 是全部 2025–2026 小目标 DETR(FMC-DETR/EFSI-DETR/D³R-DETR/DFIR-DETR/SFS-DETR)的共同底座 → **读懂它 = 读懂 B轨全家族**
- 检测层用 S3–S5(下采样8/16/32),**无 P2(S2)** → #6 SLE 的 [D2,D4] 改造(FMC-DETR 已做)在结构上有空间
- decoder 层数免重训调速 ↔ #26 最优停止理论的现成"停止维度"(层深方向 τ*)

### → Idea 映射
| RT-DETR 机制 | 关联 Idea |
|-------------|----------|
| AIFI 只算 S5(浅层自注意力冗余论) | #5/#22 划界:传特征≠算注意力;Related Work 需引 |
| Uncertainty-minimal QS(分类-定位分布差) | **#5-D 衍生的天然接口**:把"语义熵"作为第三个选择判据(cls/loc/熵)接入 query selection 是干净落点 |
| encoder 49% FLOPs / 11% AP | #24 信息瓶颈的 DETR 侧佐证数据点 |
| decoder 逐层精度递减 | #26 τ* 在 DETR 侧的验证载体 |

### 划界(#5-D 查新前置)
- RT-DETR 的 query selection 是**头级 top-K 选择**(与 LRPC/Unmasking 同层),不触碰 encoder 特征计算量 → #5-D 若做"熵引导 query 稀疏化"必须与之划界:**改变 K 的构成 vs 减少特征计算**

---

*Read: 2026-07-17 | Agent deep-read via arXiv HTML (v3) | B轨基础线第 1/3 篇(后续: Deformable DETR, DINO)*
