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
