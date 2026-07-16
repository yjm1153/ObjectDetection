# Training Strategy Knowledge Base
> 每读一篇论文必须更新。记录训练策略与技巧。

## 优化器
SGD | Adam | AdamW | RMSProp

## 学习率策略
Cos | Step | Poly | Warmup

## 正则化
Weight Decay | Dropout | Drop Path | Label Smoothing

## 其他策略
- **EMA**: 
- **AMP**: 
- **Batch Size**: 
- **Multi-Scale Training**: 
- **Pretraining Strategy**: 

## 改进方向

---

## 论文记录

### SEEN-DA(CVPR 2025)
- SGD + warmup;batch 8/域;8×V100;λ_adv=0.1, λ_t=1.0
- **伪标签策略**:目标域用 prompt "A photo of [Class] in foggy day" 由 VLM 生成高置信伪标签 → 目标域 CE
- **参数高效微调**:冻结 backbone,只训 1.875M adapter → 值得借鉴的低成本训练范式

### SEMA-YOLO(Remote Sens. 2025)
- SGD;RS-STOD 512×512 batch16 / AI-TOD 640×640 batch4;单卡 RTX 4090(本项目同级算力可复现)
- 未用特殊增强/训练技巧 → 提升全部来自结构,复现门槛低

### SFIDM(Remote Sens. 2025)
- Adam;base 训练 20k iter + 少样本微调 10k iter;lr 0.001;batch 16;单卡 RTX 3090
- **FSOD 两阶段范式**:base 类全量训练 → novel 类 k-shot 微调(reweighting 模块仅微调阶段启用,测试阶段移除)
- **元特征重加权**:支持图+mask → 类别权重向量逐通道调制特征(F⊗V)——训练期结构与推理期结构解耦的范例
- 发现:微调 shot 越多,base 类越退化(0.758→0.746)→ 少样本微调的灾难性遗忘仍未解决

### RFLA(ECCV 2022)
- MMDetection;SGD lr 0.005,batch 2,12 epoch,单卡 3090——**标签分配改动的验证成本极低**
- RFLA 即插即用替换 anchor tiling + MaxIoU 分配;FCOS 版需移除"点在框内"约束并修 centerness(因子 c=0.01 防梯度消失)

### YOLO-World(CVPR 2024)
- AdamW lr 0.002,wd 0.05,batch 512,32×V100,100 epoch,mosaic ——**预训练不可复现,只能用发布权重**
- **文本编码器必须冻结**:微调 CLIP 反而 22.4→19.3(小词表数据破坏对齐)——对 #5/#7/#8 是硬性警示
- 在线词表 M=80(正样本取自 mosaic 图,负样本随机采);image-text 伪标签数据 λ_I=0(不回传框损失)
- fine-tune 小词表(COCO)时移除 RepVL-PAN——跨模态模块在固定小词表下冗余

### YOLOE(arXiv 2025)
- AdamW lr 0.002,batch 128,wd 0.025;**8×RTX4090,v8-S 仅 12h**——开集预训练首次降到"租卡可复现"级
- **三阶段训练**:文本 prompt 30ep(全模型)→ 视觉 SAVPE 2ep(其余冻结)→ prompt-free 1ep(仅专用嵌入)——增量能力叠加范式
- SAM-2.1 从 GT 框生成伪分割 mask(高斯滤波+Douglas-Peucker 简化)——分割标注免费获取的实用配方
- **开集预训练 = 超强闭集初始化**:COCO full-tune 少 4× epoch 还比 from-scratch 高 +0.3~0.6 APb

### 可借鉴改进方向
1. VLM 伪标签 + 语义熵过滤,用于 VisDrone 半监督/自训练
2. 冻结 backbone + 轻量 adapter 微调,快速验证结构 idea(省算力)
3. 训练期辅助模块 + 推理期移除(SFIDM reweighting 范式)→ 与可重参数化思想同源,可用于 P2 头辅助监督
4. 离线词表重参数化(YOLO-World):文本嵌入/熵图等语义先验全部离线预计算,推理零额外开销——#5 的实时性保障机制
5. **#6 免费改进项**:VisDrone 微调从 YOLOE 预训练权重出发(而非 COCO 权重),YOLOE 数据显示可省 epoch 且涨点
