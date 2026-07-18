# TASKS

> Current Sprint: Improve Object Detection Performance | 基线: 🟦 YOLO11(A轨·主战场) + 🟪 DETR(交叉融合副线) | Dataset: VisDrone | Stage: Literature Review
> **2026-07-18 策略修订**: YOLO 回归唯一主战场，DETR 降级为交叉融合灵感源（不再追求 DETR 独立 Idea/设计文档）

## 🔴 战略扩展: 三维度问题空间(2026-07-18)
> 背景: 当前 26 个 Idea 过度集中于条件计算/稀疏化维度。VisDrone 场景中同等重要的**密集遮挡**、**旋转框**、**极端尺度变化**被系统性忽略。详细规划见 [Decision/research_strategy.md](Decision/research_strategy.md) § 战略扩展。

### 🔴 密集排列与遮挡（最优先: 0 Idea → 🟨 L1 检索完成, 10 篇入库）
- [x] **L1 文献检索**: ✅ 2026-07-18 双线检索轮, 6 组关键词, 命中 13 篇 → [quick_eval](papers/summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md); database 新增「九、🔴密集遮挡」10 条
- [x] **L1.5 P0 深读**: DALA(密度感知LA)✅ / OPL(遮挡感知Loss)✅ / FAFL(五组件遮挡损失) —— 3 篇（DALA 完成 2026-07-18, Summary + KB 更新 + #31/#32 新Idea；**OPL 完成 2026-07-18**: 付费墙多源重构深读, OPL_ESWA2025.md + KB 4 文件(loss/head/attention/research_gap) + database ⚡→🔬 + **#35/#36 新Idea**(频域遮挡先验/语义熵隐式遮挡检测器)；余 FAFL）
- [x] **L1.5 P1 深读**: DOMino-YOLO(OAR-Loss)✅ / DRONet✅ / HEdge-MamYOLO✅ / NWD-Soft-NMS(MFF-YOLO)✅ / GCS-DETR(YOLO迁移✅)✅ —— 5 篇（2026-07-18 全部完成）
- [x] **L2 经典补读**: Repulsion Loss(CVPR 2018)✅ / CrowdDet(CVPR 2020 Oral)✅ / Soft-NMS(ICCV 2017)✅ —— 2026-07-18 全部完成。三条经典路线奠基(NMS演进/遮挡损失/集合预测)。产出:3 Summary + loss.md #15–#17 + database 82条(🔬48) + compare结论32 + 新Idea #37/#38/#39
- [x] **L3 知识提取**: ✅ 2026-07-18 全部完成。loss.md遮挡专项(七大类taxonomy+范式演化图谱+NMS演进线) / head.md密集检测头(五大类taxonomy+五维对比表) / compare结论33(11篇知识全景+频域判据复用) / 密集遮挡方向知识基础设施就绪
- [ ] **K1 Gap 分析**: 密集场景下标签分配/NMS 敏感性/遮挡特征恢复/DETR query 冲突 — 系统分析
- [ ] **I1 Idea 生成**: 每个 Gap → ≥3 个 Idea，评分排序，择优设计
- [ ] **交叉分析**: 密集 × P2 稀疏化（#5 熵判据在密集场景是否失效？）/ 密集 × DETR（query 去重）/ 密集 × 频域（密集边缘 vs 孤立目标频谱差异）

### 🟠 旋转检测/OBB（有基础: 5 篇论文, 1 个低优先级 Idea #17, Timeline 有角度编码演进线）
- [ ] **L1 补充检索**: YOLO-OBB 最新进展 / OBB 数据增强 / 旋转框 loss 新变体
- [ ] **L2 深度补读**: ACM-Coder(已有条目未深读) / Oriented RepPoints / CFA / PSC 等
- [ ] **K1 知识补充**: loss.md OBB 专项 / augmentation.md 旋转增强 / head.md 旋转头
- [ ] **G1 Gap 分析**: YOLO-OBB vs DETR-OBB 对比空白 / OBB × 条件计算 / 旋转框密集场景
- [ ] **I1 Idea 生成**: OBB + 频域判据 / OBB + 密集场景 / OBB 标签分配
- [ ] **交叉分析**: OBB × 条件计算（旋转框空间分布与 HBB 不同→判据需重验证）/ OBB × 密集（旋转框 IoU 重叠更大→NMS 更严重）/ OBB × 频域（方向性→频谱方向性特征）

### 🟡 尺度变化拓展（存量最多, 从"P2 稀疏化"扩展到全面尺度建模）
- [ ] **补充检索**: 自适应感受野 / 尺度感知标签分配 / 极端小目标增强 / 多尺度特征对齐
- [ ] **Gap 升级**: 现有 Neck 对比空白(#9 未执行)→ 系统化 Neck 统一对照实验设计
- [ ] **Idea 升级**: #8 尺度感知语义熵升级为独立方向; 新增尺度自适应门控/感受野路由

## High Priority
- [ ] ⏸【暂缓】熵图+高频能量图 vs GT 小目标重合率预实验(一次实验定 Idea#5/#11 生死)——2026-07-15 用户决策:VisDrone 暂不提供,待数据集就绪后恢复
- [ ] ⏸【暂缓】VisDrone + YOLO11n 环境搭建,复现 SLE baseline(Idea#6:P2头+截短backbone,同批加 #12 KLD 分配)——2026-07-15 用户决策:本机无 GPU(torch CPU 版),训练类任务暂不执行
- [ ] 阅读近三年(2024–2026)CVPR、ICCV、ECCV、NeurIPS、AAAI 目标检测代表性论文(进度:26篇+2快速评估) ✅ 2026-07-16 6篇新增完成
- [x] 建立目标检测论文数据库 ✅ 2026-07-17 → papers/database.md(49 条,八大主题分区×关联Idea×类型标记;维护规则:每轮新增追加一行)
- [ ] 建立 Compare Table(已起步,持续扩充)
- [ ] 建立 Research Gap(已起步,持续扩充)

## 🟦 A轨·YOLO 方向任务(基线: YOLO11/YOLOE)
> 主战场;覆盖 Idea: #5 #6 #7 #8 #9 #10 #11 #12 #13 #15 #16 #17 #21 #22(工程型稀疏化/蒸馏/Neck/分配)
- [x] **Idea#11 技术方案 v1.1 修订** ✅ 2026-07-17:frequency_domain_cross_analysis.md → v1.1——工具首选 FFT→**S1 空域高通代理**(EFSI 硬消融 33.1>32.3>32.1+四条工程理由);叙事抽象「高频响应统计判据(实现无关)」;判据维度改"先高频+局部异常度,三频段留消融 F3";**判据族权威定义收敛至 idea_030_technical_proposal_v1.md §2**(#11/#30 共用,不再分叉);新增消融 F-impl(同判据换实现,支撑"实现无关",与 #30 E2 共用);SPA GT监督门控+packing 记录为 #5/#22 侧可学习升级选项(#11 主打免监督不采用);§七 修订日志
- [x] **#5 v3.0 Related Work 补 Dome-DETR 划界段** ✅ 2026-07-17:idea_005_v3_design.md 新增 §十——四轴划界(CNN P2 卷积分支 vs DETR encoder token/零参语义熵复用 cls logits vs 0.8M DeFE+GT密度监督/语义不确定性 vs 密度=正交信息维度/净减法 −19% vs 控增量 +37%)+ 英文 RW 段落草案(写论文直接用)+ 概念红线提醒(#5 表述统一「熵引导的空间计算分配」)
- [ ] 持续检索 2025–2026 YOLO 系小目标/轻量化/门控新作(服务 #5/#11/#22)(✅ 2026-07-17 续十一检索轮:P2 侧 2026 批量新作 LAF-YOLOv10/Edge-Constrained QIEA/DroneScan-YOLO 等全部"加P2头"路线,无人做 P2 内部空间条件计算 → **#5 gap 再确认**;Edge-Constrained "P2 alone +31% AP_small"=#5/#6 新 motivation 数据点)
- [ ] 🔔 跟踪项:Unmasking the Tiny(IVC 2026)代码放出后回读——**07-18 已见刊(IVC Vol.172)方法细节补全:STSM+FRM=补强式(加法)vs #5跳过式(减法)方向相反 → 哨点降级为普通近邻,低频跟踪**;代码仍占位(GitHub: AngstCJ/Unmasking-the-Tiny)
- [ ] ⏸【暂缓】#5 v3.0 验证点 M0–M4、熵图/高频能量图预实验、#6+#12 baseline 复现——实验类待实验模块设计

## 🟪 DETR 交叉融合（副线·2026-07-18 策略修订降级）
> ~~2026-07-17 双轨决策新增;2026-07-18 强化~~ → **2026-07-18 策略修订**: DETR 降级为 YOLO 交叉融合灵感源。不再追求 DETR 独立 Idea/设计文档/DX1-DX5 强化计划。仅保留判据层通用 + 概念层迁移两条交叉线。DETR 论文阅读新原则：每篇必须通过「YOLO 迁移过滤器」（这对 YOLO 有什么用？→ 能迁移就记录，不能就跳过）。

- [x] **DETR 基础线补读** ✅ 2026-07-17: RT-DETR/Deformable DETR/DINO 全部完成
- [x] **B轨技术地图** ✅ 2026-07-17: detr_map.md
- [x] **基线选型** ✅ 2026-07-17: D-FINE 纸面初判
- [x] **#5-D/#11-D 查新** ✅ 2026-07-17: #5-D ❌ / #11-D→#30 ✅
- [x] **#30 技术方案 v1.0** ✅ 2026-07-17
- [x] **Dynamic DETR 深读** ✅ 2026-07-18: ⚖️不撞车 → #33/#34 + RCDR
- [ ] **#30 v1.1 修订**（低优先级·文档维护）：吸收 RCDR + Dynamic DETR 合并式 token 处理 + E1 三臂对照
- [ ] **DETR 交叉灵感记录**（随读随记）：仅记录通过「YOLO 迁移过滤器」的概念/判据洞察

### ~~DX1-DX5 强化计划~~（已停止）
- [x] ~~DX1.5 P0 深读: Dynamic DETR~~ ✅ 已完成
- [ ] ~~DX1.5 P1 深读 5 篇~~ → **全部取消**（纯 DETR 论文，YOLO 迁移价值低）
- [ ] ~~DX2-DX5~~ → **全部取消**

## Literature Tasks
> 模式变更(2026-07-15 用户授权):不再等待投喂 PDF,由 Agent 直接从 arXiv 等公开渠道抓取全文阅读
> ⚠️ 约束(2026-07-16 修订):**以 2025+ 论文为主力**;pre-2025 高质量基础方法论文可主动抓取(标注年份,创新性优先)
- [x] 阅读 YOLO-World(✅ 2026-07-15,#5 基座确认,详见 papers/summaries/YOLO-World_CVPR2024.md)
- [x] 阅读 YOLOE(✅ 2026-07-15,#5 基座定论:选 YOLOE;LRPC 为查新新增最近邻,详见 papers/summaries/YOLOE_2025.md)
- [x] 阅读 Token Cropr(✅ 2026-07-15,#5 划界定稿+LLF兜底方案,详见 papers/summaries/TokenCropr_CVPR2025.md)
- [x] 阅读 TinyFormer(✅ 2026-07-16,YOLO-DETR混合,PBM+SSA;#5 P2路线竞争论述;#6 Neck选型扩展,详见 papers/summaries/TinyFormer_2026.md)
- [x] 阅读 DERNet(✅ 2026-07-16,频域全管线,WDG+LGE+FDHead;#11最强竞争者+最强佐证,详见 papers/summaries/DERNet_2026.md)
- [x] 阅读 SET(✅ 2026-07-16,CVPR 2025频谱增强;"去高频帮小目标"关键发现;#11判据修正,详见 papers/summaries/SET_CVPR2025.md)
- [x] 阅读 D3Q(✅ 2026-07-16,替代DQ-DETR;DETR动态查询;AI-TOD 32.1 SOTA;"坚持YOLO"第三次确认,详见 papers/summaries/D3Q_JSTARS2025.md)
- [x] 阅读 FMC-DETR(✅ 2026-07-16,频域解耦+KAN+多域协调,VisDrone 33.7 SOTA;#11 频域浪潮3→4篇确认,详见 papers/summaries/FMC-DETR_arXiv2025.md)
- [x] FDConv(CVPR 2025)快速评估(✅ 2026-07-16,频域动态卷积核;不做条件计算→不威胁#11;+3.6M参数超+90M CondConv)
- [x] YOLOv12(NeurIPS 2025)快速评估(✅ 2026-07-16,注意力中心YOLO;无P2头;FlashAttention硬依赖;不构成基线切换)
- [x] YOLO26 STAL 深度评估——✅ 2026-07-16 晚间 技术细节已完全确认(STAL=候选筛选阶段膨胀极小目标的代理框;仅影响mask不影响回归;与#12 KLD互补非竞争;#6 baseline默认启用)
- [x] 阅读 ViCrop-Det(✅ 2026-07-16,SAE熵引导裁剪;DETR专属;#5熵范式验证+正交佐证,详见 papers/summaries/ViCrop-Det_arXiv2026.md)
- [x] 阅读 D³R-DETR(✅ 2026-07-16,Gabor频域核+双域密度优化;#11/#13频域工具选型,详见 papers/summaries/D3R-DETR_arXiv2026.md)
- [x] 阅读 DM-EFS(✅ 2026-07-16,ICCV 2025;P2浅层特征价值验证;#5粗粒度baseline,详见 papers/summaries/DM-EFS_ICCV2025.md)
- [x] 阅读 O²-DFINE/O²-RTDETR(✅ 2026-07-16,TGRS 2026;首个实时旋转DETR;ADR角度分布,详见 papers/summaries/O2_TGRS2026.md)
- [x] 阅读 MOCHA(✅ 2026-07-16,VLM→YOLO蒸馏;Translation Module;#7技术基线,详见 papers/summaries/MOCHA_arXiv2026.md)
- [x] 阅读 CLIP-Bias(✅ 2026-07-16,CLIP置信度双重偏差结构性证实;#5风险+叙事升级,详见 papers/summaries/CLIP-Confidence-Bias_arXiv2026.md)
- [ ] 阅读 DQ-DETR / DNTR(小目标 DETR 路线,验证"坚持YOLO"决策)——⚠️ DQ-DETR 实际为 ECCV 2024, 🔓 已解锁可主动抓取;2025 升级版 D3Q 已读替代 ✅ **DQ-DETR 已读(2026-07-16,详见 papers/summaries/DQ-DETR_ECCV2024.md)**
- [x] 阅读 RFLA(✅ 2026-07-15,P2头标签分配,Idea#7 #12 配套;#12 实验设计已就绪)
- [x] 阅读 SViT(✅ 2026-07-16,WACV 2024,token再激活→#5误剪兜底→#22多阶段门控,详见 papers/summaries/SViT_WACV2024.md)
- [x] 阅读 FcaNet / FreqFusion(✅ 2026-07-16,ICCV 2021;多频谱通道注意力;GAP=最低频DCT;#21通道维频域稀疏,详见 papers/summaries/FcaNet_ICCV2021.md)
- [x] 阅读 FFCA-YOLO(✅ 2026-07-16,IEEE TGRS 2024,遥感小目标baseline,快速评估,详见 papers/summaries/FFCA-YOLO_IEEE2024.md)
- [ ] 阅读 YOLO 系列论文(仅主动抓 2025+ 如 YOLOv12/YOLOE;更早待用户提供)
- [x] 阅读 RT-DETR 系列论文——✅ 2026-07-17 双轨决策后 B轨首篇深读:RT-DETR(CVPR 2024)+ D-FINE(ICLR 2025)对照 → 2篇summary + B轨基线纸面初判 D-FINE;后续 Deformable DETR/DINO 见「🟪 B轨·DETR 方向任务」
- [x] 阅读 DINOv2(✅ 2026-07-16,ICCV 2023;自监督patch features涌现objectness;#18中立判据+P2门控,详见 papers/summaries/DINOv2_ICCV2023.md)
- [ ] 阅读 Grounding DINO——⏸ 待用户提供(2025 前)
- [ ] 阅读小目标检测论文(2025+ 自动抓取;已检索到 TinyFormer/DERNet/SET/D3Q/SFDNet 并处理 ✅;持续检索 2025–2026 新作; **DFIR-DETR ✅ 已读(2026-07-16)**;MDI-YOLO ✅ 快速评估;SFS-DETR ✅ 快速评估(全文不可获取))
- [ ] 阅读频域检测论文(SET/DERNet/SFDNet 已读 ✅;持续检索)
- [ ] 阅读遥感目标检测论文(**FFCA-YOLO ✅ 快速评估(2026-07-16)**;**AD-Det ✅ 深度阅读(2026-07-16,RS 2025,VisDrone 37.5 coarse-to-fine SOTA)**;持续检索)
- [ ] 阅读轻量化检测论文(**首轮 ✅ 2026-07-17**:HashEye(SciRep 2026)深度评估+EFSI-DETR(arXiv 2026.01)深度评估+DroneScan-YOLO 快评,详见 papers/summaries/quick_eval_2026-07-17_lightweight_round1.md;持续检索;UFO-DETR(arXiv 2602.22712,频域第6篇候选)留待下轮)
- [ ] 阅读注意力机制论文(**首轮 ✅ 2026-07-17**:SPA/SPT(ICLR 2026)深度评估+Unmasking the Tiny(IVC 2026,#5最近邻)+PST/UFO-DETR 快评,详见 papers/summaries/quick_eval_2026-07-17_attention_round1.md;持续检索)
- [ ] 🔔 **跟踪项:Unmasking the Tiny(IVC 2026)代码/arXiv 放出后回读**——#5 查新最近哨点,复核三轴划界(目的/层级/判据);GitHub: AngstCJ/Unmasking-the-Tiny(现仅占位README)
- [ ] ⏸ **路径二 Phase 1 — SNR 退化理论分析**：YOLO11 各层特征激活统计 → 验证 SNR 退化假设 → `Ideas/idea_005_v3_theory.md`——2026-07-16 用户决策:实验模块未设计,实验类全部暂缓
- [ ] ⏸ **预实验方案脚本化**：熵图+频谱异常度 vs GT 小目标重合率分析——2026-07-16 用户决策:实验模块未设计,实验类全部暂缓
- [x] **Idea#5 v2.0 → v3.0 代码级细化** ✅ 2026-07-17:伪代码/模块接口/张量形状/ultralytics集成点/FLOPs纸面预算 → Ideas/idea_005_v3_design.md(纯设计文档,验证点全部⏸待实验模块)
- [ ] 🔄 **路径三论文抓取**（2026-07-16 用户授权解除限制）：DINOv2(ICCV 2023) + Focal Loss(ICCV 2017) + FcaNet(ICCV 2021) → 解锁 #18–#21

## Knowledge Tasks
- [x] 更新 augmentation.md ✅ 2026-07-16 首次填充(AD-Det DCC + 场景理解式增强 + copy-paste 演化线)——Knowledge Base 12/12 全部完成
- [x] 更新 backbone.md
- [x] 更新 neck.md
- [x] 更新 head.md
- [x] 更新 attention.md
- [x] 更新 loss.md
- [x] 更新 training.md
- [x] 更新 dataset.md
- [x] 更新 compare.md
- [x] 更新 timeline.md
- [x] 更新 sota.md
- [x] 更新 research_gap.md
- [x] 更新 future_work.md

## Long-term Tasks
- [ ] 寻找新的 Research Gap
- [ ] 提出新的研究思路
- [ ] 设计研究方向
- [ ] 整理 SOTA 对比
- [ ] 维护 Idea 评估体系

## Auto-generated Tasks
- [ ] ⏸【暂缓】下载 RS-STOD(https://github.com/lixinghua5540/STOD)与 AI-TOD 数据集,作为遥感方向备用基准——随实验类任务一并暂缓
- [ ] ⏸【暂缓】验证 CLIP/RegionCLIP 文本嵌入对 VisDrone 俯视视角的对齐质量(Idea#5/#7/#8 共同前置)——依赖 VisDrone,暂缓
- [ ] Idea#9:统一协议下 PAN/AFPN/ASFF/GCP-ASFF 对照实验设计

- [x] **2026-07-18 续: PRNet 深读(VisDrone 最高纪录拆解)**——arXiv 2510.09531(Zheng et al.,未见venue);PRN(P2^in/P3^in 多次复用+迭代精炼 Neck)单模块 +10.3 AP50/参数反降(9.4→7.71M)/FLOPs+110.7%(21.3→44.9G)=**#5 motivation 最强新证**;ESSamp=PixelUnShuffle+d=2深度卷积;VisDrone val AP50 49.9@7.77M/54.1@24.6M(L)/61.0@1024;AI-TOD-L 35.6;跨架构泛化(YOLOv5/v8/11/FBRT +6~10,RT-DETR+3.2);P2路线图第四分支(骨干复用)+gap N+3确认;静态迭代深度(阶段0→3:45.0→51.4)一刀切=层深维条件计算入口;无FPS漏洞=#30 E6正面理由;产出:PRNet_arXiv2025.md(🔬全协议)+KB 5文件(neck+compare结论27/timeline分支+research_gap PRNet段/sota升级)+database ⚡→🔬+journal(第十七次)+Idea #5/#6/#24注记+README同步+
## Completed Tasks
- [x] **2026-07-18: 文献检索轮(跟踪项三连裁决 + 6 路并行扫描)**——①**Dome-DETR 放码✅+ACM MM 2025 接收确认**(S/M/L 权重+训练日志;#30 E1 生死项升级"官方代码对照",MWAS 控制变量可落代码级;⚠️动态query限单批训练);②**Unmasking the Tiny 见刊细节补全**(IVC Vol.172:STSM+FRM=前景分数**补强式加法**,与 #5 跳过式减法方向相反 → 哨点降级普通近邻);③HF-DETR 仍付费墙(SSMG 裁决悬置);④新作划界×3:FSDETR(IJCNN 2026,频域浪潮**第 7 篇**纯增强,VisDrone APs 13.9)/HI-MoE(DETR 专家维 MoE,+3.3 APs,与#30正交+通路侧翼佐证)/MFVL-YOLO(熵引导用于前景增强非计算分配,#5 近邻划界);⑤数据点:PRNet VisDrone AP50 **54.1/61.0@1024=检索所见最高**、FFKD-Net 47.7@3.0M、Scale-Conscious KD 面积加权=**#7 现成消融对照轴**、HFSP-YOLO P2→P3 注入=P2 第三路线;⑥**双 gap 再确认**(P2 内稀疏化无人做 N+2/频域条件计算空白维持)→ quick_eval_2026-07-18_literature_round.md + database(60 条)+ #30 方案 v1.0.1 + journal(第十六次)+ **Self Check 补漏(07-18)**:compare(Dome放码行更新+FSDETR行+结论26)/timeline(2026主线+频域第7篇+门控线+Dome放码)/sota(Dome venue+FSDETR/PRNet/FFKD-Net行)/research_gap(双gap复核+哨点降级段)/decision_history(E1升级+哨点降级两条裁决)五文件同步✅
- [x] **2026-07-17 续七: 文献检索轮(HF-DETR 撞车监控 + 双轨 gap 再确认)**——①**新命中 HF-DETR(IEEE SPL 2026)**:LoG stem+小波重建+SSMG saliency token 门控,VisDrone AP+4.3/121FPS,「高频+token稀疏+VisDrone+实时」四要素=#30 组合空间最近邻居 → 快评入库 `papers/summaries/HF-DETR_SPL2026.md`+🔔挂跟踪(SSMG 判据性质待全文核实;LoG=S1 工具又一佐证)+#30 方案 §6 风险 5;②UFO-DETR 快评补全数字(VisDrone mAP50 46.1/算力-60%,纯增强维持不威胁);③#5 近邻/Dome 放码检索无新动静;④YOLO P2 侧 2026 批量新作全部"加P2头"路线 → #5 gap 再确认,Edge-Constrained "P2 alone +31% AP_small"=新 motivation 数据点。同步:database(50 条/🔔×2)/ranking(续十一)/journal(第十五次)/research_history(续十一)/README
- [x] **2026-07-17 续六: 🟦 A轨双文档修订**——①**#11 频域交叉分析 v1.1**:工具首选 FFT→S1 空域高通代理(EFSI 硬消融)+叙事"实现无关"+判据族收敛至 #30 §2+消融 F-impl 新增+SPA 记录为可学习选项;②**#5 v3.0 §十 Dome-DETR 划界段**:四轴划界+英文 RW 草案+概念红线(「熵引导的空间计算分配」)。A轨设计文档与 B轨 #30 方案完成判据统一,双轨"同判据跨架构"(⬜#24 架构无关性卖点)的文档基础闭环
- [x] **2026-07-17 续五: 🟪 #30 技术方案 v1.0**(纯文档轮)——`Ideas/idea_030_technical_proposal_v1.md`:①判据三选项定型(S1 空域高通代理首选+局部异常度归一,吸收 EFSI 硬消融与 SET 警告;S2 DCT/S3 FFT 降为消融对照;叙事抽象为"高频响应统计判据·实现无关",同时规避 FFT 工具层撞车)②D-FINE 接入点与 Dome 逐点对齐(MWAS 结构沿用引用=控制变量;query 预算掩码过滤且**不引入 Dynamic NMS**=对 Dome 攻击面③的直接回应;背景 token identity 直通=SViT 教训)③Dome 三攻击面→#30 三卖点对照叙事表 ④实验协议 E0–E6 锁定:E1 判据 vs 复现版 DeFE 头对头=生死项,E3 免训练判据 AUROC=实验模块最低成本首验,E6 报 GFLOPs 分布+FPS(修 Dome 未报漏洞)⑤定位诚实声明:不许诺净省算力(Dome +37% 教训)。同步:ranking(rank11 状态)/candidate(#30 Current Status)/detr_map(挂点表)/TASKS/journal/README/research_history
- [x] 2026-07-15 阅读+总结 SEEN-DA(CVPR 2025)→ papers/summaries/SEEN-DA_CVPR2025.md
- [x] 2026-07-15 阅读+总结 SEMA-YOLO(Remote Sens. 2025)→ papers/summaries/SEMA-YOLO_RemoteSensing2025.md
- [x] 2026-07-15 阅读+总结 SFIDM(Remote Sens. 2025)→ papers/summaries/SFIDM_RemoteSensing2025.md
- [x] 2026-07-15 查新:token pruning/熵稀疏化 → Idea#5 novelty 确认成立(结果见 research_gap.md)
- [x] 2026-07-15 Knowledge Base 12 项中 11 项完成首轮填充
- [x] 2026-07-15 提出 8 个新候选 Idea 并完成多维评分(innovation_ranking.md)
- [x] 2026-07-15 记录 5 条决策(decision_history.md)、2 篇 Research Journal
- [x] 2026-07-15 搭建本地研究面板(dashboard/index.html + 启动研究面板.bat)
- [x] 2026-07-15 环境检测:torch 2.11.0+cpu(无GPU)/ultralytics 8.4.47/无VisDrone → 实验类任务暂缓(用户决策)
- [x] 2026-07-15 阅读+总结 RFLA(ECCV 2022)→ papers/summaries/RFLA_ECCV2022.md(arXiv 抓取,#12 前置解锁)
- [x] 2026-07-15 阅读+总结 YOLO-World(CVPR 2024)→ papers/summaries/YOLO-World_CVPR2024.md(arXiv 抓取,#5 基座确认)
- [x] 2026-07-15 阅读+总结 YOLOE(arXiv 2025)→ papers/summaries/YOLOE_2025.md(#5/#7 基座定论:YOLOE;查新边界新增 LRPC)
- [x] 2026-07-15 阅读+总结 Token Cropr(CVPR 2025)→ papers/summaries/TokenCropr_CVPR2025.md(#5 划界定稿;LLF 兜底方案确定)
- [x] 2026-07-16 阅读+总结 TinyFormer(arXiv 2026)→ papers/summaries/TinyFormer_2026.md(YOLO-DETR混合;PBM+SSA;#5 P2路线竞争)
- [x] 2026-07-16 阅读+总结 DERNet(arXiv 2026)→ papers/summaries/DERNet_2026.md(频域全管线;#11最强竞争者)
- [x] 2026-07-16 阅读+总结 SET(CVPR 2025)→ papers/summaries/SET_CVPR2025.md(频谱增强;去高频帮小目标关键发现)
- [x] 2026-07-16 阅读+总结 D3Q(JSTARS 2025)→ papers/summaries/D3Q_JSTARS2025.md(DETR动态查询;"坚持YOLO"第三次确认)
- [x] 2026-07-16 阅读+总结 SFDNet(ECCV 2026)→ papers/summaries/SFDNet_ECCV2026.md(频谱解耦+原型蒸馏;#11竞争者之三)
- [x] 2026-07-16 阅读+总结 FMC-DETR(arXiv 2025.09)→ papers/summaries/FMC-DETR_arXiv2025.md(频域解耦+KAN+多域协调;VisDrone 33.7 SOTA;#11 频域浪潮3→4篇确认)
- [x] 2026-07-16 快速评估 FDConv(CVPR 2025,频域动态卷积核,不做条件计算) + YOLOv12(NeurIPS 2025,注意力YOLO,无P2,不切换基线)
- [x] 2026-07-16 新增 Idea #13(振幅门控)、#14(D2=SLE跨架构)、#15(三源门控融合)
- [x] 2026-07-16 下午: 阅读+总结 6篇顶会顶刊论文(ViCrop-Det/D³R-DETR/DM-EFS/O²/MOCHA/CLIP-Bias) → papers/summaries/
- [x] 2026-07-16 下午: 更新 Knowledge Base(compare+6/timeline+6/sota+6/attention+3/head+2/research_gap+6新Gap)
- [x] 2026-07-16 下午: 新增 Idea #16(Gabor核P2频域门控) #17(YOLO版ADR);现有Idea状态更新(ViCrop-Det验证/CLIP偏差风险/MOCHA基线/DM-EFS演化路径)
- [x] 2026-07-16 下午: 更新 Decision(paper_selection+research_strategy) + Research Journal + README + TASKS
- [x] 2026-07-16 晚间: 填充 risk_assessment.md(17个Idea系统风险评估, 四维度矩阵)
- [x] 2026-07-16 晚间: Idea#5 v2.0 设计文档(三篇交叉分析+统一叙事+技术架构+实验设计) → Ideas/idea_005_v2_design.md
- [x] 2026-07-16 晚间: 频域五篇交叉分析(SET/DERNet/SFDNet/FMC-DETR/D³R-DETR)+#11统一技术方案 → Ideas/frequency_domain_cross_analysis.md
- [x] 2026-07-16 晚间: Idea#7 技术基线设计(MOCHA+语义熵加权蒸馏+实验设计) → Ideas/idea_007_technical_baseline.md
- [x] 2026-07-16 晚间: 更新 README/TASKS/research_strategy/research_history/innovation_ranking(产出+进度同步)
- [x] 2026-07-16 晚间: 持续检索 → 发现+快速评估 YOLO26 STAL(细节确认)/Mask-Guided Distillation(IEEE 2026)/NSSA(SciRep 2026) → papers/summaries/quick_eval_2026-07-16_evening.md
- [x] 2026-07-16 晚间: **STAL 评估完成**: 与#12 KLD互补非竞争;#6 baseline默认启用STAL
- [x] 2026-07-16 深夜: **Idea 生成突破分析（三路径元研究）**：诊断评分天花板根因（跨域交叉红利递减/引力捕获效应）；路径一（6个新交叉维度评估, Top: 多模态×频域 ~4.3）+ 路径二（5个机制洞察评估, Top: SNR退化/信息瓶颈 ~4.6）+ 路径三（6篇pre-2025论文精选, P0: DINOv2/Focal Loss）；推荐二阶段策略；预留 #18–#24 → `Ideas/idea_generation_breakthrough_analysis.md`

- [x] 2026-07-16 深夜: **路径三 pre-2025 论文抓取执行**（用户授权解除限制）：深度阅读 DINOv2(ICCV 2023)+Focal Loss(ICCV 2017)+FcaNet(ICCV 2021) → 3篇paper summary + KB全面更新(compare/timeline/attention/research_gap) + Idea #18–#21评分定档 → #20 Focal Computation(4.2)成当前最高分Idea

- [x] 2026-07-16 深夜: **文献第二轮抓取**（Literature Tasks 持续推进）：深度阅读 SViT(WACV 2024)+DFIR-DETR(arXiv 2026)+DQ-DETR(ECCV 2024) → 3篇paper summary; 快速评估 FFCA-YOLO(IEEE 2024)+MDI-YOLO(SciRep 2026)+SFS-DETR(CVPR 2026F); KB全面更新(compare+6/timeline+7/attention+3/research_gap+3); 新增Idea #22(多阶段P2门控:语义熵初筛+可学习再激活); 累计论文34篇, 候选Idea 22个

- [x] 2026-07-16 深夜续二: **路径一+路径二高分Idea正式录入**：突破分析预留 #23–#29 中 7个Idea 正式录入 innovation_ranking；#23 SNR退化(4.6)+#24 信息瓶颈(4.6)并列登顶超越#20(4.2)；Idea总数 22→**25**；README/TASKS/research_history 同步更新

- [x] 2026-07-16 深夜续四: **工作流整理+增强类文献首轮**：4条工作项移出 Long-term Tasks(用户指令);实验类暂缓范围扩大至 CPU 分析类(用户决策,记入 decision_history);深度阅读 AD-Det(RS 2025)→ papers/summaries/AD-Det_RemoteSensing2025.md;**augmentation.md 首次填充→Knowledge Base 12/12 全部完成**;compare/timeline/sota 同步;累计论文 35 篇

- [x] 2026-07-17: **Idea#5 v3.0 代码级设计** ✅：v2.0 五个开放问题全部落地(门控信号源=P3 cls logits复用/训练Gumbel+推理硬阈值/SViT保留+LLF兜底/图像级自适应稀疏度);三大模块接口+伪代码+张量形状;ultralytics 逐文件集成点;FLOPs 纸面预算(t=0.7 → 全模型约−19%,+0.033M参数);验证点 M0–M4 全部⏸待实验模块 → Ideas/idea_005_v3_design.md

- [x] 2026-07-17: **轻量化检测首轮**：HashEye(SciRep 2026,输入级LSH空间剪枝,Jetson 5.25×)+EFSI-DETR(arXiv 2026.01,"频域启发非变换",VisDrone APs 24.8/188FPS)深度评估 → 2篇summary;DroneScan-YOLO(P2分支+114K参数)快评;KB更新(compare+3行+2结论/research_gap+2段/sota+3/timeline频域线+裁剪线);⚠️关键修正:HashEye印证masked conv不省时→v3.0推理路径定稿稠密重排;EFSI空域代理胜FFT→#11判据三选项对照;累计论文38篇

- [x] 2026-07-17: **注意力机制首轮**：SPA/SPT(ICLR 2026,GT监督门控+packing,首个训练期也省算力的token选择,BDD100K +0.6mAP/−16.4%FLOPs)深度评估;⚠️ **Unmasking the Tiny(IVC 2026)判定为#5最近哨点**(YOLOX+稀疏token+语义信号,三轴划开:召回vs算力/头级vs特征级/自身分数vsVLM熵,挂跟踪项);PST(粗训细推解耦)/UFO-DETR(降级计数项)快评;KB更新(attention+2模块/compare+2行+结论22/research_gap+2段/timeline门控线重写);v3.0补丁(λ_g扫描范围+packing预留);累计论文42篇

- [x] 2026-07-17: **论文数据库建立** ✅：papers/database.md——46条(37单篇summary+9快评条目)七大主题分区(开集VLM/频域/Token选择门控/小目标P2/裁剪式/标签分配蒸馏/旋转框);每条含Venue×类型(🔬深读/🔍深度评估/⚡快评)×关联Idea×一句话×链接;统计速览+维护规则;High Priority 长期未启动项清零

- [x] 2026-07-17 续: **B轨首轮:RT-DETR + D-FINE 对照深读** ✅：RT-DETR(CVPR 2024,首个实时端到端,AIFI+CCFF+不确定性QS,53.1@108FPS,⚠️官方自认小目标短板)+ D-FINE(ICLR 2025,FDR分布式回归+GO-LSD自蒸馏,54.0@31M/91G,O365后APs 40.0)→ 2篇summary;**B轨基线纸面初判 D-FINE**(记入decision_history,最终确认⏸待实验模块);KB更新(compare+2行+结论23/timeline 2025主线+实时DETR基座支线/sota+2行);database.md 新增「八、实时DETR基座」分区(48条);Idea挂点:#5-D落点=QS第三判据(须与头级top-K划界)/#7 vs GO-LSD划界/#26 decoder层深τ*载体/#24 encoder 49%FLOPs-11%AP论据;累计论文 44 篇

- [x] 2026-07-17 续二: **B轨基础线闭环:Deformable DETR + DINO 补读** ✅(进度 3/3)：Deformable DETR(ICLR 2021,MSDeformAttn K=4点稀疏采样+多尺度免FPN,1/10训练代价 APs 20.5→26.4,two-stage=QS诞生地)+ DINO(ICLR 2023,CDN对比去噪+混合QS+LFT,12ep 49.0/APs +7.2,首登COCO榜端到端)→ 2篇summary(DeformableDETR_ICLR2021.md/DINO_ICLR2023.md);**QS判据三代演进链闭环**(纯top-K→混合→不确定性最小→#5-D第三判据谱系落点);#26 获 encoder×decoder 层数网格消融(enc 6→2 −2.0/dec 6→2 −3.0 且与QS质量强交互);#24 获 encoder冗余>decoder 定量证据;划界警示:「注意力稀疏采样」已被底座算子占据,B轨Idea须落「query/token预算自适应分配」;KB更新(compare+2行+结论24/timeline支线闭环/sota+2行/database 2行⏳→🔬);累计论文 **46 篇**;下一优先:DETR方向知识小结(14篇)

- [x] 2026-07-17 续三: **研究面板修缮 + B轨技术地图** ✅：①面板数据源补齐——journal.md 追加第十/十一次记录(此前滞后至 07-16);README 阶段行/Roadmap/Next Steps 刷新(26篇→46篇双轨态);dashboard venue 识别扩充(ICLR/TGRS/WACV/SciRep/MLSP/IVC/IEEE);②**DETR 方向知识小结完成** → `Knowledge Base/detr_map.md`(三主线:query机制四代演进/小目标适配/实时化证据库 × Idea挂点表 × 概念红线 × 基线选型),并纳入 dashboard 知识库视图(KB_FILES +1,🟪卡片);B轨下一优先:#5-D/#11-D 查新划界
- [x] 2026-07-17 续四: **🟪 B轨衍生查新裁决:#5-D ❌ / #11-D→#30 ✅**：三轮检索(熵引导token剪枝/自适应稀疏化/频域条件计算/免训练频谱判据)+ 致命竞品 **Dome-DETR**(arXiv 2505.05741,USTC)深读入库(D-FINE底座,DeFE密度头→MWAS浅层掩码窗口token稀疏+PAQI自适应query,AI-TOD-V2 34.6/VisDrone val 39.0 双SOTA)→ ①#5-D 被结构性占据,不占编号,熵判据遗产并入 #19 DETR侧对照列;②**#11-D 通过 → 正式占编号 #30「免监督频谱判据→DETR浅层token条件计算」(3.9,B轨主Idea)**,三点划界(vs EFSI增强/UAV-DETR融合软门控/Dome学习式判据头)+Dome三攻击面(GFLOPs+37%非净省/保留NMS/判据需GT监督)=对照叙事;③「全线无P2」结论失效→#14 降级回结构对照;④产出:`Ideas/detr_derivative_novelty_check.md` + Dome summary + ranking(26 Idea)/candidate/detr_map/compare(结论25)/timeline/sota/database(49条)/journal(第十二次)/README 全面同步

---
Last Update: 2026-07-18 | Maintainer: Claude Code
