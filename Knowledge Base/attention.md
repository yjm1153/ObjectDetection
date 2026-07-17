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

- **Module Name**: FcaNet (Frequency Channel Attention / Multi-Spectral Channel Attention)
- **Paper**: FcaNet: Frequency Channel Attention Networks | ICCV | 2021 ⚠️ pre-2025
- **Input / Output**: C×H×W → C (channel descriptor) → C (attention weights)
- **Complexity**: +0.04~0.13% FLOPs vs SENet | 0 extra params (DCT basis pre-computed constants)
- **Advantages**:
  1. 数学证明 GAP = 最低频 2D DCT 分量(传统通道注意力只看到 DC 信息)
  2. 多频谱压缩：不同通道组用不同 DCT 频率索引 → 互补信息
  3. 零额外参数(DCT 基预计算常量) → 可直接替换任何 SENet
  4. 固定 DCT 初始化**优于**可学习的压缩张量 → 数学结构 > 数据驱动
  5. 中低频分量单独用接近 GAP 性能，联合用超越任何单分量
- **Weakness**:
  1. 只做 soft channel re-weighting(无 hard pruning/sparsification)
  2. 频率选择策略(K/分组数)在不同任务上需重新搜索
  3. 7×7 DCT grid 要求最小特征图≥7×7
  4. pre-2025——需注意创新性
- **Suitable Detector**: 通用(可插入任何使用 SE/CBAM 的检测器)
- **Can Improve** (≥3 个 Idea):
  1. **FcaNet 频域通道选择 × #11 频域空间选择 → 双维稀疏化(#21)**：空间维度高频门控 + 通道维度频谱门控 = 联合计算分配
  2. **DCT 频谱特征 → P2 门控判据的直接输入特征**：替代或融合语义熵/高频能量，2D DCT 的多频分量提供更丰富的 token 特征描述
  3. **可学习频率选择 → 小目标自适应频率分配**：让网络自己学习哪些频率分量对小目标检测最有用(替代固定 LF/TS/NAS 策略)

### 1. SAE — Spatial Attention Entropy (ViCrop-Det, arXiv 2026.04)
- **Paper**: ViCrop-Det: Spatial Attention Entropy Guided Cropping for Training-Free Small-Object Detection
- **Input / Output**: 解码器 cross-attention tensor [L, Nh, Nq, Nk] → 归一化熵热力图 [H, W]
- **Complexity**: 推理时免训练;开销 20–25% 延迟
- **Advantages**: 免训练;模型内生探针;熵高=小目标区域(注意力分散→空间歧义高)
- **Weakness**: 仅DETR(需cross-attention decoder);零注意力盲区(模型未关注的目标无法检测);固定阈值(τ=0.7)
- **Suitable Detector**: RT-DETR / Deformable DETR / DINO (有cross-attention decoder的DETR系)
- **Can Improve** (≥3个Idea):
  1. 语义熵替代注意力熵 → 覆盖零注意力盲区 → YOLO化
  2. 嵌入模型内部作为特征级门控(非推理时裁剪)
  3. 注意力熵+语义熵双源融合门控(#15)

### 2. MWAS — Masked Window Attention Sparsification (D³R-DETR, arXiv 2026.01)
- **Paper**: D³R-DETR: DETR with Dual-Domain Density Refinement for Tiny Object Detection
- **Input / Output**: 密度热力图 [1, H, W] → 稀疏化注意力窗口mask
- **Complexity**: 继承自Dome-DETR;与密度估计共享特征
- **Advantages**: 密度引导→计算资源聚焦高密度区域;减少encoder冗余计算
- **Weakness**: 仅DETR encoder;密度估计误差→稀疏化误剪风险
- **Suitable Detector**: DETR系(有encoder的Transformer检测器)
- **Can Improve** (≥3个Idea):
  1. 频域判据替代密度判据 → #11方向
  2. YOLO P2层移植(用特征能量替代attention mask)
  3. 软门控替代硬mask(连续值而非0/1)

### 3. DFM — Dynamic Feature Multiplexing (DM-EFS, ICCV 2025)
- **Paper**: DM-EFS: Dynamically Multiplexed Expanded Features Set for Robust and Efficient Small Object Detection
- **Input / Output**: 浅层高分辨率特征集 → Size-Codebook查表 → 自适应特征子集
- **Complexity**: 推理开销极小(仅codebook查表+特征选择)
- **Advantages**: 浅层特征按需使用;3档离散切换;极低开销
- **Weakness**: 图像级粗粒度(整图统一策略);仅按尺寸(忽视语义);离散codebook(3档)
- **Suitable Detector**: YOLOv7(已验证);Any CNN detector(通用范式)
- **Can Improve** (≥3个Idea):
  1. Token级软门控替代图像级离散codebook → #5方向
  2. 语义熵替代尺寸作为选择依据
  3. 频域能量+语义熵+尺寸三维codebook

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

### 6. Asymmetric Self-Attention + Group KAN (FMC-DETR WeKat)
- **Module Name**: HSG-AKAT (非对称自注意力 + Group KAN)
- **Paper**: FMC-DETR | arXiv | 2025.09
- **Input / Output**: 深层特征 → Q/K压缩投影 + V保留 + 动态位置偏置 + Group KAN替代MLP
- **Complexity**: Q/K压缩降低全局交互代价;Group KAN分组共享基参数控制增长
- **Advantages**: 非对称投影保持注意力质量的同时降计算;动态位置偏置(3×3 DWConv)感知空间结构;KAN自适应非线性
- **Weakness**: KAN样条基训练复杂度高;FlashAttention硬依赖;DETR专属
- **Suitable Detector**: DETR系
- **Can Improve**:
  1. Group KAN→轻量门控(语义熵/高频判据)替代样条基,零参数自适应
  2. 动态位置偏置×语义确定性融合(位置偏置+语义熵=前景增强+背景抑制)
  3. Q/K压缩策略迁移到YOLO跨尺度融合(P2高分辨率注意力降计算)

### 8. DKSA — Dynamic K-Sparse Attention (DFIR-DETR, arXiv 2026.05)
- **Module Name**: DKSA (动态K-稀疏自注意力)
- **Paper**: DFIR-DETR: Frequency-Domain Iterative Refinement and Dynamic Feature Aggregation for Small Object Detection | arXiv | 2026.05
- **Input / Output**: token序列 X [N, C] → 动态K预测 → Top-K稀疏注意力 → [N, C]
- **Complexity**: O(NK)替代O(N²); K = ⌊N · σ(AvgPool(ψ(X)))⌋; ψ为两层卷积门控网络
- **Advantages**:
  1. **Focal Computation 范式工程验证**：K动态预测 = 根据特征统计动态分配注意力预算
  2. 理论依据：查询-键互信息服从幂律分布 → K-稀疏近似误差指数衰减
  3. 门控网络ψ极轻(两层卷积+AvgPool+Sigmoid)
- **Weakness**: DETR专属(全局自注意力); K预测需训练; GFLOPs减少≠墙钟加速(稀疏操作GPU效率)
- **Suitable Detector**: DETR系(有全局自注意力的Transformer检测器)
- **Can Improve** (≥3个Idea):
  1. K预测门控→P2空间稀疏化率预测(Focal Computation实例化)
  2. 门控输入替换为语义熵/高频能量(免训练替代ψ)
  3. 多阶段K预测(SViT-style逐层再激活)

### 9. DFA — Directional Fusion Attention (MDI-YOLO, SciRep 2026)
- **Module Name**: DFA (方向融合注意力)
- **Paper**: MDI-YOLO: A Lightweight Transformer-CNN-Based Multidimensional Feature Fusion Model for Small Object Detection | Scientific Reports | 2026
- **Input / Output**: 特征图 [C, H, W] → 双方向(空间+通道)+GAP分支 → 增强特征 [C, H, W]
- **Complexity**: 极轻(Coordinate Attention变体, +GAP分支)
- **Advantages**: Coordinate Attention改进(加GAP分支提取细粒度特征);空间+通道双重关注
- **Weakness**: 增量式改进(CA+GAP);创新有限;SciRep非顶会
- **Suitable Detector**: YOLO系(轻量即插即用)
- **Can Improve** (≥3个Idea):
  1. GAP分支→频域压缩(DCT最低频) → FcaNet风格增强
  2. 双方向权重→P2门控判据(方向性熵)
  3. DFA+语义信息融合(文本引导的方向注意力)

### 10. SCAM — Spatial Context Aware Module (FFCA-YOLO, IEEE TGRS 2024)
- **Module Name**: SCAM (空间上下文感知模块)
- **Paper**: FFCA-YOLO: Feature Enhancement, Fusion and Context Aware YOLO for Small Object Detection in Remote Sensing Images | IEEE TGRS | 2024
- **Input / Output**: 特征图 [C, H, W] → 三并行分支(GAP+GMP/1×1卷积/QK分支) → Hadamard积融合 → [C, H, W]
- **Complexity**: 轻量(三分支并行, Hadamard积融合)
- **Advantages**: GAP+GMP双池化捕获互补全局上下文;三并行分支(通道/空间变换/跨通道-跨空间);抑制背景混淆
- **Weakness**: YOLOv5基线;通用增强(不涉及条件计算);pre-2025
- **Suitable Detector**: YOLO系(通用即插即用)
- **Can Improve** (≥3个Idea):
  1. QK分支→频域变换(DCT代替1×1) → 频谱上下文
  2. SCAM门控输出→条件计算判据(高上下文歧义→多保留)
  3. GAP+GMP→多频谱DCT压缩(FcaNet融合)

### 7. Amplitude-Guided Modulation (FMC-DETR MDFC)
- **Module Name**: 振幅引导细节下采样(FFT振幅/相位解耦调制)
- **Paper**: FMC-DETR | arXiv | 2025.09
- **Input / Output**: 浅层P2特征 → FFT→振幅A/相位P分解→仅1×1调制A→保留P→IFFT→与空间分支融合
- **Complexity**: 一次FFT+IFFT(P2分辨率开销不可忽略,论文未独立报告)
- **Advantages**: 振幅-相位解耦="改多少"与"在哪"分离;仅调振幅保相位=结构信息零损失;可学习调制极轻(1×1 conv)
- **Weakness**: P2高分辨率FFT墙钟开销未消融;全图统一调制无空间选择性
- **Suitable Detector**: 通用(思想可迁移到任何多尺度特征融合)
- **Can Improve**:
  1. **与#11直接关联**:振幅调制→用高频能量局部异常度替代可学习卷积(免训练)
  2. **与#5直接关联**:振幅调制→用语义熵替代可学习卷积(语义感知)
  3. 空间选择性:只在判据认为"值得精细处理"的位置做FFT(稀疏频域分析)

### 8. SPA — Select and Pack Attention (SPT)
- **Module Name**: 上下文感知 token 选择 + 打包稀疏注意力
- **Paper**: SPA/SPT | ICLR 2026 (arXiv 2410.23608)
- **Input / Output**: Swin 第三 stage 起的 token → 线性门控打分(GT框栅格化BCE监督, α=0.01)→ Gumbel-Softmax 二值化 → 选中 token 打包进固定容器组新 batch → 稀疏注意力
- **Complexity**: BDD100K −16.4% FLOPs 且 +0.6 mAP;训练与推理都真实节省(区别于 DynamicViT/EViT 只省推理)
- **Advantages**: packing 解决变长 token GPU 批处理(不 padding);GT 监督防止门控"全保留"作弊;容器内 mask+feature shift 保持跨容器交互
- **Weakness**: 门控需 GT 监督(非免训练);**明确避开浅层(第三 stage 起才剪,浅层剪=信息损失)**;Swin/ViT 系;无小目标专项
- **Suitable Detector**: ViT/Swin 系检测器
- **Can Improve** (≥3个Idea):
  1. **#5 v3.0 推理路径**: packing=特征级稠密重排,与 HashEye(输入级)构成两级证据链;训练期省算力是 masked-conv 的升级选项
  2. **#5 L_gate**: GT框栅格化+BCE(α=0.01)与 v3.0 §5 λ_g 选项同构→有顶会先例;α 起点应下调对照
  3. **#19 判据对照**: SPA 式 GT 监督门控=可学习上限组(oracle 的可学习近似)
  4. ⚠️ **反面张力**: SPA"浅层不剪"结论 vs #5"专剪最浅 P2"——#5 需以语义判据+LLF兜底回答;若 M0 失败此即反面证据

### 9. Foreground Probing — STSM+FRM (Unmasking the Tiny)
- **Module Name**: 稀疏前景 token 选择 + 前景分数细化
- **Paper**: Unmasking the Tiny | Image and Vision Computing 2026(全文数字未获取,跟踪中)
- **Input / Output**: 全特征图 token → STSM top-K 前景分数粗筛(剪确定背景)→ FRM 门控组合回归/分类自注意力 → 修复被压低的前景分数
- **Complexity**: "minimal FPS drop"(开销中性,非节省)
- **Advantages**: 洞察"分类特征在被压制区域仍鲁棒"——弱前景分数+高语义相似邻居=被压制的真阳性;YOLOX 基线(YOLO系首个稀疏token选择);VisDrone/UAVDT SOTA(数字待补)
- **Weakness**: 目的是召回增强非省算力;选择在检测头 token 级(backbone/neck 稠密计算未省);代码未放
- **Suitable Detector**: YOLOX(原文);理论上 YOLO 系通用
- **Can Improve**:
  1. **#5 Related Work 必引划界**(迄今重叠面最大:YOLO系+稀疏token+语义信号;三轴划开:目的/层级/判据)
  2. "分类特征鲁棒"洞察→佐证 v3.0 用 P3 cls logits 做判据的合理性
  3. FRM 语义相似邻居修正→ #22 再激活的判据候选(误剪 token 若语义邻居高相似→复活)
