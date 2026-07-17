# AD-Det: Boosting Object Detection in UAV Images with Focused Small Objects and Balanced Tail Classes

> Remote Sensing 2025 (17, 1556) | Li, Lian et al. (福州大学) | arXiv:2504.05601
> 论文: arxiv.org/abs/2504.05601 | 代码: 未公开
> **VisDrone val 37.5 AP(ResNeXt-101, flip)——超越 CZDet 至少 +3.1,当前 coarse-to-fine 路线 SOTA**

---

## 1. 问题 (Problem)
UAV 图像两大挑战被现有工作**分开处理**,忽视其协同:
- **尺度变化**:VisDrone 小目标(<32²)占 60.5%(比 COCO 高 19.1%),大目标仅 5.5%
- **类别不平衡**:头部类(car/people)占 70%+ 实例,尾部类(bicycle/van)仅 1–7%

## 2. 方法 (Method) —— coarse-to-fine,基座 GFL(非 YOLO/DETR)

### 2.1 ASOE(Adaptive Small Object Enhancement)—— 零参数小目标区域挖掘
- 从 coarse 检测器**分类头的 P3 高分辨率特征图** F_l∈R^(C×H×W) 计算逐位置激活图:
  `V_l = (1/C)·Σ_c σ(F_l)`(Sigmoid 后按通道平均)
- 阈值过滤 `V_l(i,j) > γ=0.5` → 乘下采样因子 2^l 映射回原图坐标 → 得候选点集 T_l
- **K-means 聚类**成 N 个簇(VisDrone N=4, UAVDT N=3)→ 取每簇 TL/BR 坐标裁剪子区域 → 放大后送 fine 检测器
- 关键性质:**免额外可学习参数、免密度图 GT**(vs DMNet 密度图网络);利用检测器固有性质(P3 激活≈小目标位置)

### 2.2 DCC(Dynamic Class-balanced Copy-paste)—— 尾类目标级重采样(仅训练期)
- **DA(多样性增强)**:每个尾类维护容量 10 的 FIFO 记忆库;实例裁剪带 **1.5× bbox 扩展**保留上下文;粘贴前做 shift-scale-rotate + 随机亮度对比度
- **DS(动态搜索)**:从 ASOE 簇中心出发 **BFS 搜索**粘贴位置——靠近目标分布中心 + 不与现有 GT 重叠(二值 mask 校验);以 b′ 宽高为自适应搜索步长
- 尾类定义:VisDrone 除 pedestrian/people/car 外全部;UAVDT 的 truck/bus

### 2.3 训练与推理
- coarse/fine 两个检测器**独立训练**;fine 训练集 = ASOE 子区域 + DCC 增强
- 推理:`D_final = NMS(Coarse(G) ∪ ∪_i Fine(S_i))`,NMS 阈值 0.5,max det 500
- 输入 1333×800(VisDrone);12 epochs SGD;2×A4000

## 3. 结果
| 方法(VisDrone val) | Backbone | AP | AP₅₀ | AP₇₅ |
|---|---|---|---|---|
| CZDet | R101 | 34.4 | 59.7 | 34.6 |
| YOLC | X101 | 33.7 | 57.4 | 33.8 |
| **AD-Det** | **R50** | **35.3** | 57.9 | 36.6 |
| **AD-Det*** | X101 | **37.5** | **60.9** | **39.2** |

- **消融**:Baseline 33.1 → +ASOE 35.3(**AP_S 24.3→27.5, +3.2**)→ +DCC 35.9(AP_S 28.0);耗时仅 0.706→0.758 s/img
- **P3 vs P4 聚类**:P4 反而降到 30.4(AP_S 21.3)——**高分辨率层对小目标区域定位不可替代**
- DCC 尾类 AP 提升 0.9~1.9%(bicycle/tricycle/awn./bus),不损害头部类
- 复杂度:R50 版 64.1M/1072G/0.514 s/img——参数量显著低于 ClusDet(181M)/GLSAN(591M)
- UAVDT:20.1 AP(R50)新 SOTA
- 基座选型消融:GFL 29.3 > CenterNet 27.2 > FCOS 26.7 > YOLOv8 26.1(AP,VisDrone)

## 4. 局限(作者自述+我方分析)
- ASOE 忽视全局-局部特征交互;DCC 均匀采样未做实例级难例挖掘
- **非实时**:0.5–0.7 s/img,两阶段推理(coarse+N 次 fine)与本项目实时约束冲突
- 粘贴仍是 2D 贴图,无光照/视角一致性建模(对比 IEEE TAES 2025 场景理解式增强)
- GFL 基座 + MMDetection,非 YOLO 生态

## 5. 对项目的启示
- ✅ **#5 的又一正交佐证(激活引导范式)**:ASOE 用"P3 激活图>阈值→只精算这些区域"——与 #5"语义熵引导 P2 稀疏化"同属**特征引导计算分配**,但 ASOE 是图像级两阶段裁剪(慢),#5 是特征级单阶段门控(实时)。Related Work 划界:裁剪式 vs 门控式
- ✅ **P3/P2 高分辨率激活≈小目标位置**再获独立验证(P4 聚类 AP_S 暴跌 -6.2)→ 支持 #23 SNR 退化假设:小目标可解码信号集中在最浅层
- ✅ **augmentation.md 空白填补**:DCC = 位置合理性 + 多样性的 copy-paste 新范式(记忆库+BFS+簇中心先验)
- 💡 **DCC 思想可低成本迁移 #6**:SLE baseline 训练时对 VisDrone 尾类加 DCC 式增强(纯训练期,零推理开销)——待实验模块就绪后可作为 trick 纳入
- ⚠️ **SOTA 表更新**:VisDrone val 37.5(AD-Det, coarse-to-fine 非实时)>FMC-DETR 33.7;注意二者赛道不同(非实时裁剪式 vs 实时端到端),引用时需分赛道对比

## 6. 分析维度
- **研究问题**:尺度变化+类不平衡的协同求解(coarse-to-fine 框架内)
- **创新点**:P3 激活图零参数区域挖掘(ASOE);簇中心引导+记忆库 copy-paste(DCC)
- **局限**:两阶段非实时;图像级裁剪粒度粗;无跨阶段特征复用
- **可借鉴**:激活引导计算分配的又一实例;尾类 copy-paste 的位置合理性设计
- **可改进**:裁剪式→门控式(#5 方向);尺寸/激活判据→语义熵判据

---

*Summary generated: 2026-07-16 | Agent: Claude Code*
