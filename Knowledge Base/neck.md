# Neck Knowledge Base
> 每读一篇论文必须更新。记录所有特征融合网络。

## Template
- **Name**: PAN | FPN | BiFPN | AFPN | DyHead | ...
- **Function**: 作用描述
- **Feature Fusion Strategy**: 融合方式
- **Advantages**:
- **Weakness**:
- **Computational Cost**: GFLOPs | Params
- **Suitable Scenario**: 小目标 | 大目标 | 实时检测 | 遥感 | ...
- **Possible Improvement** (≥3个):
  1. 
  2. 
  3. 
- **References**:

---

## Entries

### 1. GCP-ASFF(SEMA-YOLO, Remote Sens. 2025)
- **Name**: GCP-ASFF(Global Context Pooling enhanced Adaptively Spatial Feature Fusion)
- **Function**: 四个检测头(P2–P5)各配一个,自适应融合跨尺度特征并注入全局上下文
- **Feature Fusion Strategy**: 各层 resize 对齐 → GAP 全局描述子拼接(GCP)→ 1×1 conv + softmax 生成逐位置空间权重 α/β/γ(和为1)→ 加权求和;小目标位置自动升低层权重、抑高层干扰
- **Advantages**: 解决 FPN 直接相加的梯度不一致/低层弱信号被淹没问题;比原版 ASFF 多全局语义一致性;Grad-CAM 显示背景激活被显著抑制
- **Weakness**: 4 个 ASFF + P2 头使 GFLOPs 翻倍(6.3→14.2);逐位置 softmax 权重在密集小目标区域可能过度平滑
- **Computational Cost**: SEMA-YOLO-n 整体 3.6M / 14.2 GFLOPs(ASFF 部分贡献约 +1.4M / +3 GFLOPs)
- **Suitable Scenario**: 小目标 | 遥感 | 密集场景(实时性要求极高时慎用)
- **Possible Improvement**:
  1. 与 AFPN(渐近融合)同基准对比——本项目 Idea#1 的直接竞品
  2. 高熵/低信息区域跳过 ASFF 计算(结合语义熵)降低开销
  3. 权重生成加入尺度先验(小目标数据集初始化偏向低层)
- **References**: ASFF arXiv:1911.09516;SEMA-YOLO doi:10.3390/rs17111917

### 2. SLE(Shallow Layer Enhancement,SEMA-YOLO)
- **Name**: SLE 策略(P2 头 + backbone 截短)
- **Function**: 结构级再分配算力:增加 P2(1/4)检测分支,同时把 backbone 终止在 P4,P5 由 P4 下采样+Concat 重建
- **Feature Fusion Strategy**: P4 两次上采样得 P2;P4 经 C2PSA 后下采样与原下采样特征 Concat 生成增强 P5
- **Advantages**: 参数反而降 19.7%(2.583M→2.075M);RS-STOD mAP50:95 +5.2;是消融中**单项收益最大**的组件(0.671→0.717)
- **Weakness**: 深层语义被削弱,大小目标混合场景(DOTA 大操场+小车)适用性未知;P2 特征图大,GFLOPs +3.4
- **Computational Cost**: 2.075M / 9.7 GFLOPs(仅 SLE)
- **Suitable Scenario**: 小目标占绝对主导的数据集(RS-STOD 93%、VisDrone、AI-TOD)
- **Possible Improvement**:
  1. 在 VisDrone + YOLO11 上复现,作为本项目第一个强 baseline(优先级高)
  2. 动态路由:按输入图目标尺度分布决定是否走 P5 分支
  3. P2 头配 RFLA 式高斯感受野标签分配,解决海量背景负样本
- **References**: SEMA-YOLO doi:10.3390/rs17111917

### 3. SFI 空频交互融合(SFIDM, Remote Sens. 2025)
- **Name**: Spatial-Frequency Interaction(Concat 融合)
- **Function**: 将高/低频 FF-Block 特征与 backbone 空域特征拼接,为检测头提供频域互补信息
- **Feature Fusion Strategy**: 简单 Concat(低频特征→分类分支、高频特征→定位分支的职责解耦)
- **Advantages**: 实现简单;消融显示高低频互补(仅低频 77.8 / 仅高频 78.6 / 全部 82.3)
- **Weakness**: Concat 是最弱融合方式,无跨域注意力/对齐;频域特征需独立 CNN 提取,融合收益被三路提取成本抵消
- **Computational Cost**: SFIDM 整体 225.3 GFLOPs(未单独报告 SFI 占比)
- **Suitable Scenario**: 遥感 | 小目标(细节定位)| FSOD
- **Possible Improvement**:
  1. Concat → 跨域注意力融合(空域 query 频域)
  2. 特征级频域分解(FcaNet/FreqFusion),省掉独立 FF-Block 路径
  3. 高频能量图直接作为 P2 融合权重先验(与 GCP-ASFF 的空间权重结合)
- **References**: SFIDM doi:10.3390/rs17060972

### 4. RepVL-PAN(YOLO-World, CVPR 2024)
- **Name**: Re-parameterizable Vision-Language PAN
- **Function**: 在 PAN 的 P3–P5 做双向跨模态融合,把开放词汇能力注入实时 YOLO
- **Feature Fusion Strategy**: ①T-CSPLayer(文本→图像):max-sigmoid 门控 `X' = X·δ(max_j(X Wjᵀ))ᵀ`(每个位置取与全部文本嵌入的最大相似度);②I-Pooling Attention(图像→文本):特征 max-pool 成 3×3=27 token,`W' = W + MHA(W, X̃, X̃)`;③推理时文本嵌入重参数化为 1×1 conv 权重,**文本编码器完全移除**(FPS 19.9→74.1)
- **Advantages**: 跨模态融合首次实时化;LVIS 消融 +2.2 AP(O365+GQA);离线词表范式推理零文本开销
- **Weakness**: **无 P2、backbone 无注入**(小目标先天弱);I-Pooling 压成 3×3 丢尽空间细节;小词表场景(COCO fine-tune)融合冗余到被作者移除——VisDrone 仅 10 类属同类场景
- **Computational Cost**: YOLO-World-S 13M / 74.1 FPS(V100+TensorRT,重参数化后)
- **Suitable Scenario**: 开放词汇 | 实时 | 大词表;小目标/固定小词表场景收益存疑
- **Possible Improvement**:
  1. 下探 P2 必配稀疏化(算力爆炸)——正是 Idea #5 的故事线
  2. max-sigmoid 门控形式可复用为 #5 的熵图门控(比 attention 便宜)
  3. I-Pooling 的 3×3 改成熵引导的自适应区域采样
- **References**: YOLO-World arXiv:2401.17270;https://github.com/AILab-CVC/YOLO-World

### 5. MDFC (Multi-Domain Feature Coordination, FMC-DETR)
- **Name**: MDFC (振幅引导细节下采样 + 多域细化)
- **Function**: DETR Hybrid Encoder内的跨尺度频率感知特征融合;将浅层P2转化为细节增强先验后与高层融合
- **Feature Fusion Strategy**: 两阶段——①振幅引导下采样(P2特征分空间/频谱两分支,频谱分支FFT→振幅/相位解耦→仅调制振幅→保留相位→IFFT→与空间分支逐元素融合);②多域细化(空间DWConv+频谱混合FFT+边缘Sobel门控三路并行,部分通道细化)
- **Advantages**: 振幅-相位解耦极优雅(调制振幅改特征强度,保留相位维持结构);边缘感知分支提供显式定位信号;振幅引导下采样比直接stride卷积保留更多小目标细节
- **Weakness**: 三路并行计算开销;FFT在P2高分辨率上的墙钟代价未消融;DETR专属,非通用Neck
- **Computational Cost**: MDFC单独+1.5 AP,计算开销未独立报告
- **Suitable Scenario**: 小目标 | 遥感 | DETR系检测器
- **Possible Improvement**:
  1. 振幅调制→熵/高频判据替代可学习的1×1卷积(=#5/#11)
  2. 部分通道细化比例自适应(高信息量区域→更多通道走变换路径)
  3. MDFC的频率解耦迁移到YOLO PAN(替代简单Concat)
- **References**: arXiv:2509.23056
