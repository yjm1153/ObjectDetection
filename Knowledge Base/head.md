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
