# Deformable DETR: Deformable Transformers for End-to-End Object Detection

> **Venue**: ICLR 2021(arXiv 2010.04159)⚠️ pre-2025 基础方法(按 2026-07-16 解锁授权抓取)
> **机构**: SenseTime Research + USTC + CUHK(Zhu, Su, Lu, Li, Wang, Dai)
> **代码**: https://github.com/fundamentalvision/Deformable-DETR
> **阅读日期**: 2026-07-17 | **类型**: 🔬 深读(ar5iv HTML 全文)
> **项目定位**: 🟪 B轨基础线 2/3——**全体实时 DETR 的共同底座算子**(RT-DETR/D-FINE/DINO/EFSI 的 decoder 全部沿用 MSDeformAttn)

---

## 一、动机:DETR 两大痛点的根因诊断

| 痛点 | 数字 | 根因(论文分析) |
|---|---|---|
| 收敛慢 | 500 epoch(比 Faster R-CNN 慢 10–20×) | 初始化时注意力权重 ≈ 1/N_k 均匀分布 → 梯度模糊,需要漫长训练才能学会聚焦稀疏关键位置 |
| 小目标差 | DETR APs 仅 20.5(Faster R-CNN 26.6) | 检测小目标需要高分辨率特征,但 encoder 自注意力 O(H²W²C) 二次复杂度 → 高分辨率不可承受 |

两个痛点同根:**Transformer attention 处理图像特征图的固有缺陷**——"看所有位置"既贵又难学。

## 二、核心方法:Deformable Attention

### 2.1 单尺度公式

DeformAttn(z_q, p_q, x) = Σ_m W_m [ Σ_{k=1}^{K} A_mqk · W'_m · x(p_q + Δp_mqk) ]

- 每个 query 只对参考点 p_q 周围 **K 个采样点**(K≪HW,默认 K=4,M=8 头)做注意力
- **关键设计**:偏移 Δp_mqk 和权重 A_mqk 都由 query 特征**线性投影直接预测**(3MK 通道:2MK 给 offset,MK 过 softmax 给权重)——**注意力权重不经过 query-key 内积**!
- 分数坐标用双线性插值取值(继承 deformable conv)

**复杂度**:encoder(N_q=HW)→ O(HWC²) 线性;decoder cross-attn(N_q=N)→ O(NKC²) **与特征图分辨率无关** → 高分辨率特征图从此可用

### 2.2 多尺度版 MSDeformAttn

- L 层特征(C3–C5 经 1×1 conv + C5 再 stride-2 conv 得 C6,共 L=4,全部 256 通道)
- 每 query 跨全部层级采 L×K 个点,归一化坐标 φ_l(p̂_q) 重缩放到各层
- **天然跨尺度信息交换 → 不需要 FPN**(消融:加 FPN/BiFPN 零提升)
- 加 scale-level embedding(随机初始化可学习)区分层级
- 退化关系:L=1, K=1, W'_m=identity 时 = deformable conv;采样点遍历所有位置时 = 标准 attention

### 2.3 架构落位

- **encoder**:自注意力全部替换为 MSDeformAttn(query=key=像素,参考点=自身)
- **decoder**:**只替换 cross-attention**,query 间 self-attention 保留标准形式(N 小,负担可接受)
- 参考点机制:box 预测为**相对参考点的 offset**(sigmoid/σ⁻¹ 空间)→ 后续全家族(DAB/DINO/RT-DETR/D-FINE)沿用

## 三、两个变体(后续家族的火种)

1. **Iterative Bounding Box Refinement**:每层 decoder 基于上层预测精化 box;**梯度在 σ⁻¹(b^{d-1}) 处截断**(DINO 后来命名为 "look forward once" 并改进为 twice);采样 offset 还按上层 box 宽高调制
2. **Two-Stage**(DINO 正名为 **query selection**):去 decoder 的 encoder-only 变体逐像素出提案 → top-K 分数框作为 decoder 初始 query;**无 NMS**。→ 这是 #5-D「query selection 第三判据」所在机制的**诞生地**

## 四、COCO 数字(val 2017, R50)

| 模型 | Epochs | AP | APs | 参数/FLOPs | FPS |
|---|---|---|---|---|---|
| Faster R-CNN+FPN | 109 | 42.0 | 26.6 | 42M/180G | 26 |
| DETR | 500 | 42.0 | 20.5 | 41M/86G | 28 |
| DETR-DC5 | 500 | 43.3 | 22.5 | 41M/187G | 12 |
| **Deformable DETR** | **50** | **43.8** | **26.4** | 40M/173G | 19 |
| + iterative refine | 50 | 45.4 | 26.8 | 40M/173G | 19 |
| ++ two-stage | 50 | **46.2** | **28.8** | 40M/173G | 19 |

- 1/10 训练代价超越 DETR;APs 20.5→26.4(+5.9,**收益最大项**正是小目标)
- 消融:多尺度输入 +1.7 AP(APs +2.9);跨尺度 MS attention 再 +1.5;K:1→4 +0.9
- test-dev:ResNeXt-101+DCN 50.1;+TTA 52.3

## 五、与本项目的关系

1. **B轨底座算子确认**:RT-DETR(decoder)、D-FINE、DINO、EFSI-DETR 的 decoder 全部沿用 MSDeformAttn——B轨任何改动都建立在"K 点稀疏采样"这一前提上
2. **条件计算谱系源头**:deformable attention 本质 = **最早的空间稀疏化**("attends to a small set of sampling points as a pre-filter")——#5-D/#11-D 的「减少特征计算」主张与该精神同源,划界点在于:deformable 是**固定 K 点**的稀疏,#5-D 要做**内容自适应的 token/query 数量**稀疏
3. **#24 信息瓶颈论据补全**:RT-DETR 论文所引「encoder 占 49% GFLOPs 只贡献 11% AP」正是对本文 encoder(N_q=HW 的 MSDeformAttn 仍是大头)的定量批评 → encoder 冗余是家族遗传病
4. **#26 最优停止**:iterative refinement 的"逐层精化+梯度截断"结构 = 层深维度可微中断点的天然载体(DINO 层数消融进一步补充数据)
5. **可视化发现**(A.5):类别预测依赖**物体内部像素**,box 回归看**边界极值点**——与 #5 语义熵(内容判据)+ 定位不确定性(边界判据)的双判据思想暗合
6. **多尺度不需要 FPN 的启示**:MSDeformAttn 内生跨尺度交换 → B轨若加 P2,不必照搬 YOLO 的 neck 思路,可从**采样层级扩展**(L=4→5)切入(⚠️ 与 timeline 结论「全线无 P2」相印证,#6 迁移空间成立)

## 六、划界与风险提醒

- 「稀疏采样」已被本文占据 15000+ 引用的位置——B轨 Idea 严禁表述为"对 attention 做稀疏采样"(= 本文),必须表述为"对 **query/token 预算**做内容自适应分配"(#5-D)或"对**特征层级**做条件门控"(#11-D)
- 无序内存访问使 deformable attention 比同 FLOPs 卷积略慢(论文自认)→ B轨轻量化不能只看 FLOPs,须报时延(与 HashEye/EFSI 的教训一致)
