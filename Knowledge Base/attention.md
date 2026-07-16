# Attention Modules Knowledge Base
> 每读一篇论文必须更新。记录所有注意力机制。

## Template
- **Module Name**: SE | CBAM | EMA | ECA | Coordinate Attention | ...
- **Paper**: 论文名 | 会议/期刊 | 年份
- **Input / Output**: 输入输出维度
- **Complexity**: GFLOPs | Params
- **Advantages**:
- **Weakness**:
- **Suitable Detector**: YOLO | RT-DETR | ...
- **Can Improve** (≥3个Idea):
  1. 
  2. 
  3. 

---

## Entries

### 1. SEEN(Semantic Entropy Attention / Domain-aware Attention)
- **Module Name**: SEEN / Domain-aware Attention Module
- **Paper**: SEEN-DA | CVPR | 2025
- **Input / Output**: 视觉 block 输出特征 → 投影到文本嵌入空间(V2T)→ 与 VLM 文本嵌入算 softmax 相似度 → 熵图作为空间注意力权重,输出同维加权特征(残差相加)
- **Complexity**: 可学习参数仅 1.875M(3 个模块,挂在冻结 backbone 最后 3 个 block)
- **Advantages**:
  - 注意力权重来自"语义熵"(免参数的重要性度量):低熵=语义明确=前景,高熵=冗余/背景
  - 双分支解耦:inter-domain(域共享 prompt,提域不变特征+对抗对齐)/ intra-domain(域私有可学习 prompt,补域特定特征)
  - 优于 self-attention(+2.7)和 cross-attention(+2.0)
- **Weakness**: 依赖 CLIP/RegionCLIP 文本-视觉对齐质量;小目标特征相似度低→熵天然偏高→可能被误抑制;目标域 prompt 需人工先验
- **Suitable Detector**: 目前仅 Faster R-CNN(RegionCLIP);迁移到 YOLO-World/YOLOE 是开放方向
- **Can Improve**:
  1. 用语义熵做 token/区域剪枝(高熵背景直接跳过计算)→ 轻量化
  2. 尺度感知 prompt("a tiny [Class]")缓解小目标高熵问题
  3. 类别原型替代文本嵌入,摆脱 VLM 域先验(适配遥感/红外)

### 2. RFAConv(Receptive Field Attention Convolution)
- **Module Name**: RFA / RFA-C3k2
- **Paper**: RFAConv (arXiv 2023);SEMA-YOLO 将其嵌入 YOLOv11 C3k2 | Remote Sens. | 2025
- **Input / Output**: `F = Softmax(g1×1(AvgPool(X))) × ReLU(Norm(gk×k(X)))`,对 k² 个感受野窗口逐位置动态加权
- **Complexity**: 极轻(SEMA 中 +0.003M / +0.1 GFLOPs)
- **Advantages**: 打破卷积核参数共享;大感受野分支管上下文、小感受野分支管局部纹理;提升高 IoU 阈值定位(mAP50:95)
- **Weakness**: **单独使用无效甚至掉点**,必须与 ASFF 等多尺度融合配合(SEMA 消融:SLE+RFA 0.715 < SLE 0.717);机制解释只是假设
- **Suitable Detector**: YOLO 系列(C3k2/C2f 即插即用)
- **Can Improve**:
  1. 研究 RFA 与融合模块的协同条件(模块协同性分析,可发一篇分析型论文)
  2. 与 ASFF 空间权重统一为"跨尺度-跨感受野联合注意力"
  3. 感受野权重按目标尺度先验初始化(小目标数据集偏向小感受野)

### 3. GCP(Global Context Pooling)
- **Module Name**: GCP(用于增强 ASFF)
- **Paper**: SEMA-YOLO | Remote Sens. | 2025
- **Input / Output**: GAP 得通道描述子 g∈R^C → broadcast 成 C×H×W 与原特征 Concat(2C)→ 1×1 conv 压回 C
- **Complexity**: 极轻(GAP + 1×1 conv)
- **Advantages**: 补 ASFF 缺失的全局上下文;通道级全局统计做"语义滤波器",抑制背景激活(Grad-CAM 验证)
- **Weakness**: 本质是 SE 变体(通道统计),创新有限;单一 GAP 描述子对多目标复杂场景表达力弱
- **Suitable Detector**: 任意 FPN/ASFF 类 neck
- **Can Improve**:
  1. GAP → 多区域池化(金字塔池化)保留空间分布信息
  2. 用文本语义(参考 SEEN-DA)替代纯视觉全局统计做语义一致性引导
  3. 跨层级共享 GCP 描述子,进一步减参

### 4. Max-Sigmoid 文本门控(YOLO-World, CVPR 2024)
- **Module Name**: Max-Sigmoid Attention(T-CSPLayer 内)
- **Paper**: YOLO-World | CVPR | 2024
- **Input / Output**: 图像特征 X_l(C×H×W)+ 文本嵌入 W(C_txt×512)→ `X' = X·δ(max_j(X Wjᵀ))ᵀ`,每位置对全部文本取最大相似度过 sigmoid 作空间门控,输出同维
- **Complexity**: 一次矩阵乘 + sigmoid,远轻于 cross-attention;可重参数化为 1×1 conv(推理零文本开销)
- **Advantages**: 跨模态融合的最便宜形式;max 操作对词表大小不敏感;完美适配 CNN 特征图(无需 token 化)
- **Weakness**: max 只保留最强响应类别,类间歧义信息丢失(与语义熵刚好互补——熵保留完整分布);只在 P3–P5,无浅层
- **Suitable Detector**: YOLO 系(已在 YOLO-World 验证)
- **Can Improve**:
  1. **#5 的门控形式直接候选**:把 max-sigmoid 换成熵图门控(-Σp·log p),保留分布信息用于稀疏化判据
  2. 下探 P2 + 稀疏跳算(高熵位置跳过)
  3. max 与熵双门控:max 管"是什么最像",熵管"有多确定"

### 5. Cropr Router(Token Cropr, CVPR 2025)
- **Module Name**: 单 query cross-attention 打分器 + Top-K selector(token 剪枝路由)
- **Paper**: Token Cropr | CVPR | 2025
- **Input / Output**: token 序列 X → `A = Q·K(X)ᵀ`(单可学习 query)→ 每 token 单一相关性分 → Top-K 保留;训练期辅助头(任务定制)+ stop-gradient 提供选择监督,推理期辅助头/MLP 全部丢弃
- **Complexity**: 近乎随机剪枝的开销;消融证明单 query 胜 16 头 MHA(85.3 vs 85.2 且更快)
- **Advantages**: "简单判据够用"的实证;**LLF**(被剪 token 最后一 block 前按原位重插)零参数实现 dense prediction 近无损(ADE20k 56.6 vs 无剪枝 56.7);COCO 97% 剪枝仍 63.0 AP_box
- **Weakness**: 绑定 ViT(token 序列 + 末端全局 attention);判据需任务监督训练;未验证小目标(无 AP_s);backbone 级,多尺度 neck 未涉及
- **Suitable Detector**: ViT 系(EVA-02 + Cascade R-CNN);CNN/YOLO 无直接对应
- **Can Improve**:
  1. LLF 思想移植 CNN:#5 被稀疏跳过的 P2 位置在检测头前轻量复活(P3 上采样填充+1×1 conv)
  2. 可学习 router vs 免训练熵判据的选择质量对照(预实验加一列)
  3. 辅助头+stop-gradient 范式:熵判据若需对齐微调,训练期辅助、推理期移除
