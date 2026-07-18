# Backbone Knowledge Base
> 每读一篇论文必须更新。记录所有目标检测Backbone。

## Template
- **Name**: e.g. ResNet50, CSPDarkNet, Swin-T, ConvNeXt
- **Category**: CNN | Transformer | Hybrid | Lightweight
- **Paper**: 论文名 | 会议/期刊 | 年份
- **Core Idea**: 一句话核心思想
- **Architecture**: 关键结构描述
- **Advantages**: 优点列表
- **Disadvantages**: 缺点列表
- **Computational Cost**: GFLOPs | Params | FPS
- **Performance**: COCO | VisDrone | DOTA | VOC
- **Used By**: YOLO | RT-DETR | DINO | ...
- **Possible Improvements** (≥3个可改进方向):
  1. 
  2. 
  3. 
- **References**: 论文链接 | Github | Project Page

---

## Entries

### 1. 冻结 VLM Backbone + 轻量注意力 Adapter(SEEN-DA 范式)
- **Name**: RegionCLIP(ResNet-50)+ Domain-aware Attention Adapter
- **Category**: CNN(VLM 预训练)+ Adapter
- **Paper**: SEEN-DA | CVPR | 2025
- **Core Idea**: 冻结 VLM 视觉编码器,在最后 N 个 block 后挂轻量可学习注意力模块,用文本语义(语义熵)引导视觉特征精炼
- **Architecture**: N 个冻结 visual block + N 个域感知注意力模块(实验最优 N=3);h_i = A_i(V_i(h_{i-1}))
- **Advantages**: 可学习参数仅 1.875M;保留 VLM 通用表征;语义引导特征选择
- **Disadvantages**: 两阶段、非实时;依赖 CLIP 域先验;总参数 36.7M 不算小
- **Performance**: C→F 57.5 mAP(DAOD SOTA)
- **Used By**: Faster R-CNN(DAOD 场景)
- **Possible Improvements**:
  1. Adapter 范式迁移到 YOLO-World 冻结 backbone(参数高效微调 + 实时检测)
  2. 语义熵图指导蒸馏(教师=VLM 检测器,学生=YOLO11n)
  3. 多域场景下 adapter 的域数无关设计
- **References**: CVPR 2025 Open Access

### 2. 截短 Backbone(SEMA-YOLO SLE)
- **Name**: YOLOv11 backbone 截短至 P4
- **Category**: Lightweight CNN
- **Paper**: SEMA-YOLO | Remote Sens. | 2025
- **Core Idea**: 小目标主导场景下,深层(P5 阶段)卷积对小目标贡献低,砍掉后把算力还给浅层
- **Architecture**: backbone 终止于 P4(经 C2PSA);P5 由 P4 下采样 + Concat 重建
- **Advantages**: 参数 -19.7%;配合 P2 头 mAP50 +4.6(单项收益最大)
- **Disadvantages**: 深层语义弱化,大目标混合场景风险未验证
- **Computational Cost**: 2.075M(SLE 后)
- **Performance**: RS-STOD 0.717 mAP50(仅 SLE)
- **Used By**: SEMA-YOLO(YOLOv11 系)
- **Possible Improvements**:
  1. VisDrone 上复现验证(本项目直接可做)
  2. 截短程度做成可搜索超参(P4 vs P4.5 vs P5)
  3. 与知识蒸馏结合:被砍掉的深层用教师网络语义补偿
- **References**: doi:10.3390/rs17111917

### 3. 空频三路特征提取(SFIDM)
- **Name**: Backbone(空域)+ 双 FF-Block(高/低频域)
- **Category**: CNN + 频域分支
- **Paper**: SFIDM | Remote Sens. | 2025
- **Core Idea**: 图像级 2D-DFT 按阈值切高/低频后 IDFT 重建,双独立 FF-Block(Conv+Bottleneck+SE)分别提特征;低频→分类、高频→定位,与 backbone 空域特征 Concat 融合
- **Architecture**: 3 条并行提取路径:backbone(YOLOv3/YOLOv8s)+ 低频 FF-Block + 高频 FF-Block(参数不共享)
- **Advantages**: 频域信息首次进入遥感 FSOD;高低频职责解耦;即插即用(换 YOLOv8s 仍有效)
- **Disadvantages**: 三路提取计算冗余(SFIDM 225.3 GFLOPs);频率切分阈值无消融;图像级 DFT 而非特征级
- **Computational Cost**: SFIDM 66.0M/225.3 GFLOPs;SFIDM-L(YOLOv8s)15.7M/35.7 GFLOPs
- **Performance**: DIOR novel 10-shot 37.3(SOTA);base 0.62
- **Used By**: SFIDM(FSOD)
- **Possible Improvements**:
  1. 频域分解移到特征级(FcaNet/FreqFusion 路线),消除三路冗余
  2. 高频能量图作免训练前景判据,引导 P2 稀疏化(→ Idea #11,免 VLM)
  3. 高低频切分阈值自适应(城市高频噪声场景)
- **References**: doi:10.3390/rs17060972

### 4. WeKat (Wavelet Kolmogorov-Arnold Transformer, FMC-DETR)
- **Name**: WeKat (HSG-WAVE浅层 + HSG-AKAT深层)
- **Category**: Hybrid (CNN + Wavelet + KAN + Attention)
- **Paper**: FMC-DETR | arXiv | 2025.09
- **Core Idea**: 异质分裂门控(HSG)三流分解(保留/门控/计算);浅层用Haar小波递归分解做结构-细节解耦;深层用非对称自注意力+Group KAN替代MLP
- **Architecture**: HSG-WAVE: Haar小波→递归分解低频子带→结构先验细化→逆变换重建; HSG-AKAT: Q/K压缩投影+动态位置偏置(3×3 DWConv)+Group KAN(样条基函数+分组共享)
- **Advantages**: 频率感知的特征提取;参数量可控(分组KAN);浅层小波扩大ERF且抑制噪声
- **Disadvantages**: DETR专属;小波GPU墙钟效率未验证;FlashAttention依赖;复杂度高于纯CNN
- **Computational Cost**: FMC-DETR-T 13.8M; FMC-DETR-B 17.4M / 53.3 GFLOPs
- **Performance**: VisDrone AP 33.7 / AP50 53.6 (SOTA)
- **Used By**: FMC-DETR(RT-DETR 系)
- **Possible Improvements**:
  1. HSG-WAVE的小波结构解耦迁移到YOLO CSPDarknet替代C2PSA
  2. Group KAN用更轻量的激活函数替代样条基(降低训练复杂度)
  3. 保留流/门控流/计算流三路分解 → 门控流用熵/频域先验替代可学习参数(=#5/#11思路)
- **References**: arXiv:2509.23056; https://github.com/bloomingvision/FMC-DETR

### 15. OAKB — Occlusion-Aware KANC Block (DRONet)
- **Name**: OAKB (遮挡感知 KAN 卷积块)
- **Category**: CNN + KAN Hybrid (频域参数化)
- **Paper**: DRONet | Displays (Elsevier) | 2026.02
- **Core Idea**: 用 KAN (Kolmogorov-Arnold Networks) 的可学习 B-spline 激活函数替代标准 CNN 的固定激活函数，GRAM 多项式展开构造频率多样性核，频域参数化解决 KAN 延迟瓶颈
- **Architecture**: 集成在 ResNet18 backbone → B-spline 基函数非线性变换 → GRAM 多项式展开 → 频率多样性核（不同核响应不同空间频率）→ 频域点乘（替代逐点求值）
- **Advantages**: KAN 在目标检测 backbone 的首批实践; GRAM 展开的频率多样性核自然区分遮挡碎片（高频不规则）vs 完整目标（轮廓规整）; 频域参数化解延迟瓶颈
- **Disadvantages**: KAN 非标准 CNN 组件（ultralytics 集成困难）; 仅在 ResNet18 验证; CARPK +0.7%（价值绑定不规则遮挡场景）
- **Computational Cost**: 60 FPS（整体 DRONet，含 backbone+neck+head）
- **Performance**: VisDrone mAP50 50.1% (vs RT-DETR-R18 47.0%); CARPK 98.7%
- **Used By**: DRONet (RT-DETR + ResNet18 基座)
- **Possible Improvements**:
  1. 标准 CNN 等价实现：DCT 基核组 + 可学习权重 → 同效果免 KAN 框架
  2. 频域参数化核 → #11 S1 判据实现（Sobel/LoG 的频域核等效）
  3. 多频段判据升级（不同遮挡程度 → 不同频率特征 → 不同核响应）
- **References**: DRONet | Displays 93:103388 | ScienceDirect

### 16. Vision Mamba Backbone (HEdge-MamYOLO)
- **Name**: Vision Mamba (扩展自 Mamba-YOLO) — SS2D + LSBlock + RGBlock
- **Category**: State Space Model (SSM) Hybrid
- **Paper**: HEdge-MamYOLO | IEEE TGRS | 2026.04
- **Core Idea**: 用 Mamba SSM 的 O(n) 线性复杂度全局扫描替代 ViT 的 O(n²) 自注意力，同时保留 CNN 局部建模能力
- **Architecture**: 每个 VSSBlock = SS2D（四向选择性扫描2D: 水平/垂直/两对角线, O(n)线性复杂度）+ LSBlock（3×3深度可分离卷积, 补偿SSM局部弱势）+ RGBlock（乘性门控+残差连接, 增强跨通道信息流）; 额外组件: RAGE（区域注意力+门控增强）/ SCDown（参数高效空间下采样）/ A2C2f（面积注意力+C2f融合）
- **Advantages**: O(n) 线性复杂度（vs ViT O(n²)）→ 高分辨率 UAV 图像友好; SS2D 四向扫描捕获全局依赖; LSBlock 补偿 SSM 局部建模不足; VisDrone 52.5% SOTA
- **Disadvantages**: Mamba 生态不成熟（ultralytics 无原生支持, 复现门槛高）; 与 CNN backbone 的 YOLO 检测器不兼容（需整个 Mamba-YOLO 框架替换）; 训练/推理速度未与 YOLOv11 对标
- **Computational Cost**: 未公开（推测高于 YOLOv11 同参数级 CNN backbone）
- **Performance**: VisDrone mAP50 52.5%（检索所见最高）; UAVDT 33.4%
- **Used By**: HEdge-MamYOLO
- **Possible Improvements**:
  1. FM-CHFEM 模块（频域+Mamba 协同）的 CNN 等价实现 → 使频域修复能力脱离 Mamba 依赖
  2. SS2D 的 4 方向扫描 → CNN large-kernel conv（如 31×31 depthwise）近似全局感受野
  3. LSBlock 局部补偿 → 标准 3×3 DWConv（ultralytics 原生支持）
- **References**: HEdge-MamYOLO | IEEE TGRS Vol.64 Art.5619216 | DOI: 10.1109/tgrs.2026.3686228

### 17. FreqDyNet — Frequency-Domain Dynamic Backbone (GCS-DETR)
- **Name**: FreqDyNet (轻量频域动态骨干网)
- **Category**: CNN + Frequency-Domain Filtering
- **Paper**: GCS-DETR | Multimedia Systems | 2026.05
- **Core Idea**: 在 backbone 中引入频域自适应滤波——对部分通道做频域变换→学习保留/抑制权重→增强高频细节+减少低频计算冗余
- **Architecture**: RT-DETR backbone 改造 → Cross-Stage Partial Dynamic Filter Module（跨阶段部分动态滤波）→ 仅对部分通道做频域滤波（类似 PConv 的"部分"哲学）→ 跨 backbone stage 共享/级联滤波结果
- **Advantages**: 频域滤波参数高效（整体模型 −20.6% 参数 vs RT-DETR）; 增强小目标高频细节同时减少背景低频冗余; 部分通道滤波思想控制计算开销; Jetson Orin Nano 实时部署验证
- **Disadvantages**: ⚠️ "动态"机制未确认（输入自适应 vs 学习参数固定）; 频域变换方式未确认; 若为学习式固定参数 → 属于"频域增强"范式（非条件计算）
- **Computational Cost**: 参数量 −20.6% vs RT-DETR; Jetson Orin Nano Super 实时
- **Performance**: VisDrone +3.0% / HIT-UAV +3.5% vs RT-DETR
- **Used By**: GCS-DETR (RT-DETR 基座)
- **Possible Improvements**:
  1. 频域部分滤波 → YOLO C2f/C3k2 模块的频域增强版本
  2. 若为学习式 → 升级为输入自适应频域门控（#30 思路）
  3. FreqDyNet + #11 S1 判据联合：频域滤波提供连续权重 + 频域判据提供离散门控 → 连续-离散谱系
- **References**: GCS-DETR | Multimedia Systems Vol.32 Art.304 | DOI: 10.1007/s00530-026-02378-8
