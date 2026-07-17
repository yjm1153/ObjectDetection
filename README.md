# Object Detection Research Project v2.0 — 创新发现阶段

## Project Info
- **方向**：Object Detection（YOLO Series | RT-DETR | Transformer Detector | Small/Tiny Object Detection | Remote Sensing | Lightweight | Real-time | Knowledge Distillation | Model Compression）
- **基线**：🟦 A轨 YOLO11 + Ultralytics(主战场)| 🟪 B轨 DETR(选型中: RT-DETR / D-FINE 系)——2026-07-17 用户决策双轨并行
- **数据集**：VisDrone（主）| COCO | DOTA | UAVDT | VOC

## Current Status
- **阶段**：`文献调研 → 方向设计`（进度：🟩 47篇已读；🟨 **双轨设计文档栈闭环**:🟦A轨 #5 v3.0+#11 v1.1 + 🟪B轨 #30 v1.0;实验类任务 ⏸ 暂缓——2026-07-15 用户决策：数据集/GPU 暂不提供）
- **文献模式**：arXiv 公开渠道自动抓取（**以 2025+ 论文为主**；pre-2025 关键基础方法已解锁——2026-07-16 用户授权）
- **目标**：文献调研 → 知识库构建 → 研究缺口发现 → Idea 提出与评估 → 方向设计
- **本轮更新(2026-07-16 下午)**：+6篇(ViCrop-Det/D³R-DETR/DM-EFS/O²/MOCHA/CLIP-Bias)；累计26篇；顶会顶刊2025-2026系统检索
- **本轮更新(2026-07-16 晚间)**：Week 2 设计阶段启动；产出 risk_assessment + Idea#5 v2.0 + 频域交叉分析 + Idea#7 技术基线；进入方向设计阶段
- **本轮更新(2026-07-16 深夜)**：Idea 生成突破分析（三路径元研究）✅；pre-2025 限制解除 → 路径三 P0/P1 论文抓取（DINOv2+Focal Loss+FcaNet）✅；Idea #18–#21 评分定档；#20 Focal Computation(4.2) 登顶
- **本轮更新(2026-07-16 深夜续)**：Literature Tasks 第二轮：SViT+DFIR-DETR+DQ-DETR 深度阅读 ✅；FFCA-YOLO+MDI-YOLO+SFS-DETR 快速评估 ✅；累计 **34 篇**，候选 Idea **22 个**; #22 多阶段P2门控(SViT×#5)新增
- **本轮更新(2026-07-16 深夜续二)**：路径一+路径二 7个高分Idea 正式录入(#23–#29)；Idea 总数 22→**25**；#23 SNR退化(4.6)+#24 信息瓶颈(4.6)并列登顶
- **本轮更新(2026-07-16 深夜续四)**：工作流整理(工作项移出 Long-term Tasks)；实验类暂缓范围扩大至 CPU 分析类(用户决策)；深度阅读 AD-Det(RS 2025, VisDrone 37.5 coarse-to-fine SOTA)；**augmentation.md 首次填充→Knowledge Base 12/12 全部完成**；累计 **35 篇**
- **本轮更新(2026-07-17)**：**Idea#5 v3.0 代码级设计 ✅** → `Ideas/idea_005_v3_design.md`；v2.0 五个开放问题落地(P3 cls logits 复用/Gumbel门控/SViT保留+LLF兜底/自适应稀疏度)；ultralytics 集成点+FLOPs 纸面预算(约−19%, +0.033M 参数)；验证点全部⏸待实验模块
- **本轮更新(2026-07-17 续)**：轻量化首轮——HashEye(输入级LSH剪枝, Jetson 5.25×)+EFSI-DETR(伪频域, VisDrone APs 24.8/188FPS)深度评估+DroneScan快评;⚠️ v3.0 推理路径定稿稠密重排(HashEye印证);#11 判据三选项对照(EFSI空域代理胜FFT);累计 **38 篇**
- **本轮更新(2026-07-17 续二)**：注意力首轮——SPA/SPT(ICLR 2026, GT监督门控+packing, 训练期也省算力)深度评估;⚠️ **Unmasking the Tiny(IVC 2026)判定为 #5 查新最近哨点**(三轴划开:召回vs算力/头级vs特征级/自身分数vsVLM熵, 挂跟踪);"浅层不剪 vs 专剪浅层"张力浮出(M0 为裁判);Literature Tasks 全类目启动;累计 **42 篇**
- **本轮更新(2026-07-17 续三)**：**论文数据库建立 ✅** → `papers/database.md`(46 条,七大主题分区×关联Idea×类型标记,含统计速览与维护规则);High Priority 长期未启动项清零
- **本轮更新(2026-07-17 续四)**：**研究战略升级:YOLO + DETR 双轨并行 ✅(用户决策)**——TASKS 重组为 🟦A轨YOLO/🟪B轨DETR 两大方向任务区;25个 Idea 完成架构分类(🟦15 / 🟪1+2衍生 / ⬜10 通用理论);#14 升级为 B轨入口;新增 #5-D/#11-D 衍生候选(待查新);RT-DETR 基础线解锁补读;决策记入 decision_history
- **本轮更新(2026-07-17 续五)**：**🟪 B轨首轮:RT-DETR(CVPR 2024)+ D-FINE(ICLR 2025)对照深读 ✅**——B轨基线纸面初判 **D-FINE**(54.0@31M/91G,O365后APs 40.0;RT-DETR 官方自认小目标短板→B轨改进空间有原作者背书);#5-D 落点确认=query selection 第三判据(cls/loc/熵,须与头级top-K划界);#7 迁B轨须与 GO-LSD 划界;database.md 新增「实时DETR基座」分区;累计 **44 篇**
- **本轮更新(2026-07-17 续六)**：**🟪 B轨基础线闭环:Deformable DETR(ICLR 2021)+ DINO(ICLR 2023)补读 ✅(3/3)**——MSDeformAttn=全家底座算子(K点稀疏采样,two-stage=QS诞生地);DINO 三技术(CDN/混合QS/LFT)小目标增益全尺度最大(APs +7.2);**QS判据三代演进链闭环**(纯top-K→混合→不确定性最小→#5-D谱系落点);#26 获层数网格消融/#24 获encoder冗余定量证据;划界警示:B轨Idea须落「query/token预算自适应分配」勿撞底座概念;累计 **46 篇**;下一优先:DETR方向知识小结
- **本轮更新(2026-07-17 续七)**：**研究面板修缮 + 🟪 B轨技术地图 ✅**——journal.md 补齐第十/十一次记录;README 阶段/Roadmap/Next Steps 刷新至双轨态;dashboard venue 识别扩充+KB 视图新增 🟪 卡片;**DETR 方向知识小结** → `Knowledge Base/detr_map.md`(14 篇整合:query 机制四代演进/小目标适配/实时化三主线 × Idea 挂点 × 概念红线);B轨下一优先:#5-D/#11-D 查新划界
- **本轮更新(2026-07-17 续八)**：**🟪 B轨衍生查新裁决 ✅——#5-D ❌ / #11-D→#30 占编号**——致命竞品 **Dome-DETR**(arXiv 2505.05741)深读入库(D-FINE底座+密度头→MWAS浅层token稀疏+PAQI自适应query,VisDrone 39.0/AI-TOD 34.6双SOTA)→ #5-D 被结构性占据不占编号(熵判据遗产并入#19);**#30 免监督频谱判据→DETR浅层token条件计算**(3.9)成为 B轨主 Idea(频域DETR竞品6+篇全是增强范式,条件计算空白确认;Dome三攻击面=对照叙事);「全线无P2」结论失效→#14 降级;裁决文档 `Ideas/detr_derivative_novelty_check.md`;Idea 总数 **26**;累计 **47 篇**
- **本轮更新(2026-07-17 续九)**：**🟪 #30 技术方案 v1.0 ✅** → `Ideas/idea_030_technical_proposal_v1.md`——判据三选项定型(**S1 空域高通代理首选**,EFSI 硬消融 33.1>FFT 32.3;叙事抽象为"高频响应统计判据·实现无关")× D-FINE 三接入点(判据与 DeFE 同位/MWAS 结构沿用引用=控制变量/query 预算**无NMS**保端到端)× Dome 三攻击面→三卖点对照叙事 × 实验协议 E0–E6 锁定(**E1 判据 vs DeFE 头对头=生死项**;E3 免训练判据 AUROC=实验模块最低成本首验);定位诚实声明:不许诺净省算力(Dome +37% 教训)
- **本轮更新(2026-07-17 续十)**：**🟦 A轨双文档修订 ✅——#11 v1.1 + #5 v3.0 Dome 划界段**——#11 频域交叉分析 v1.1(工具首选 FFT→S1 空域高通代理;**判据族权威定义收敛至 #30 §2**,双轨"同判据跨架构"文档闭环;新增消融 F-impl;SPA 记录为可学习选项)+ #5 v3.0 §十(四轴划界:CNN卷积 vs token/零参熵 vs 0.8M DeFE/不确定性 vs 密度=正交/净减法 vs 控增量;英文 RW 草案=先手引用消毒完成)。**双轨设计文档栈全部闭环**,余下依赖实验模块或新文献
- **本轮更新(2026-07-17 续十一)**：**文献检索轮 ✅——HF-DETR 撞车监控入库 + 双轨 gap 再确认**——新命中 **HF-DETR(IEEE SPL 2026)**:LoG stem+小波重建+**SSMG saliency token 门控**(VisDrone AP+4.3/121FPS)=「高频+token稀疏+VisDrone+实时」四要素齐聚,#30 组合空间最近邻居 → 快评入库+🔔挂跟踪(SSMG 判据性质待全文核实;判定大概率可学习微门→与 #30 免监督判据可划界;LoG=S1 工具又一佐证)+#30 §6 风险 5;UFO-DETR 补全数字维持不威胁;YOLO P2 侧 2026 批量新作全部"加P2头"路线→**#5 gap 再确认**(Edge-Constrained "P2 alone +31% AP_small"=新 motivation 数据点);数据库 **50 条**/🔔×2

## Research Progress
| 指标 | 数量 |
|------|------|
| 已读论文 | 48 |
| 已总结论文 | 35 |
| 已对比论文 | 34 |
| SOTA 最近更新 | 是（2026-07-17）|

## Knowledge Base Status
| Backbone | Neck | Head | Loss | Attention | Training | Augmentation | Dataset | Timeline | Compare | Research Gap | Future Work |
|----------|------|------|------|-----------|----------|-------------|---------|----------|---------|-------------|-------------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Idea Pipeline
| 候选Idea | 已验证Idea | 已设计方向 |
|----------|-----------|-----------|
| 26 | 0 | 3 (#5 v2.0→**v3.0** + #7 技术基线 + **#30 v1.0**) + 1 (突破分析, #18–#29) + 1 (B轨查新裁决, #30) |

## Current Ideas（按 innovation_ranking 排序）
> 🧭 **架构方向分类(2026-07-17 双轨决策)**: 🟦A轨YOLO 15个(#5#6#7#8#9#10#11#12#13#15#16#17#21#22+#1) | 🟪B轨DETR **#30(主Idea,查新✅)**+#14(降级对照) | ⬜双轨通用理论 10个(#18–#20,#23–#29),详见 [innovation_ranking.md](Ideas/innovation_ranking.md)

| # | Idea | Status |
|---|------|--------|
| 23 | **SNR退化统一理论** | **🏆 4.6** 🆕 路径二#1;为#5/#6/#11提供统一数学解释 |
| 24 | **信息瓶颈形式化: 小目标检测的理论根基** | **🏆 4.6** 🆕 路径二#2;Tishby IB→#5理论最优解 |
| 25 | **频率签名(Frequency Signature)判据** | **4.4** 🆕 路径二#3;点状/线状/面状信号频域区分 |
| 28 | **多模态遥感×频域门控泛化** | **4.3** 🆕 路径一#1;SAR/RGB模态自适应;需SAR数据集 |
| 29 | **时序一致性×P2稀疏化** | **4.2** 🆕 路径一#2;帧间熵图预测;需VisDrone-VID |
| 20 | Focal Computation理论框架 | **4.2** 路径三P0;DFIR-DETR DKSA验证工程雏形✅ |
| 26 | **计算最优停止理论: 零超参数自动门控** | **4.1** 🆕 路径二#4;#5自动化版 |
| 27 | **语义-空间不确定性原理** | **4.1** 🆕 路径二#5;Δspace×Δsemantic≥C |
| 18 | DINOv2特征熵→P2门控(中立判据) | **4.0** 路径三P0;免VLM+免频域 |
| 5 | 语义熵引导的 P2 特征稀疏化 | **4.0** **查新✅ ViCrop-Det验证熵范式✅ v3.0代码级设计✅ +§十Dome-DETR划界段✅(四轴+英文RW草案)** ⚠️CLIP偏差需应对 |
| 30 | 🟪 **免监督频谱判据→DETR浅层token条件计算** | **3.9** B轨主Idea;查新✅+**技术方案 v1.0 ✅**(S1空域高通代理判据/D-FINE接入点无NMS/E1判据头对头=生死项)→ [方案](Ideas/idea_030_technical_proposal_v1.md) |
| 19 | 三判据对照实验(CLIP vs DINOv2 vs FFT) | **3.8** 路径三;确定最佳判据前置实验 |
| 15 | 三源门控融合(振幅×熵×高频) | **3.8** CLIP偏差→双源互补价值提升 |
| 7 | 语义熵图引导知识蒸馏 | **3.7** MOCHA提供技术基线✅ |
| 22 | 多阶段P2门控(SViT×#5) | **3.5** 免训练+可学习混合范式;误剪兜底 |
| 21 | 频域通道-空间双维稀疏化(FcaNet×#11) | **3.5** 首次通道维频域条件计算 |
| 6 | SLE(P2头+截短backbone) 迁移 VisDrone | **3.5** DM-EFS验证P2价值✅ |
| 11 | 高频能量引导 P2 稀疏化（免 VLM）| **3.4** CLIP偏差→免VLM路线优先级↑;**v1.1 ✅**(首选S1空域高通代理,判据族与#30 §2统一) |
| 13 | 振幅-相位解耦P2稀疏化 | **3.1** #11技术细化，可并入 |
| 16 | D³R-DETR Gabor核→P2频域门控 | **3.0** #13备选频域工具 |
| 8 | 尺度感知语义熵（分层 prompt）| **3.0** 可并入 #5/#7 |
| 9 | GCP-ASFF vs AFPN 同基准对照 | **3.0** 决策实验 |
| 12 | KLD 分布匹配分配迁移 P2 头 | **3.0** #6 增强件同批执行 |
| 17 | YOLO版ADR角度分布头 | **2.8** O²→YOLO迁移 |
| 10 | RFA-ASFF 协同机制分析 | **2.7** 低优先 |
| 14 | D2=SLE 跨架构验证 | **2.5** Dome已用最浅层→降级回结构对照 |
| 2–4 | Attention / 特征融合 / Loss 改进（旧）| 待具体化 |

## Current Problems
1. Small object accuracy is low → #5 #6 直接相关
2. Large computational cost → #5（稀疏化）直接相关
3. Backbone lacks feature interaction → SEEN-DA 的语义引导思路可借鉴
4. Need better Neck → #9 对照实验给出决策依据

## Key Research Gap（详见 Knowledge Base/research_gap.md）
- 语义信息（VLM 文本嵌入）从未进入实时检测器的特征提取/融合阶段
- P2 检测头的稀疏化/条件计算完全空白（**已查新验证**，2026-07-15）
- 交叉 Gap：熵引导的浅层特征稀疏化 = 精度与算力痛点同时求解
- 新增：频域信息只在图像级粗糙使用，高频能量作免训练空间先验空白（SFIDM 启发）
- 新增：开集检测（OVD）线与小目标线从未交汇——YOLO-World 无 P2、文本只进 P3–P5（结构层面再证 #5 Gap）
- ⚠️ **2026-07-16 新增**: 频域小目标检测 2025–2026 浪潮**4篇**确认(SET/FMC-DETR/DERNet/SFDNet)——全部做特征增强,无人做条件计算/稀疏化(=#11 差异化生命线稳固)
- ⚠️ **2026-07-16 新增**: FMC-DETR 的振幅-相位解耦为 #11 提供技术方案; [D2,D4]检测层在 DETR 侧验证 SLE 跨架构普适性
- ⚠️ **2026-07-16 下午新增 (CLIP-Bias)**: CLIP 特征存在结构性尺度偏差(大目标置信度膨胀 r=0.579;小目标被系统性抑制) → Idea#5 的语义熵门控需显式应对;温度缩放可部分修正(小目标R@10 +19.6%)但不彻底 → #11(免VLM)优先级提升;#15(双源融合)成为长期最终方案
- ⚠️ **2026-07-16 下午新增 (ViCrop-Det)**: SAE注意力熵引导计算分配范式已验证(VisDrone +1.4;COCO APS +2.1);但DETR专属→YOLO版语义熵是差异化方向;可作#5正交佐证引用
- ⚠️ **2026-07-16 下午新增 (DM-EFS)**: P2浅层特征价值获ICCV 2025验证;Size-Codebook粗粒度→#5的token级语义熵门控是精细化演进 → 完整提升链:均匀→尺寸引导→语义引导
- ⚠️ **2026-07-16 晚间新增**: YOLO26 STAL 技术细节已完全确认(候选筛选阶段膨胀代理框;仅影响mask不影响回归) → 与#12 KLD互补非竞争;#6 baseline默认启用
- ⚠️ **2026-07-16 晚间新增**: Mask-Guided Distillation(IEEE 2026)用teacher objectness做蒸馏mask → #7 Related Work baseline; 熵加权(objectness vs entropy)区分度仍需验证
- ⚠️ **2026-07-17 新增 (B轨查新裁决)**: 「DETR 全线无浅层/P2」Gap **失效**——Dome-DETR 已用最浅层四尺度特征+MWAS 密度掩码稀疏;但「频域判据→DETR token 级条件计算」空白**确认成立**(频域 DETR 竞品 6+ 篇全是增强范式)→ #30 正式占据;「判据免监督 vs 学习式密度头(DeFE)」成为新的对照缺口

## Next Steps
1. 持续检索 2025–2026 顶会顶刊新作(双轨全类目;✅ 续十一检索轮完成一轮);🔔 跟踪×3:**HF-DETR 全文(SSMG 判据核实=#30 撞车裁决)**/Unmasking the Tiny(IVC 2026)/Dome-DETR(accept后)代码放出
2. ⏸ 暂缓(待实验模块):B轨基线选型最终确认、#5 v3.0 验证点 M0–M4、**#30 E1 判据 vs DeFE 头对头(生死项)+ E3 免训练判据 AUROC(最低成本首验)**、SLE baseline 复现(#6+#12)
   > ✅ 已完成移出:~~#30 技术方案 v1.0~~(续九)/~~#11 v1.1 修订~~(续十)/~~#5 v3.0 RW Dome 划界段~~(续十)——**双轨设计文档栈全部闭环**

## Roadmap
| 阶段 | 状态 |
|------|------|
| 1. 阅读论文 | 🟩 进行中（48篇,双轨:🟦A轨 + 🟪B轨基础线4/4✅+竞品Dome深读）|
| 2. 总结论文 | 🟩 进行中（35篇深读总结）|
| 3. 构建知识库 | 🟩 12/12 全部完成,持续扩充(+detr_map B轨地图) |
| 4. 分析研究缺口 | 🟨 11+个Gap(双轨;⚠️"DETR无P2"失效/频域条件计算空白确认) |
| 5. 提出并评估 Idea | 🟨 26个候选(🟦15/🟪#30主+#14对照/⬜10) |
| 6. 设计研究方向 | 🟩 **双轨设计文档栈闭环**（🟦#5 v3.0+§十划界 + #11 v1.1 + #7 基线;🟪#30 v1.0·基线初判D-FINE;余下待实验模块/新文献） |
| 7. Idea 生成元研究 | 🟩 已完成（三路径分析, #18–#29 录入） |

## Records
| 类型 | 表格 |
|------|------|
| **论文数据库** | **papers/database.md(50 条结构化索引,八大主题分区)** |
| Idea 历史 | 见 Ideas/innovation_ranking.md |
| 阅读历史 | SEEN-DA（CVPR 2025）✅ \| SEMA-YOLO（RS 2025）✅ \| SFIDM（RS 2025）✅ \| RFLA（ECCV 2022）✅ \| YOLO-World（CVPR 2024）✅ \| YOLOE（arXiv 2025）✅ \| Token Cropr（CVPR 2025）✅ \| TinyFormer（arXiv 2026）✅ \| DERNet（arXiv 2026）✅ \| SET（CVPR 2025）✅ \| D3Q（JSTARS 2025）✅ \| SFDNet（ECCV 2026）✅ \| FMC-DETR（arXiv 2025）✅ \| FDConv（CVPR 2025）✅ \| YOLOv12（NeurIPS 2025）✅ \| MGS（MLSP 2025）✅ \| ELDET（NeurIPS 2025）✅ \| GCA2Net（RS 2025）✅ \| ACM-Coder（CVPR 2024）✅ \| ALGS（TGRS 2025）✅ \| **ViCrop-Det（arXiv 2026.04）✅** \| **D³R-DETR（arXiv 2026.01）✅** \| **DM-EFS（ICCV 2025）✅** \| **O²-DFINE/O²-RTDETR（TGRS 2026）✅** \| **MOCHA（arXiv 2026）✅** \| **CLIP-Bias（arXiv 2026.07）✅** \| **YOLO26 STAL（arXiv 2026.06）✅** \| **Mask-Guided Distillation（IEEE 2026）快速评估✅** \| **NSSA（SciRep 2026）快速评估✅** \| **SViT（WACV 2024）✅** \| **DFIR-DETR（arXiv 2026）✅** \| **DQ-DETR（ECCV 2024）✅** \| **FFCA-YOLO（IEEE 2024）快速评估✅** \| **MDI-YOLO（SciRep 2026）快速评估✅** \| **SFS-DETR（CVPR 2026F）快速评估✅** \| **AD-Det（RS 2025）✅** \| **HashEye（SciRep 2026）深度评估✅** \| **EFSI-DETR（arXiv 2026.01）深度评估✅** \| **DroneScan-YOLO（arXiv 2026.04）快速评估✅** \| **SPA/SPT（ICLR 2026）深度评估✅** \| **Unmasking the Tiny（IVC 2026）快速评估✅🔔跟踪** \| **PST（arXiv 2025.05）快速评估✅** \| **🟪 RT-DETR（CVPR 2024）✅** \| **🟪 D-FINE（ICLR 2025）✅** \| **🟪 Deformable DETR（ICLR 2021）✅** \| **🟪 DINO（ICLR 2023）✅** \| **🟪🔴 Dome-DETR（arXiv 2025.05）✅** |
| 方向设计历史 | Idea 生成突破分析（三路径元研究）✅ |

---
*Last Update: 2026-07-17 | Maintainer: Claude Code*
