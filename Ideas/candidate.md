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
