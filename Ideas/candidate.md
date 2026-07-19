# Candidate Ideas

## Template
- **Idea Name**: 一句话描述
- **Source**: 来自哪篇论文？还是多篇共同启发？
- **Motivation**: 为什么想到？
- **Solved Problem**: 解决什么问题？
- **Novelty**: Agent评分 ★★★★★
- **Difficulty**: Easy | Medium | Hard
- **Expected Impact**: Low | Medium | High
- **Current Status**: Thinking | Reading | Designing | Validated | Discarded
- **Notes**: 其他说明

---

## Candidates(2026-07-15,来源:SEEN-DA + SEMA-YOLO)

### #5 语义熵引导的 P2 特征稀疏化(★推荐)
- **Idea Name**: 用(免 VLM 的)原型熵在 P2/P3 浅层特征图上识别背景区域并跳过/降权计算,实现"加 P2 头不加算力"
- **Source**: SEEN-DA【自】(语义熵)× SEMA-YOLO【自】(P2 头算力痛点)交叉
- **Motivation**: SEMA 加 P2 头 GFLOPs 翻倍,其中大量算力花在背景;SEEN-DA 证明熵是免训练的前景/冗余判别器。两篇论文的最大短板互为解药。
- **Solved Problem**: 小目标检测的"精度-算力"矛盾(本项目 Current Problems #1 #2 同时命中)
- **Novelty**: ★★★★☆(熵用于 DAOD 特征选择已有,用于小目标稀疏推理无人做;需查 token pruning 文献确认)
- **Difficulty**: Hard(稠密头上的稀疏计算工程实现;熵的免 VLM 化需设计类别原型)
- **Expected Impact**: High(VisDrone + AI-TOD 双基准,精度不掉+GFLOPs 显著下降即可发)
- **Current Status**: Thinking → **查新已通过(2026-07-15)**,待熵-尺度预实验
- **Notes**: 风险:小目标区域本身高熵,阈值设计不当会误删目标;需先做熵-目标尺度相关性分析实验
- **查新结果(2026-07-15)**: novelty 成立;最近邻 ViCrop-Det(DETR 推理级裁剪路由)/SViT·Token Cropr(ViT token pruning)/BiSD-YOLO(门控增强不省算力)/PEEK·WCE(静态剪枝)均不覆盖本组合,详见 Knowledge Base/research_gap.md;SViT 的 token 再激活机制可借鉴作误剪兜底;免 VLM 备胎方案 → #11
- **YOLO-World 精读补充(2026-07-15)**:
  1. **基座确定**:YOLO-World 文本只注入 PAN P3–P5、无 P2、backbone 无语义——结构层面再次确认 #5 的 Gap,且可直接以其发布权重为基座(文本嵌入免费拿)
  2. **实时性机制**:借用其"离线词表重参数化"哲学——类别文本嵌入离线预计算,推理只算特征-嵌入相似度+熵,零文本编码开销
  3. **门控形式候选**:T-CSPLayer 的 max-sigmoid 门控是最便宜的跨模态形式;#5 用熵替换 max(熵保留完整分布信息,恰好互补)
  4. ⚠️ 两条警示:文本编码器必须冻结(微调 CLIP 掉 3 AP);VisDrone 仅 10 类属"文本贫瘠"场景,跨模态融合涨点会缩水——#5 的核心收益叙事应是"熵做稀疏化判据省算力",融合涨点只是附带
- **YOLOE 精读补充(2026-07-15,基座定论)**:
  1. **基座定为 YOLOE**(胜过 YOLO-World):推理结构=纯 YOLO(删了跨模态融合,加 P2/稀疏化无纠缠);8×4090×12h 预训练可复现;物体嵌入-文本相似度直接产出熵图;MobileCLIP 文本编码器更轻
  2. **查新边界新增最近邻:LRPC**——头部输出级 anchor 过滤(语义分数>δ 滤 80%,提速 1.7× 无损)。划界:LRPC 省的是词表检索,backbone/neck 稠密计算没省;#5 在特征级(P2 计算前)省稠密卷积 FLOPs。Related Work 必引
  3. **利好佐证**:δ=0.001 即无损滤 80% → 背景/前景语义分数高度可分,熵判据假设的间接证据
  4. 待办更新:CLIP 对齐验证任务的载体改为 YOLOE 物体嵌入(MobileCLIP 版),用发布权重零训练即可做
- **Token Cropr 精读补充(2026-07-15,划界定稿 + 兜底机制)**:
  1. 四重划界(Related Work 用语):ViT token vs CNN 特征图 / 可学习 router vs 免训练熵先验 / backbone 内 vs P2 分支 / 非实时大分辨率 vs VisDrone 实时小目标;其 97% 剪枝未验证小目标恰是 #5 的反面切入点
  2. **误剪兜底方案确定:LLF 式末端复活**——被稀疏跳过的 P2 位置在检测头前用 P3 上采样填充 + 1×1 conv 轻量复活(零/极少参数),替代 SViT 逐层再激活(更便宜);写入方法设计
  3. 复杂度信心:单 query 打分器即支撑 97% 剪枝且胜 MHA → 熵图(零参数)作判据完全站得住
- **TinyFormer 精读补充(2026-07-16,P2 路线竞争 + 架构趋势)**:
  1. **PBM 是 P2 头的替代方案**:PBM 用跨层捷径(浅层→深层双向并行)保留空间细节,不显式加 P2 头——#5 必须回答"为什么选 P2+稀疏化而非 PBM 捷径?"。答案:PBM 是**稠密传递**(所有位置都保留,算力开销在 Neck 融合);#5 是**选择性传递**(熵判据只保留前景区域,省算力)。两者互补——PBM 解决"如何传",#5 解决"传什么"
  2. **SSA 的 SDE 分支可借鉴**:轻量 CNN 直接在原始图像上提取空间先验→#5 的熵图也可从原始图像级别计算,进一步降低计算开销
  3. **架构趋势警示**:YOLO-DETR 混合是 2026 年明显趋势,纯 YOLO 需在 P2 改进上加速。但 PBM 在纯 CNN backbone 上的有效性未知
- **SET 精读补充(2026-07-16,#5 vs #11 判据安全性的关键证据)**:
  1. ⚠️ **重大预警:SET 证明"移除高频信息反而帮助微小目标"(非常小目标 +15%)**——小目标的特征天然偏低频(信号弱→被背景高频噪声淹没)
  2. **这对 #5 是利好**:语义熵(基于 CLIP 相似度)不依赖高频分量→**不会因为目标本身低频而误杀小目标**;#11 的高频判据在此维度上有根本性风险
  3. **但反面风险**:前景/背景在 CLIP 空间语义相似时(VisDrone "car" vs 路面)→语义熵也可能失效;#11 的高频判据成为更好的 fallback
  4. **双判据互补的逻辑被 SET 加强**:语义确认"是什么",高频确认"在哪里"——OR 融合(任一判据认为重要即保留)比单判据更安全
- **PRNet 深读补充(2026-07-18,motivation 最强新证 ⭐)**: PRN 消融链完美暴露矛盾——P2^in 原始信息只用一次是大浪费(单模块 +10.3 AP50/参数反降)但稠密复用代价高涨(FLOPs +110.7%)→ **选择性复用的必要性不再只是理论推演,而是有确凿数字背书**。与 Edge-Constrained "P2 alone +31% AP_small" 并列 #5 叙事最强动机数据点。另,PRN 101 条实验全部静态稠密 = #5 gap 第 N+3 次确认(跨四条路线共性空白)。
- **🟡 G1-X1 升级方向(2026-07-19·I1): #5 v3.3 层级+空间双维条件计算**——当前#5仅做P2层空间门控("P2内哪些位置算")。G1-X1揭示更基础的维度:**"哪些层级算"**——大目标区域→P4/P5就够了·跳过P2/P3;小目标区域→P2/P3全算·P5可选。层级选择+空间选择=条件计算的双维联合。per-location的层级选择完全无人探索(YOLO-Master是Backbone内路由·Input-Adaptive DNN是图像级早退·均非层级选择)。PRNet的迭代深度(阶段0→3)是层级选择的静态版→频域判据可使其动态化。v3.3设计要点:①频域判据同时输出"空间门控"(哪些位置算·已有)+"层级门控"(每位置需要哪些FPN层·新增) ②层级掩码+空间掩码=Pareto前沿探索 ③频域判据一次计算→双维门控(摊薄判据成本)。详见 research_gap.md § G1-X1。

### #6 SLE 策略在 VisDrone + YOLO11 上的复现与增强
- **Idea Name**: P2 头 + backbone 截短至 P4,作为本项目第一个强 baseline
- **Source**: SEMA-YOLO【自】
- **Motivation**: VisDrone 小目标占比与 RS-STOD 类似;SLE 是消融中单项收益最大且**减参**的组件;单卡 4090 可复现
- **Solved Problem**: 建立可信的改进起点,替代裸 YOLO11n 基线
- **Novelty**: ★★☆☆☆(社区常规操作,不可单独发表,但是后续一切实验的地基)
- **Difficulty**: Easy(Ultralytics 改 yaml 即可)
- **Expected Impact**: Medium(基础设施价值高于发表价值)
- **Current Status**: Thinking → 建议最先执行
- **Notes**: 同时验证 SLE 在 VisDrone 大小目标混合场景的适用边界(自带一个分析点)
- **TinyFormer 补充(2026-07-16)**: PBM 的出现意味着 #6 的 Neck 选型可能需要从 PAN vs AFPN vs ASFF 扩展为 PAN vs PBM vs AFPN vs ASFF——但 PBM 原设计依赖 ViT backbone,在 CNN 上的适配性待验证
- **D3Q 补充(2026-07-16)**: D3Q (DETR 系小目标最佳) VisDrone 36.7 未显著超越 YOLO 系,且 49M/543G 对比 YOLO11n 2.6M/6.3G→**"坚持 YOLO11 基线"决策再次确认**,#6 的工程价值不变
- **PRNet 深读补充(2026-07-18,Neck 选型新增坐标点 ⭐)**: PRN=FPN 演进重要节点(单模块 +10.3,远超前代 Neck 增益),VisDrone 最高纪录(+9.5 vs YOLO11-s)→ **#6 的统一协议对照实验必须纳入 PRN**。另 PRN 参数反降(9.4→7.71M)但 FLOPs +110.7% = 参数-算力折衷形态完全不同于 SLE(P2 头加参数加算力),对照将直接回答"P2 信息利用的信息收益 vs 计算代价"。

### #7 语义熵图引导的知识蒸馏
- **Idea Name**: VLM 检测器(教师)的语义熵图作为蒸馏 mask,指导 YOLO11n(学生)只在语义丰富区域模仿特征
- **Source**: SEEN-DA【自】 + 项目方向(Knowledge Distillation | Lightweight)
- **Motivation**: 现有特征蒸馏(FGD 等)用 GT box 或注意力选区域;语义熵提供了更细粒度、含语言先验的重要性度量
- **Solved Problem**: 小模型在小目标上的特征表达不足;蒸馏区域选择的语义盲区
- **Novelty**: ★★★★☆(熵作蒸馏 mask 未见;与 FGD/MGD 的对比是关键)
- **Difficulty**: Hard(需搭 VLM 教师 + 蒸馏 pipeline;教师在 VisDrone 上本身要够强)
- **Expected Impact**: High(蒸馏+小目标+轻量化三热点交叉)
- **Current Status**: Thinking
- **Notes**: 前置依赖:验证 CLIP 类文本嵌入对无人机俯视视角图像的对齐质量

### #8 尺度感知语义熵(分层 prompt)
- **Idea Name**: FPN 各层级用不同粒度 prompt("a tiny/small/large [Class]")计算层级专属语义熵
- **Source**: SEEN-DA【自】弱点(小目标高熵被误抑制)
- **Motivation**: 语义熵的尺度偏差是 SEEN-DA 未讨论的盲区;FPN 层级天然对应目标尺度
- **Solved Problem**: 熵度量的尺度不公平性
- **Novelty**: ★★★☆☆
- **Difficulty**: Medium(需 YOLO-World/YOLOE 基座)
- **Expected Impact**: Medium
- **Current Status**: Thinking
- **Notes**: 可作为 #5/#7 的子模块,不必独立成文

### #9 GCP-ASFF vs AFPN 对照实验(排除性实验)
- **Idea Name**: 在 YOLO11+VisDrone 统一协议下对比 PAN / AFPN / ASFF / GCP-ASFF
- **Source**: SEMA-YOLO【自】 + 项目已有 Idea#1(Replace PAN with AFPN)
- **Motivation**: 项目已有"换 AFPN"的候选,GCP-ASFF 是同类竞品;不做对照就选型是盲动
- **Solved Problem**: Neck 选型决策依据(Current Problems #4)
- **Novelty**: ★☆☆☆☆(纯工程对照,不发表,产出决策依据)
- **Difficulty**: Easy–Medium
- **Expected Impact**: Medium(决策价值)
- **Current Status**: Thinking
- **Notes**: 建议在 #6 的 SLE baseline 之上做,结论才对后续有效

### #10 RFA-ASFF 协同机制分析
- **Idea Name**: 解释"RFA 单独加掉点、配 ASFF 才生效"的机制(梯度冲突?特征频谱?)
- **Source**: SEMA-YOLO【自】消融表的反常现象
- **Motivation**: 模块协同性是"拼装式改进"论文从不回答的问题,有分析型论文空间
- **Solved Problem**: 改进模块的组合可预测性
- **Novelty**: ★★★☆☆(分析视角新,但结论风险高)
- **Difficulty**: Medium
- **Expected Impact**: Medium
- **Current Status**: Thinking
- **Notes**: 低优先级,可作为大论文的 discussion 素材积累

---

## Candidates(2026-07-15 第二批,来源:SFIDM + 查新)

### #11 高频能量引导的 P2 特征稀疏化(#5 的免 VLM 备胎/对照)
- **Idea Name**: 用图像/特征的 DFT 高频能量图(零训练、零 VLM)替代语义熵作 P2 背景判据,跳过低细节区域的 P2 计算
- **Source**: SFIDM【自】(高频→定位细节)× SEMA-YOLO【自】(P2 算力痛点)
- **Motivation**: SFIDM 证明高频分量指示"值得精细定位的区域";它比 CLIP 语义熵便宜几个数量级(一次 FFT),且不依赖 VLM 对无人机视角的对齐质量——恰好对冲 #5 的最大风险
- **Solved Problem**: 与 #5 相同(P2 算力浪费),但判据来源不同
- **Novelty**: ★★★☆☆→ **经过本轮频域文献调研后上调为 ★★★★☆**——频域+检测是 2025–2026 热点,但 3 篇独立工作(SET/DERNet/SFDNet)全部做**特征增强**,无人做**条件计算/稀疏化**(详见下方频域竞争格局分析)。"频域引导的计算资源分配"作为新方向,novelty 高于原先估计
- **Difficulty**: Medium(FFT 高效实现容易;难点与 #5 共享:稀疏计算工程化);**新增风险:SET 证明高频对极小目标可能有害→需改用"高频局部异常度"**
- **Expected Impact**: Medium-High(若与 #5 融合成"语义×频率双判据",故事完整度更高;独立发文的 novelty 窗口有限——需要在 DERNet/SET/SFDNet 大规模引用前投稿)
- **Current Status**: Thinking → **频域竞争格局已摸清(2026-07-16)**,待预实验
- **Notes**: 预实验与 #5 共用:在 VisDrone 上同时统计语义熵图、高频能量图与 GT 小目标位置的重合率——一个实验回答两个 idea 的生死
- **查新边界(2026-07-15)**: 频域用于检测多为特征增强(FcaNet/BiSD-YOLO C3WT),未见用于条件计算/稀疏化
- **⚠️ 2026-07-16 频域竞争格局精读(本轮核心发现)**:

  **频域小目标检测 2025–2026 浪潮:3 篇独立工作同时瞄准,彼此无相互引用(投稿时间线重叠)→方向处于早期上升期**

  | 竞争者 | 频域工具 | 策略 | 位置 | 与 #11 的本质区别 |
  |--------|---------|------|------|------------------|
  | **SET (CVPR'25)** | 2D FFT + 通道瓶颈平滑 + 对抗扰动 | **抑制**背景高频噪声(HBS) | FPN 各层 | SET=频域降噪→检测更准;#11=频域判前景→跳过背景节省算力 |
  | **DERNet (arXiv'26.06)** | 小波门控(WDG)+Log-Gabor(LGE) | **增强**前景高频信号 | Backbone+Neck+Head 全管线 | DERNet=频域增强特征;#11=频域引导计算分配。**路线级差异** |
  | **SFDNet (ECCV'26)** | 低/中/高三频解耦(ASD)+原型蒸馏(CPD) | **分治**多频谱互补 | Backbone 特征解耦 | SFDNet=频谱分治提取更好的特征;#11=频谱判据决定要不要算 |

  **三篇的共同盲区(正是 #11 的位置)**:
  - 全部做频域→**特征增强**(更好的特征→更准的检测)
  - **无人做频域→条件计算/稀疏化**(频域判前景→跳过背景→省算力)
  - **无人专攻 P2 层**(P2 分辨率高,频域处理墙钟开销大→三篇都回避)
  - 全部忽略"频域判据的**无监督/免训练**潜力"(都依赖标注或学习)

  **#11 的差异化生命线**:Related Work 引这三篇→承认频域对微小目标有效→"但现有工作只在增强维度使用频域,其作为计算资源分配依据的潜力未被探索"

  **SET 的关键警示**:"移除高频→帮助极小目标(+15%)"→#11 的绝对高频能量判据有误杀小目标的风险→修正为**"高频能量局部异常度"**(小目标高频点状孤立 vs 背景高频规则分布)

  **叙事策略**:#11 标题/摘要必须出现 "frequency-guided conditional computation" 或 "spectral sparsification" 以与 "frequency enhancement" 路线区隔

  **时间窗口**:三篇均未引用彼此→频域小目标检测的文献综述尚未形成共识,#11 需在 2026 年内投稿以利用当前"频域增强 vs 频域稀疏化"的清晰划界
	- **🟡 G1-S2 升级方向(2026-07-19·I1): #11 v2.0 频域双模统一框架**——增强+节省统一。G1-S2揭示DERNet WDG的HF门控g已计算per-location重要性→同一g信号可同时决定增强强度和计算分配。三重决策:高频区→增强+全算、中频区→标准卷积、低频区→跳过。v2.0设计要点:双模门控(二值门控+连续增强强度)+三方对照(纯节省 vs 纯增强 vs 混合)。详见 research_gap.md § G1-S2。

### #12 KLD 高斯分布匹配分配迁移 VisDrone P2 头
- **Idea Name**: P2 头标签分配用 bbox 高斯化 + KLD 度量替代 IoU(SFIDM DM 模块思路)
- **Source**: SFIDM【自】(DM 模块)+ RFLA(ECCV 2022,已读 ✅ 2026-07-15)
- **Motivation**: P2 上小框的 IoU 分配天然不稳定(轻微偏移→IoU 剧变/为0);KLD 尺度无关且不重叠框仍有信号;SFIDM 消融显示 DM 稳定 +2~3;**RFLA 佐证:VisDrone 上 AP_vt 0.1→4.8**(Faster R-CNN)
- **Solved Problem**: #6 SLE baseline 的 P2 头海量背景负样本与分配噪声
- **Novelty**: ★★☆☆☆(RFLA/NWD 已系统做过,SFIDM 也已用;仅作 #6 的增强件,无独立发表价值)
- **Difficulty**: Easy(Ultralytics TaskAlignedAssigner 中替换度量)
- **Expected Impact**: Medium(为 #6 baseline 免费涨点,巩固地基)
- **Current Status**: Thinking → 与 #6 同批执行(前置文献 RFLA 已读)
- **Notes**: RFLA 精读结论(2026-07-15):
  1. 迁移点聚焦在 **TAL 对齐度 `s^α·u^β` 中把 IoU 项 u 换成尺度不变 KLD 度量**,而非照搬 HLA(TAL 本身已含 top-k 机制,结构同型)
  2. 实验设计:三方对照 {默认 TAL, SFIDM-DM(box-box KLD), RFLA 风格(ERF-box KLD)},主指标 AP_vt/AP_t
  3. ⚠️ 风险已确认:RFLA 在一阶段检测器上仅 +0.4~0.9(vs 两阶段 +10)——YOLO11 预期收益保守估 +1~2 AP,若 <0.5 则果断放弃
  4. RFLA 推理零开销特性与 #5/#11 稀疏化正交,可叠加

---

## Candidates (2026-07-16, 来源: FMC-DETR)

### #13 FMC-DETR 振幅-相位解耦 → P2 稀疏化门控 (#11 的技术细化)
- **Idea Name**: 用 FFT 振幅(非高频能量)作 P2 稀疏化判据——振幅="有多少纹理变化"、相位="结构在哪"——只在高振幅位置做稠密 P2 计算,低振幅背景跳过;相位保留给定位
- **Source**: FMC-DETR MDFC 模块的振幅-相位解耦设计
- **Motivation**: FMC-DETR 证明振幅调制1×1 conv即可显著改善P2特征;但它全图做FFT——若先用极轻量高通滤波器快速判振幅高低,再选择性做精细频域分析,可同时得频域收益和省算力
- **Solved Problem**: #11 高频能量判据的粗糙性(高频能量是粗粒度的频域特征,振幅是细粒度的逐频率分量)
- **Novelty**: ★★★☆☆ (振幅-相位解耦在信号处理中经典,但在检测稀疏化中首次出现;更可能是 #11 的技术方案而非独立 idea)
- **Difficulty**: Medium
- **Expected Impact**: Medium (作为 #11 的方法设计组件,非独立发表)
- **Current Status**: Thinking
- **Notes**: 可并入 #11 的方法设计章节;FMC-DETR 提供了代码参考(GitHub 已公开)

### #14 FMC-DETR 检测层设计 [D2, D4] → SLE 跨架构验证
- **Idea Name**: DETR侧的"SLE等价发现"——FMC-DETR也发现跳过深层(S5)、增加浅层(D2)对小目标最优→这是 #6(SLE)的跨架构旁证,可用于 #6 论文的 Related Work
- **Source**: FMC-DETR 消融实验(Table IX)
- **Motivation**: YOLO的SLE(P2头+截短至P4)和DETR的[D2,D4]检测层在原理上等价→说明"小目标场景下算力从深层转移到浅层"是**架构无关的通用原则**,增强了 #6 的学术叙事
- **Solved Problem**: #6 论文需要"为什么SLE有效"的理论/经验支撑
- **Novelty**: ★☆☆☆☆ (不是新 idea,是 #6 的引用佐证)
- **Difficulty**: N/A
- **Expected Impact**: 低(仅作为 #6 论文中的一句引用+讨论)
- **Current Status**: 已记录,不单独追踪
- **Notes**: 写入 #6 的 Notes 即可

### #15 三源门控融合: 振幅 × 语义熵 × 高频能量 (#5+#11 融合方案)
- **Idea Name**: P2 稀疏化不依赖单一判据——三源门控(振幅/"纹理在哪" + 语义熵/"是什么" + 高频异常度/"细节有多规则") AND/OR 融合,互补盲区
- **Source**: FMC-DETR(振幅) × SEEN-DA【自】(语义熵) × SFIDM【自】+SET(高频能量)
- **Motivation**: 单一判据各有盲区——语义熵在"前景/背景语义相似"时失效(YOLO-World警示)、高频能量在"小目标天然低频"时误杀(SET警示)、振幅在城市背景边缘噪声下误保留。三源融合=任一判据认为重要即保留(OR),错误模式互不重叠
- **Solved Problem**: #5 和 #11 各自的最大风险被对冲
- **Novelty**: ★★★★☆ (多源免训练判据融合做条件计算,目前完全空白;但叙事复杂度高,可能更适合大论文而非单篇)
- **Difficulty**: Hard (三源的超参/融合逻辑/消融设计复杂;实验量×3)
- **Expected Impact**: High (若成功=即插即用零参数P2加速模块,故事完整度极高)
- **Current Status**: Thinking
- **Notes**: 预实验中同时统计三种判据与GT的重合率→若三种判据的错误模式确实互补(而非高度相关),则融合价值被确认;优先度低于 #5/#11 各自独立验证

---

## Candidates(2026-07-16 下午,来源:D³R-DETR + O²)

### #16 D³R-DETR Gabor核 → P2 频域门控(#13 备选频域工具)
- **Idea Name**: 用可学习 Gabor 卷积核(方向+频率双参数)替代 FFT/振幅作 P2 门控的频域特征提取器
- **Source**: D³R-DETR(arXiv 2026.01)——其消融给出硬度量:Gabor > Fourier > Haar
- **Motivation**: Gabor 核方向选择性强,对小目标点状信号与背景线状边缘的区分优于全局 FFT;且以普通卷积实现,无 FFT 的部署兼容性问题
- **Solved Problem**: #13(振幅-相位解耦)的频域工具选型——多一个被消融验证过的备选
- **Novelty**: ★★★☆☆(工具迁移型;Gabor 用于检测已有,用于门控判据未见)
- **Difficulty**: Medium
- **Expected Impact**: Medium(作为 #11/#13 的方法组件,非独立发表)
- **Current Status**: 已记录,随 #11/#13 推进
- **Notes**: **2026-07-17 更新(EFSI-DETR)**:#11 判据已改为三选项对照(真FFT / Gabor / 空域高通代理)——本条即"Gabor 选项"的技术储备;EFSI 证明空域代理可胜真变换,Gabor 属中间态(空域实现的频域启发算子)

### #17 YOLO 版 ADR 角度分布头(O² → YOLO 迁移)
- **Idea Name**: 将 O² 系列的 ADR(角度分布回归:角度离散化+分布学习替代直接回归)迁移到 YOLO11-OBB 头
- **Source**: O²-DFINE/O²-RTDETR(TGRS 2026)——首个实时旋转 DETR(297FPS)
- **Motivation**: 角度边界不连续是旋转框检测的核心痛点;ADR 用分布建模绕开;YOLO 侧 OBB 头仍用直接回归
- **Solved Problem**: YOLO11-OBB 在 DOTA 上的角度回归不稳定
- **Novelty**: ★★☆☆☆(跨架构迁移型)
- **Difficulty**: Medium(改 OBB 头输出与损失)
- **Expected Impact**: Medium(仅当项目转向 OBB/DOTA 主线时才有价值)
- **Current Status**: 已记录,低优先
- **Notes**: ⚠️【自】ACM-Coder(CVPR 2024,用户提供)警示:"换度量≠解决边界不连续"——若启动本条,需先回答 ADR 是否真正解决而非缓解;当前 VisDrone 主线(HBB)下暂不追踪

---

## Candidates(2026-07-16 深夜,路径三 pre-2025 外部注入:DINOv2 + Focal Loss + FcaNet)

> 来源:`idea_generation_breakthrough_analysis.md` 路径三;pre-2025 抓取已获用户授权

### #18 DINOv2 特征熵 → P2 门控(中立判据)
- **Idea Name**: 用 DINOv2 自监督 patch 特征的 PCA 前景激活图/特征熵作 P2 门控判据——免 VLM、免频域的"第三判据"
- **Source**: DINOv2(ICCV 2023 ⚠️pre-2025)——patch 特征零文本监督涌现 objectness
- **Motivation**: 双重规避已知风险:无文本 → 无 CLIP 偏差(大目标膨胀/小目标抑制);无频域 → 无 SET 反例(去高频帮小目标)
- **Solved Problem**: #5(CLIP 偏差)与 #11(高频误杀)各自最大风险的中立替代
- **Novelty**: ★★★★☆(自监督特征做门控判据未见;"判据中立性"是新问题意识)
- **Difficulty**: Hard(DINOv2-S 21M 需离线/旁路提取,wall-clock 开销待评估;与 YOLO 特征分辨率对齐)
- **Expected Impact**: High(若三判据对照胜出,则 #5 的判据源直接切换)
- **Current Status**: Thinking;依赖 #19 对照实验(⏸ 实验暂缓)
- **Notes**: 训练时离线提取 → 推理零开销的蒸馏式用法是兜底方案(判据只在训练期教门控网络,推理不跑 DINOv2)

### #19 三判据对照实验(CLIP vs DINOv2 vs FFT)
- **Idea Name**: 统一协议下统计三种免训练判据(CLIP 语义熵 / DINOv2 特征熵 / FFT 高频异常度)与 GT 小目标的重合率——确定最佳判据的前置决策实验
- **Source**: 路径三产物;#5/#11/#18 共同的生死实验
- **Motivation**: 三个判据各有已证风险(CLIP 偏差 / SET 反例 / 无);不做对照就选判据是盲动
- **Solved Problem**: #5 vs #11 vs #18 的判据选型;同时是 #15(多源融合)的错误模式互补性验证
- **Novelty**: ★★★☆☆(对照实验本身可作分析型论文的核心表格)
- **Difficulty**: Easy(CPU 可执行的统计分析,但 ⏸ 实验暂缓范围内)
- **Expected Impact**: High(决策价值:一个实验回答四个 idea 的生死)
- **Current Status**: 设计就绪,⏸ 待实验模块
- **Notes**: **2026-07-17 更新(SPA)**:SPA 证明"GT 框栅格化 + BCE"可学习门控也是强 baseline → 对照组应加第四列"可学习门控(SPA 式)"作上界参考
### #20 Focal Computation 理论框架
- **Idea Name**: 将 Focal Loss 的调制思想从损失空间平移到计算空间:`FC(i) = α(1−E(H_i))^γ · FLOPs_base`——计算量按不确定性连续调制,γ 从超参变为有理有据的设计选择
- **Source**: Focal Loss(ICCV 2017 ⚠️pre-2025)× #5
- **Motivation**: #5 的硬门控("高熵算/低熵跳")是 γ→∞ 特例;连续调制(γ=2)允许低熵区做低成本计算而非二选一,理论叙事更完整
- **Solved Problem**: #5 阈值设计的"我们设了个阈值"式任意性 → 升级为 Focal 家族的计算版推广
- **Novelty**: ★★★★★(损失→计算的理论平移未见先例)
- **Difficulty**: Hard(连续调制的工程实现比硬门控更难省真实算力——不同位置不同深度/宽度)
- **Expected Impact**: High(理论框架型,可覆盖 #5/#11/#18 全家族)
- **Current Status**: Thinking
- **Notes**: **DFIR-DETR DKSA 已验证工程雏形 ✅**(动态 K-稀疏注意力=离散版焦点计算);工程落地可取离散近似:2–3 档计算深度(全量/轻量/直通)替代连续 γ

### #21 频域通道-空间双维稀疏化(FcaNet × #11)
- **Idea Name**: FcaNet 证明不同频率分量对通道选择有不同价值 → #11 的频域空间门控(哪些位置算)扩展为空间×通道双维(哪些位置的哪些通道算)
- **Source**: FcaNet(ICCV 2021 ⚠️pre-2025)× #11
- **Motivation**: GAP=最低频 DCT 这一洞察说明通道注意力本质是频域选择;通道维稀疏化与空间维正交,收益可叠乘
- **Solved Problem**: #11 单一空间维稀疏化的收益天花板
- **Novelty**: ★★★★☆(首次通道维频域条件计算;MGS 的通道级门控是 MLP 通道,非频域判据)
- **Difficulty**: Medium
- **Expected Impact**: Medium-High(双维消融表故事完整,但工程复杂度×2)
- **Current Status**: Thinking;排在 #11 单维验证之后
- **Notes**: MGS(MLSP 2025)的分组门控+BCE 工程范式可直接复用到通道维

---

## Candidates(2026-07-16 文献第二轮,来源:SViT)

### #22 多阶段 P2 门控:语义熵初筛 + 可学习再激活(SViT × #5)
- **Idea Name**: 两阶段门控——语义熵免训练初筛(粗剪)+ P2 分支中段 SViT 式可学习再激活门(2-layer MLP,允许被误剪 token 复活)
- **Source**: SViT(WACV 2024 ⚠️pre-2025)三原则之"再激活" × #5
- **Motivation**: 单门控误剪不可逆是 #5 最大精度风险;SViT 证明再激活机制是 -4.6→-0.3 AP 的关键组件之一;免训练初筛+可学习细筛=两个范式的混合
- **Solved Problem**: #5 的误剪兜底从"LLF 末端复活"(被动填充)升级为"中途主动复活"(判据自我纠错)
- **Novelty**: ★★★★☆(免训练+可学习混合门控范式未见)
- **Difficulty**: Hard(两门控联合训练稳定性;收益归因消融)
- **Expected Impact**: Medium-High
- **Current Status**: Thinking;**已列为 #5 v3.1 预留**(v3.0 首发单门控+LLF,见 idea_005_v3_design.md §四)
- **Notes**: **2026-07-17 更新(Unmasking the Tiny 🔔)**:其 FRM(分类/回归自注意力门控组合)与本条的"第二阶段可学习门"思路接近但位置不同(检测头 vs P2 分支中段)——代码放出后必须回读划界

---

## Candidates(2026-07-16 深夜续二,路径一+路径二正式录入:#23–#29)

> 来源:`idea_generation_breakthrough_analysis.md`(三路径元研究);评分定档见 innovation_ranking.md

### #23 SNR 退化统一理论(🏆 4.6)
- **Idea Name**: 小目标检测失败的根因不是"深层丢细节"这一经验观察,而是 backbone 下采样(≈低通滤波+降采样)对特征 SNR 的系统性破坏,且破坏程度与目标尺寸呈非线性关系——存在临界尺寸,以下时 P3+ 特征基本为噪声,仅 P2 保留可解码信号
- **Source**: 路径二洞察 1(元研究);无单篇论文源,是对全部 P2 证据链的机制升级
- **Motivation**: #5/#6/#11 共享同一个未被回答的"为什么":为什么小目标必须 P2?若拟合出 SNR(尺寸,层级) 衰减曲线并定位临界尺寸,三个 idea 获得统一数学解释,论文 contribution 从"一个更好的检测器"升级为"被验证的退化定律 + 据此设计的检测器"
- **Solved Problem**: P2 路线的理论根基缺失(现有工作全部停留在"实验显示 P2 有用")
- **Novelty**: ★★★★★(从经验观察到物理规律的重定义)
- **Difficulty**: Hard(理论要立得住需严格的测量协议:激活强度≠SNR,需定义信号/噪声的可操作度量)
- **Expected Impact**: High(为 #5/#6/#11 全家族供弹)
- **Current Status**: Thinking;⏸ 验证需 YOLO11 各层特征激活统计(实验暂缓范围)
- **Notes**: 验证三步:①按目标尺寸分桶统计 P2–P5 特征激活 ②拟合衰减曲线 ③找临界尺寸。**间接证据已积累 4 个独立数据点**:SET(去高频反帮小目标=深层噪声主导)、FMC-DETR([D2,D4] 弃深层反升)、AD-Det(P3 激活图已够定位=P3 是小目标信号上界)、**EFSI-DETR(2026-07-17,FFR 弃 F5 反涨 1.2 AP)**——"弃深层反升"现象反复复现,理论若成立可一并解释

### #24 信息瓶颈形式化:小目标检测的理论根基(🏆 4.6)
- **Idea Name**: 用 Tishby 信息瓶颈理论形式化"backbone 为什么天然丢小目标":标准压缩 `min I(X;Z) − βI(Z;Y)` 下,小目标像素少→信息占比小→被无偏压缩自然淘汰;解法=加先验项 `+λ·P(small|Z_P2)`,而语义熵恰是该先验的免训练代理 → #5 从 heuristic 升级为 IB 理论预测的最优方案
- **Source**: 路径二洞察 2 × Tishby IB 理论
- **Motivation**: 与 #23 互补——#23 是信号处理视角(SNR),#24 是信息论视角(互信息);两者指向同一结论"浅层保留小目标唯一可解码信息",双视角互证
- **Solved Problem**: #5 的门控判据为什么应该是"语义不确定性"而非任意显著性度量——IB 框架给出原理性回答
- **Novelty**: ★★★★★(IB 用于解释检测尺度偏差未见)
- **Difficulty**: Hard(⚠️ 最大风险:高维特征的互信息估计是出了名的难,可能只能停留在叙事级类比而非可测量理论——审稿人会追问 I(X;Z) 怎么算)
- **Expected Impact**: High
- **Current Status**: Thinking
- **Notes**: 务实路线:不做严格互信息估计,改用可测代理(如线性探针可解码性 decoding accuracy 随层级/尺寸的变化)——与 #23 的验证实验可完全共用一套特征统计
- **PRNet 深读补充(2026-07-18,跨架构证据 ⭐)**: PRN 在 YOLO 系(+6~10 AP50)vs RT-DETR(+3.2)的增益差=**架构差异实证**——CNN 的"原始浅层特征多次复用"天然比 self-attention 的"MSDeformAttn 编码 token"更契合信息瓶颈揭示的"浅层保持小目标不可逆信息"命题。对 #24 的双轨叙事价值:PRNet 是"YOLO 侧已有强解",B轨需独立设计不能照搬——**一致的理论解释不同架构的不同实现路径,正是架构无关性叙事的卖点**。

### #25 频率签名(Frequency Signature)判据(4.4)
- **Idea Name**: 每个空间位置的**频谱形状**(而非高频能量标量)决定其信号类别——小目标=点状信号→宽谱平坦;背景边缘=线状信号→窄谱尖锐(定向);纹理=面状信号→离散峰;据此做精确的"要不要算"判据
- **Source**: 路径二洞察 3;SET"去高频帮小目标"悖论的统一解释
- **Motivation**: 绝对高频能量判据已被 SET 证伪(小目标天然偏低频);"局部异常度"修正仍是标量;频谱形状是矢量级判据,能统一解释 SET(抑背景高频)/DERNet(低频增强点状)/SFDNet(中频受益)三篇的表面矛盾
- **Solved Problem**: #11 判据的根本性升级:从"有多少高频"到"频谱长什么形状"
- **Novelty**: ★★★★★(频谱形状分类做条件计算判据完全空白)
- **Difficulty**: Medium(逐位置局部频谱→形状特征(平坦度/峰度/方向性)→轻量分类;窗口尺寸与开销需权衡)
- **Expected Impact**: High(若成立则 #11 的判据直接替换)
- **Current Status**: Thinking
- **Notes**: **2026-07-17 更新(EFSI-DETR)**:"频域启发非变换"结论同样适用本条——频谱形状特征未必需要逐位置真 FFT,谱平坦度可用多尺度空域滤波器组响应比值近似(Gabor 方向组=方向性,多尺度 DoG=平坦度),纳入 #11 三选项对照框架

### #26 计算最优停止理论:零超参数自动门控(4.1)
- **Idea Name**: 门控阈值 τ 不是超参数——形式化"继续在 P2 计算某位置的边际收益 E[ΔAP]>成本"的最优停止问题,`τ* = argmax_τ AP_small(τ)/FLOPs(τ)`,即 Pareto 前沿拐点,自动定标
- **Source**: 路径二洞察 4 × #5
- **Motivation**: #5 的 τ 需扫描调参(M1 里程碑),是审稿人必攻的任意性;若 τ* 可从验证集 Pareto 曲线自动求出,#5 获得"零超参数"卖点
- **Solved Problem**: #5/#11/#18 全家族的阈值调参负担与叙事弱点
- **Novelty**: ★★★★☆(最优停止用于逐位置计算分配未见)
- **Difficulty**: Medium(Pareto 拐点求解简单;难在 per-image 自适应版:边际收益的在线估计)
- **Expected Impact**: High(方法论组件,所有门控 idea 通用)
- **Current Status**: Thinking;依赖 #5 先落地(τ 扫描数据本身就是 Pareto 曲线原料)
- **Notes**: **2026-07-17 更新(SPA)**:SPA 的 GT 监督门控仍带手工 α=0.01 与固定预算——"零超参数自动定标"卖点在 ICLR 2026 时点依然成立

### #27 语义-空间不确定性原理(4.1)
- **Idea Name**: 提出检测特征金字塔的不确定性权衡律 `Δspace × Δsemantic ≥ C`:P2 空间准但语义糊,P5 语义准但空间糊;小目标要求两者同时小→单层级无解→唯一出路是跨层语义引导空间(P3 语义熵指导 P2 计算,即 #5 的设计)
- **Source**: 路径二洞察 5(量子力学不确定性原理类比)
- **Motivation**: 为 #5 的"为什么门控信号必须来自更深层"提供原理性论证(v3.0 已选 P3 cls logits 作源——本条是该决策的理论包装)
- **Solved Problem**: #5 架构选择的必然性叙事
- **Novelty**: ★★★★☆(类比新颖,但严格性存疑)
- **Difficulty**: Medium(若只作叙事零成本;若要实证 C 的存在需定义两个 Δ 的可测度量)
- **Expected Impact**: Medium-High
- **Current Status**: Thinking
- **Notes**: ⚠️ 定位建议:类比论证≠定理,单独成文审稿风险高;最优用法是作 #5 大论文的 motivation/discussion 章节,与 #23/#24 的实证理论形成"定律(实证)+原理(类比)"组合

### #28 多模态遥感 × 频域门控泛化(4.3)
- **Idea Name**: 频域门控判据的模态自适应:SAR 图像散斑噪声高频为主→门控需抑高频防过触发;RGB 纹理混频→维持"高频=结构=算"策略;做首个模态自适应的条件计算
- **Source**: 路径一维度 2;频域四篇(SET/DERNet/SFDNet/FMC-DETR)全部只做 RGB 的盲区
- **Motivation**: 多模态小目标检测现有工作全做特征融合,"模态自适应的计算分配"是未被提出的问题
- **Novelty**: ★★★★★
- **Difficulty**: Hard
- **Expected Impact**: High(遥感顶刊 TGRS 受众精准)
- **Current Status**: Thinking;⏸ **硬阻塞:需 SAR+RGB 数据集**(如 DOTA SAR 变体/SARDet-100K),当前项目未提供
- **Notes**: 排名虽高(4.3)但可行性受数据钳制,列为"数据就绪即启动"状态;#11 的判据结论(三选项对照)可直接平移

### #29 时序一致性 × P2 稀疏化(4.2)
- **Idea Name**: 用帧 t−1 的熵图/频域图预测帧 t 的"值得计算"区域:静态背景连续 N 帧低熵→跳过 P2 计算;运动/新出现区域→全精度。时序引导的计算分配,非特征聚合
- **Source**: 路径一维度 1;VisDrone-VID 子集存在 × 当前全部 idea 都是单帧的盲区
- **Motivation**: 视频检测(FGFA/MEGA/TransVOD)全做特征聚合;时序×特征级稀疏化空白;且是三社区(视频检测/高效推理/小目标)彼此推诿的交叉点
- **Novelty**: ★★★★★
- **Difficulty**: Hard(帧间对齐/相机运动补偿是无人机场景的额外难点)
- **Expected Impact**: High
- **Current Status**: Thinking;⏸ **硬阻塞:需 VisDrone-VID 数据集**,当前未提供
- **Notes**: **2026-07-17 更新(HashEye)**:HashEye 的 LSH 桶签名天然可跨帧复用(背景桶帧间稳定)——免训练时序判据的先例雏形,若启动本条其帧间复用策略是首个 baseline;⚠️ HashEye 城市地形失效的教训同样适用(城市动态背景多)

## Candidates(2026-07-17,B轨衍生查新裁决:#5-D ❌ / #11-D → #30 ✅)

> 裁决全文与检索记录见 [detr_derivative_novelty_check.md](detr_derivative_novelty_check.md);致命竞品深读见 [Dome-DETR summary](../papers/summaries/Dome-DETR_arXiv2025.md)

### #30 免监督频谱判据 → DETR 浅层 token 条件计算(3.9)🟪 B轨主Idea
- **Idea Name**: 用零参数、免监督的频谱统计(DCT/FFT 高频能量,A轨 #11 同判据)对 DETR 浅层高分辨率特征做 token 级"算/不算"的预算分配,替代 Dome-DETR 的学习式密度头(DeFE: 0.8M + GT 高斯密度图 + DRFL 专用损失)
- **Source**: #11-D 衍生候选(2026-07-17 双轨决策)→ 查新通过后正式占编号
- **Motivation**: 频域方法在 DETR 侧全部停留在"增强"范式(EFSI/UAV-DETR/D³R/DFIR/FMC),无人做 token 级条件计算;Dome-DETR 证明「判据→掩码→浅层 token 稀疏」通路有效(+2.5~3.3 AP),把 #30 的风险从"路通不通"降为"判据能不能免费"
- **Solved Problem**: 浅层高分辨率特征引入的计算代价(Dome 方案 GFLOPs +37%)与判据本身的监督/参数/跨数据集重训成本
- **Novelty**: ★★★★☆(通路被 Dome 占,判据免监督差异化 + 分类域 TREWA 判据方向相反[保低频],小目标域需高频——同工具反判据天然划界)
- **Difficulty**: Medium(判据免训练,工程量在 D-FINE 浅层分支接入)
- **Expected Impact**: High(与 A轨 #11 构成 #24 信息瓶颈理论的双轨验证,"架构无关性"卖点)
- **Current Status**: 查新✅通过(2026-07-17);**技术方案 v1.0 ✅**(2026-07-17)→ [idea_030_technical_proposal_v1.md](idea_030_technical_proposal_v1.md):判据首选 S1 空域高通代理(EFSI 硬消融 33.1>FFT 32.3,叙事抽象为"高频响应统计判据·实现无关")+ 局部异常度归一(SET 警告);接入点与 Dome 逐点对齐(MWAS 结构沿用引用、query 预算无 NMS 保端到端);实验协议 E0–E6 锁定;⏸ 实验(E1 判据 vs DeFE 头对头 = 生死项;E3 免训练判据 AUROC 可作实验模块最低成本首验)待实验模块
- **Notes**: **三点划界红线**——vs EFSI(增强非条件计算)/vs UAV-DETR(其 "learnable gating" 是融合软加权,全 token 都算;⚠️ 表述避开 "frequency gating" 字样,落「频谱统计驱动的 token 预算分配」)/vs Dome-DETR(判据免监督零参数 vs 学习头;Dome 攻击面 = GFLOPs 不降反升/保留 Dynamic NMS/判据需 GT 监督)。**风险**: 免监督判据若差 DeFE >1 AP,退守叙事 = "1/40 判据成本保住 x% 增益"

### ~~#5-D~~ 语义熵 QS 第三判据 + encoder token 门控(查新 ❌ 不占编号)
- **裁决**: 被 Dome-DETR(arXiv 2505.05741)结构性占据——「判据热图→二值掩码→浅层 token 稀疏 + query 数量/位置自适应」完整实现,且底座(D-FINE)/主战场(VisDrone/AI-TOD)/卖点(小目标+效率)与拟议完全重合;熵判据侧另有 ViCrop-Det(DETR 头级)/MATP/EnTeR-Track(ViT 熵剪枝)/Dynamic DETR(ICML 2025 学习式 importance)夹击,剩余增量 = 判据替换,不足以过查新
- **资产处置**: 熵判据遗产并入 #19 三判据对照的 DETR 侧对照列(作为 #30 的判据消融项存活);🟦 A轨 #5 不受影响,但 v3.0 Related Work 须补 Dome-DETR 划界段

### #31 ⬜ 密度×频域联合判据→双维条件计算 (DALA + #5/#11 交叉)
- **Idea Name**: 将 DALA 的密度分类(标签分配维度)与 #5/#11 的频域/熵判据(特征计算维度)融合为统一的双维条件计算框架——密度决定"每 GT 给几个正样本"，频域/熵决定"每 token 算不算"
- **Source**: DALA (ESWA 2026) × #5 语义熵 × #11 高频能量 交叉
- **Motivation**: DALA 证明"不同密度的目标需要不同的标签分配策略"；#5/#11 证明"不同区域的 token 需要不同的计算预算"。两个维度独立但共享"密度信息"——密度(空间域)提供 GT 级分配策略，频域/熵(语义域)提供 token 级计算决策。两者融合可实现**四象限联合策略**(密度×熵/频域→同时决定正样本数和 token 计算量)→比单维度更精细的条件计算
- **Solved Problem**: 
  1. DALA 的空间密度忽略语义密度(空间近但特征可分的目标被误判为密集)
  2. #5/#11 的熵/频域忽略空间密度(密集区域的 token 即使低熵也要保留，但标签分配应 O2O)
  3. 现有标签分配和特征计算是独立的两个阶段——无人做联合优化
- **Novelty**: ★★★★ (DALA 的密度×频域的跨域组合是全新交叉维度，但双维框架复杂度高、实验设计难度大)
- **Difficulty**: Hard (需要定义联合判据的计算公式、设计门控训练方案、验证两个维度各自贡献)
- **Expected Impact**: High (若成功，是首个"标签分配-特征计算联合条件计算框架"，理论贡献>纯工程创新)
- **Current Status**: Thinking (概念阶段，来自 DALA 深读启发)
- **Notes**: 
  - 四象限草案: 密集+低熵/高频→O2O+高稀疏率；密集+高熵/低频→O2O+全计算；稀疏+低熵→Decreasing+中稀疏；稀疏+高熵→Decreasing+全计算
  - 风险: 双维联合的收益是否能大于分别独立优化？可能需要大量消融实验证明"协同效应"
  - 优先验证: 先分别在 A 轨(CNN)验证单维度，再融合→需 #5/#11 实验先完成

### #32 🟪 密度引导 DETR query 配额自适应 (DALA → DETR 二分匹配层移植)
- **Idea Name**: 将 DALA 的密度分类思想移植到 DETR 的匈牙利匹配——密集 GT 强制 O2O (1 query)，稀疏 GT 保留 K_max→1 递减 query 配额。同时作为 Dome-DETR DeFE 密度监督的低成本替代(不用高斯密度图+DRFL，只需 GT 框密度分类)
- **Source**: DALA (ESWA 2026) × Dome-DETR (ACM MM 2025) 交叉
- **Motivation**: 
  1. DALA 仅在 CNN 检测器(FCOS/RetinaNet/ATSS/GFL)验证→DETR 移植是理论空白
  2. Dome-DETR 的 DeFE 密度头需要 GT 高斯密度图监督(0.8M 参数 + DRFL 损失 + 跨数据集重训)→DALA 的密度分类仅需 GT 框信息(零额外参数/零额外损失)→低成本替代
  3. DETR 二分匹配在密集场景下的局限性(稠密目标竞争有限 query)可能与 CNN 的密集问题同源→密度感知匹配有潜在收益
- **Solved Problem**: 
  1. DETR 二分匹配未考虑目标密度差异(所有 GT 同等参与匹配)
  2. Dome-DETR DeFE 密度监督成本高(参数/训练/泛化)
  3. DETR 密集场景 query 冲突(多个目标竞争同一 query 表示)
- **Novelty**: ★★★★☆ (DALA→DETR 移植是理论新方向；密度分类替代 DeFE 是低成本创新；但 Density-aware DETR query 已有 Adaptive Query Allocation 2025 竞争，需划界: DALA 是 GT 密度→匹配策略, AQA 是密度图→query 数量)
- **Difficulty**: Medium-Hard (需修改匈牙利匹配逻辑→用密度分类决定 GT 的匹配候选 query 数；与 #30 的 token 稀疏化协同需协调训练)
- **Expected Impact**: High (DETR 二分匹配的密度感知改进 + Dome-DETR 低成本替代→双卖点)
- **Current Status**: Thinking (概念阶段，来自 DALA 深读启发)
- **Notes**: 
  - 与 Adaptive Query Allocation (Ha et al. 2025) 划界: AQA 是密度图→动态 query 数量(图像级分配), #32 是密度分类→per-GT 匹配策略(GT 级分配)→粒度不同
  - 与 #30 的协同: #30 控制 encoder token 算不算(特征层), #32 控制 decoder query 配不配(匹配层)→两层独立但互不冲突
  - 技术挑战: DETR 的匈牙利匹配是全局二分匹配(非 per-GT local 选择)→"为稀疏 GT 保留更多 query"如何实现？可能的方案: (a) 克隆稀疏 GT 为多个 GT 副本参与匹配, (b) 修改 cost matrix 为稀疏 GT 降低匹配代价

---

## Candidates(2026-07-18,来源:Dynamic DETR ICML 2025 深读)

> 深读全文见 [Dynamic-DETR_ICML2025.md](../papers/summaries/Dynamic-DETR_ICML2025.md);裁决:与 #30 不撞车,升级为 #30 SOTA 对照基线

### #33 🟪 频谱判据驱动的输入自适应 token 聚合(#30 × Dynamic DETR 框架融合)
- **Idea Name**: 把 Dynamic DETR 的 MTA 双轨聚合框架(低层 Proximal 窗口合并 + 高层 Holistic 亲合注入 + RCDR 正则)整体保留,仅将其判据(attention weight 离线统计先验)替换为 #30 的免监督频谱判据(S1 空域高通代理+局部异常度)——实现从"stage 级静态先验"到"输入级实时自适应"的判据升级
- **Source**: Dynamic DETR (ICML 2025) 深读 × #30 技术方案 v1.0 交叉
- **Motivation**: Dynamic DETR 的最大弱点是判据非输入自适应——每图共享同一套 COCO 统计的保留率排序 ρ^s,分布外场景(航拍/密集小目标)失效风险高,且换模型/数据集需重新统计+扫参。#30 的频谱判据恰好免训练、逐图实时、模型无关。两者是"框架 × 判据"的正交组合: Dynamic DETR 提供顶会验证过的聚合架构(净省 40-47% FLOPs),#30 提供更强的判据泛化性
- **Solved Problem**:
  1. Dynamic DETR 的离线统计先验在小目标场景失效风险("低→高迁移"假设在 VisDrone 未验证)
  2. ρ 向量每模型手动扫参的部署成本
  3. #30 原方案的聚合机制空白——技术方案 v1.0 只定义了判据和接入点,token 处置方式(丢弃/合并/注入)未定;Dynamic DETR 的消融证明合并式(保 token 关系)优于丢弃式(Sparse DETR 对照 −2.7 vs −0.7 AP)
- **Novelty**: ★★★★ (判据替换本身查新已通过[#30];增量在"免监督判据×合并式聚合"的组合与输入级自适应 ρ 分配公式——需设计频谱能量→保留率的映射函数,如 ρ_l = softmax(E_hf(x_l)/τ)·ρ_total 预算重分配)
- **Difficulty**: Medium (框架可复现 Dynamic DETR,判据已有 #30 v1.0 设计;新工程量在 ρ 映射函数和两套系统对接)
- **Expected Impact**: High (直接强化 #30 的 E1 实验设计: 三臂对照 = Dynamic DETR 原版 vs #30 判据替换版 vs Dome-DETR DeFE——同一框架下裁决"统计先验 vs 物理先验 vs 学习头"三种判据范式)
- **Current Status**: Thinking (概念阶段,来自 Dynamic DETR 深读)
- **Notes**:
  - 与 #30 的关系: 不是竞争而是**技术方案 v1.1 的候选升级件**——若 E1 显示频谱判据+MTA 聚合优于频谱判据+MWAS 掩码,则 #30 的 token 处置层切换到聚合式
  - RCDR(+0.6 AP 零推理开销)判据无关,无论哪条路线都应引入
  - 风险: 频谱判据是 token 级标量,Dynamic DETR 的 ρ^s 是层级向量——需把 token 级判据聚合出层级保留率(均值/分位数),这一步的信息损失需消融
  - 小目标专项卖点: 四个 token 稀疏化方法(Sparse/Focus/Lite/Dynamic)全部未测 VisDrone/AI-TOD → 第一个系统评估者占据"efficient DETR for small objects"生态位

### #34 ⬜ 密度自适应聚合窗口: 小目标区域禁止合并(Dynamic DETR Proximal 的小目标修正)
- **Idea Name**: Dynamic DETR 的 Proximal Aggregation 对入选 patch 一律 n²→1 合并(本质空间下采样),在小目标密集区域会把 ~10px 目标对应的 token 合并掉。提出密度/频谱自适应的窗口豁免机制: 判据(高频异常度或 DINOv2 objectness)超阈值的 patch 禁止合并或降低合并粒度(n²→n²/2),背景 patch 正常甚至加强合并(2n×2n)
- **Source**: Dynamic DETR (ICML 2025) 深读局限分析 §5.5 × #23 SNR 退化理论 × #31 密度判据交叉
- **Motivation**: Dynamic DETR 的窗口合并粒度是均匀的(n=2^{l-1} 全图一致),其 w_m(patch 内平均余弦相似度)判据只看"合并会不会损失语义多样性",不看"这里有没有小目标"——高相似度背景和小目标群在 w_m 上可能难以区分(密集小目标邻域 token 也高度相似)。SNR 退化理论(#23)指出小目标可解码信号集中在浅层——恰是 Proximal Aggregation 作用区,均匀合并直接压缩小目标的信号带宽
- **Solved Problem**:
  1. token 稀疏化方法在小目标基准上的系统性空缺(四方法零验证)
  2. Proximal Aggregation 均匀粒度与小目标空间异质性的矛盾
  3. 提供 token 稀疏化 × 小目标的第一个专项设计(误合并→定位精度损失的量化+修复)
- **Novelty**: ★★★★ (聚合粒度的空间自适应无人做;"合并豁免"概念清晰;但依赖 #33/#30 判据先行,独立成篇需附完整消融)
- **Difficulty**: Medium (机制简单——判据图→patch 分档→差异化合并;难点在证明小目标 AP 增益来自豁免机制而非稀疏率变化,需固定 FLOPs 对照)
- **Expected Impact**: Medium-High (是 #33 的自然子模块,也可独立作为"小目标友好 token 稀疏化"的核心贡献;与 A轨 #5 的 LLF 兜底思想同构——都是"判据保护关键区域")
- **Current Status**: Thinking (概念阶段)
- **Notes**:
  - 三档合并草案: 判据高(小目标嫌疑)→禁止合并;中→保留 super token + 最大响应 token 双份;低(背景)→正常合并或扩窗
  - 与 #31 四象限的关系: #31 是"标签分配×特征计算"双维,#34 是特征计算单维内的"粒度维"细化——#34 可作为 #31 特征计算轴的实现件
  - 验证起点(免训练): 在 VisDrone 上跑 Dynamic DETR 原版,统计被合并 patch 与 GT 小目标框的重叠率→若显著>随机,论文 motivation 图表直接成立(也是 #30 E3 判据 AUROC 实验的姊妹实验)

---

## Candidates(2026-07-18,来源:OPL ESWA 2025 深读——首个显式遮挡感知损失)

### #35 🔴 频域遮挡先验: 免 bbox 重叠的遮挡图生成(OPL × #30 判据交叉)
- **Idea Name**: 用高频局部异常度图(#30 判据族 S1 空域高通代理)替代 OPL 的"bbox 重叠+高斯模糊"作为遮挡图生成源→免除 bbox 重叠依赖的遮挡感知学习
- **Source**: OPL (ESWA 2025) 深读局限分析 × #30 免监督频谱判据
- **Motivation**: OPL 证明了显式遮挡建模有效(遮挡召回率 95.4%/+22.6%),但其 GT 遮挡图有三个结构性局限——①bbox 重叠≠真实遮挡(并排行人假阳性);②完全被遮挡目标(无 bbox)无法建模;③只覆盖框间重叠,截断/背景遮挡(柱子/树)盲区。高频局部异常度恰好覆盖这些盲区:遮挡边界=两物体纹理突变=高频异常;密集人群=纹理混乱=高频异常;且免标注、免重叠假设
- **Solved Problem**:
  1. OPL 遮挡 GT 的 bbox 重叠依赖(方法论最深层假设)
  2. 遮挡感知与条件计算两条文献线的首次连接(OPL 社区与 #30 社区无交集)
  3. #30 判据获得第二应用维度: 同一张判据图双用途(token 预算分配 + 遮挡先验注入)→摊薄判据计算成本,强化 #30 "不许诺净省算力"定位的性价比叙事
- **Novelty**: ★★★★ (遮挡图生成的免 bbox 重叠替代无人做;但频域图与真实遮挡的相关性是未验证假设——需 AUROC 预实验先行)
- **Difficulty**: Medium (判据已有 #30 v1.0 设计;新工程量在遮挡先验的注入机制(OPC 类似物)和与检测 loss 的权重平衡)
- **Expected Impact**: High (若成立→🔴密集遮挡方向获得免标注遮挡建模路线;B轨 #30 的应用叙事扩容)
- **Current Status**: Thinking (概念阶段,⏸验证依赖实验模块)
- **Notes**:
  - 关键预实验(实验模块就绪后最低成本首验): CrowdHuman/VisDrone 上离线计算高频异常度图 vs OPL 式 bbox 重叠图的 AUROC/IoU——判据能否预测重叠区域?(与 #30 E3 同型,可共用代码)
  - 风险: 频域判据"看到"的是高频突变(边缘/纹理),不必然是语义遮挡——背景纹理(树叶/栅栏)高频也高→需局部异常度归一化(继承 #30 §2 的 SET 教训)
  - 与 #36 的关系: #35 用频域判据替代遮挡 GT(B轨向),#36 用语义熵验证遮挡相关性(A轨向)——同一 OPL 启发的双轨分身,判据族对照(#19)可增加"遮挡预测"评估列

### #36 🔴⬜ 语义熵 = 隐式遮挡检测器: OPL 遮挡图 × 熵图相关性验证
- **Idea Name**: 验证"遮挡区域天然高熵"假设——OPL 式遮挡图(bbox 重叠+高斯模糊,零成本可离线生成)与 #5 语义熵图的空间相关性(Spearman ρ/AUROC);若显著→语义熵获得"零参数遮挡检测器"新身份
- **Source**: OPL (ESWA 2025) 深读关联分析 × #5 语义熵门控
- **Motivation**: 遮挡区域=两物体视觉特征混合→语义信号不纯→CLIP 相似度分布分散→高熵。这一推理链若被验证,意味着 #5 的熵图**免费附赠遮挡感知能力**——不需要 OPD(Transformer 辅助解码器)、不需要 OPL 监督训练,熵图本身就隐含遮挡信息
- **Solved Problem**:
  1. OPL 需要 OPD+OPL+OPC 三组件才能遮挡感知;语义熵若相关→零新增组件
  2. **#5 与 OPL 的方向张力裁决**: OPL 对遮挡区域**增强**(注入遮挡图补信息),#5 对高熵区域**跳过**(降低计算)——冲突根源是"高熵的成因"(特征弱→该增强 vs 背景冗余→该跳过)。相关性实验可分解熵图: 高熵∩遮挡图=遮挡型高熵(不该剪,LLF 兜底应覆盖) vs 高熵∩非遮挡=背景型高熵(该剪)→**#5 v3.0 的误剪风险分析获得新的分解维度**
  3. #5 的叙事扩容: 从"熵引导计算分配"到"熵引导计算分配+隐式遮挡感知"(双重物理意义)
- **Novelty**: ★★★★ (熵-遮挡相关性从未被验证;两条文献线首次连接;若否定结论也有价值——证明熵图与遮挡正交→#5 误剪风险降低)
- **Difficulty**: Medium-Easy (纯离线分析: CrowdHuman GT→bbox 重叠图,CLIP→熵图,算相关性——CPU 可跑,但按项目约定⏸暂缓)
- **Expected Impact**: High (正反结论都反哺 #5;若正相关→熵门控设计需加遮挡豁免(遮挡区高熵但不该剪);若不相关→高熵=背景的假设更干净)
- **Current Status**: Thinking (概念阶段,⏸CPU 分析类暂缓——2026-07-16 用户决策)
- **Notes**:
  - ⚠️ 关键细分: 需分别在 P2/P3 特征分辨率下验证(遮挡边界在高分辨率下更清晰)
  - CLIP-Bias 风险传导: 小目标遮挡区域的熵可能被 CLIP 尺度偏差污染→对照组应加 DINOv2 特征熵(#18/#19 判据族)
  - 与 OPL 的划界: OPL 是"训练一个遮挡预测器",#36 是"验证已有判据是否免费隐含遮挡信息"——目的/成本/组件数全不同
  - 若验证通过的后续: #5 门控策略升级为三态(低熵前景→全算/高熵∩遮挡→算+LLF 保护/高熵∩非遮挡→跳过)

## #37 🔴🟦 YOLO Grid-Cell EMD: 局部集合预测适配一阶段检测器
- **Source**: CrowdDet (CVPR 2020) × YOLO dense prediction 范式
- **Motivation**: CrowdDet 证明"一个 proposal 预测 K 个实例"可以有效处理密集重叠——但仅限 proposal-based 检测器。YOLO 的 P2 高分辨率 grid（160×160）在密集场景下每个 grid cell 同样面临"多个实例落入同一 cell"的问题。将 EMD 从 proposal 级迁移到 grid-cell 级，让 YOLO 也具备集合预测能力。
- **Solved Problem**: YOLO 一阶段检测器在高度重叠场景下的漏检——当前每个 grid cell 只预测一个实例（或 N 个 anchor），密集重叠时多个 GT 竞争同一 cell 导致标签分配 ambiguity
- **Novelty**: 4 (局部集合预测在 YOLO 密集预测范式上的首次适配；CrowdDet 的 proposal 级概念→grid-cell 级是架构级别的迁移，非简单移植)
- **Difficulty**: Medium-Hard (需要设计 grid-cell 的 G(b_i) 定义 / K 值选择策略 / dummy box 填充 / Set NMS 的 YOLO 适配 / 与 YOLO 现有 TAL 标签分配的兼容)
- **Expected Impact**: High (直接在 YOLO 架构内解决密集重叠的检测瓶颈；可与现有密集遮挡方案 OPL/OAR-Loss/频域判据互补叠加)
- **Current Status**: Thinking (L2 经典补读交叉产物)
- **Risk**: 3 (grid-cell 的 G(b_i) 定义可能出现大量空集→伪背景；K=2 的额外预测分支增加检测头复杂度；Set NMS 在 YOLO anchor-free 范式下需重新设计)
- **Key Design Choices**:
  1. **G(b_i) 定义**: 对 P2 每个 grid cell，G = {所有 GT 的中心点落入该 cell 或其 8 邻域的 GT}（比 CrowdDet 的 IoU 阈值更适配 YOLO grid 范式）
  2. **K 值**: P2 K=2（密集）/ P3-P5 K=1（稀疏，退化为标准 YOLO）
  3. **Dummy Boxes**: |G| < K → 用 "no object" 类别填充（类似 YOLO 现有的 obj 分支）
  4. **Set NMS YOLO 适配**: 同一 grid cell 的 K 个预测互不抑制 + 不同 cell 间正常 NMS
  5. **TAL 兼容**: EMD 匹配替代 YOLO 现有的 SimOTA/TAL——对齐 DETR 的集合匹配哲学
- **Notes**: 与 #35(频域遮挡先验)可联合——频域判据识别高密度 cell→K 值自适应(K=1/2/3); 与 DETR 全局集合预测构成「局部+全局」层次化集合预测——Local EMD per cell + Global Hungarian across cells

## #38 🔴⬜ 频谱感知 Soft-NMS: 频域内容相似度→NMS 第二衰减判据
- **Source**: Soft-NMS (ICCV 2017) × #11 高频判据 × NWD-Soft-NMS (MFF-YOLO 2025)
- **Motivation**: 过去 9 年所有 NMS 变体（Soft-NMS/Adaptive NMS/NWD-Soft-NMS/Softer-NMS）的共同盲区——**仅用 box 坐标判断冗余，完全忽略框内特征内容**。两个不同实例即使 IoU=0.9，其框内纹理/边缘/频谱模式可能完全不同。高频判据(#11 S1 空域高通代理)天然适合快速度量框内内容的「纹理复杂度」，为 NMS 提供独立于空间重叠的第二判断轴。
- **Solved Problem**: NMS 无法区分"同实例多预测（应抑制）"和"不同实例高度重叠（应保留）"——Soft-NMS 用连续衰减缓解了硬清零，但衰减函数仍仅依赖 IoU（或 NWD）→ 无法利用内容信息做更智能的判断
- **Novelty**: 4.5 (频谱内容相似度进入 NMS 衰减函数——概念层面全新，且与现有所有 NMS 变体正交可叠加；NWD-Soft-NMS 是"距离度量改进"，频谱感知是"内容维度增广")
- **Difficulty**: Medium (关键在于设计判别力足够且计算轻量的内容特征——S1 空域高通代理输出可作为候选；需要在 IoU/NWD 衰减因子和频谱相似度衰减因子之间设计融合方式)
- **Expected Impact**: Medium-High (如果判别力足够，将从根本上改变 NMS 的处理逻辑——从"空间重叠→必冗余"到"空间重叠+内容不同→非冗余")
- **Current Status**: Thinking (L2 经典补读交叉产物)
- **Risk**: 3 (频谱相似度的判别力需要验证——不同实例的高频模式可能仍然相似；计算开销——每个框内需要做一次频谱统计；融合方式(IoU×频谱 vs 双因子独立衰减)需要消融)
- **Key Design Choices**:
  1. **内容特征**: 框内区域的 S1 高频响应直方图 / 局部频谱能量统计量（均值+方差）——计算可由 #11 的 S1 判据共享
  2. **衰减函数**: `s_i = s_i · exp(-NWD²/σ) · exp(-(1-cos_sim(f_i, f_M))²/σ_c)` —— NWD 衰减×频谱相似度衰减双因子
  3. **融合权重**: λ 控制空间 vs 内容的相对重要性（可学习或启发式）
  4. **计算共享**: 若 S1 判据已在 P2 层计算，每个预测框只需在其对应区域取统计量——几乎零额外开销
- **Notes**: 与 NWD-Soft-NMS(#6 baseline 推荐)兼容——频谱感知是 NWD 衰减的第二乘子；若验证有效，可写为"Spectrum-Aware NMS: Beyond Spatial Overlap for Crowded Detection"
- **🟡 G1-L2 动机强化(2026-07-19·I1)**: G1-L2确认——30篇L1尺度文献中**零篇**将频域用于NMS或后处理。全部频域论文(8篇)=特征增强/融合。频域在后处理阶段的应用是完全空白。尺度变化使此Gap更严重:小目标IoU对位置敏感(1px偏移→IoU暴跌)但频域特征对位置鲁棒→频域NMS对小目标特别友好。此Gap直接支撑#38的novelty叙事——"首个频域内容感知NMS"。详见 research_gap.md § G1-L2。

## #39 🔴🟦 EMD+RepLoss 联合训练: 局部集合匹配+全局框间排斥
- **Source**: CrowdDet (CVPR 2020) × RepLoss (CVPR 2018)
- **Motivation**: 两条经典密集检测路线从未在同一检测器上联合使用。EMD Loss 解决"同一 proposal/grid-cell 内多实例的匹配"，RepLoss 解决"不同 proposal/grid-cell 间预测框的互斥"——两者覆盖密集检测的两个正交维度（匹配 vs 定位、内 vs 间）。联合使用可实现「proposal/grid-cell 内 EMD 匹配多个实例 + proposal/grid-cell 间 RepBox 推开不同目标的预测框」的完整方案。
- **Solved Problem**: 密集检测的两个独立失败模式——①同一区域多实例的匹配失败（EMD 解决）②不同目标预测框互相吸引导致 NMS 误杀（RepBox 解决）——首次被同一训练框架覆盖
- **Novelty**: 3.5 (两条已有路线的首次联合——增量创新但填补明确的空白；与 DETR 的 Hungarian+auxiliary loss 有精神相似但实现路线完全不同)
- **Difficulty**: Hard (两条路线的底座不同——EMD 原为 Faster R-CNN proposal 级/RepLoss 也原为 Faster R-CNN → 需要统一适配到 YOLO；EMD 的 K 个预测如何与 RepBox 的排斥对象定义对齐；训练期两个损失的时间同步——RepBox 应在 EMD 匹配收敛到一定程度后再加大权重)
- **Expected Impact**: High (若成功，将建立密集检测的「匹配+排斥」标准训练范式——类似 DETR 的 Hungarian+denoising 双支柱)
- **Current Status**: Thinking (L2 经典补读交叉产物)
- **Risk**: 4 (两条路线同时适配 YOLO 的工程复杂度高；EMD 匹配后的 K 个预测框与 RepBox 排斥对象的关系需要仔细定义——同一 cell 的 K 个预测 vs 不同 cell 的预测是不同的边界条件；训练稳定性——两个排斥项(EMD 隐式+RepBox 显式)可能导致梯度过大)
- **Key Design Choices**:
  1. **统一底座**: 先在 YOLO Grid-Cell EMD(#37)上实现→再叠加 RepBox 排斥(#37 作为 #39 的前置)
  2. **排斥对象定义**: EMD 匹配后的 K 个预测作为一组→不同 cell 的组间施加 RepBox → 组内 EMD 保证多样性、组间 RepBox 保证分离
  3. **训练 Schedule**: 前半段仅 EMD(匹配学习)→ 后半段 EMD+RepBox(匹配+排斥联合)
  4. **频域加权**: 高频区域加重 RepBox 权重(遮挡区排斥需求更强)→#35 频域遮挡先验作为上游
- **Notes**: 依赖 #37 先行验证；与 #35 频域遮挡先验可三级联动(#35 判据→#37 EMD K值自适应→#39 RepBox 权重自适应)

---

## Candidates (2026-07-18 K1 Gap 分析新增)

### #40 🔴🟦 连续密度感知标签分配 (Continuous Density-Aware Label Assignment)
- **Idea Name**: 用连续软密度函数替代 DALA 的硬二分类密度感知 LA，实现从"密集/稀疏"到"密度连续谱"的标签分配粒度升级
- **Source**: K1-G1（DALA 硬二分类→连续软值缺口）
- **Motivation**: DALA 首个密度感知 LA，但密度分类是硬二值（τ_dense 阈值）→阈值附近的 GT 分配策略突变（一侧 O2O/一侧 Decreasing LA）→训练不稳定+边界目标分配次优。实际密度是连续谱——VisDrone 停车场(极度密集)→道路交叉口(中度密集)→天空(稀疏)，需要连续的分配策略过渡。
- **Solved Problem**: 密集场景标签分配的粒度断层——从二分类升级为连续密度感知，消除阈值边界效应
- **Novelty**: ★★★★ (DALA 后首个连续密度 LA；软密度函数+频域正则化的组合全新；Natural extension of DALA——审稿友好)
- **Difficulty**: Medium (实现成本低——局部 GT 统计+连续函数映射；核心挑战在密度度量设计而非工程)
- **Expected Impact**: Medium-High (DALA 已验证密度感知 LA 有价值→连续化是自然升级；与 #31 频域密度判据互补)
- **Current Status**: Thinking (K1 Gap 分析产物)
- **Risk**: 3 (主要风险：连续软密度函数的选择——线性/指数/sigmoid？需要 VisDrone 消融确定最优映射；频域密度正则项的权重需调参)
- **Key Design Choices**:
  1. **密度度量**: 空间密度(K近邻 GT 距离→连续值 d∈[0,1]) + 频域密度(高频局部统计→f_density∈[0,1]) → 联合密度 ρ = α·d + (1-α)·f_density
  2. **软密度函数**: 正样本数 K(ρ) = max(1, round(K_max · (1-ρ))) —— 密集区(ρ→1)→K=1(O2O)、稀疏区(ρ→0)→K=K_max(充分表征)、中间连续过渡
  3. **与 DALA 的关系**: 将 DALA 的硬二分类+Decreasing LA 统一为连续软值→K(ρ) 在每个 GT 上独立计算→无需密度阈值超参数
  4. **频域正则化**: 频域判据作为密度的正交第二维——空间密集但频域可分(不同纹理)→ρ降低→保留更多正样本→避免误判为"需要O2O"
- **Notes**: 与 #31(密度×频域双维条件计算)互补——#31 控制推理计算分配，#40 控制训练标签分配，两者共用同一密度定义；DALA 代码开源→可基于 DALA 改造验证；K1-G2(多维密度)和 K1-G3(数据驱动衰减)可作为 v2.0 增强方向

### #41 🔴⬜ 密度自适应 Soft-NMS (Density-Adaptive Soft-NMS)
- **Idea Name**: 将 Soft-NMS 的全局静态衰减参数 σ 替换为局部目标密度驱动的动态 σ，密集区宽容(弱衰减保召回)、稀疏区严格(强衰减杀冗余)
- **Source**: K1-G5（Soft-NMS σ 近10年全局静态缺口）
- **Motivation**: Soft-NMS 自 ICCV 2017 提出至今近 10 年，衰减参数 σ 仍为全局固定值。密集区域需要大 σ（宽容→降低衰减力度→保留更多真实目标），稀疏区域需要小 σ（严格→加大衰减力度→消除冗余框）。全局 σ 是折中→两端都不最优。实现成本极低（局部预测框计数→σ查表或线性映射）但近10年无人做——典型的"低垂果实"。
- **Solved Problem**: NMS 后处理在密度变化场景下的适应性——从"一刀切"到"密度自适应"
- **Novelty**: ★★★☆ (概念简单但近10年无人实现；密度自适应 σ + 频域内容相似度双因子→完整的"密度+内容双自适应 NMS"；与 #38 频谱感知 Soft-NMS 正交互补——空间维+内容维)
- **Difficulty**: Easy (一行代码级改动——在 Soft-NMS 的 σ 计算前加一句局部密度查询；局部密度可从预测框邻域计数或频域密度图获取；无需重新训练)
- **Expected Impact**: Medium (预期增益 +0.5~1.5 AP，密集子集更高；作为#6 baseline 默认 NMS 组件)
- **Current Status**: Thinking (K1 Gap 分析产物)
- **Risk**: 2 (主要风险：局部密度估计的窗口大小需要消融——太小→噪声大、太大→失去局部性；极度稀疏场景(天空)下局部密度=0→σ_min 下限需设定)
- **Key Design Choices**:
  1. **局部密度定义**: 方案A(纯空间)——预测框质心半径 r 内其他预测框数量→min-max 归一化→σ 映射；方案B(频域增强)——频域密度图局部统计(高频密集≈真正密集区)+空间密度→联合
  2. **σ 映射函数**: σ(density) = σ_base + (σ_max - σ_base) · density → 线性映射最简单，也可用 sigmoid
  3. **与 #38 联合**: 密度自适应 σ (空间维) + 频谱感知衰减因子(内容维) → `s_i = s_i · exp(-NWD²/σ(density)) · (1 - λ·spectral_sim)` —— 完整的"密度+内容双自适应 NMS"
  4. **自适应范围**: σ ∈ [0.3, 0.7] —— Soft-NMS 原作者推荐 σ=0.5，在此范围内按密度线性缩放
- **Notes**: 与 #38(频谱感知 Soft-NMS)高度互补→联合设计可产出完整的"下一代 NMS"方案；可作为 #6 baseline 的默认 NMS 组件（与 NWD 共同构成小目标+密集友好的后处理管线）；验证成本极低——在现有 YOLO 推理脚本中改一行 σ 计算即可
- **🟡 G1-S3 升级方向(2026-07-19·I1): #40 v2.0 尺度×密度双维标签分配**——VALA(尺度维·VIoU虚拟锚框)+DALA(密度维·O2O vs Decreasing LA)=LA的完整双维控制。G1-S3揭示两者的联合决策表(4种密度×尺度组合→4种LA策略)从未被设计:密集+微小→O2O+小虚拟锚框;稀疏+大目标→Decreasing LA+标准锚框。两者的衰减schedule(DALA K(t)递减+VALA DSS渐进衰减)需同步设计。频域判据可提供密度+尺度的统一上游信号(高频能量→同时指示密度和尺度)→一次计算·双线下游。详见 research_gap.md § G1-S3。

---

## Candidates (2026-07-19, 来源: 🟡 尺度变化 G1 Gap 分析 → I1 Idea 生成)

> G1分析识别20个系统性Gap→8条I1入口。4条为新Idea(#42-#45)，4条为已有Idea升级(#5 v3.3 / #11 v2.0 / #38 G1-L2动机强化 / #40 v2.0)。详见 [research_gap.md](../Knowledge%20Base/research_gap.md) § 🟡 G1。

### #42 ⬜ 训练-推理解耦三范式设计空间与选择指南 (G1-S4·分析性论文)
- **Idea Name**: 系统化三种"训练专用·推理零开销"范式（辅助Loss训后丢弃/辅助Head训后丢弃/门控训后硬化）的设计空间、适用场景与组合兼容性——产出首个训练-推理解耦方法论指南
- **Source**: G1-S4 Gap分析（FS-Mamba SR头 × SET HBS辅助Loss × #5 Gumbel→Hard阈值 三范式交叉）
- **Motivation**: 三种范式各自独立发展、无相互引用、社区缺乏"何时用哪种"的方法论。①辅助Loss训后丢弃(SET CVPR 2025·频谱增强教师→推理时关闭loss项) ②辅助Head训后丢弃(FS-Mamba SR头→训后直接移除) ③门控训后硬化(#5 Gumbel Softmax→推理Hard阈值·SPA GT监督门控→packing)。三者目标相同（训练期注入额外信息/能力→推理期零开销保留收益），但机制、适用场景、组合兼容性从未被系统对比。这是一个**可70%文档推演完成**的Gap——不需实验即可产出分析性论文初稿。
- **Solved Problem**: 
  1. 训练-推理解耦社区的方法论真空——三种范式各自为战，无统一设计空间/术语/评估协议
  2. 工程师的"选择困难"——面对具体场景（小目标/密集/轻量化）时不知该选哪种范式
  3. 三种范式的叠加兼容性矩阵完全未知（能否同时使用？互相增强还是干扰？）
- **Novelty**: ★★★★ (首次系统化训练-推理解耦设计空间；"方法论的论文"而非"方法的论文"——差异化定位清晰；三范式数学形式化+兼容性矩阵+决策树→审稿人友好)
- **Difficulty**: Easy-Medium (70%文档推演——三范式的数学形式化/适用场景分析/叠加兼容性矩阵/决策树；30%⏸需实验——三方在YOLO+VisDrone上的头对头对照。文档推演部分当前即可启动)
- **Expected Impact**: High (独立分析性论文——"A Design Space and Selection Guide for Train-Inference Decoupling in Object Detection"；适合IJCAI/AAAI的分析性track或ECCV的口头报告；引用潜力高——填补方法论空白)
- **Current Status**: **Designing ✅ v1.0 (2026-07-19)** — 分析性论文初稿完成: [idea_042_train_inference_decoupling_design_space.md](idea_042_train_inference_decoupling_design_space.md) (~450行·12节·三范式形式化+设计空间四轴+3×3兼容性矩阵+决策树+8臂实验协议+Venue策略+Related Work划界)
- **Risk**: 2 (主要风险：纯分析性论文在某些venue可能被认为"贡献不够"→可以补充30%实验部分做实证验证——"分析框架+实证研究"的双层定位；另需确认三范式的覆盖完整性——是否还有第四种范式被遗漏)
- **Key Design Choices**:
  1. **三范式数学形式化**: 统一符号系统下定义每种范式的目标函数——①辅助Loss: `L_total = L_det + λ(t)·L_aux`, t→T时λ→0 ②辅助Head: `y = f_head(f_backbone(x)); inference: y = f_head'(f_backbone(x))` ③门控硬化: `τ`从Gumbel温度退火→推理Hard阈值
  2. **设计空间轴**: 信息注入位置(Loss空间/特征空间/架构空间) × 注入时机(全程/前期/后期) × 移除方式(逐步衰减/一次性丢弃/温度退火) × 适用任务(分类/回归/两者)
  3. **兼容性矩阵**: 3×3兼容性格——①+②(辅助Loss+辅助Head·可能协同也可能冗余) ①+③(Loss引导门控学习·SPA范式) ②+③(SR头+门控·FS-Mamba已有雏形·未正式分析)
  4. **决策树**: 场景→推荐范式——小目标检测(②SR头·FS-Mamba证据) / 实时检测(③门控硬化·算力敏感) / 有强教师(①辅助Loss·SET证据) / 多任务(①+②)
  5. **实证验证(30%)**: VisDrone+YOLO11上三方对照——纯baseline vs +SET式辅助Loss vs +SR辅助Head vs +Gumbel门控 → 精度/训练时间/推理延迟三维对比
- **Notes**: 
  - 与项目所有三个门控Idea直接关联——#5(③门控硬化范式)/#11(判据免训练→可改用①或②范式引入监督)/#22(②+③混合范式)
  - 与SPA的关系: SPA的GT监督门控+packing是③的终极形态（训练期也省算力）→可作为③的上界baseline
  - **最高可推进性理由**: 三范式的数学形式化+设计空间定义+兼容性矩阵+决策树→全部可文档推演，0实验即可产出80%完成度的论文初稿
  - **v1.0 设计文档 (2026-07-19)**: ✅ 完成——[idea_042_train_inference_decoupling_design_space.md](idea_042_train_inference_decoupling_design_space.md) · 12节 · ~450行 · 核心贡献: ①三范式形式化(统一符号系统+数学定义) ②设计空间四轴(信息注入位置×注入时机×移除方式×适用任务) ③3×3兼容性矩阵+梯度冲突诊断 ④决策树+场景速查表+"不推荐"矩阵 ⑤9方法实例化映射表 ⑥8臂实验协议+5维评估+Venue策略(IJCAI/AAAI分析性track)。关键发现: FS-Mamba是唯一三范式全用的方法(但作者未意识到); 范式混合是常态(5/9方法使用≥2范式); YOLO-Master级联梯度冲突揭示叠加风险; 范式I最低侵入/范式II最高算力节省/范式III最普遍

### #43 🟦 频域驱动的MoE空间路由 (G1-S1·频域判据→MoE路由信号)
- **Idea Name**: 用免训练频域判据(DERNet WDG HF门控/#11 S1空域高通代理)替代YOLO-Master ES-MoE的图像级GAP路由→实现空间级专家路由，释放异构专家的真正价值
- **Source**: G1-S1 Gap分析（YOLO-Master ES-MoE × DERNet WDG × FS-Mamba FDGate 交叉·条件计算双维融合）
- **Motivation**: YOLO-Master ES-MoE的路由是图像级GAP（`GAP→FC→γ=8→Soft→Hard Top-K`）→全图所有位置路由到同一组专家。其Wiki自认"后期版本revert to homogeneous experts"——异构专家的价值被GAP路由掩盖（路由粒度太粗→不同位置的不同需求被平均化）。DERNet WDG的HF自派生门控`g∈(0,1)`和FS-Mamba FDGate都是**逐位置**频域响应——天然适配空间级MoE路由。**频域判据从未被用作MoE路由信号**——这是条件计算（频域空间门控）与MoE（专家路由）两个独立范式的首次交叉。
- **Solved Problem**: 
  1. YOLO-Master MoE的图像级路由粒度粗→异构专家无法发挥差异化能力→"revert to homogeneous"的根因可能是路由而非专家设计
  2. 频域判据的应用维度受限——当前仅用于"算不算"(#5/#11)和"增强多少"(DERNet)→从未用于"用哪个专家算"
  3. 空间级路由的空缺——不同空间位置的目标（小目标/大目标/背景/遮挡）需要不同的卷积核感受野→图像级统一路由无法满足
- **Novelty**: ★★★★ (频域判据→MoE路由=条件计算×MoE首次交叉；免训练路由vs YOLO-Master可学习路由=第三条路线；空间级路由粒度升级→直接回应YOLO-Master的"revert to homogeneous"痛点)
- **Difficulty**: Medium-Hard (核心挑战：频域判据标量→K个专家的离散选择的映射函数设计；频域图的分辨率（P2/P3/P4/P5不同）与MoE层分辨率的对齐；负载均衡——免训练判据可能导致某些专家利用率极低)
- **Expected Impact**: High (YOLO-Master是CVPR 2026·社区关注度高→在其基础上改进容易获得引用；频域路由若验证有效→可推广至其他MoE检测器（HI-MoE等）；与#11/#30构成频域判据三线应用——空间门控(#11)+token稀疏化(#30)+MoE路由(#43))
- **Current Status**: Thinking (G1 Gap分析产物)
- **Risk**: 3 (主要风险：频域标量与专家选择的映射可能过于粗糙→需要定义"高频区偏好小kernel专家/低频区偏好大kernel专家"的启发式规则·若规则不work需引入轻量可学习映射；YOLO-Master的代码开源→可基于其MoE架构做对照·降低工程风险)
- **Key Design Choices**:
  1. **频域判据→路由映射**: 方案A(硬规则)——高频局部异常度↑→小kernel专家(3×3·细节保留)；中频→中等专家(5×5)；低频→大kernel专家(7×7·语义聚合)。方案B(软映射)——频域判据向量→轻量MLP→K个logits→Softmax路由（保留可学习性但判据作为强先验）
  2. **空间粒度**: 频域图分辨率=P2层（最大分辨率·160×160）→路由在P2级做→上采样/广播到其他FPN层
  3. **负载均衡**: 借鉴YOLO-Master的λ=1.5负载均衡loss→但频域判据天然导致某些频率区专家负载不均（大部分区域是中低频）→需设计补偿机制(如熵正则化)
  4. **对照基线**: ①标准YOLO-Master ES-MoE(GAP路由) ②#43频域路由(硬规则) ③#43频域路由+轻量MLP(软映射) ④Homogeneous experts(消融·证明异构价值)
  5. **计算共享**: S1判据已在#11/#30中计算→#43复用同一判据图→零额外频域计算开销
- **Notes**: 
  - 与#11的关系: #11控制"算不算"（二值），#43控制"用谁算"（多选）→两者正交可叠加——"先频域判据决定是否计算→若计算则频域路由选择专家"
  - 与YOLO-Master的关系: 论文定位为"Rethinking MoE Routing in YOLO: From Image-Level to Spatial-Level"→自然引出频域判据方案
  - YOLO-Master开源代码(GitHub)可直接作为实现基座→最低工程成本验证

### #44 🟠 OBB旋转框双维LA：尺度×角度联合标签分配 (G1-X2)
- **Idea Name**: 将VALA的尺度感知虚拟锚框(VIoU)扩展到旋转框——同时缩放wh和旋转θ→旋转虚拟锚框·实现尺度×角度双维标签分配
- **Source**: G1-X2 Gap分析（VALA VIoU × FAA FAE频域角度 × YOLO26-OBB 长边角度定义 交叉）
- **Motivation**: OBB中尺度变化和角度变化**不独立**——狭长目标（ship·宽高比5:1）侧视时是小目标（窄边）、俯视时是大目标（宽面）。当前方法（YOLO26-OBB/FAA/RDCNet）单独处理角度回归或尺度分配，无人建模"尺度-角度联合分布"。VALA的VIoU开创了尺度感知LA→自然扩展到OBB就是"旋转VIoU(R-VIoU)"——同时缩放(scale_w, scale_h, angle)三维参数。
- **Solved Problem**: 
  1. OBB标签分配忽略目标方向对尺度感知的影响→狭长目标的anchor匹配质量随角度变化剧烈波动
  2. VALA VIoU仅适用于HBB→OBB场景的扩展是理论空白
  3. FAA FAE的频域角度估计可作为R-VIoU的角度先验——免训练·零参数
- **Novelty**: ★★★★ (旋转VIoU=VALA首次OBB扩展·尺度×角度双维LA；FAA频域角度→LA角度先验=频域+LA+OBB三维交叉；OBB社区尚无尺度感知LA方法)
- **Difficulty**: Medium (核心设计：旋转虚拟锚框的缩放策略——(w,h,θ)三维参数空间→与GT的匹配度量→旋转IoU或KLD；YOLO26-OBB开源→可在其代码上改造VALA逻辑)
- **Expected Impact**: Medium-High (OBB社区规模中等但增长快·DOTA/DIOR-R标准基准；若验证有效→可单独成文投TGRS/RS)
- **Current Status**: Thinking (G1 Gap分析产物)
- **Risk**: 3 (主要风险：OBB的双维LA是否比HBB单维LA增益更大？可能需要更复杂的消融设计证明"角度维的增量贡献"；OBB实验依赖DOTA数据集·当前项目未提供→⏸实验暂缓)
- **Key Design Choices**:
  1. **R-VIoU定义**: 对每个GT(旋转框·5参数)，逐层统计中心化宽高+角度→虚拟锚框(scale_w, scale_h, θ_ref)→与anchors计算旋转IoU→VIoU重校准
  2. **角度先验源**: 方案A(纯统计)——同层GT角度统计→θ_ref=中位数角度（数据集先验）；方案B(频域增强)——FAA FAE的FFT角度估计+GT角度统计→联合θ_ref（实例级自适应）
  3. **与YOLO26-OBB的兼容性**: YOLO26-OBB已使用长边角度定义[-45°,135°)+STAL+无NMS双头→R-VIoU在STAL阶段注入（候选anchor筛选时使用旋转IoU而非HBB IoU）
  4. **消融设计**: ①标准YOLO26-OBB(无VALA) ②+VALA VIoU(HBB·仅尺度) ③+R-VIoU(尺度+角度) ④+R-VIoU+FAA角度先验(频域增强)——四臂拆解尺度和角度的独立贡献
  5. **理论卖点**: "尺度×角度联合分布→标签分配从二维(w,h)决策空间升级为三维(w,h,θ)决策空间"
- **Notes**: 
  - 与VALA的关系: 自然扩展→可联合发表或作为VALA的OBB扩展论文
  - 与FAA的关系: FAA FAE的频域角度估计是免训练先验→与#43频域MoE路由/#38频谱NMS共享"频域判据→下游多用途"叙事
  - OBB实验⏸暂缓（需DOTA数据集+GPU）→当前阶段完成方法设计文档即可

### #45 🟦 频域门控路线裁决：可学习(FDGate) vs 免训练(#11 S1) 系统对比 (G1-S5)
- **Idea Name**: 同一YOLO+VisDrone协议下，系统对比两种频域门控范式——FS-Mamba FDGate(可学习·BCE监督) vs #11 S1(免训练·空域高通代理)——裁决项目频域门控的基础路线选择
- **Source**: G1-S5 Gap分析（FS-Mamba FDGate × #11 S1空域高通代理 路线对照）
- **Motivation**: FS-Mamba FDGate（1×1 Conv+Sigmoid→gated HF injection·BCE训练）和#11 S1（Sobel/LoG→高频响应统计·零参数）功能完全等价（识别高频区域→优先处理），但实现路线相反——可学习(数据自适应·需监督) vs 免训练(物理先验·零成本)。**同一基准上的head-to-head对比从未被做过**。这不只是"哪个更好"的问题，而是项目频域门控路线的**基础性战略选择**——#11当前走免训练路线，若FDGate在VisDrone上显著更优（>2 AP），项目需要战略调整。
- **Solved Problem**: 
  1. 项目频域门控路线的基础选择缺乏实证依据——当前#11/#30默认免训练·但FDGate的存在意味着可学习路线同样可行
  2. 社区缺乏"频域门控到底要不要学"的裁决性实验——可指导后续所有频域门控工作
  3. 两种范式的适用边界未被定义——哪些场景下免训练够用？何时需要可学习？
- **Novelty**: ★★★ (对比实验型而非新方法型——但实验结果具有社区级参考价值；与G1-S4形成"方法论(#42)+实证(#45)"的互补论文对)
- **Difficulty**: Medium (工程核心：在统一YOLO backbone上实现两种门控→保持其他组件完全相同做控制变量；FDGate的BCE监督需要"高频GT"——如何定义？可复用DOME-DETR DeFE的GT高斯密度图·或直接用#11 S1的输出作为软标签→形成有趣的"免训练教可学习"实验臂)
- **Expected Impact**: High (决策价值>发表价值——直接决定#11 v2.0和#30 v1.1的路线选择；若免训练接近可学习→"零参数频域门控"叙事更强；若可学习显著更优→项目需战略调整但论文仍可发表)
- **Current Status**: Thinking (G1 Gap分析产物)
- **Risk**: 2 (主要风险：对比实验需要公平的超参调优——若一方调参不足导致不公平对比→结论不可靠。需预设双方的最优超参搜索预算相同。另：FDGate的BCE监督源选择本身就是消融维度——GT密度图→滤波后高频 vs S1输出→哪个作为监督标签？)
- **Key Design Choices**:
  1. **统一实验台**: YOLO11n + VisDrone + P2头——固定backbone/neck/检测头，仅门控模块不同
  2. **三方对照**: ①标准YOLO11n(无门控·上界精度参照) ②#11 S1免训练门控(零参数·Sobel/LoG→高频统计→阈值门控) ③FDGate可学习门控(1×1 Conv+Sigmoid→BCE监督·HF injection) ④FDGate用S1输出作软标签(免训练教可学习·最有趣的实验臂)
  3. **评估维度**: 精度(mAP/AP_small/AP_medium/AP_large) + 计算(GFLOPs/参数/FPS) + 数据效率(不同训练集大小下的FDGate性能衰减·免训练不受影响) + 跨数据集泛化(VisDrone→UAV-ROD→AI-TOD·免训练不受影响)
  4. **FDGate监督标签**: 方案A(硬标签)——GT bbox内的特征位置=1(高频区·应保留)·背景=0→BCE训练；方案B(软标签)——#11 S1的连续输出作为软标签→FDGate学习模仿免训练判据但可超越
  5. **预期结论类型**: 场景依赖性裁决——VisDrone城市纹理复杂→FDGate可能更好(自适应)；海面/农田等均匀背景→S1可能更好(物理先验更稳定)→结论是"场景自适应选择"而非单一赢家
- **Notes**: 
  - 与#42(G1-S4训练-推理解耦)的关系: #45是"哪个门控范式更好"，#42是"训练-推理解耦的通用框架"→两者互补，可作为姊妹篇
  - 与#11/#30的关系: 直接决定两者的v2.0/v1.1路线选择——若免训练胜出→#11保持当前路线+#30保持S1首选；若可学习胜出→#11 v2.0需引入FDGate式学习+#30需评估判据替换
  - 实验⏸暂缓（需GPU+VisDrone）→当前阶段完成实验设计文档即可

