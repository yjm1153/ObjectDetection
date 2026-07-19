# Detection Head Knowledge Base
> 每读一篇论文必须更新。记录所有检测头设计。

## Template
- **Name**: YOLO Head | RT-DETR Head | DINO Head | ...
- **Classification**: Anchor | Anchor-Free | Transformer
- **Prediction**: 分类 | 回归 | Objectness | Quality | ...
- **Matching Strategy**: Hungarian | TaskAligned | OTA | ATSS | ...
- **Loss**: 使用的Loss函数
- **Advantages**:
- **Weakness**:
- **Future Improvement**:

---

## Entries

### 1. P2 小目标检测头(SEMA-YOLO / 社区常规改进)
- **Name**: P2 Tiny Detection Head(四头 P2/P3/P4/P5)
- **Classification**: Anchor-Free(YOLOv11 head)
- **Prediction**: 分类 + DFL 回归(沿用 YOLOv11)
- **Matching Strategy**: TaskAligned(YOLOv11 默认)
- **Loss**: YOLOv11 默认(BCE + CIoU + DFL)
- **Advantages**: 1/4 分辨率特征图直接检测,小目标召回显著提升(RS-STOD Recall 0.643→0.681);配合截短 backbone 可不增参
- **Weakness**: 特征图面积是 P3 的 4 倍 → GFLOPs 大增;引入海量背景负样本,标签分配压力大
- **Future Improvement**: 高熵背景区域稀疏化;RFLA 式高斯感受野标签分配;P2 头只在训练用、推理蒸馏回 P3(speed trick)

### 2. VLM 文本编码器检测头(DA-Pro / SEEN-DA)
- **Name**: Text-Encoder-as-Head(域自适应 prompt)
- **Classification**: 两阶段(Faster R-CNN RoI head)+ 文本嵌入分类器
- **Prediction**: 视觉特征与文本嵌入余弦相似度做分类;回归分支常规
- **Matching Strategy**: RPN + RoI(Faster R-CNN)
- **Loss**: 源域 CE + 目标域伪标签 CE + 对抗损失(λ_adv=0.1)+ 回归
- **Advantages**: 类别名的语言语义参与分类(非 one-hot);可学习域 prompt "[v_c][v_d][Class]" 显式建模域差异;开放词汇潜力
- **Weakness**: 依赖 VLM;文本嵌入对细粒度/罕见类(遥感器械)可能失准;推理需文本编码器(可离线缓存)
- **Future Improvement**: 迁移到 YOLO-World head;尺度感知 prompt;伪标签质量用语义熵过滤

### 3. RepRTA 重参数化开集分类头(YOLOE, 2025)
- **Name**: RepRTA(Re-parameterizable Region-Text Alignment)+ 物体嵌入头
- **Classification**: Anchor-Free(YOLOv8/11 head 同构)
- **Prediction**: 头部输出物体嵌入 O,分类 = O·Pᵀ(P 为增强后文本嵌入);回归常规 DFL
- **Matching Strategy**: TaskAligned(沿用 YOLOv8)
- **Loss**: Region-text 对比(BCE)+ IoU + DFL(+分割 BCE)
- **Advantages**: 训练期用 SwiGLU FFN 增强文本嵌入,推理期重参数化并入分类头卷积(`K'=R(f_θ(P))⊛Kᵀ`)→ **推理结构 = 原生闭集 YOLO,零开销开集能力**;LVIS 消融 +2.0 AP(APr +9.3)
- **Weakness**: 词表固定后才能重参数化(动态加类需重算);对齐质量仍受冻结文本编码器上限约束
- **Future Improvement**: ①#5 直接以此为基座加 P2+熵稀疏化(推理结构纯净,改造无纠缠);②LRPC 的 anchor 过滤思想下沉到特征级(=#5 本体);③熵图也走同款离线重参数化路径保实时

### 4. DFM 动态特征复用头 (DM-EFS, ICCV 2025)
- **Name**: Dynamic Feature Multiplexing (DFM) + Size-Features Codebook
- **Classification**: Anchor-Free (YOLOv7 head)
- **Prediction**: 标准 YOLO 分类+回归 + Control Module 预测 min/max object size
- **Matching Strategy**: YOLOv7 默认
- **Loss**: 标准检测 loss + Codebook 训练 loss
- **Advantages**: 推理开销极小(仅查表+特征选择);按需使用浅层特征(小目标场景启用更多);3档离散切换简洁
- **Weakness**: 图像级粗粒度(整图统一策略);离散codebook(仅3档);仅按尺寸(忽视语义/频域信息)
- **Future Improvement**: Token级软门控替代图像级Codebook → Idea#5方向;语义熵+频域能量三维Codebook

### 5. ADR 角度分布细化检测头 (O² 系列, TGRS 2026)
- **Name**: Angle Distribution Refinement (ADR) + Chamfer Distance Cost (CDC)
- **Classification**: DETR 旋转框检测头
- **Prediction**: 角度概率分布(非标量回归)→迭代细化 + 旋转框顶点坐标
- **Matching Strategy**: Chamfer距离二分匹配(4顶点最近邻距离之和)
- **Loss**: Chamfer距离匹配代价 + 旋转对比去噪(OCD) + 标准DETR loss
- **Advantages**: 角度不确定性建模(非过拟合单点);Chamfer距离消除几何歧义;推理零额外开销
- **Weakness**: DETR专属;YOLO-OBB未验证;角度分布头在YOLO框架的移植性未知
- **Future Improvement**: ADR迁移到YOLO-OBB → 验证跨架构通用性;YOLO版角度分布头+Chamfer匹配

### 6. OPD — Occlusion Perception Decoder (遮挡感知解码器, 辅助头)
- **Name**: OPD (Li & Li, ESWA 2025)
- **Classification**: Transformer-based 辅助检测解码器（多任务网络组件）
- **Prediction**: 遮挡感知图（Occlusion Perception Map），每空间位置预测遮挡概率 [0,1]
- **Matching Strategy**: 无需匹配（OPD 输出整图遮挡概率图，非 per-object 预测）
- **Loss**: OPL（Occlusion Perception Loss），监督信号来自 bbox 重叠+高斯模糊的 GT 遮挡图
- **Advantages**:
  - 首个人为设计的"遮挡感知"辅助头——与主检测头并行，训练期多任务、推理期可移除
  - Transformer 结构提供全局感受野——能捕捉远距离遮挡关系（遮挡者与被遮挡者可能相距很远）
  - OPC 机制将遮挡图注入检测头→直接补偿遮挡区域的信息缺失
  - 零额外标注依赖（GT 来自 bbox 重叠的自动生成）
- **Weakness**:
  - Transformer 结构在高分辨率特征图上计算开销大（P2 级特征图面积是 P5 的 16 倍）
  - 仅验证 CNN 检测器（行人检测），DETR/YOLO 通用检测器上的可移植性未知
  - OPD 输出整图一张遮挡图→无法区分"哪个目标被哪个目标遮挡"（per-object 遮挡建模缺失）
  - bbox 重叠→遮挡的假设在通用场景下可能不成立（并排目标的 bbox 重叠≠遮挡）
- **Future Improvement**:
  1. **轻量化 OPD**: 用小型 CNN（而非 Transformer）做遮挡图预测 + 复用 FPN 特征→降低训练/推理开销
  2. **Per-object 遮挡建模**: 在 DETR 框架下用 per-query 遮挡图（而非整图一张）→更精细遮挡推理
  3. **频域判据替代 GT 遮挡图**: 高频局部异常度作为 OPD 的无监督训练信号→覆盖 bbox 重叠无法捕获的遮挡类型
  4. **遮挡图注入 Neck**: O_pred 不仅注入检测头，也注入 FPN→同时提升分类和回归的特征质量

### 12. CSIM-Head — Context-Suppressed Implicit Modulation Head (DOMino-YOLO)
- **Name**: CSIM-Head (上下文抑制隐式调制头)
- **Classification**: Anchor-Free (YOLOv11 head 增强)
- **Prediction**: 分类 + 回归 + 通道自适应重加权
- **Paper**: DOMino-YOLO | MDPI Remote Sensing | 2025.12
- **Advantages**: 通道维软门控——抑制遮挡/背景噪声通道，增强目标判别通道; 适配遮挡场景（遮挡区域分类特征不可靠→压低不可靠通道）; 与 #5 空间维P2门控互补（通道维×空间维双维门控）
- **Weakness**: ⚠️ 通道调制机制细节未获取（SE-like / channel attention / 其他）; 仅在 VOD-UAV 车辆数据集验证; 与标准 SE/ECA 的差异化不明确
- **Future Improvement**:
  1. **通道×空间双维门控融合**: CSIM（通道维）+ #5 P2门控（空间维）→联合稀疏化
  2. **频域判据引导通道选择**: 用频域高频能量指标选择保留哪些通道（高频响应高的通道→保留）

### 13. LLFFH — Lightweight Low-Level Feature Fusion Head (HEdge-MamYOLO)
- **Name**: LLFFH (轻量低级特征融合头)
- **Classification**: Anchor-Free + PConv 稀疏处理
- **Prediction**: 融合 P2 高分辨率浅层特征 + DSFFM 尺度自适应特征
- **Paper**: HEdge-MamYOLO | IEEE TGRS | 2026.04
- **Advantages**: PConv（部分卷积）稀疏处理特征图→保留小目标细节+减少FLOPs; P2 级特征显式融入检测头→极端小目标（12-20px）细节不丢失; 与 Mamba backbone 配合但 PConv 本身架构无关
- **Weakness**: PConv 的通道选择策略未详述（随机/固定/可学习?）; 仅验证 Mamba backbone 上的效果→CNN backbone 上的可移植性未知
- **Future Improvement**:
  1. **PConv 在 YOLO P2 头的等价实现**: → #5 v3.1 空间+通道双维稀疏
  2. **PConv 通道选择×频域判据**: 高频响应高的通道→全卷积; 低频通道→PConv 稀疏处理

---

## 🔴 密集遮挡检测头设计（密集遮挡 L3 知识提取·2026-07-18）

> 涵盖密集遮挡论文中的检测头级创新，按功能维度组织。

### 分类学

```
密集遮挡检测头
├── 一、通道维遮挡抑制
│   └── CSIM-Head (DOMino-YOLO, #12): 通道自适应重加权→压低遮挡噪声通道
│
├── 二、空间维细节保留
│   ├── LLFFH (HEdge-MamYOLO, #13): PConv稀疏处理+P2高分辨率融合
│   └── VASA (DOMino-YOLO): 可见度感知空间聚合→遮挡区降权
│
├── 三、多实例预测头
│   └── CrowdDet K-Prediction Head (CVPR 2020): 每proposal预测K个实例(K=2)
│
├── 四、遮挡感知注入
│   └── OPC (OPL ESWA 2025): 显式遮挡图通过Cross-Attn注入检测头
│
└── 五、未来方向
    └── #37 YOLO Grid-Cell EMD: P2每grid-cell预测K个实例(K=2/自适应)
```

### 设计原则对比

| 维度 | CSIM-Head | LLFFH | VASA | CrowdDet K-Head | OPC |
|------|-----------|-------|------|-----------------|-----|
| 遮挡处理策略 | 通道抑制（压低不可靠通道）| 细节保留（PConv稀疏+高分辨率）| 空间降权（遮挡区低权重）| 多实例预测（一框多物）| 遮挡图注入（显式补偿）|
| 处理维度 | 通道维 | 空间+通道维 | 空间维 | 实例维 | 通道+空间维 |
| 计算代价 | 轻量（通道门控）| PConv部分节省 | 中等（软权重）| 最小（K路输出）| 中等（Cross-Attn） |
| 与P2的关系 | 独立（任意层）| P2专属 | 独立 | proposal通用 | 独立 |
| YOLO迁移难度 | ✅ 低 | ✅ 低（PConv架构无关）| ✅ 低 | ⚠️ 中（需EMD Loss配合）| ⚠️ 中（需OPD模块） |

### 与项目检测头路线的整合

- **CSIM-Head × #5 P2门控**: 通道维(CSIM) + 空间维(#5) = 双维门控——正交可叠加
- **LLFFH PConv × #11 频域判据**: 高频响应通道→全卷积 / 低频通道→PConv稀疏 → 频域引导的通道级条件计算
- **CrowdDet K-Head × YOLO**: P2 grid-cell 每 cell 预测 K=2 实例 + P3-P5 K=1 → 仅在高分辨率层做多预测（密集区最多）
- **OPC × #30 判据复用**: 遮挡图生成所需的先验→频域判据替代 bbox 重叠 GT → 免标注的 OPC 等效模块

---

## 🟠 OBB 旋转检测头设计（OBB K1 知识补充·2026-07-19）

> 基于 FAA(CVPR 2026) / YOLO26-OBB(arXiv 2026.06) / RDCNet(IEEE JSTARS 2026.04) 三篇 P0 深读 + ADR(O² TGRS 2026) + OBB L1 检索知识合成。

### 一、OBB 检测头分类体系

```
OBB 检测头
├── 一、Anchor-Free 回归式（主流·YOLO系）
│   ├── YOLO11-OBB: 标准解耦头 + 角度分支 + OpenCV角度定义 ❌
│   ├── YOLO26-OBB: NMS-free双头 + 长边角度 + 直接回归 ✅
│   └── RDCNet Head: YOLOv8 C2f + 并行角度分支 + (t,l,b,r,θ)
│
├── 二、Anchor-Free 角度分类式
│   ├── CSL (ECCV 2020): 角度离散化为180分类→分类替代回归
│   ├── DCL (2021): 密集分类编码→更细粒度
│   └── PSC (CVPR 2023): 相位编码→周期性自然编码→角度分类
│
├── 三、结构化解耦式
│   ├── FAA Head (CVPR 2026): RoI→规范角0°(分类旋不变) + 残差(回归旋敏感)
│   └── ACM-Coder (CVPR 2024): 复指数编码→消除边界不连续
│
├── 四、角度分布概率式
│   └── ADR (TGRS 2026): 角度概率分布→迭代细化+Chamfer匹配
│
└── 五、Anchor-Based (两阶段)
    ├── RoI Transformer (CVPR 2019): RRoI→旋转RoI对齐
    ├── Oriented R-CNN (ICCV 2021): 旋转RPN+Rotated RoIAlign
    └── ReDet (CVPR 2021): 旋转等变Backbone+RRoI
```

### 二、核心OBB检测头详解

#### 2.1 YOLO26-OBB: NMS-free 双头架构

**O2M (One-to-Many) 训练头**:
- 每个grid cell→K个正样本预测(K>1, 训练期)
- 使用STAL(小目标感知LA)分配→小目标膨胀代理框→增加正样本匹配数
- DFL-free: 移除分布焦点损失→OBB中回归分布约束不合理
- 输出: 5-D `(t, l, b, r, θ)` + class scores

**O2O (One-to-One) 推理头**:
- 每个grid cell→**仅1个**最终预测
- NMS-free: O2O预测天然无冗余→直接取top-K分数→**无需NMS**
- Progressive Loss: 训练期从O2M到O2O逐步转移监督权重

**OBB场景NMS-free收益放大**:
- HBB中旋转IoU=$O(n^2)$ 次凸多边形求交→计算昂贵的NMS
- O2O消除NMS→旋转检测中推理加速比HBB场景更大
- 但: 密集场景K=1可能不够(O2O vs 多目标同cell冲突)

#### 2.2 FAA Head: 规范角度分类-回归解耦

**动机**: 分类需要旋转不变性(同一物体不同角度→同一类别) / 回归需要旋转敏感性(精准定位需角度信息) → **两者互相矛盾**

**设计**:
1. **Step 1 — 规范角变换**: FAE估计RoI主方向→旋转RoI至规范角0°(物体"直立")
2. **Step 2 — 分类分支**: 规范角0°的旋转不变特征→分类(与旋转无关→天然不变)
3. **Step 3 — 回归分支**: 原始RoI特征 + 规范角残差→回归旋转框偏差
4. **Step 4 — 最终输出**: 分类:规范角+回归:残差→解耦互不干扰

**优势**: 结构化解耦(非loss层面patch)→从根本上避免任务冲突
**局限**: 依赖FAE角度估计精度→角度误差会传播到分类和回归; 两阶段流程(YOLO单阶段集成需适配)

#### 2.3 RDCNet Head: YOLOv8 + 角度分支

**设计**: 基于YOLOv8检测头(C2f模块) + 并行角度回归分支
- 共享: C2f backbone特征→标准4距离回归(t,l,b,r) + 类别
- 独立: 角度分支→并行预测θ(与(t,l,b,r)共享特征但独立参数)
- Loss: Focal Loss(分类, w=1.0) + Rotated IoU Loss(回归, w=1.0)

**优势**: 最简OBB检测头→与标准YOLO Head差异最小→迁移最易
**局限**: 角度分支独立→无法利用(t,l,b,r)与θ的相关性; YOLOv8 C2f未针对旋转优化

#### 2.4 ADR: 角度分布细化头 (TGRS 2026)

**设计**: 角度不再是标量→角度的概率分布向量→可通过迭代更新
- 初始角度分布: 粗预测→softmax→概率质量集中在主方向附近
- 细化: Chamfer距离匹配→最小化预测分布与GT分布的Wasserstein距离
- 输出: 旋转框顶点坐标(从分布中采样→解码)

**优势**: 角度不确定性建模; Chamfer距离消除几何歧义; 推理零额外开销
**局限**: DETR专属(YOLO适配未验证); 训练复杂度增加

### 三、OBB vs HBB 检测头关键差异

| 维度 | HBB 检测头 | OBB 检测头 |
|------|-----------|-----------|
| 回归输出 | 4-D (x,y,w,h) | 5-D (x,y,w,h,θ) 或 (t,l,b,r,θ) |
| NMS | IoU-based标准NMS | 旋转IoU(昂贵较多)/NMS-free(O2O) |
| 边界问题 | 无(框始终轴对齐) | PoA+BoC→角度定义/表示是关键 |
| 分类与回归关系 | 独立 | 互相矛盾(分类需旋不变/回归需旋敏感)→需解耦 |
| 多尺度 | 标准FPN/PAN | PAN+旋转感知融合(FAAFusion)可提升 |

### 四、OBB 检测头的任务冲突与解决方案

| 方案 | 代表 | 解耦级别 | 代价 |
|------|------|---------|------|
| Loss解耦 | YOLO26 ωᵢ自动调节(角度vs ProbIoU) | Loss层 | 无(纯公式) |
| 结构解耦 | FAA Head(规范角0°分类+残差回归) | Head架构 | 需FAE角度估计 |
| 表示解耦 | RDCNet 极坐标(ρ尺度+θ方向) | Backbone | ~3M参数 |
| 概率解耦 | ADR(角度分布→分类+回归统一) | 输出表示 | 训练复杂度 |

**最优组合**(理论): RDCNet极坐标Backbone(特征级解耦) + FAA规范角Head(任务级解耦) + YOLO26 ωᵢ角度Loss(Loss级解耦) = 三级解耦

### 五、项目OBB 检测头路线建议

| 优先级 | 方案 | 理由 |
|--------|------|------|
| P0 | YOLO26-OBB NMS-free双头 | 2026最强基线·立即替代YOLO11-OBB |
| P1 | AALA宽高比无关centerness→替换SimOTA | 低难度·快速验证·极端宽高比VisDrone目标 |
| P2 | FAA规范角解耦→YOLO适配 | FAA Head概念简洁·需解决单阶段集成 |
| P3 | RDCNet极坐标DCN→Backbone嵌入 | 中等难度·与YOLO26可叠加·需MMRotate环境 |

---

## 🟡 尺度感知检测头（尺度变化 K1 知识补充·2026-07-19）

> 基于 YOLO-Master(CVPR 2026) / DERNet(arXiv 2026) / VALA(Neurocomputing 2026) / FS-Mamba(Displays 2026) 四篇 P0 深读 + 尺度 L1 检索(30篇)知识合成。

### 一、尺度感知检测头分类体系

```
尺度感知检测头
├── 一、多尺度专家路由头（MoE Head）
│   └── YOLO-Master ES-MoE: 多尺度专家(3×3/5×5/7×7 DWConv·E=4) + 动态路由 + 负载均衡
│       → 关键发现: Backbone-only最优·级联梯度冲突→Head不应参与路由
│
├── 二、频域驱动检测头（Frequency-Driven Head）
│   ├── DERNet FDHead: P2-only·box-only·SHG频域门控→高频能量注入密集回归
│   │   → 关键数据: 单模块最大增益(>0.03 mAP50)但55.6% GFLOPs占比=频域增强算力代价定量证据
│   └── FA-YOLO FDAFE: 频域自适应特征增强→AFPN+ASFF+频域自适应融合
│
├── 三、SR辅助训练头（Training-Only Auxiliary Head）
│   ├── FS-Mamba SR Head: 训练期超分重建→P2特征增强→训后丢弃·零推理开销
│   └── MambaIR-YOLO SR Head: 同范式·ODSSBlock+SR分支·4.46M/19.97GFLOPs
│       → 关键发现: 训练-推理解耦三范式(SET/FS-Mamba/#5 Gumbel)→2026共识
│
├── 四、多尺度特征融合头（Multi-Scale Fusion Head）
│   ├── RFAG-YOLO SAF: 尺度注意力→动态加权融合高低层特征
│   ├── MFR-YOLO MSFEM: SPDConv+DCNv4双分支并行→多尺度特征增强
│   ├── PASR-YOLO HDI: P2高分辨率细节→注入P3/P4/P5各层
│   └── CSD-DETR SOFFM: SPDConv P2保留+CSP-OmniKernel→多尺度金字塔
│
├── 五、动态分辨率头（Dynamic Resolution Head）
│   ├── DARE-YOLO DRDU: 双模上采样(静态双线性+动态注意力引导)
│   └── YOLOv11 BiFPN++: 高分辨率预测头+小目标检测分支+双向加权FPN
│
└── 六、尺度条件计算头（Scale-Conditional Head）
    ├── YOLO-Master MoE路由: 感受野维条件计算(不同尺度→不同核大小)
    ├── Input-Adaptive DNN: 早退(33%/66%深度)+Gumbel-Softmax分组路由
    └── #5 语义熵门控: 空间维条件计算(高熵→跳过)→算力节省而非尺度适应
```

### 二、多尺度专家路由头 — YOLO-Master ES-MoE

#### 2.1 架构

```
输入特征 (C, H, W)
  ↓
GAP → γ=8压缩 → 两层1×1 Conv → Softmax → Hard Top-K(K=2)
  ↓ 路由权重
专家池: {E₁(3×3 DWConv), E₂(5×5 DWConv), E₃(7×7 DWConv), E₄(Identity)}
  ↓ 稀疏激活(K=2)
加权融合: Σᵢ wᵢ · Eᵢ(x)  →  + 负载均衡Loss(L_balance = λ·Σ(f_i − 1/E)², λ=1.5)
  ↓
输出特征
```

#### 2.2 路由机制

| 维度 | 训练期 | 推理期 |
|------|--------|--------|
| 路由方式 | Soft Top-K(软权重) | Hard Top-K(硬选择·K=2) |
| 激活专家数 | K=2(软加权) | K=2(硬选择) |
| 负载均衡 | L_balance 正则化 | 不需要(推理期无均衡需求) |
| 门控输入 | GAP(全局平均池化·图像级) | 同左 |

**与#5门控对比**: YOLO-Master门控=图像级(一个图像选一组专家) + 可学习(BCE训练) + 感受野维(不同核大小) ⟂ #5门控=空间级(每个位置独立决定) + 免训练(语义熵) + 算力维(计算/跳过)

#### 2.3 关键发现：Backbone-only路由最优

YOLO-Master消融实验的核心发现：

| 路由位置 | 性能 | 分析 |
|----------|------|------|
| **Backbone-only** | **最优** | 感受野适应在特征提取阶段最有效 |
| Backbone + Neck | 退化 | 级联梯度冲突→两处路由互相干扰 |
| Backbone + Head | 退化 | Head路由干扰任务特定学习 |

**对项目的启示**: #5 P2门控(Backbone浅层·空间维)与YOLO-Master感受野门控(Backbone全层·感受野维)正交可叠加→#22多阶段门控可设计为：YOLO-Master负责感受野选择 + #5负责空间计算分配

#### 2.4 条件计算五维框架（YOLO-Master贡献）

| 维度 | 代表方法 | 粒度 | 可学习性 | 项目关联 |
|------|---------|------|---------|---------|
| **通道维** | SE/ECA/FcaNet | 通道级 | 可学习 | #21 双维稀疏 |
| **感受野维** | **YOLO-Master ES-MoE** | 层/块级 | 可学习 | #22 多阶段 |
| **空间维** | #5 语义熵/#11 高频能量 | Token/Grid级 | **免训练** | #5/#11 核心 |
| **专家维** | HI-MoE(DETR·多专家query) | Query级 | 可学习 | #30对照 |
| **Token维** | Dynamic DETR/Sparse DETR | Token级 | 统计/可学习 | #30对照 |

### 三、频域驱动检测头 — DERNet FDHead

#### 3.1 设计

```
P2特征图 (C, H/4, W/4)
  ↓
SHG(Spatial High-pass Gate): 空间高通滤波器→高频响应图 H ∈ (0,1)^{H×W}
  ↓ 高频区域标识
Box Regression Branch Only(无分类分支——小目标分类不可靠→专注回归)
  ↓ 高频门控
L_reg = Σ H_i · L_CIoU(box_i, gt_i)  ← 高频位置回归权重↑
```

**核心创新**: 检测头不再对所有位置平等对待——高频响应强的位置(边缘/纹理/小目标→信号复杂区域)→回归权重↑；低频平坦区域(背景/大目标内部)→回归权重↓

#### 3.2 代价分析

| Head组件 | GFLOPs | 占比 | mAP50增益 |
|----------|--------|------|----------|
| FDHead(P2-only·box-only·SHG) | 7.40 | **55.6%** (总13.3) | >0.03(单模块最大) |
| WDG(Backbone·Haar DWT) | ~3.5 | 26.3% | ~0.02 |
| LGE(Neck·Log-Gabor) | ~2.4 | 18.0% | ~0(无增量) |

**关键洞察**: FDHead是单模块增益最大的组件，但也是FLOPs占比最高的组件——**频域增强在检测头层面有明确算力代价**。这为#11"频域→节省"路线提供了根本动机证据：与其对所有位置增强高频信号(花算力)，不如只对高频区域分配算力(省算力)。

#### 3.3 FDHead vs 标准YOLO Head

| 维度 | YOLOv11 Head(标准) | DERNet FDHead | 差异 |
|------|-------------------|---------------|------|
| 特征层 | P3/P4/P5(3层) | **P2 only**(1层) | 专注小目标 |
| 预测分支 | 分类+回归(双分支) | **回归only**(无分类) | 小目标分类不可靠→专注回归 |
| 空间权重 | 均匀(所有位置平等) | **SHG高频门控**(非均匀) | 高频区域优先 |
| 算力分布 | 均匀 | 集中在P2层(55.6%) | 小目标检测的算力代价显式暴露 |

### 四、SR辅助训练头 — FS-Mamba范式

#### 4.1 设计原则

```
训练期:                              推理期:
P2特征 → SR重建头(轻量CNN)           P2特征 → 标准检测头
         ↓                                    ↓
    上采样重建(×2)→与原始图像L1 Loss       直接回归/分类
         ↓                                    ↓
    梯度→增强P2特征的空间细节              SR分支已丢弃·零开销
```

**哲学**: 训练期的额外监督信号(SR重建)可以塑造更好的特征表示→训练完成后特征已经"内化"了高频细节→推理时不需要SR分支

#### 4.2 三范式对比：训练-推理解耦

| 范式 | 代表方法 | 训练期额外组件 | 推理时 | 解耦方式 |
|------|---------|--------------|--------|---------|
| **辅助Loss丢弃** | **SET (CVPR 2025)** | 频谱增强教师 | 学生独立推理 | 蒸馏→丢弃教师 |
| **辅助Head丢弃** | **FS-Mamba (2026)** | SR重建头 | Head丢弃·特征保留 | Head训练→特征内化 |
| **软→硬门控** | **#5 Gumbel (本项目)** | Gumbel-Softmax软门控 | Hard阈值硬门控 | 温度τ→0硬化 |

**三者从未在同一实验中系统对比**→"训练-推理解耦的最优方式"是开放研究问题：
- SET: 需要教师模型→额外训练+架构依赖
- FS-Mamba: 仅需SR重建Loss→最简单·架构无关
- #5 Gumbel: 门控本身参与训练→可学习+免训练混合范式

#### 4.3 SR辅助头设计空间

| 设计选择 | 选项 | FS-Mamba选择 | 替代方案 |
|----------|------|-------------|---------|
| 输入特征 | P2 / P2+P3 / 多尺度 | P2 only(最高分辨率) | P2+P3联合→多尺度重建 |
| 重建目标 | 原始图像 / 边缘图 / 高频残差 | 原始图像 | 高频残差→更轻量 |
| 上采样倍率 | ×2 / ×4 | ×2 | ×4→更大增益但更难 |
| Loss类型 | L1 / L2 / Perceptual | L1(假设) | Perceptual Loss→更真实 |
| λ_sr 权重 | 0.01–1.0 | ~0.1(假设) | 动态λ_sr(训练早期大→后期小) |

### 五、多尺度特征融合头

#### 5.1 融合策略分类

| 策略 | 代表 | 机制 | 计算代价 |
|------|------|------|---------|
| **尺度注意力** | RFAG-YOLO SAF | 学习各层对最终预测的重要性权重→软加权融合 | 轻量(注意力) |
| **双分支并行** | MFR-YOLO MSFEM | SPDConv(空间→深度·保留细节) + DCNv4(可变形·自适应感受野) → concat | 中等(DCNv4) |
| **细节注入** | PASR-YOLO HDI | P2高分辨率特征→通过注入单元传播到P3/P4/P5 | 轻量(注入) |
| **SPDConv保留** | CSD-DETR SOFFM | SPDConv替代stride→空间细节不丢失进入深层 | 通道数×4 |
| **OmniKernel** | CSD-DETR CSP | 多尺度深度可分离卷积→融合多个感受野 | 中等 |
| **BiFPN++** | YOLOv11 BiFPN++ | 双向加权+高分辨率头+小目标专属分支 | 中等 |

#### 5.2 融合头的项目适配

| 融合方案 | P2检测 | P3-P5检测 | Neck改动 | YOLOv11集成难度 |
|----------|--------|----------|---------|----------------|
| **SAF**(尺度注意力) | 受益大(低层特征权重大) | 受益中等 | 无(PAN不改) | ✅ 低·仅换融合权重 |
| **HDI**(细节注入) | N/A(注入上游) | 受益大(边界提升) | 注入路径 | ⚠️ 中·PAN内新增连接 |
| **MSFEM**(双分支) | 受益中等 | 受益中等 | 替换PAN卷积 | ⚠️ 中·DCNv4依赖 |
| **SPDConv**(空间→深度) | 受益大(保留细节) | 受益(但通道暴增) | 替代所有stride | ⚠️ 高·通道膨胀 |

### 六、动态分辨率头 — 按需分配空间分辨率

#### 6.1 DARE-YOLO DRDU

```
P3特征 → ├── 静态上采样(双线性·固定×2) ──┐
          └── 动态上采样(注意力引导·内容自适应) ──┼── 融合(可学习权重) → 高分辨率特征
```

**核心思想**: 不是所有位置都需要同样的上采样倍率→小目标聚集区放大→大目标区域保持原分辨率

#### 6.2 与YOLO-Master路由的类比

| 维度 | YOLO-Master ES-MoE | DARE-YOLO DRDU |
|------|-------------------|-----------------|
| 自适应对象 | 卷积核大小(感受野) | 上采样倍率(分辨率) |
| 决策粒度 | 图像级 | **空间位置级**(更细粒度) |
| 门控输入 | GAP(全局) | 注意力图(局部) |
| 条件计算 | 稀疏激活专家(节省) | 动态分辨率(增强) |

### 七、尺度×条件计算：检测头的未来路线

#### 7.1 当前状态
- 检测头的条件计算远落后于Backbone——Backbone有YOLO-Master MoE/#5 P2门控；Head仍以固定结构为主
- DERNet FDHead SHG是Head端唯一的空间自适应门控(高频→高回归权重)，但这是**权重调整**而非**计算跳过**

#### 7.2 两条未来路线

| 路线 | 描述 | 难度 | 项目关联 |
|------|------|------|---------|
| **A. 尺度条件检测头** | 不同尺度目标→不同Head子网络(小目标Head vs 大目标Head) | 中 | YOLO-Master MoE Head扩展 |
| **B. 频域条件检测头** | 高频区域→全精度Head；低频区域→轻量Head | 中高 | DERNet FDHead + #11门控 |
| **C. 密度条件检测头** | 密集区域→O2O Head；稀疏区域→O2M Head | 中 | DALA×Head联合 |
| **D. 统一条件Head** | 尺度+频域+密度三维条件→动态Head配置 | 高 | #5+#11+#40联合 |

#### 7.3 项目推荐路线

| 优先级 | 方案 | 理由 |
|--------|------|------|
| P0 | P2检测头 + STAL小目标膨胀 | 最小改动·已验证·VisDrone直接受益 |
| P1 | FS-Mamba SR辅助训练头 | 零推理开销·最优雅·架构无关 |
| P1 | DERNet FDHead SHG→#11判据匹配 | 频域门控在Head端与Backbone端的一致性 |
| P2 | YOLO-Master ES-MoE→Neck/Head扩展 | 感受野路由的Head端适用性需验证(级联冲突风险) |
| P3 | 尺度条件检测头(路线A) | 需先解决"如何定义尺度条件"→频域判据可能提供动态尺度指示 |

### 八、关键洞察

1. **Head端的条件计算是蓝海**: Backbone已有大量条件计算(MoE/稀疏化)，Head端几乎全是固定结构——DERNet FDHead的SHG是唯一的空间自适应信号(但仅为权重调整非计算跳过)→**检测头的条件计算=新的创新维度**

2. **Backbone-only路由的最优性值得验证**: YOLO-Master发现级联路由互相干扰→但#5的空间门控(免训练)与YOLO-Master的感受野门控(可学习)是否也有级联干扰？→需要实验裁决

3. **训练-推理解耦三范式尚未统一**: SET(蒸馏)→FS-Mamba(辅助Loss)→#5(软→硬门控)→三者在同一benchmark上的对比=独立论文贡献

4. **FDHead 55.6% FLOPs = #11最强动机**: DERNet在实践中证明了"频域增强在Head端有明确的算力代价"→"与其对所有位置做增强，不如只对高频区分配算力"→#11"节省"路线的量化动机
