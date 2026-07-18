# Research Journal

## 2026-07-18 (第二十四次记录: 密集遮挡 L1.5 P1 深读5篇 🔬 + KB/数据库全面更新)

- **触发**: 策略修订后的首个任务——密集遮挡 L1.5 P1 深读队列 5 篇（DOMino-YOLO/DRONet/HEdge-MamYOLO/MFF-YOLO NWD-Soft-NMS/GCS-DETR）
- **阅读方式**: 全部多源重构深读（MDPI WebFetch 403 / ScienceDirect付费墙 / IEEE付费墙 / Springer付费墙，通过 Semantic Scholar/Google/Dimensions/中文解读多轮交叉验证）；GCS-DETR 已通过「YOLO 迁移过滤器」
- **核心发现**:
  - **密集遮挡三路线**: ①频域修复路线（HEdge-MamYOLO FM-CHFEM="频域提取→Mamba全局搜索→特征修复"，VisDrone 52.5%最高）②频域滤波路线（GCS-DETR FreqDyNet+OAM-FPN 小波高频保留）③RepLoss演化路线（DOMino-YOLO OAR-Loss=RepLoss+可见度加权）
  - **NWD度量共识**: 5篇中3篇使用NWD（MFF-YOLO NWD-Soft-NMS/GCS-DETR NWD-MPDIoU/DOMino-YOLO距离度量改进）→ NWD是小目标+密集场景的共识度量，#6 baseline应默认采用
  - **频域判据角色升级**: FM-CHFEM证明高频不只可做门控（#11当前角色），也可指导特征修复→#11 v2.0可能方向："判据+修复"统一框架
  - **KAN首次进入检测backbone**: DRONet OAKB=KAN+GRAM多项式展开+频域参数化核，但ultralytics集成困难→CNN等价实现是开放问题
  - **遮挡损失三元谱系**: OAR-Loss(需标注)/OPL(bbox重叠自动GT)/FAFL(熵正则)三种遮挡先验来源→#35频域判据可作为第四种
  - **GCS-DETR YOLO迁移✅**: 三个核心组件(FreqDyNet/OAM-FPN/NWD-MPDIoU)全部架构无关→YOLO迁移价值高，NWD-MPDIoU迁移优先级最高
- **产出**:
  - 5篇深度 Summary: `DOMino-YOLO_RS2025.md` / `DRONet_Displays2026.md` / `HEdge-MamYOLO_TGRS2026.md` / `MFF-YOLO_NWD-Soft-NMS_DMBD2025.md` / `GCS-DETR_MultimediaSystems2026.md`
  - Knowledge Base 5文件10+新条目: loss(#12 OAR-Loss/#13 NWD-MPDIoU/#14 NWD-Soft-NMS) / head(#12 CSIM-Head/#13 LLFFH) / neck(#23 OAM-FPN/#24 DSFFM/#25 PSI+SDEA) / attention(#12 FM-CHFEM/#13 OAKB) / backbone(#15 OAKB/#16 Vision Mamba/#17 FreqDyNet)
  - compare.md 结论31(密集遮挡文献对比横评) / timeline.md 2026追加5行 / research_gap.md 5篇各5问(25条新Gap)
  - database.md 5篇 ⚡→🔬 升级(累计🔬深读 40→45) / README + TASKS 同步
  - 密集遮挡 L1.5 P1 深读全部完成 ✅
- **下一步**: 密集遮挡 L2 经典补读（Repulsion Loss CVPR 2018 / CrowdDet CVPR 2020 / Soft-NMS ICCV 2017）→ L3 知识提取（loss.md遮挡专项/head.md密集检测头/NMS演进线）→ K1 Gap分析 → I1 Idea生成

## 2026-07-18 (第二十三次记录: 📋 策略修订 — DETR 降级为交叉融合副线)

- **触发**: 用户指令——"改变一下策略，DETR仅做为交叉融合的副研究方向，主要还是以YOLO进行研究"
- **决策**: 推翻同日早些时候的「DETR 轨道强化」计划(DX1-DX5)。DETR 从30%资源占比降为5%（仅保留判据层通用+概念层迁移两条交叉线）
- **三大理由**: ①DETR 五大专属机制(Query/Cross-Attention/Bipartite Matching/Encoder-Decoder非对称/Token序列)在YOLO CNN中无直接对应→纯DETR创新无法服务YOLO; ②YOLO积累最深(15 Idea+4设计文档)→分散精力得不偿失; ③判据层+概念层是架构无关的→DETR阅读的剩余价值
- **具体调整**: ①B轨降级为YOLO灵感源; ②DETR论文新原则——每篇必须通过「YOLO迁移过滤器」; ③停止DETR独立Idea/设计文档; ④#32💤纯DETR机制存档; ⑤DX1.5 P1 5篇DETR深读全部取消; ⑥DETR P1深读队列取消; ⑦资源分配: YOLO 80% / DETR交叉融合 5% / 通用理论 15%
- **产出**: 8文件全面修订（CLAUDE/README/TASKS/research_strategy/decision_history/innovation_ranking/journal/research_history）+ Idea预期 45-55→35-45

## 2026-07-18 (第二十二次记录: Dynamic DETR ICML'25 深读 🔬 + #30 撞车裁决 + 新 Idea ×2)

- **触发**: P0 深读任务——Dynamic DETR (ICML 2025)，DX1 检索轮标记的"概念红线缺口"跟踪项
- **阅读方式**: 无 arXiv 版本 → PMLR 官方 PDF 全文获取成功（pdfplumber 提取 15 页全文），方法/公式/实验/消融全部拿到，深读质量完整
- **核心发现**:
  - **判据本质裁定**: DTA 的"动态"是 attention weight 在 COCO val-set 上的**离线统计先验**（stage 级保留率重排 ρ^s=ρ[I^s]），**非输入自适应、非端到端学习**——与 #30 的免监督物理判据（逐图实时频谱统计）三轴分离（判据来源/自适应粒度/泛化性）
  - **⚖️ #30 撞车裁决: 不撞车**——Dynamic DETR 完全未触碰频谱/梯度信息，"免监督输入自适应判据"空白仍成立且获得第三次确认（query 机制线/频域增强线/token 稀疏化线全部让出该生态位）；其身份从"概念红线威胁"转为 **#30 SOTA 对照基线**
  - **重要性跨层迁移规律**: 浅层 block 重要 token 集中在低层级，随 encoder 加深向高层级迁移（Figure 2/4）——⚠️ 但 VisDrone 未验证，小目标场景该假设可能翻转（浅层重要性持续）
  - **合并式 > 丢弃式**: MTA 双轨聚合（低层 Proximal 窗口 Mean 合并 n=2^{l-1} / 高层 Holistic γ_i 重要性+Affinity T=3 注入）保留 token 关系，DINO −42% FLOPs 仅 −0.7 AP，胜 Sparse(−2.7)/Lite/Focus 全系
  - **RCDR 红利**: 中心距离正则 ‖ν_pre−ν_post‖₂（λ=0.1）判据无关、+0.6 AP 零推理开销——#30 可直接引入
  - **小目标盲区确认**: 四个 token 稀疏化方法（Sparse/Focus/Lite/Dynamic）全部只测 COCO 系基准，VisDrone/AI-TOD 零覆盖 = "token 稀疏化 × 小目标"无人区
- **新 Idea**:
  - **#33 🟪 频谱判据驱动的输入自适应 token 聚合**（#30 × Dynamic DETR 框架融合）——保留 MTA 聚合框架+RCDR，判据替换为 S1 空域高通代理；E1 升级三臂对照（统计先验 vs 物理先验 vs DeFE 学习头）
  - **#34 ⬜ 密度自适应聚合窗口**（小目标区域禁止合并）——判据超阈值 patch 豁免 n²→1 合并，修复 Proximal Aggregation 均匀粒度与小目标空间异质性的矛盾；免训练验证起点：统计被合并 patch 与 GT 小目标框重叠率
- **产出**:
  - `papers/summaries/Dynamic-DETR_ICML2025.md`（深度 Summary：机制/公式/全数字/局限/4 方向/项目关联四维分析）
  - Knowledge Base 四件套: attention.md 条目10 / detr_map.md 主线3+概念红线深读标记 / research_gap.md Dynamic DETR 条目 / compare.md 对比行+结论29
  - `papers/database.md`: ⚡→🔬 升级+挂跟踪项 3→2；`Ideas/candidate.md`: #33/#34 录入
- **下一步**: innovation_ranking.md 补 #33/#34 评分行；继续 P0 队列剩余深读

## 2026-07-18 (第二十一次记录: OPL 深读 🔬 + 新 Idea ×2)

- **触发**: P0 深读任务——OPL (Occlusion Perception Loss, ESWA 2025)，密集遮挡方向首个显式遮挡感知损失
- **阅读方式**: ScienceDirect 付费墙 + 无 arXiv 预印本 → 多源 WebFetch/WebSearch 综合重构（eBiotrade 中文报道 + 5 轮 WebSearch + Dimensions/Semantic Scholar 交叉验证）。精确公式/消融数字表/OPD 超参数未能获取，已诚实标注 ⚠️
- **核心发现**:
  - OPL = **首个显式遮挡感知损失**——OPD（Transformer 遮挡图预测）+ OPL（bbox 重叠+高斯模糊 GT 监督）+ OPC（遮挡图注入检测头）三元组
  - GT 遮挡图生成: bbox 重叠区域 → 高斯模糊 → 连续遮挡概率图 → **零额外标注成本**
  - 遮挡召回率 95.4%（+22.6%），CrowdHuman + CityPersons 双数据集验证
  - **与项目核心的交叉点**: ①OPL 的 bbox 重叠→遮挡图 可用频域判据替代（免重叠依赖）；②遮挡区域是否天然高熵？→ #5 语义熵门控 vs OPL 遮挡增强的张力；③DETR 比 CNN 更适合 OPL 范式（Cross-Attn 全局感受野 + per-query 遮挡建模）
- **关键局限**: bbox 重叠 ≠ 真实遮挡（并排行人假阳性）；完全被遮挡目标无 bbox→无法建模；仅行人检测验证；高斯模糊参数手工设置
- **新 Idea 提出**（⚠️ #31/#32 已被 DALA 衍生、#33/#34 已被 Dynamic DETR 衍生占用，本轮取 #35/#36）:
  - **#35 🔴 频域遮挡先验 → 免bbox重叠的遮挡图生成**（Novelty 4 | Impact 4 | Overall **3.8**）: 高频局部异常度图→自适应阈值→作为 OPD 的无监督训练目标（替代 bbox 重叠+高斯模糊）→覆盖截断/背景遮挡/密集人群等 bbox 重叠无法覆盖的遮挡类型。同时服务🔴密集遮挡（遮挡建模）和 B轨 #30（频域判据新应用维度）
  - **#36 🔴⬜ 语义熵隐式遮挡检测器 — OPL遮挡图 × 熵图相关验证**（Novelty 4 | Impact 4 | Overall **3.9**）: 验证 OPL 遮挡图 vs 语义熵图的空间相关性（Spearman ρ）。若显著相关→语义熵 = 零参数、免训练、免 VLM 额外开销的"隐式遮挡检测器"→为 #5 提供新叙事（熵门控不仅在省算力，也在隐式感知遮挡）。同时调和 OPL（增强遮挡）vs #5（跳过遮挡）的张力：先熵门控过滤背景→再在保留的前景区域做遮挡增强
- **知识库更新**: loss.md（OPL 遮挡感知损失条目 + 4 个改进方向）/ head.md（OPD 辅助头条目 + 4 个改进方向）/ attention.md（OPL 显式遮挡感知机制条目 + 4 个改进方向）/ research_gap.md（来自 OPL 的 Gap 分析 6 条: 免 bbox 重叠遮挡图生成 + 熵图=隐式遮挡检测器 + DETR 化 OPL + OPL×#5 张力分析 + OPL×#30 交叉 + 双轨交汇点）
- **数据库更新**: OPL ⚡→🔬，关联 Idea 更新
- **下一步**: DOMino-YOLO (OAR-Loss) 或 FAFL 深读（密集遮挡 L1.5 P0/P1）；#35/#36 评分详细论证 + candidate.md 条目

## 2026-07-18 (第二十次记录: 密集遮挡 L1 + DETR DX1 双线文献检索)

- **触发**: 按战略规划启动双线并行文献检索——🔴密集遮挡(L1,最薄弱优先) + 🟪DETR专属补读(DX1,强化B轨)
- **检索范围**: 8 组关键词 × 2 方向 = 16 组搜索,命中 50+ 候选,经相关性筛选后记录 22 篇(密集 13 + DETR 9)
- **密集遮挡方向关键发现**:
  - **标签分配**: DALA(首个密度显式建模进LA)/FSS(次优样本聚焦,50.8 AP)/RFAssigner(通用多尺度LA)——密度感知LA 2026年才出现
  - **损失函数**: OPL(首个显式遮挡感知损失,召回率95.4%)/OAR-Loss(Repulsion Loss 2025唯一可见变体)/FAFL(五组件遮挡损失框架,"Entropic regularization"与#5熵判据潜在交叉)
  - **NMS**: NWD-Soft-NMS(VisDrone +9.0%)——频域距离度量进NMS仍是空白
  - **架构**: DRONet(KAN+GRAM,50.1%)/HEdge-MamYOLO(频域+Mamba,52.5%检索最高)/GCS-DETR(DETR+频域+遮挡三交叉)
- **DETR DX1 方向关键发现**:
  - **DETR×密集**: Adaptive Query Allocation(密度图→动态query)/Pe-DETR(query差异化,CrowdHuman +3.7)/SCOPE-DETR(注意力温度调控)——都未引入免监督频域判据=#30交叉空间
  - **DETR×OBB**: RS-DETR(旋转-语义双分支decoder)/RO²-DETR(旋转等变,ISPRS)/Hausdorff Matching(WACV 2025,旋转框匹配改进)——O²以外新方案,但无人做OBB×频域判据
  - **DETR 机制**: **Dynamic DETR(ICML 2025)**——概念红线缺口,多级token稀疏化对#30判据层级分布有直接指导;Predictive Imbalance(LAD loss,分类-定位不一致定量分析)
- **Gap 确认**: 密集遮挡方向 4 个 Gap 初步确认(密度感知LA/遮挡RepLoss演进/频域NMS/频域选择性遮挡恢复);DETR 方向 5 个 Gap 初步确认(DETR query冲突×频域/DETR×OBB×频域/Cross-Attn分析/Bipartite Matching密集场景/Encoder动态token)
- **深读优先级**: P0=Dynamic DETR(概念红线)+DALA(首个密度LA)+OPL(首个遮挡感知Loss);P1=8篇(Adaptive Query Allocation/Pe-DETR/SCOPE-DETR/DOMino/DRONet/HEdge-MamYOLO/FAFL/RS-DETR/Hausdorff Matching);P2=7篇
- **产出**:
  - `papers/summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md`(22 篇快评+深读优先级排序)
  - `papers/database.md` 新增「九、🔴密集遮挡」(10条)+「十、🟪DETR专属扩展」(8条),总条目 60→**78**
- **下一步**: 按 P0→P1→P2 启动深读

## 2026-07-18 (第十八次记录: 战略扩展——四维问题空间 + 三方向系统性研究规划)

- **触发**: 用户指出当前 26 个 Idea 全部围绕轻量化/条件计算,要求拓展到**尺度急剧变化(小目标)**、**密集排列与遮挡**、**旋转角度(OBB vs HBB)** 三个方向
- **Agent 全项目盘点结果**:
  - 方向一(尺度变化): 论文最多(25+), 但视角高度单一——全部围绕 P2 条件计算。Neck 对比实验/跨尺度融合/自适应感受野基本空白
  - 方向二(密集遮挡): **完全空白**——0 Idea, 0 专项论文, Knowledge Base 无条目, Repulsion Loss/Soft-NMS/CrowdDet 等经典工作零覆盖。CrowdHuman 数据集被列出但从未使用
  - 方向三(旋转检测): 5 篇论文 + Timeline 角度编码演进线, 但仅 1 个低优先级 Idea(#17, 标注"项目转向 OBB 才有价值")。YOLO-OBB 内部机制/OBB 数据增强/loss 条目均为空白
- **决策**: 写系统性研究规划,最薄弱优先 → 密集遮挡(25%)> 旋转检测(15%)> 尺度拓展(5%),与现有条件计算(55%)并行
- **产出**:
  - `Decision/research_strategy.md` § 战略扩展: 四维问题空间总览/扩展原则/三方向路线图(每方向 L→K→G→I→D 完整循环)/资源分配/执行顺序/预期总产出(Idea 26→40-50)
  - `TASKS.md` 新增「🔴 战略扩展: 三维度问题空间」区块(18 个新任务)
  - `README.md` v3.0: 问题维度从单一→四个,方向标签从双轨→双轨×四维
- **关键交叉点已识别**:
  - 密集 × P2 稀疏化: #5 熵判据在密集场景是否失效?
  - 密集 × DETR: query conflict in dense scenes
  - 密集 × 频域: 密集边缘 vs 孤立目标频谱差异
  - OBB × 条件计算: 旋转框空间分布→判据需重验证
  - OBB × 密集: 旋转框 IoU 重叠更大
  - OBB × 频域: 方向性→频谱方向性特征(#25 天然延展)
- **下一步**: 密集遮挡方向 L1 文献检索(最薄弱优先启动)

## 2026-07-18 (第十九次记录: 🟪 DETR 轨道强化——从单 Idea 到系统化研究)

- **触发**: 用户指出 DETR 轨道研究不足,须加强。当前 B轨仅 #30(条件计算)+#14(降级对照)两个 Idea,单点故障风险极高
- **DETR 审计(并行 Agent 全项目盘查)关键发现**:
  - B轨健康度 B+(79/100):论文覆盖 A(92)/研究活跃度 A(95),但 Idea 管线 C+(58)/知识库覆盖 B-(67)
  - 仅 1 个活跃 B轨 Idea(#30)承载全部创新;#30 失败则 B轨归零
  - 5/14 Knowledge Base 文件 DETR 零覆盖(training/loss/augmentation/dataset/future_work)
  - DETR 五大专属机制(Query/Cross-Attention/Bipartite Matching/Encoder-Decoder非对称/Token序列)完全未作为新 Idea 种子
  - 三维度(密集/OBB/尺度)的 DETR 视角完全空白——所有新方向任务都只从 YOLO 出发
- **决策**: 系统化 DETR 强化方案,五阶段推进 DX1(论文补读)→DX2(知识深化)→DX3(Gap分析)→DX4(Idea生成)→DX5(Design)
- **DETR 五大专属机制→Idea 种子**:
  - Query 可学习交互: 密度自适应 query/query 交互建模/query 初始化策略
  - Cross-Attention 全局检索: 注意力图分析→遮挡推理/尺度感知稀疏化
  - Bipartite Matching 一对一分配: 密集场景匹配稳定性/匹配冲突检测
  - Encoder-Decoder 非对称(49% FLOPs→11% AP): encoder 独立轻量化/渐进式推理
  - Token 1D 序列: token 重要性排序/聚类/稀疏化(YOLO P2 2D grid 不具备)
- **DETR × 三维度交叉**: 密集(query冲突+匹配不稳)/OBB(旋转query表示)/尺度(多尺度token预算)/频域(#30扩展到query+decoder侧)/专属理论(Cross-Attn信息流形式化)——目标 B轨专属 Idea 2→8-12
- **资源调整**: B轨总占比 15%→30%(条件计算10%+三维度扩展20%),与 A轨持平
- **产出**:
  - `Decision/research_strategy.md` 新增 § DETR轨道强化(DETR专属机制表/五维度交叉/五阶段行动/资源分配/预期产出)
  - `TASKS.md` 新增「🟪 B轨强化」区块(DX1–DX5 共 20+ 任务)
  - `README.md`: 问题维度+B轨强化条目/Roadmap 全标注
- **下一步**: DX1 DETR 专属论文补读(与密集遮挡 L1 并行启动)

## 2026-07-18 (第十七次记录: PRNet 深读——VisDrone 最高纪录拆解 + P2 复用矛盾量化 + 层深维条件计算入口)

- **背景**: 今日检索轮数据点中 PRNet(VisDrone AP50 54.1@24.6M/61.0@1024)以近 7 点优势登顶,远超此前纪录(D3Q 36.7/Dome 39.0/DroneScan 55.3@1280 混杂分辨率),且直接涉及 Neck 选型(#6)、信息瓶颈(#24)与 P2 路线图,升级深读遵从全协议
- **论文**: PRNet: Original Information Is All You Have, arXiv 2510.09531(Zheng, Zhao, Cui, Li), 2025-10-10 提交,未见 venue 接收;代码仓未核实
- **核心方法**:
  - **PRN(Progressive Refinement Neck)**: 替换 PAN-FPN,通过三阶段多次复用原始 P2^in/P3^in(带渐进闭环单次 down-up/块),解决 FPN 中原始特征只用一次 + 重建偏差两大缺陷
  - **ESSamp(Enhanced SliceSamp)**: PixelUnShuffle 替代显式切片索引(key:访存合并)+ depth multiplier d=2 补单核表达力(d=3 掉点 cause:后续点卷积压缩比过大)
- **关键数字**:
  - PRNet(7.77M/44.9G) vs YOLO11-s(9.4M/21.3G): **AP50 49.9 vs 40.4(+9.5)**, 参数反降 17%, FLOPs +110.7%
  - PRN 单独 = **+10.3 AP50**(39.0→49.3), 仅 7.71M/41.1G(YOLO11-s 基线 39.0)
  - ESSamp 单独 = +1.1 AP50(温和)
  - 迭代阶段 0/1/2/3: 45.0/49.3/51.0/51.4 AP50, FLOPs 线性 28.7/41.1/54.3/67.5G → 一刀切取 1
  - 跨架构: YOLOv5s +7.1 / v8s +7.8 / 11s +10.3 / FBRT +6.0 / RT-DETR-R50 +3.2
  - PRNet-L@1024: **61.0 AP50 = 检索所见最高**(此前记录 DroneScan 55.3@1280 分辨率混杂)
- **判定与影响**:
  1. **#5 motivation 最强新证** ⭐⭐⭐: PRN 消融链完美暴露"P2 复用价值巨大 +10.3 / 稠密处理代价高昂 FLOPs +110.7%"——与 Edge-Constrained "P2 alone +31% AP_small" 并列,选择性复用的必要不再只是理论推演
  2. **P2 路线图第四分支确立 + gap N+3 确认**: 加头/注入 P3/头内粗粒度选择/骨干 P2 复用——四条路线全部静态稠密无输入自适应,#5 gap 从"某一支路的空白"升级为"跨路线共性空白"
  3. **层深维条件计算新入口**: PRN 静态迭代深度 1/2/3 的 49.3/51.0/51.4 阶梯 = 现成的输入自适应 early-exit 场景,判据复用 #11 图像级高频统计——与 #26(decoder 层深)构成"层深维条件计算"双轨对(空间 & 层深正交)
  4. **DETR 增益缩水实证**: RT-DETR +3.2 vs YOLO +6~10 = CNN "浅层原特征复用"天然优于 self-attention 的量化锚点,为 #24 架构无关叙事提供反面证据(spokesman: 信息瓶颈双轨验证时 B轨需独立设计,不能照搬 A轨方案)
  5. **PRNet 无 FPS 漏洞**: 全文自称 real-time 但只报 FLOPs — 为 #30 E6 必须测 FPS+延迟 的协议设计提供反例背书
- **产出**: PRNet_arXiv2025.md(🔬深度总结,按全协议) + neck(KB entry 6) + sota(行升级:未核实→🔬) + compare(行+结论 27) + timeline(主线+FPN 线+小目标线+P2 利用路线分支) + research_gap(PRNet 专项段+N+3 确认) + database(PRNet ⚡→🔬)
- **下一步**: ⏸ PRN×#5 稀疏化融合待实验模块(纯文档态,预实验设计已记录在 Summary §八);周期检索继续

## 2026-07-18 (第十六次记录: 文献检索轮——Dome 放码 + 哨点降级 + 双 gap 维持)

- **任务**: 6 路并行检索(YOLO P2/DETR token/频域/轻量化/遥感UAV/蒸馏)+ 三个跟踪项复查
- **跟踪项三连裁决**:
  - **Dome-DETR 放码 ✅ + ACM MM 2025 接收确认(#30 最大利好)**: github.com/RicePasteM/Dome-DETR,S/M/L 预训练权重+训练日志(Dome-S=AI-TOD 32.1/VisDrone 35.9),AI-TOD-v2/VisDrone 双数据集 → **E1 生死项从"论文复现对照"升级为"官方代码对照"**,MWAS 控制变量可落代码级;⚠️其动态 query 限每 GPU 单批训练,#30 实验需预估同样约束;#30 方案 v1.0.1 已同步
  - **Unmasking the Tiny 见刊(IVC Vol.172)细节补全 → #5 哨点降级**: 核心洞察"前景分数被抑制而分类语义 robust";STSM 粗选弱信号 token + FRM 语义注意力**补强**恢复前景分数——**补强式(加法)vs #5 跳过式(减法)方向相反,可共存** → 威胁从"最近哨点"降级为"普通近邻";代码仍占位,低频跟踪
  - **HF-DETR 仍付费墙**: SSMG 判据性质裁决继续悬置(无 arXiv 镜像);跟踪不变
- **新作划界×3**: ①FSDETR(IJCNN 2026,RT-DETR+FSFPN 可学习频域滤波,VisDrone APs 13.9)=**频域浪潮第 7 篇,纯增强范式** → #30 gap 反证再+1;②HI-MoE(arXiv preliminary,DETR 两级 MoE,DINO +3.3 APs)=条件计算在**专家维**非 token 空间维,与 #30 正交,且"条件计算利好小目标"与 Dome 相互印证=通路侧翼佐证;③MFVL-YOLO(Physica Scripta 2025,熵引导+频域增强同现)——其熵用于**前景判别增强**非计算分配 → #5 概念红线表述价值再显,记入近邻清单
- **数据点收获**: PRNet VisDrone AP50 **54.1(24.6M)/61.0@1024 = 检索所见最高**(sota 参照);FFKD-Net 47.7@3.0M(#7 轻量+KD 上限);**Scale-Conscious KD 面积加权蒸馏 = #7 语义熵加权的现成消融对照轴**;HFSP-YOLO P2→P3 注入 = P2 信息利用第三路线(加头/头内稀疏/注入,均静态→#5 gap 不变)
- **产出**: quick_eval_2026-07-18_literature_round.md + database 50→60 条 + #30 方案 v1.0.1 + TASKS 跟踪项状态更新
- **下一步**: ①🔔 HF-DETR 全文渠道/HI-MoE 正式版/Unmasking 放码(低频);②⏸ Dome 代码细读(MWAS/DeFE)待实验模块——**实验模块启动时首批任务已凑齐: E3 判据 AUROC + Dome 代码复核 + E0 基线复现**;③继续周期性检索

## 2026-07-17 (第十五次记录: 文献检索轮——HF-DETR 撞车监控 + #5 gap 再确认)

- **任务**: 双轨全类目 2025–2026 新作检索(设计文档栈闭环后的唯一无阻塞工作线)
- **核心命中 HF-DETR(IEEE SPL 2026)⚠️🔔**: LoG 算子 stem(FSD-Stem)+ 小波逆投影重建(FEFR-Encoder)+ **SSMG saliency token 稀疏门控**;VisDrone AP +4.3/AP50 +6.0,8.6M,121 FPS——「高频+token稀疏+VisDrone+实时」四要素齐聚,**#30 组合空间迄今最近邻居**。判定:高频组件做增强非判据统计;SSMG 大概率可学习微门(落 learnable gating 已占区)→ 与 #30 免监督统计判据仍可划界;**但无 arXiv/IEEE 全文不可获取,SSMG 判据性质待核实 → 🔔 挂跟踪(第 2 项)**,#30 方案 §6 新增风险 5。附带正面证据:LoG(Laplacian 家族)被顶刊快报用作高频提取器 = S1 工具选择又一独立佐证
- **UFO-DETR 快评补全数字**: VisDrone mAP50 46.1(vs RT-DETR-L +2.6)/算力 -60%;纯"频域增强+轻量化"(DynFreq-C3 内用 FDConv),不做条件计算 → 维持"外围计数项"判定不威胁
- **无新撞车确认**: ①#5 近邻(语义熵/空间门控 CNN 特征稀疏化)检索无新命中;②Dome-DETR 代码仍未放出;③YOLO P2 侧 2026 批量新作(LAF-YOLOv10 35.1@VisDrone/Edge-Constrained QIEA/DroneScan-YOLO 等)全部是"加 P2 头"路线,无人做 P2 内部空间稀疏化——**#5 gap 第 N+1 次确认**;Edge-Constrained "P2 分支 alone +31% AP_small" 为 #5/#6 新增 motivation 数据点
- **产出**: HF-DETR_SPL2026.md 快评新建 + attention_round1 UFO-DETR 条目补全 + database(50 条,🔔×2)+ #30 方案 §6 风险 5 + ranking 续十一日志
- **下一步**: ①🔔 跟踪 HF-DETR 全文(SSMG 判据裁决)/Dome 放码/Unmasking 放码;②继续周期性检索;③⏸ 实验类待实验模块(E3/M0 首验候选)

## 2026-07-17 (第十四次记录: 🟦 A轨双文档修订——#11 v1.1 + #5 v3.0 Dome 划界段)

- **任务**: TASKS 既定的 A轨两项纯文档修订,一轮完成
- **#11 频域交叉分析 v1.1**([frequency_domain_cross_analysis.md](../Ideas/frequency_domain_cross_analysis.md)): ①工具首选 FFT→**S1 空域高通代理**(EFSI 硬消融 33.1>FFT 32.3>DWT 32.1 + 四条工程理由),FFT/DCT 降为消融;②叙事抽象为「高频响应统计判据(实现无关)」,新增消融 F-impl(同判据形式换实现,与 #30 E2 共用)支撑该论断;③判据维度调整为"先高频+局部异常度,三频段留 F3 裁决"(门控容错不对称:误保留只多算,误丢弃才致命);④**判据族权威定义收敛至 #30 方案 §2**(#11 YOLO P2 / #30 DETR token 共用,杜绝分叉维护)——双轨"同判据跨架构"文档基础闭环(⬜#24 卖点);⑤SPA(ICLR 2026)GT 监督门控+packing 记录为 #5/#22 侧可学习升级选项,#11 主打免监督版不采用(定位一致性)
- **#5 v3.0 §十 Dome-DETR 划界段**([idea_005_v3_design.md](../Ideas/idea_005_v3_design.md)): 四轴划界表——架构载体(CNN P2 卷积分支 vs DETR encoder token,token selection 社区未覆盖 CNN 特征级)/判据(零参语义熵复用 cls logits vs 0.8M DeFE+GT 密度监督+DRFL)/判据语义(**不确定性 vs 密度 = 正交信息维度**,密度低的难例区仍被保留)/成本叙事(净减法 −19% vs 控增量 +37%,互补不冲突);附英文 RW 段落草案(写论文直接用);概念红线落款「熵引导的空间计算分配」
- **产出**: 2 个设计文档修订 + ranking(#5/#11 行+续十日志)/TASKS(双任务✅+Completed 续六)同步
- **意义**: A轨设计文档栈(#5 v3.0+§十 / #11 v1.1)与 B轨 #30 方案 v1.0 完成判据统一与相互划界——**双轨设计阶段文档基础全部闭环**,余下推进依赖实验模块或新文献
- **下一步**: ①持续检索 2025–2026 双轨新作(唯一无阻塞工作线);🔔 Dome/Unmasking 放码跟踪;②⏸ 实验类待实验模块(E3 免训练判据 AUROC 为最低成本首验候选)

## 2026-07-17 (第十三次记录: 🟪 #30 技术方案 v1.0——判据选型×D-FINE接入点×Dome对照叙事)

- **任务**: B轨主 Idea #30 技术方案 v1.0 落地(纯文档,实验全部 ⏸)→ [idea_030_technical_proposal_v1.md](../Ideas/idea_030_technical_proposal_v1.md)
- **判据定型**: 三选项 **S1 空域高通代理(首选)**/S2 DCT/S3 FFT——直接吸收 EFSI 硬消融(空域代理 33.1 > FFT 32.3 > DWT 32.1)与其四条工程理由;判据公式继承 #11 修正版(局部异常度归一,回应 SET"背景高频噪声"警告);叙事从"FFT 判据"抽象为「**高频响应统计判据(实现无关)**」,同时规避与 FFT 系竞品的工具层撞车。零参数版主打,+1参数(可学习τ)/4参数(线性组合)作消融阶梯,证明"判据不需要 0.8M"
- **接入点设计**: 与 Dome 逐点对齐做控制变量——P(最浅层判据,与 DeFE 同位)/E(MWAS 窗口注意力结构**沿用并引用**,非本方案贡献;背景 token identity 直通,SViT 硬删除教训)/Q(query 弹性预算掩码过滤,**不引入 Dynamic NMS**=保住 D-FINE 端到端性,直接回应 Dome 攻击面③)。全部差异集中在「判据+无NMS」两点,增益归因干净
- **对照叙事**: Dome 三攻击面→#30 三卖点表(判据 1/40 成本/免监督零重训跨数据集迁移/端到端保持);定位诚实声明:不许诺净省算力(Dome GFLOPs +37% 教训),定位="以受控成本引入浅层高分辨率信息,判据免费化"
- **实验协议锁定(⏸ 待实验模块)**: E0 基线复现→**E1 判据 vs 复现版 DeFE 头对头(生死项,>1AP 差距则退守"1/40 成本保 x% 增益")**→E2 判据消融→**E3 免训练判据热图 AUROC(不训检测器即可跑,实验模块最低成本首验)**→E4 跨数据集 τ 迁移→E5 query 预算消融→E6 成本核算(报 GFLOPs 分布+FPS,修 Dome 未报漏洞)
- **产出**: 技术方案 v1.0 新建 + ranking/candidate/detr_map/TASKS 四处状态同步
- **风险跟踪**: 撞车窗口(频域 DETR ~6篇/年,「频谱判据+条件计算」空白可能 6–12 个月被填)→ #30 维持 B轨最高优先;🔔 Dome 放码后 E1 升级为官方对照(利好)
- **下一步**: ①🟦 A轨 #11 v1.1 修订(判据设计直接引用 #30 §2,避免分叉);②🟦 #5 v3.0 Related Work 补 Dome 划界段;③持续检索双轨新作

## 2026-07-17 (第十二次记录: 🟪 B轨衍生查新裁决——#5-D ❌ / #11-D→#30 ✅)

- **任务**: detr_map 规划的「B轨下一优先:#5-D/#11-D 查新与划界」执行完毕,裁决落地
- **致命发现**: **Dome-DETR**(arXiv 2505.05741, USTC)——D-FINE 底座 + DeFE 密度头(0.8M,GT 高斯监督)→ MWAS 浅层掩码窗口 token 稀疏 + PAQI 自适应 query,AI-TOD-V2 34.6/VisDrone val 39.0 双 SOTA。「判据热图→掩码→浅层 token 稀疏+query 预算」结构与 #5-D 拟议完全同构,底座/数据集/卖点全部重合 → **#5-D 查新不通过,不占编号**(叠加 Dynamic DETR ICML'25 学习式 importance、MATP/EnTeR ViT 熵剪枝夹击);熵判据遗产并入 #19 DETR 侧对照列
- **幸存与占号**: **#11-D → 正式占编号 #30「免监督频谱判据→DETR 浅层 token 条件计算」(3.9,B轨主 Idea)**——频域 DETR 竞品 6+ 篇全部停留在增强范式,无人做 token 级条件计算;分类域 TREWA 判据方向相反(保低频,小目标需高频)天然划界;Dome 反而佐证通路有效(+2.5~3.3),#30 的差异 = 判据免监督零参数 vs DeFE 学习头,Dome 三攻击面(GFLOPs+37% 非净省/保留 NMS/判据需监督)= 对照叙事
- **连带修正**: ①「全线无 P2」结论失效(Dome 已用最浅层四尺度)→ #14 降级回结构对照实验,B轨入口更替为 #30;②概念红线扩充(「密度引导 token 稀疏」「learnable frequency gating」「学习式 token importance」均被占)→ B轨合法表述收敛为「免监督/零参数判据驱动的 token 预算分配」;③A轨 #5 v3.0 Related Work 须补 Dome-DETR 划界段
- **产出**: Dome-DETR 深读 summary + 裁决文档 detr_derivative_novelty_check.md + ranking(26 Idea)/candidate/detr_map/compare(结论25)/timeline/sota/database(49 条)七处同步
- **最大风险**: 审稿人必问「免监督频谱判据 vs 学习式 DeFE 谁强」→ 头对头对照实验为 #30 生死项(⏸ 待实验模块);Dome 未开源,复现其 MWAS 做对照有工程成本
- **下一步**: ①🟦 A轨 #11 v1.1 修订(吸收 EFSI 三选项判据+SPA 门控证据,与 #30 共用判据设计);②#30 技术方案文档 v1.0;③持续检索双轨新作

## 2026-07-17 (第十一次记录: 双轨决策 + 🟪 B轨基础线四篇闭环)

- **用户决策**: 「YOLO 和 DETR 都很好」→ 研究体系重组为 **🟦 A轨·YOLO(~60%)+ 🟪 B轨·DETR(~25%)+ ⬜ C类·双轨通用理论(~15%)** 双轨并行;25 个 Idea 完成架构分类;#14 升级 B轨入口;新增衍生候选 #5-D(语义熵→query 稀疏化)/#11-D(频域门控 DETR 版),须过查新才占正式编号
- **阅读**: B轨基础线 4 篇全部深读闭环——①RT-DETR(CVPR 2024,AIFI+CCFF+不确定性QS,53.1@108FPS,**官方自认小目标短板**);②D-FINE(ICLR 2025,FDR 分布式回归+GO-LSD 自蒸馏,54.0@31M/91G,O365 后 APs 40.0);③Deformable DETR(ICLR 2021,MSDeformAttn K点稀疏采样,QS 诞生地,APs +5.9);④DINO(ICLR 2023,CDN+混合QS+LFT,APs +7.2,首登 COCO 榜端到端)
- **最大发现**: **QS 判据三代演进链**(纯 top-K→混合→不确定性最小)= #5-D 第三判据(语义熵)的谱系落点;**小目标增益是 DETR 谱系每一环的最大收益项**——DETR 主线是"让 query 离小目标更近",与 YOLO 主线"分辨率更高(P2)"正交 → B轨引 P2 是跨路线组合创新(全线无 P2 已证)
- **决策**: B轨基线**纸面初判 D-FINE**(RT-DETR 为机制理解层+ultralytics 生态兜底;最终确认⏸待实验模块)
- **新Idea**: 无新占号;#5-D/#11-D 挂查新门槛
- **最大疑问**: #5-D 的增量能否真正落到"减少 encoder/特征计算"?若只改 QS 排序则退化为 QS 改良,查新难过 DQ-DETR/D3Q 一线
- **最大风险**: 「注意力稀疏采样」概念已被 MSDeformAttn(15000+ 引用)占据——B轨 Idea 表述必须落「query/token 预算的内容自适应分配」;DINO 的 CDN 900 query 显存开销在 VisDrone 密集场景需重估
- **下一步**: ①DETR 方向知识小结(14 篇→B轨技术地图);②#5-D/#11-D 查新划界;③A轨 #11 v1.1 修订

## 2026-07-17 (第十次记录: A轨设计深化 + 基础设施,覆盖 07-16 深夜至 07-17)

- **阅读/评估**: SViT+DFIR-DETR+DQ-DETR 深读;FFCA/MDI/SFS 快评;AD-Det(RS 2025,coarse-to-fine SOTA 37.5)深读;HashEye+EFSI-DETR 深度评估;DroneScan 快评;SPA/SPT(ICLR 2026)深度评估;Unmasking the Tiny(IVC 2026)快评并**挂 #5 最近哨点跟踪**;DINOv2/Focal Loss/FcaNet(pre-2025 解锁三篇)
- **产出**: Idea 生成突破分析(三路径元研究)→ #18–#29 十二个新 Idea 录入(#23 SNR退化/#24 信息瓶颈 4.6 并列登顶);**Idea#5 v3.0 代码级设计**(稠密重排推理路径,FLOPs 纸面 −19%);**papers/database.md 论文数据库建立**(46 条七大主题分区);augmentation.md 填充 → KB 12/12 全部完成
- **最大发现**: ①HashEye 证明 GPU 稀疏计算须走"gather→稠密重排→scatter"(v3.0 推理路径定稿);②SPA"浅层不剪"与 #5"专剪浅层"构成正面张力(M0 预实验为裁判);③EFSI"频域启发非变换"(空域代理胜 FFT)修正 #11 判据实现
- **工作流**: 工作项移出 Long-term Tasks;实验类暂缓扩大至 CPU 分析类(用户决策)
- **下一步**: (已被第十一次记录的双轨决策接管)

## 2026-07-16 (第九次记录: 用户提供三篇新论文)

- **论文1**: Xu et al. — "Rethinking Boundary Discontinuity Problem for Oriented Object Detection" (CVPR 2024). ✅ 已写Summary. 旋转框角度边界不连续；核心发现:KLD/GWD/KFIoU并未真正解决边界不连续——根因是编码模式(encoding mode)而非loss形式。ACM-Coder用复指数编码 `e^(jωθ)` 消除断点,AP75提升高达+14.38。**对项目的价值**: 方法论警示——"换了度量≠解决了问题"→对#12(KLD标签分配)的类比:需要验证KLD在标签分配中是否真正解决了小目标尺度相关偏差,而非仅整体数字提升。
- **论文2**: Chen et al. — "Adaptive Label Granularity Selection for Remote Sensing Targets" (IEEE TGRS 2025). ✅ 已写Summary. 遥感多粒度分类(MGC)首次;accuracy-specificity曲线+语义距离约束loss+有序Pareto集推理。SOTA on HRSC/FGSC/FGSRSIS。**对项目的价值**: 概念层面——"自适应粒度选择"在精神上与检测中"自适应选择特征层级/标签分配粒度"相通,但直接技术迁移路径有限(纯分类→检测)。
- **论文3**: GCA2Net — "Global-Consolidation and Angle-Adaptive Network for Oriented Object Detection" (Remote Sensing 2025). ✅ 已写Summary. DRC(动态旋转卷积)+ARU(自适应路由单元)+MOSCAB+AugFPN+。DOTA 77.56%, HRSC 90.4%。**对项目的价值**: ARU的"轻量路由单元→预测参数→条件执行"三段式设计——#5/#11的条件计算路由参考。
- **留存率**: 3/3（用户提供论文全部处理）
- **共同特征**: 三篇全部来自旋转框/遥感方向——两个是旋转框检测、一个是遥感细粒度分类。说明用户在探索遥感+旋转框的交叉地带。
- **关键整合**: 
  - ACM-Coder + #12: "换了度量≠解决根本问题"的方法论警示
  - GCA2Net ARU + MGS: 共同构成#5/#11的工程参照系(MGS=门控训练, ARU=路由设计)
  - ALGS: 概念参考,暂不形成可操作的技术输入
- **下一步**: 等待用户进一步指示

## 2026-07-16 (第八次记录: 跨界搜索——门控/蒸馏方向收获)

- **任务**: 顶刊广泛搜索跨界碰撞，饱和方向(频域/YOLO/DETR)降优先级。7个方向并行搜索。
- **搜索方向与结果**:
  - 动态网络/条件计算 → **命中 MGS**(MLSP 2025): 分组门控+冻结主干→85–95% MLP 稀疏率。#5/#11 的工程实现模板✅
  - 自监督+检测 → DeCon(WACV 2026,+0.37 AP 边际)、DINO Teacher(CVPR 2025,DAOD 已饱和)→ **全部舍弃**
  - 知识蒸馏 → **命中 ELDET**(NeurIPS 2025): 定位/分类噪声记忆时序不对称(epoch 4 vs 11)→ #7 分阶段蒸馏策略✅。CLD-FCOS/CLoCKDistill/MuSCM → 增量改进、DETR专属→ **舍弃**
  - FSOD → FSOD-VFM(ICLR 2026,图扩散免训练,但2.4s/image+无法扩展到P2密集网格)→ **舍弃**。LMP/GiPL/CD-FSOD→ 与#5/#11方向无关→ **舍弃**
  - 小目标非频域 → SPAR-Det(WACV 2026,MoE检测头动态路由,但场景级非空间级;分割依赖);BDNet(CVPR 2026,双骨架仿生,可操作性强但方向不符)→ **全部舍弃**
  - 门控/稀疏计算 → 与动态网络方向重叠,归入MGS
  - NAS/硬件感知 → 未发现高价值2025+检测相关论文
- **留存率**: 7方向搜索 → ~40篇初筛 → 5篇深入评估 → **仅2篇写入系统**(MGS + ELDET)
- **最大发现**: MGS 的分组门控范式是#5/#11 目前最接近的已有工程实现——但需要关键改造:**通道级→空间级**(Linear+Sigmoid→Conv1×1+Sigmoid; 通道分组→空间分块)
- **第二大发现**: ELDET 的早学时序不对称(定位噪声比分类噪声更早被记忆)为 #7 提供了"何时蒸馏什么"的时序维度——当前 #7 的最薄弱环节(蒸馏 schedule 未设计)得到具体解决方案
- **该放弃的已放弃**: SPAR-Det 的 MoE routing 吸引人但场景级粒度不对; FSOD-VFM 的图扩散免训练理念好但计算不可行; BDNet 双骨架仿生有启发但方向不符
- **新Idea**: 暂无全新 idea; MGS→#5/#11 工程实现方案细化; ELDET→#7 训练 schedule 设计
- **最大疑问**: ①MGS 的分组门控在 CNN 卷积层(非 Transformer MLP)上的稀疏模式是否同样有效?②空间级门控的分块粒度(8×8 vs 16×16 vs per-pixel)对精度-效率 trade-off 的影响?③ELDET 的早学拐点在"教师模型定位偏差"(非标注噪声)场景下是否仍然存在?
- **下一步**: ①等待用户提供其在读论文或指示新方向;②若用户无新指令,可深入搜索"spatial gating / spatial sparsity"方向(空间门控是 MGS→#5 改造的核心技术缺口)

## 2026-07-16 (第七次记录: FMC-DETR + 频域浪潮3→4 + YOLOv12/FDConv 快速评估)

- **阅读**: ①FMC-DETR(arXiv 2025.09,频域解耦+KAN+多域协调,VisDrone 33.7 SOTA,✅已写Summary);②FDConv(CVPR 2025,频域动态卷积核,+3.6M参数超ODConv+65M,不做条件计算,✅已确认);③YOLOv12(NeurIPS 2025,注意力中心YOLO,无P2,FlashAttention硬依赖,✅已评估)
- **最大发现**: **频域小目标浪潮从 3 篇确认为 4 篇**(SET+FMC-DETR+DERNet+SFDNet)——FMC-DETR 作为第 4 篇独立工作,再次确认:①频域对小目标确实有效;②**无人做条件计算/稀疏化**。#11 的差异化生命线从"3篇增强都回避"升级为"4篇增强都回避"——差异化论证更充分。
- **第二大发现**: FMC-DETR 的**振幅-相位解耦**极优雅——"振幅=改多少,相位=在哪"。这对 #11 是直接的技术方案输入:#11 可以用振幅(免训练的频域响应强度)替代原始的高频能量作判据。同时 FMC-DETR 的检测层 [D2,D4] 设计在 DETR 侧验证了 SLE(P2头+截短backbone)的架构无关普适性→#6 的学术叙事更强。
- **第三大发现**: FDConv(CVPR 2025)用傅里叶域不相交索引组生成 n=64 个频率多样化权重,仅 +3.6M 参数(+90M CondConv的1/25)。但同样**不做条件计算**——FBM 在所有空间位置预测调制值,无 gating/dropping。再次确认频率域方法的"两条路":绝大多数走特征增强(FDConv/FMC-DETR/SET/DERNet/SFDNet),条件计算路完全空白。
- **YOLOv12 评估结论**:注意力中心YOLO,无P2头,小目标 AP_small=20.2%(N)/39.6%(X);FlashAttention 硬依赖(GPU需Turing+架构)→本机无法复现。不构成基线切换——基线保持 YOLO11。
- **YOLO26 评估结论**:STAL(小目标标签分配)直接竞争 Idea #12;但论文为综述性质,技术细节未公开,暂不能深度评估。待 Ultralytics 公开 STAL 细节后重新评估 #12 的 novelty。
- **新Idea**: #13(振幅门控,#11技术细化);#14(D2=SLE跨架构验证,#6佐证);#15(三源门控融合=振幅×语义熵×高频能量,#5+#11 长期融合方案)
- **放弃的Idea**: 暂无
- **最大疑问**: ①FMC-DETR 的振幅调制若改成空间选择性(只在判据认为"值得"的位置做FFT),能加速多少?②三源门控(振幅/语义熵/高频异常度)的错误模式是否真的互补(高度相关→融合无增益)?③YOLO26的STAL到底是怎么做的——等公开细节后需紧急评估对#12 novelty 的影响
- **下一步**: ①若用户无新指令,继续检索 2025+ 小目标/轻量化/注意力机制论文;②FDConv 快速 Summary(虽不做条件计算,但频率域方法参考价值高);③持续关注 YOLO26 STAL 细节公开

## 2026-07-16(第六次记录:频域小目标浪潮 + YOLO 决策再确认)
- **阅读**: ①TinyFormer(arXiv 2026.05,YOLO-DETR混合,PBM+SSA);②DERNet(arXiv 2026.06,频域全管线,1/6参数超YOLOv11);③SET(CVPR 2025,频域归因→抑制噪声而非增强信号);④D3Q(IEEE JSTARS 2025,DETR动态查询,AI-TOD 32.1 SOTA);⑤SFDNet(ECCV 2026,频谱解耦分治+原型蒸馏,AI-TOD 31.7)
- **DQ-DETR 年份修正**:检索发现 DQ-DETR 实际为 ECCV 2024(非 AAAI 2025),已标注"待用户提供";其 2025 升级版 D3Q 替代验证任务
- **最大发现**: **频域小目标检测已成 2025–2026 独立子方向**——SET/DERNet/SFDNet 三篇独立工作同时瞄准"频域+小目标",彼此无相互引用(投稿时间线重叠),方向处于早期上升期。三篇**全部做频域→特征增强,无人做频域→条件计算/稀疏化**——这恰恰是 #11 的差异化生命线
- **第二大发现**: TinyFormer 的 PBM(并行双向融合)是 P2 头的替代方案——"通过跨层捷径保留空间细节"vs"加 P2 头+稀疏化",形成"稠密传递 vs 选择性传递"的路线竞争。PBM 和 #5 是互补而非互斥:PBM 解决"如何传",#5 解决"传什么"
- **第三大发现**: SET 的"移除高频→帮助极小目标(+15%)"是对 #11 的根本性质疑——小目标天然偏低频(被背景高频噪声淹没),用"绝对高频能量"作判据反而可能误杀。修正方案:**高频能量局部异常度**(小目标高频点状孤立 vs 背景高频规则分布)
- **"坚持 YOLO"决策再次确认(第三次验证)**:D3Q(DETR 系小目标最佳)VisDrone 36.7 未显著超越 YOLO 系,且 49M/543G vs YOLO11n 2.6M/6.3G——轻量/边缘部署场景 YOLO 不可替代。三次独立验证(SEEN-DA/SEMA-YOLO→RT-DETR 落后→D3Q 无压倒优势)构成完整证据链
- **#11 Novelty 上调**:★★★☆☆→★★★★☆。频域+检测虽热,但"频域引导条件计算"完全空白——需要在 DERNet/SET/SFDNet 大规模引用前投稿以利用当前清晰划界
- **新Idea**: 暂无全新 idea;#5 新增 PBM 竞争论述;#6 Neck 选型扩展(PAN vs PBM vs AFPN vs ASFF);#11 修正判据形式(绝对高频能量→局部异常度)+三篇频域竞争者的 Related Work 划界策略
- **放弃的Idea**: 暂无
- **最大疑问**: ①PBM 在纯 CNN backbone 上是否有效?(原论文用 ViT);②PBM + 显式 P2 头的叠加收益 vs 功能重叠?③三频解耦(SFDNet)vs 小波(DERNet)vs FFT(SET)在"前景/背景判别"任务上的 head-to-head 对比——哪种频域表示对 #11 最有效?
- **最大预警**: 频域小目标方向的 novelty 窗口正在收窄——三篇独立工作出现在同一时间窗口,说明这是"众望所归"的方向,需要在 2026 年内完成投稿以保持 novelty 优势
- **下一步**: ①继续 2025+ 文献检索(频域方向确认无遗漏;小目标检测新作);②整理频域三篇的对比分析(哪个频域工具最适合 #11);③等待用户提供 2025 前论文或指示下一步行动

## 2026-07-15(第五次记录:Token Cropr 划界)
- **阅读**: Token Cropr(CVPR 2025,#5 查新最近邻精读;注:WebFetch 临时受阻,经检索通道完成技术细节提取)
- **最大发现**: **#5 的误剪兜底方案确定 = LLF 式末端复活**——Token Cropr 的 LLF(被剪 token 最后一 block 前按原位重插,零参数)在 ADE20k 上几乎无损(56.6 vs 56.7);移植到 #5:被稀疏跳过的 P2 位置在检测头前用 P3 上采样填充+1×1 conv 复活。同时"单 query 打分器支撑 97% 剪枝且胜 MHA"证明简单判据够用——熵图(零参数)作判据在复杂度上完全站得住
- **划界定稿(#5 Related Work)**: 与 Token Cropr 四重区别——ViT token vs CNN 多尺度特征图 / 可学习 router vs 免训练熵先验 / backbone 内 vs P2 分支 / 1536² 非实时未验证小目标 vs VisDrone 实时小目标
- **新Idea**: 暂无新增(方法设计素材+2:LLF 兜底、辅助头+stop-gradient 范式)
- **放弃的Idea**: 暂无
- **最大疑问**: LLF 依赖 ViT 末端全局 attention,CNN 检测器上"末端复活"的最优形式待预实验验证(上采样填充 vs 零填充 vs 可学习插值)
- **下一步**: ①DQ-DETR(AAAI 2025,验证"坚持 YOLO"决策);②检索 2025–2026 小目标/频域新作;③2025 前论文(SViT/FcaNet 等)等用户提供

## 2026-07-15(第四次记录:YOLOE + 基座定论)
- **新约束**: 用户规定自动抓取仅限 2025 年及以后论文;2025 前(SViT/FcaNet/FFCA-YOLO/DINO 系等)标注"待用户提供"
- **阅读**: YOLOE(arXiv 2025,THU——删跨模态融合改 RepRTA 重参数化对齐;SAVPE 视觉 prompt;LRPC 检索式 prompt-free)
- **最大发现**: **#5/#7 基座定论 = YOLOE**。四个理由:推理结构=纯 YOLO(改造无纠缠)、预训练 8×4090×12h 可复现、RepRTA 与离线熵图哲学同构、零 shot APr 33.2 最强。同时 LRPC 的 δ=0.001 无损滤 80% anchor 证明**背景/前景语义分数高度可分**——熵判据假设的最强间接证据
- **新Research Gap 佐证**: YOLOE 仍无 P2、仍不报 AP_s(OVD 线与小目标线依旧未交汇);LRPC 把"语义分数过滤"做到 head 级但 backbone/neck 稠密计算没省——特征级稀疏化空白再次确认
- **新Idea**: 暂无新增;#5 查新边界新增第五条最近邻(LRPC,head 级 vs 特征级划界);#6 新增免费改进项(从 YOLOE 权重初始化,YOLOE 数据显示省 4× epoch 还涨点)
- **放弃的Idea**: 暂无
- **最大疑问**: YOLOE 物体嵌入(MobileCLIP)在 VisDrone 俯视小目标上的熵分布如何?——原"CLIP 对齐验证"任务载体更新为 YOLOE 发布权重,零训练即可做,数据集就绪后最先执行
- **最大风险**: 不变(稀疏计算工程实现);新增缓解:LRPC 证明逐点语义过滤在 YOLO 上工程可行且无损
- **下一步**: ①继续抓 2025+ 论文:Token Cropr(CVPR 2025)、DQ-DETR(AAAI 2025)、2025 小目标/频域新作检索;②SViT/FcaNet 等 2025 前论文等用户提供;③实验类任务保持暂缓

## 2026-07-15(第三次记录:实验暂缓 + RFLA/YOLO-World)
- **系统模式变更**: 用户决策——VisDrone/GPU 暂不提供,实验类任务(预实验/#6复现)全部暂缓;文献任务获授权转 **arXiv 自动抓取模式**(不再等投喂 PDF)
- **阅读**: ①RFLA(ECCV 2022,高斯 ERF 先验+KLD 尺度不变度量+HLA 分层分配);②YOLO-World(CVPR 2024,RepVL-PAN+离线词表重参数化,开集 YOLO 实时化)
- **最大发现**: 两篇分别夯实了 #12 和 #5——RFLA 用 VisDrone AP_vt 0.1→4.8 证明高斯化分配对极小目标质变;YOLO-World 在结构层面确认 #5 的 Gap(文本只进 P3–P5、无 P2、backbone 无语义),且其"离线词表重参数化"直接解决 #5 的实时性问题(熵图判据可完全离线预计算)
- **新Research Gap**: 开集检测(OVD)线与小目标线从未交汇——OVD 全线无 P2、不报 AP_s;P2 下探必遇算力爆炸,必配稀疏化,#5 恰在两线交点
- **新Idea**: 暂无新增(本轮为已有 idea 补前置文献);#12 实验设计就绪(三方对照 {TAL, box-box KLD, ERF-box KLD})
- **放弃的Idea**: 暂无
- **最大疑问**: RFLA 一阶段收益骤降(两阶段 +10 vs 一阶段 +0.4~0.9)的根因——若是"缺多阶段回归精化",则 #12 在 YOLO11 上收益可能 <1 AP;止损线已设(<0.5 AP 放弃)
- **最大风险**: (更新)#5 新增警示——VisDrone 仅 10 类属文本贫瘠场景(YOLO-World 消融:文本越贫瘠跨模态收益越小),#5 的叙事必须押"熵做稀疏化判据省算力"而非"跨模态融合涨点";文本编码器必须冻结
- **下一步**: ①读 YOLOE(确认其是否已解决无 P2/小目标问题,#5 基座二选一);②读 SViT(误剪兜底机制细节);③读 FcaNet/FreqFusion(#11 特征级频域支撑)

## 2026-07-15(第二次记录:SFIDM + 查新)
- **阅读**: SFIDM(Remote Sens. 2025,空频交互+KLD分布匹配,遥感FSOD)
- **查新完成**: Idea #5 novelty 确认成立(最近邻:ViCrop-Det/SViT/Token Cropr/BiSD-YOLO/PEEK,均不覆盖,详见 research_gap.md);ViCrop-Det 的熵引导使 VisDrone APS +3.8~4.8,为熵-小目标关联提供旁证
- **最大发现**: SFIDM 的高频能量分量是**第二种免训练前景判据**(零 VLM、零训练、一次 FFT)——直接回应了上次日志的"最大风险"(CLIP 对无人机视角对齐失效):#11 高频判据成为 #5 的天然备胎,且两者可在同一预实验中对比甚至融合(语义确认"是什么"+高频确认"在哪里")
- **新Research Gap**: 频域信息只在图像级粗糙使用(整图DFT切两半+三路CNN冗余提取),特征级/多尺度频域分解与"高频作先验(而非再学一遍)"均空白
- **新Idea**: #11 高频能量引导 P2 稀疏化(Overall 3.4,Rank 4)、#12 KLD 分布匹配迁移 P2 头(#6 增强件)
- **放弃的Idea**: 暂无
- **最大疑问**: 高频能量与语义熵在 VisDrone 上与 GT 小目标的重合率谁更高?城市背景的建筑边缘高频噪声会不会让 #11 误保留大量背景?——预实验一次回答 #5/#11 两个 idea
- **最大风险**: (更新)原"CLIP 对齐失效"风险已有 #11 对冲;当前最大风险转为稀疏计算的工程实现(稠密检测头上的条件计算,SViT 的 token 再激活可借鉴作误剪兜底)
- **下一步**: ①熵图+高频能量图 vs GT 重合率预实验(合并设计);②VisDrone+YOLO11n 环境搭建与 SLE 复现(#6,同批加 #12);③读 RFLA(#12 前置)

## 2026-07-15 (第一次记录: 初期文献调研 + Idea 孵化)
- **阅读**: ①SEEN-DA(CVPR 2025,语义熵引导域感知注意力,DAOD);②SEMA-YOLO(Remote Sens. 2025,SLE+GCP-ASFF+RFA-C3k2,遥感小目标)
- **最大发现**: 两篇论文的最大短板互为解药——SEMA 的 P2 头算力翻倍(大量花在背景),SEEN-DA 的语义熵恰是免训练的背景/冗余判别器。交叉点"熵引导的浅层特征稀疏化"无人做过,同时命中本项目 Current Problems #1(小目标精度)和 #2(计算成本)。
- **新Research Gap**: ①语义信息从未进入实时检测器(YOLO)的特征提取/融合阶段;②P2 头的稀疏化/条件计算空白;③遥感小目标论文评估协议混乱(AI-TOD 被随意重划分)。
- **新Idea**: #5 熵引导 P2 稀疏化(Overall 4.0,Rank 1)、#6 SLE 迁移 VisDrone、#7 熵图引导蒸馏、#8 尺度感知语义熵、#9 GCP-ASFF vs AFPN 对照、#10 RFA-ASFF 协同分析
- **放弃的Idea**: 暂无正式放弃;旧 Idea#1(Replace PAN with AFPN)降级为 #9 对照实验的一部分——理由:无对照依据的模块替换是盲动。
- **最大疑问**: 语义熵与目标尺度的相关性——小目标特征弱→相似度分布均匀→天然高熵,若成立则 #5 的阈值策略必须尺度自适应,否则会误删小目标(这正是要保护的对象)。此问题决定 #5 生死,需最先用预实验回答。
- **最大风险**: CLIP/RegionCLIP 文本嵌入对无人机俯视视角(VisDrone)的对齐质量未知,#5/#7/#8 三个 idea 都压在这个假设上;若失效则全部转向免 VLM 的类别原型熵方案。
- **下一步**: ①VisDrone+YOLO11n 环境搭建与 SLE 复现(#6);②熵-尺度相关性预实验;③token pruning/熵稀疏化查新。

## YYYY-MM-DD(模板)
- **阅读**: 哪些论文？
- **最大发现**: 
- **新Research Gap**: 
- **新Idea**: 
- **放弃的Idea**（及原因）: 
- **最大疑问**: 
- **下一步**: 

## 2026-07-18 DALA 深读: 密度感知标签分配

- **阅读**: DALA (Liu et al., ESWA 2026) — 密度感知自适应标签分配
- **最大发现**: 
  1. DALA 是**首个将密度显式建模进标签分配**的工作，打破"统一标签分配策略"假设。核心理念: 密集目标用 O2O (每 GT 1 正样本→避免重复预测)，稀疏目标用 Decreasing LA (训练早期 K_max 正样本→逐步衰减至 1)。
  2. **密度(空间域)与熵/频域(语义域)是同一问题的两个正交视角**——两者都试图回答"哪些位置检测更难"，但分别从空间分布和语义不确定性/频谱特征出发。两者的交叉区域(空间密集+语义高熵)是最需要 O2O + 保留计算的双重处理区。
  3. DALA 的"从多到少动态过渡"范式与 #5/#11 的"从稠密到稀疏条件计算"共享哲学——**标签分配(训练信号分布)和特征计算(推理算力分布)是条件计算的两个独立维度**，两者协同无人触及。
  4. DALA 密度定义是纯空间域(GT 邻域距离)，频域判据(高频能量/频谱差异)作为语义密度的正交信息源完全未被探索。

- **新Research Gap**: 
  1. **密度感知 LA + 频域判据的组合空白**(双轨共享): DALA 的空间密度 + #11/#30 的频域判据→联合区分"空间密集但语义可分"vs"空间密集且语义混淆"→精确 O2O 目标选择
  2. **标签分配条件计算 × 特征条件计算的协同框架空白**(跨维度): 密度×熵/频域联合判据同时决定正样本数和 token 计算量——全新理论方向
  3. **DALA 的 DETR 移植空白**: 密度分类引导 query 配额自适应(密集 GT→1 query，稀疏 GT→K_max→1 query)——二分匹配下的密度感知分配
  4. **DALA 密度分类→替代 Dome-DETR DeFE GT 密度监督**: DALA 仅需 GT 框信息(无需高斯密度图+DRFL 损失)→低成本的 B 轨密度先验

- **新Idea**: #31 ⬜ 密度×频域联合判据→双维条件计算 (A轨: 密度+高频→O2O+高稀疏率)、#32 🟪 密度引导 DETR query 配额自适应 (B轨: DALA→二分匹配层移植+DeFE 低成本替代)

- **放弃的Idea**: 暂无

- **最大疑问**: 
  1. DALA 的密度分类在 VisDrone 上的 dual-gain (sparse→正样本增多、dense→去重)占比各多少？两者谁是大头？无法从现有信息确认
  2. 空间密度与语义熵/高频能量的相关性在 VisDrone 上究竟如何？高密度一定高熵/低频吗？反例(密集但特征清晰)占比多大？

- **下一步**: 
  1. 获取 DALA 全文(通过西安交大机构订阅)→补充精确密度公式和量化性能数据
  2. 将 #31/#32 录入 idea pipeline(innovation_ranking + candidate.md)
  3. 继续按 P0 优先级深读列表推进(目标: 本日完成 3 篇 P0/P1 深读)

---

## 2026-07-18 (第二十三次记录: 📋 策略修订 — DETR 降级为交叉融合副线)

- **触发**: 用户指令——"改变一下策略，DETR仅做为交叉融合的副研究方向，主要还是以YOLO进行研究"
- **决策**: 推翻同日早些时候的「DETR 轨道强化」计划（DX1-DX5），DETR 降级为 YOLO 交叉融合灵感源
- **理由梳理**:
  1. DETR 五大专属机制（Query/Cross-Attention/Bipartite Matching/Encoder-Decoder非对称/Token序列）在 YOLO CNN 架构中无直接对应——纯 DETR 创新无法服务 YOLO 主线
  2. YOLO 积累最深（15 Idea + 4 设计文档 + 三维度扩展），分散精力得不偿失
  3. 但判据层（频域先验/密度感知/遮挡建模）和概念层（条件计算/自适应分配/合并>丢弃）是架构无关的——这些是 DETR 阅读的剩余价值
- **具体调整**:
  - DETR 独立研究（DX1-DX5）全部停止
  - DETR P1 深读 5 篇（Adaptive Query Allocation/Pe-DETR/SCOPE-DETR/RS-DETR/Hausdorff）取消
  - #32（密度引导 DETR query 配额）因纯 DETR 机制存档💤
  - DETR 论文阅读新原则：「YOLO 迁移过滤器」——每篇 DETR 论文必须回答"这对 YOLO 有什么用？"
  - #30 v1.1 修订降为低优先级文档维护
- **资源重分配**: DETR 从 30%（强化版）→ 5%（交叉融合副线）；YOLO 主线合计 ~80%
- **预期产出调整**: Idea 总数 45-55 → 35-45；产出重心从 DETR 独立创新 → YOLO 密集遮挡/旋转/尺度三维度
- **已修改文件**: research_strategy.md（战略定位 + DETR 交叉融合章节重写）+ innovation_ranking.md（🧭分类 + #32💤）+ TASKS.md（B轨精简 + DX1-DX5 取消）+ README.md（基线/维度/Pipeline/更新记录）
- **下一步**: 密集遮挡 L1.5 P1 深读继续（DOMino-YOLO/DRONet/HEdge-MamYOLO/NWD-Soft-NMS/GCS-DETR——5 篇 YOLO 密集遮挡论文）

## 2026-07-18 (第二十五次记录: 密集遮挡 L2 经典补读3篇 🔬 + 三条经典路线奠基)

- **触发**: 密集遮挡 L1.5 P1 深读完成后的下一步——L2 经典补读（pre-2025 基础方法）
- **阅读方式**: 多源重建深读（CVF Open Access 403/arXiv仅摘要→中文技术博客+多搜索引擎交叉验证，技术细节已充分获取）
- **核心发现**:
  - **三条经典路线奠基**: ①NMS 演进线: Soft-NMS(ICCV 2017, IoU衰减)→NWD-Soft-NMS(MFF-YOLO 2025)→密度自适应σ/频谱感知(空白); ②遮挡损失线: RepLoss(CVPR 2018, L_Attr+L_RepGT+L_RepBox)→OAR-Loss(DOMino-YOLO 2025)→频域自适应RepLoss(#35); ③集合预测线: CrowdDet(CVPR 2020, EMD K=2+Set NMS)→YOLO grid-cell适配(空白)→EMD+RepLoss联合(空白)
  - **IoG vs IoU 设计洞察**: RepLoss 的 IoG(Intersection over GT)避 cheat gradient——分母固定GT面积，真正迫使减少重叠。这一原则可推广到任何 overlap-based 损失
  - **训练期解决NMS问题**: RepBox 在训练期提前优化预测框分布降低NMS误杀 + Soft-NMS 在推理期缓和NMS硬清零——双阶段NMS优化的典范
  - **局部集合预测 vs 全局集合预测**: CrowdDet(proposal级EMD)↔ DETR(图像级Hungarian)——局部集合的YOLO grid-cell适配是未被探索的中间地带
  - **NMS 的「内容感知」空白**: 所有NMS变体仅用box坐标判断冗余→框内频谱/纹理内容相似度可区分"同实例多预测"vs"不同实例重叠"→频谱感知Soft-NMS全新方向
- **产出**:
  - 3篇深度 Summary: `RepulsionLoss_CVPR2018.md` / `CrowdDet_CVPR2020.md` / `Soft-NMS_ICCV2017.md`
  - Knowledge Base loss.md 追加3条目(#15 RepLoss / #16 EMD Loss / #17 Soft-NMS Classic)
  - database.md 密集遮挡分区追加3行(🔬48 + 密集遮挡13 + pre-2025 15)
  - compare.md 结论32(三条经典路线奠基+交汇分析) / timeline.md 遮挡线3篇状态更新(⏳→✅已读) / research_gap.md 3×5=15条新Gap追问
  - 新Idea 3个: #37 YOLO Grid-Cell EMD(3.7) / #38 频谱感知Soft-NMS(3.8) / #39 EMD+RepLoss联合训练(3.5)
  - 密集遮挡 L2 经典补读全部完成 ✅
- **关键洞察**:
  - **三条路线从未在同一检测器上联合使用**: Soft-NMS(后处理) + RepLoss(训练期回归) + EMD Loss(训练期匹配)构成密集遮挡的"后处理→回归→匹配"完整覆盖——频域判据(#11/#35)可作为三条线的共享上游先验
  - **YOLO 一阶段适配是三条路线共同的迁移空白**: RepLoss 原为两阶段/EMD Loss 原为proposal-based/Soft-NMS 虽通用但NWD改进仅在YOLOv8验证→#6 baseline可一次性集成三者
  - **经典方法的核心思想被现代社区低估**: RepLoss的"训练期排斥=NMS问题前置"和CrowdDet的"局部集合预测"在DETR/Hungarian匹配的范式转移中被忽视，但与频域判据结合后可能复现新生命力
- **下一步**: 密集遮挡 L3 知识提取（loss.md遮挡专项/head.md密集检测头/NMS演进线）→ K1 Gap分析 → I1 Idea生成

## 2026-07-18 (第二十六次记录: 密集遮挡 L3 知识提取 ✅ + 11篇论文知识体系闭环)

- **触发**: L2 经典补读完成后——将 11 篇密集遮挡论文的知识系统化为结构化 KB 体系
- **工作方式**: 知识合成（非新论文阅读）——对已有 11 篇论文的全部产出进行 taxonomy 级重组
- **核心产出**:
  - **loss.md 遮挡感知损失函数体系**: 七大类 taxonomy（回归排斥/显式遮挡图/组合式/集合匹配/定位度量/后处理NMS/频域遮挡先验）+ 范式演化图谱(2017→Future) + 三大关键洞察
  - **head.md 密集遮挡检测头设计**: 五大类 taxonomy（通道抑制/空间保留/多实例预测/遮挡注入/未来方向）+ 五维设计原则对比表 + 与项目检测头路线整合方案
  - **NMS 演进线**: 完整演化图谱(传统NMS→Soft-NMS→Adaptive NMS→NWD-Soft-NMS→#38频谱感知) + Set NMS分支 + DETR NMS-Free分支 + 技术维度对比表
  - **compare.md 结论33**: 11篇论文知识全景 + 三条路线交汇分析 + 频域判据复用价值
- **关键整合**:
  - **遮挡先验来源演化**: 人工标注(2018)→自动GT(2025)→物理先验(#35 频域)→内容先验(#38 频谱)
  - **三阶段覆盖但从未联合**: 训练期回归(RepLoss) + 训练期匹配(EMD) + 推理期后处理(Soft-NMS) = 完整管线——但三者从未在同一检测器上使用
  - **频域判据复用**: 同一高频异常度图→#11 P2门控+#35 RepLoss权重+#38 Soft-NMS内容判据 = 一次计算三次收益
  - **检测头双维门控**: CSIM-Head(通道维)×#5(空间维) = 双维联合稀疏化——尚未被探索
  - **NWD度量共识量化**: 密集遮挡文献中NWD使用率3/11深度阅读
- **11篇论文知识全景图**: L1检索10篇(入口) → L1.5 P0 3篇(DALA+OPL+FAFL) → L1.5 P1 5篇(DOMino-YOLO+DRONet+HEdge-MamYOLO+MFF-YOLO+GCS-DETR) → L2经典3篇(RepLoss+CrowdDet+Soft-NMS) → 覆盖七大维度(损失/NMS/检测头/标签分配/backbone/neck/频域)
- **密集遮挡方向知识基础设施**: ✅ 就绪。损失/NMS/检测头/标签分配四大专项体系全部建立。
- **下一步**: 密集遮挡 K1 Gap 分析（密集场景下标签分配/NMS敏感性/遮挡特征恢复/DETR query冲突——系统分析）→ I1 Idea 生成

## 2026-07-18 (第二十七次记录: 📋 数据库质量筛选 —— 移除5篇低质量纯arXiv论文)

- **触发**: 用户指令——筛选数据库，从arXiv抓取的论文仅保留满足四条标准者(①有"To Appear"标注/venue ②高引用高关注 ③知名作者机构 ④有GitHub代码)
- **审核范围**: 全库82篇中18篇纯arXiv（无顶会/期刊接收）论文
- **审核结果**: 保留13篇 / 移除5篇
- **移除清单**:
  - ❌ **PST** (arXiv 2025.05): 超1年无venue；coarse-to-fine Top-K为2023旧思路；与项目关联弱
  - ❌ **HI-MoE** (arXiv 2026.04 preliminary): 自认preliminary draft；条件计算在专家维与#30正交；无代码无venue
  - ❌ **DroneScan-YOLO** (arXiv 2026.04): 仅快评未深读；P2基线参考可被替代；无代码无venue
  - ❌ **DisDop** (arXiv 2026.05): 仅快评未深读；蒸馏参考可被替代；无代码无venue
  - ❌ **RFAssigner** (arXiv 2026): 无详情无代码无venue；通用标签分配陈述无法验证
- **保留的13篇纯arXiv论文**(均深度集成知识库或满足机构/影响标准): YOLOE(广泛引用+代码) / PRNet(VisDrone最高分) / CLIP-Bias(#5风险关键) / DERNet(#11最强竞争) / FMC-DETR(频域线关键) / D³R-DETR(Gabor工具#16) / DFIR-DETR(#20工程雏形) / EFSI-DETR(频域启发非变换关键洞察) / TinyFormer(#5竞争论述) / ViCrop-Det(熵范式#5) / YOLO26 STAL(#6 baseline必需) / MOCHA(Samsung机构背书) / Dome-DETR(已有ACM MM 2025 venue→不再算纯arXiv)
- **影响评估**: 5篇均为⚡快评，移除不影响知识库/Idea链/timeline核心叙事。数据库 82→77 条，快评 31→26。
- **产出**: database.md 行删除 + 统计更新 + 页眉更新 / README 续十 + 计数 55→50 / journal #27
- **教训**: 未来arXiv抓取应立即评估四条标准，不满足者不入库（可保留summary文件但不进database索引）。
