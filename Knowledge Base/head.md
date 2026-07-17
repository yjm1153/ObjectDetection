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
