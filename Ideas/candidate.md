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
- **Source**: SEEN-DA(语义熵)× SEMA-YOLO(P2 头算力痛点)交叉
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

### #6 SLE 策略在 VisDrone + YOLO11 上的复现与增强
- **Idea Name**: P2 头 + backbone 截短至 P4,作为本项目第一个强 baseline
- **Source**: SEMA-YOLO
- **Motivation**: VisDrone 小目标占比与 RS-STOD 类似;SLE 是消融中单项收益最大且**减参**的组件;单卡 4090 可复现
- **Solved Problem**: 建立可信的改进起点,替代裸 YOLO11n 基线
- **Novelty**: ★★☆☆☆(社区常规操作,不可单独发表,但是后续一切实验的地基)
- **Difficulty**: Easy(Ultralytics 改 yaml 即可)
- **Expected Impact**: Medium(基础设施价值高于发表价值)
- **Current Status**: Thinking → 建议最先执行
- **Notes**: 同时验证 SLE 在 VisDrone 大小目标混合场景的适用边界(自带一个分析点)
- **TinyFormer 补充(2026-07-16)**: PBM 的出现意味着 #6 的 Neck 选型可能需要从 PAN vs AFPN vs ASFF 扩展为 PAN vs PBM vs AFPN vs ASFF——但 PBM 原设计依赖 ViT backbone,在 CNN 上的适配性待验证
- **D3Q 补充(2026-07-16)**: D3Q (DETR 系小目标最佳) VisDrone 36.7 未显著超越 YOLO 系,且 49M/543G 对比 YOLO11n 2.6M/6.3G→**"坚持 YOLO11 基线"决策再次确认**,#6 的工程价值不变

### #7 语义熵图引导的知识蒸馏
- **Idea Name**: VLM 检测器(教师)的语义熵图作为蒸馏 mask,指导 YOLO11n(学生)只在语义丰富区域模仿特征
- **Source**: SEEN-DA + 项目方向(Knowledge Distillation | Lightweight)
- **Motivation**: 现有特征蒸馏(FGD 等)用 GT box 或注意力选区域;语义熵提供了更细粒度、含语言先验的重要性度量
- **Solved Problem**: 小模型在小目标上的特征表达不足;蒸馏区域选择的语义盲区
- **Novelty**: ★★★★☆(熵作蒸馏 mask 未见;与 FGD/MGD 的对比是关键)
- **Difficulty**: Hard(需搭 VLM 教师 + 蒸馏 pipeline;教师在 VisDrone 上本身要够强)
- **Expected Impact**: High(蒸馏+小目标+轻量化三热点交叉)
- **Current Status**: Thinking
- **Notes**: 前置依赖:验证 CLIP 类文本嵌入对无人机俯视视角图像的对齐质量

### #8 尺度感知语义熵(分层 prompt)
- **Idea Name**: FPN 各层级用不同粒度 prompt("a tiny/small/large [Class]")计算层级专属语义熵
- **Source**: SEEN-DA 弱点(小目标高熵被误抑制)
- **Motivation**: 语义熵的尺度偏差是 SEEN-DA 未讨论的盲区;FPN 层级天然对应目标尺度
- **Solved Problem**: 熵度量的尺度不公平性
- **Novelty**: ★★★☆☆
- **Difficulty**: Medium(需 YOLO-World/YOLOE 基座)
- **Expected Impact**: Medium
- **Current Status**: Thinking
- **Notes**: 可作为 #5/#7 的子模块,不必独立成文

### #9 GCP-ASFF vs AFPN 对照实验(排除性实验)
- **Idea Name**: 在 YOLO11+VisDrone 统一协议下对比 PAN / AFPN / ASFF / GCP-ASFF
- **Source**: SEMA-YOLO + 项目已有 Idea#1(Replace PAN with AFPN)
- **Motivation**: 项目已有"换 AFPN"的候选,GCP-ASFF 是同类竞品;不做对照就选型是盲动
- **Solved Problem**: Neck 选型决策依据(Current Problems #4)
- **Novelty**: ★☆☆☆☆(纯工程对照,不发表,产出决策依据)
- **Difficulty**: Easy–Medium
- **Expected Impact**: Medium(决策价值)
- **Current Status**: Thinking
- **Notes**: 建议在 #6 的 SLE baseline 之上做,结论才对后续有效

### #10 RFA-ASFF 协同机制分析
- **Idea Name**: 解释"RFA 单独加掉点、配 ASFF 才生效"的机制(梯度冲突?特征频谱?)
- **Source**: SEMA-YOLO 消融表的反常现象
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
- **Source**: SFIDM(高频→定位细节)× SEMA-YOLO(P2 算力痛点)
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

### #12 KLD 高斯分布匹配分配迁移 VisDrone P2 头
- **Idea Name**: P2 头标签分配用 bbox 高斯化 + KLD 度量替代 IoU(SFIDM DM 模块思路)
- **Source**: SFIDM(DM 模块)+ RFLA(ECCV 2022,已读 ✅ 2026-07-15)
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
