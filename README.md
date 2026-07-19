# Object Detection Research Project v3.0 — 多维度创新发现阶段

## Project Info
- **方向**：Object Detection（YOLO Series | DETR | Small/Tiny Object | Remote Sensing | Lightweight | Real-time | Knowledge Distillation）
- **基线**：🟦 YOLO11 + Ultralytics（唯一主战场）| 🟪 DETR 交叉融合副线（仅判据/概念层）——2026-07-18 策略修订
- **数据集**：VisDrone（主）| COCO | DOTA | UAVDT | VOC
- **问题维度**（2026-07-18 策略修订）：
  - 🟦 **维度一：计算效率** — 条件计算/P2 稀疏化/蒸馏（YOLO 主线，15 Idea 成熟度最高）
  - 🔴 **维度二：密集排列与遮挡** — Crowd/Occlusion/NMS（YOLO 主线新维度，2 Idea🆕）
  - 🟠 **维度三：旋转检测/OBB** — Oriented Detection（YOLO 主线，仅 #17 待激活）
  - 🟡 **维度四：极端尺度变化** — Scale-Adaptive（YOLO 主线拓展视角）
  - 🟪 **DETR 交叉融合** — 仅保留判据/概念层，为 YOLO 主线提供灵感（副线，~5% 资源）

## Current Status
- **阶段**：`文献调研 → 方向设计`（进度：🟩 50篇已读(质量筛选后)；🟩 **密集遮挡 D1 方向设计完成**←全链路闭环;实验类任务 ⏸ 暂缓——2026-07-15 用户决策：数据集/GPU 暂不提供）
- **文献模式**：arXiv 公开渠道自动抓取（**以 2025+ 论文为主**；pre-2025 关键基础方法已解锁——2026-07-16 用户授权）
- **目标**：文献调研 → 知识库构建 → 研究缺口发现 → Idea 提出与评估 → 方向设计
- **本轮更新(2026-07-19 续二十九:🟠 OBB G1 Gap 分析 ✅)**：基于 OBB P0 3篇(FAA CVPR 2026·YOLO26-OBB·RDCNet)+L1 21篇→三模块系统化Gap分析(跨P0交叉7项+L1未覆盖7项+四维交叉7项=**19个系统性Gap**)。**核心发现**: ①频域判据在OBB的收益>HBB(一次FFT→能量+方向+签名三输出→四线下游·2-3×价值密度) ②FAA+YOLO26+RDCNet三角定位·三篇独立零互引→跨论文联合分析=可发表贡献 ③OBB×密集=项目双战略维度最强交汇(D1→OBB-D1独立发表价值) ④OBB条件计算=完全蓝海(21篇零涉足·三架构空白叙事完整) ⑤OBB=频域判据"跨任务通用性"论证最佳载体(HBB→OBB→DETR) ⑥VisDrone-OBB标注缺失=系统性瓶颈。**P0 Gap(7个)**: 双源角度监督/全链路旋转感知/OBB三维频域判据族/D1 OBB扩展/条件计算判据重验证/NMS路线对比/OBB密集NMS路线。**8条I1 Idea入口**(OBB三维频域判据框架~4.2/D1 v2.0~4.1/双源角度监督~4.0/条件计算判据适配~3.9/NMS路线裁决~3.8/全链路旋转感知~3.8/BDAssign~3.7/旋转等变选型指南~3.7)。产出: research_gap.md OBB G1专节(~400行·19Gap+优先级表+6发现) + compare(结论45) + journal(第四十四次) + research_history(续三十五)。**🟠 OBB方向 L1→P0→K1→G1 完成 ✅·I1 待生成**
- **本轮更新(2026-07-18 续十二:🔴 密集遮挡 K1+I1+交叉分析全链路闭环)**：**K1 Gap分析(19个Gap,4维+4交叉)**→**I1 Idea生成(#40连续密度LA 3.9+#41密度自适应NMS 3.5)**→**三项交叉分析(密集×P2/密集×DETR/密集×频域)**。核心发现: ①频域判据是密集遮挡+条件计算两方向的天然桥梁分子(K1-X1) ②#5需增加密集/遮挡否决机制(交叉一) ③频域判据从辅助判据升级为场景自适应中枢(交叉三)。Idea总数 35→37(🟦19/🟪4/⬜16)。密集遮挡 L1→L3→K1→I1→交叉分析全链路闭环 ✅
- **本轮更新(2026-07-18 续十三:🔴 密集遮挡 D1 方向设计 ✅)**：**频域驱动的密集检测统一框架**——选定方案A(频域统一框架·Novelty最高)击败方案B(密度自适应管线·增量)/方案C(局部集合预测·高风险)。核心设计: S1空域高通代理判据(#30 §2复用)为共享上游→三条独立下游(①#35频域遮挡先验→替代OPL bbox重叠遮挡图 ②#38频谱感知Soft-NMS→NMS首次引入框内特征内容 ③#40连续密度感知LA→空间+频域联合密度软值)。三"首次"创新+渐进式论文策略(下游2 NMS→下游1 遮挡→统一框架)+三下游独立验证(风险隔离)。密集遮挡方向**L1→L3→K1→I1→交叉分析→D1 全链路闭环 ✅**。产出: [D1 设计文档](Ideas/dense_occlusion_d1_design.md)(~350行, 10节完整设计)
- **本轮更新(2026-07-18 续十四:🟠 OBB L1 补充检索 ✅)**：6 组关键词 × 3 轮检索, 命中 **21 篇**(P0×3: FAA CVPR 2026·频域×OBB首次交叉 / YOLO26-OBB·最新基线 / RDCNet·旋转感知LA; P1×4: BD Loss·旋转Loss新SOTA / HERO-Det AAAI 2026·Hilbert旋转等变 / SFMP-Net·空域频域融合 / GADet·轻量Pareto前沿; P2×14: 频域OBB×3/ YOLO-OBB应用×4/ 数据增强×2/ 旋转等变轻量×5)。核心发现: ①频域×OBB=全新交叉维度(此前项目未触及)→FAA的FFT角度估计+SFMP-Net空域频域融合为OBB×频域交叉分析提供技术入口 ②YOLO26-OBB的STAL+NMS-free+长边角度→直接影响OBB基线选型 ③旋转等变三范式成熟度提升(群卷积→极坐标→Hilbert曲线)。database 77→**98**条(🟠OBB 6→27)。OBB方向知识基础就绪→下一: P0 深读
- **本轮更新(2026-07-19 续二十八:#42 训练-推理解耦三范式设计空间 v1.0 ✅)**: G1-S4 Gap→**分析性论文初稿完成** → [idea_042_train_inference_decoupling_design_space.md](Ideas/idea_042_train_inference_decoupling_design_space.md) (~450行·12节)。核心: ①三范式形式化(辅助Loss训后丢弃·λ(t)衰减/辅助Head训后丢弃·物理移除/门控训后硬化·温度退火)·统一符号系统 ②设计空间四轴(注入位置×时机×移除方式×适用任务) ③3×3兼容性矩阵+梯度冲突诊断(YOLO-Master级联冲突警示) ④决策树+8场景速查表+5场景"不推荐"矩阵 ⑤9方法实例化映射(FS-Mamba唯一三范式全用·作者未意识·范式混合是常态5/9) ⑥8臂实验协议(B0+E1三范式+E2两两混合+E3全联合·5维评估)+Venue策略(IJCAI/AAAI分析性track)。**关键洞察**: 训练-推理解耦=2026共识设计模式(三独立趋势汇合); "方法论的论文"差异化定位。产出: candidate/ranking更新 + compare(结论45) + journal(#43) + research_history(续三十四)。**#42 文档启动 ✅·当前最高可推进性任务完成**
- **本轮更新(2026-07-19 续二十七:🟡 尺度变化 交叉分析 ✅)**: I1完成后→三维度交叉分析(Scale×条件计算/OBB/密集遮挡)。**核心发现: 频域判据=三维度交叉的通用语言**——同一频域图服务七条下游(空间门控+层级选择+专家路由+标签分配+NMS+遮挡检测+尺度估计)。产出: ①Scale×条件计算→三维统一计算分配框架(空间+层级+路由·~4.3) ②Scale×OBB→频域驱动免标注R-VIoU(FAA FAE角度+#11能量·~4.1)+四线OBB频域应用 ③Scale×密集遮挡→D1 v2.0升级路径(尺度自适应判据+联合衰减NMS+遮挡修正密度·~4.3)+遮挡-尺度退化-恢复完整管线。**7个新高分交叉Idea候选**(P0:三维统一分配+D1 v2.0 / P1:免标注R-VIoU+尺度感知遮挡+三态门控 / P2:动态迭代深度+OBB判据族)。理论贡献从"更好的检测器组件"升级为"被验证的通用物理先验+全场景自适应检测器"。产出: research_gap.md交叉分析专节(~200行·四模块) + compare结论44 + journal(#42) + research_history(续三十三)。**🟡 尺度方向 L1→P0→K1→G1→I1→交叉分析 全链路闭环 ✅**
- **本轮更新(2026-07-19 续二十六:🟡 尺度变化 I1 Idea生成 ✅)**：G1→I1 **8条正式Idea**落地——4新(#42-#45)+4升级(#5 v3.3/#11 v2.0/#38动机/#40 v2.0)。**新Idea**: #42 ⬜训练-推理解耦三范式设计空间(G1-S4·~4.2·**最高可推进性·70%文档推演**)/#43 🟦频域驱动MoE空间路由(G1-S1·~4.0·条件计算×MoE首次交叉)/#44 🟠OBB旋转框双维LA(G1-X2·~3.8·VALA→OBB扩展)/#45 🟦频域门控路线裁决(G1-S5·~3.7·可学习vs免训练head-to-head)。**已有升级**: #5→v3.3层级+空间双维条件计算(G1-X1)/#11→v2.0频域双模统一框架(G1-S2·增强+节省)/#38→G1-L2动机强化(30篇零频域NMS)/#40→v2.0尺度×密度双维LA(G1-S3·VALA+DALA联合)。**Idea总数 37→41**(🟦YOLO 18→21/🟪DETR 4/⬜通用 16→17/🟠OBB #17+#44=2)。关键发现: ①#42=最低悬垂果实·可立即启动文档撰写 ②频域判据应用维度爆发(5线下游:MoE路由+条件计算+NMS+遮挡+尺度) ③条件计算三维扩展(空间+层级+路由) ④LA双维升级(密度+尺度)。产出: candidate.md(+4新+4升级注释) + innovation_ranking.md(新增4条目+更新4条目+路径九+架构刷新) + research_gap.md(I1交叉引用) + compare.md(结论43) + journal(#41) + research_history(续三十二)。**🟡 尺度方向 L1→P0→K1→G1→I1 全链路闭环 ✅**
- **本轮更新(2026-07-19 续二十五:🟡 尺度变化 G1 Gap分析 ✅)**：基于K1知识补充→三模块系统化Gap分析(跨P0交叉8项+L1未覆盖6项+交叉维度6项=**20个系统性Gap**)。核心: ①G1-S1频域→MoE路由信号·条件计算双维融合·P0最高价值交汇点 ②G1-S2增强+节省统一框架·#11 v2.0核心方向 ③G1-S4训练-推理解耦三范式系统对比·**最低悬垂果实(70%可文档推演)**·独立分析性论文潜力 ④G1-X1层级+空间双维条件计算·#5从P2→全FPN升级。**8条I1 Idea入口**(G1-S4训练-推理解耦分析性论文⬜~4.2/G1-S1频域驱动MoE路由🟦~4.0/G1-S2频域双模统一🟦~4.0/G1-X1层级+空间双维🟦~4.0/G1-S3尺度×密度双维LA🟦~3.9/G1-L2频谱感知NMS🟦~3.8/G1-X2旋转框双维LA🟠~3.8/G1-S5频域门控路线裁决🟦~3.7)。五大发现: 频域→MoE路由=最高价值交叉点; 三范式对比=最低悬垂果实; 增强+节省统一=#11最高价值升级; 层级+空间双维=#5自然扩展; 频域判据一次计算五线共享(MoE路由+条件计算+NMS+遮挡+尺度)。产出: research_gap.md G1专节(~350行·20Gap·优先级排序表+I1路线图) + compare结论42 + journal(第四十次) + research_history(续三十一)
- **本轮更新(2026-07-19 续二十四:🟡 尺度变化 K1 知识补充 ✅)**：基于4篇P0深读+30篇L1检索→loss.md/augmentation.md/head.md三文件尺度专节(共~520行)。核心产出: loss §🟡(LA三维创新空间·VALA VIoU+DSS·Anchor-free适配路径·推荐栈) / augmentation §🟡(五级增强体系·SR辅助范式·频域多尺度族·动态分辨率) / head §🟡(六级Head分类·MoE路由·FDHead算力代价·SR辅助Head·Head条件计算蓝海) + compare结论41 + timeline双增强线(尺度感知LA线+训练-推理解耦线) + research_gap K1专节(8个系统性Gap·跨论文交叉视角)。关键洞察: ①LA三维独立可叠加→#40双维升级 ②训练-推理解耦三范式从未系统对比→独立论文潜力 ③FDHead 55.6%FLOPs=#11节省路线最强动机 ④Head端条件计算=完全蓝海 ⑤频域判据双用途(尺度指示+密度指示)。**尺度方向知识基础设施就绪 ✅**。产出: journal(第三十九次) + research_history(续三十)
- **本轮更新(2026-07-19 续二十三:🟡 尺度变化 P0 深读 FS-Mamba ✅·尺度P0收官)**：FS-Mamba (Displays 2026, 南京航空航天大学)——**Mamba SSM×频域解耦×SR辅助训练·尺度P0第四篇收官**。FDVSSBlock(Backbone·FDGate门控高通滤波)+FPU(Neck·双门控频率保持)+PDFAM(金字塔双融合注意力)+SR辅助训练头(训后丢弃·零推理开销)。VisDrone/UAV-ROD/WX-Road三基准。核心洞察: ①FDGate可学习门控 vs #11免训练判据=频域门控方法论对照 ②SR辅助 vs SET vs #5 Gumbel=训练-推理解耦三范式 ③Mamba→CNN迁移是首要障碍。产出: [Summary](papers/summaries/FS-Mamba_Displays2026.md)(~350行·10节·5方向) + database快评→🔬P0 + compare结论40 + timeline + research_gap 8条目 + journal(第三十八次)。**🟡 尺度变化 P0 深读 4/4 全部完成 ✅** (YOLO-Master+DERNet+VALA+FS-Mamba)
- **本轮更新(2026-07-19 续二十二:🟡 尺度变化 P0 深读 VALA ✅)**：VALA (Neurocomputing 2026, 国防科技大学)——**首个将锚框尺度引入标签分配·尺度维LA开辟者**。VIoU(逐层GT尺寸统计→虚拟锚框尺度重校准→IoU一致性保持)+DSS(训练期渐进衰减归一化·课程学习式正则化)。AI-TOD 27.9/AI-TODv2 26.9/VisDrone 29.4 AP; 零架构修改+零推理开销+纯训练期LA。核心洞察: ①LA第三创新维度(规则/度量→尺度)→DALA(密度维)×VALA(尺度维)=双维自适应LA→#40最明确升级方向 ②anchor-free迁移需"逐层scale range重校准"等效设计 ③虚拟锚框为静态统计→频域判据可升级为动态校准。产出: [Summary](papers/summaries/VALA_Neurocomputing2026.md)(~350行·10节·5方向+YOLO迁移过滤器) + database快评→🔬P0 + compare结论39 + timeline 2026线 + research_gap 8条目 + journal(第三十七次)。**尺度P0进度: 3/4** (YOLO-Master✅ + DERNet✅ + VALA✅ → 最后一篇: FS-Mamba)
- **本轮更新(2026-07-19 续二十一:🟡 尺度变化 P0 深读 DERNet ✅)**：DERNet (arXiv 2026.06, 南方科技大学)——**频域全管线特征学习最系统化方案·增强vs节省路线分野**。DER统一算子: WDG(Backbone·Haar DWT+RepCDC+HF自派生门控g∈(0,1)→x̃_LL=y_LL⊙(1+g))+LGE(Neck·Log-Gabor K=2/S=1+WTConv变体)+FDHead(P2-only·box-only·SHG)。DERNet-S **1.3M参数**(↓86.2% vs YOLOv11-S 9.4M)/13.3GFLOPs→VisDrone test 0.316(+0.005); DERNet-M 2.9M→0.362(超YOLOv11-M 20M); A100 162FPS/Jetson Nano 22FPS; 五检测器跨架构。核心洞察: ①"增强vs节省"路线分野——DERNet所有位置做频域增强 vs #11高频区算·低频区跳过→FDHead 55.6%GFLOPs占比=频域增强算力代价定量暴露→#11"节省"路线根本动机数据点 ②WDG的HF门控g可直接作为#11 P2稀疏化判据 ③三模块互补性低于预期(All three 0.458 vs WDG+FDHead 0.464→LGE无增量)。产出: [Summary](papers/summaries/DERNet_2026.md)(~350行·11节·6研究方向+YOLO迁移过滤器) + database快评→🔬P0 + compare结论38 + timeline 2026线/频域检测线双更新 + research_gap 10条目 + journal(第三十六次)。**尺度P0进度: 2/4** (YOLO-Master✅ + DERNet✅ → 下一: VALA)
- **本轮更新(2026-07-19 续二十:🟡 尺度变化 P0 深读 YOLO-Master ✅)**：YOLO-Master (CVPR 2026, Tencent)——**首个MoE×YOLO深度融合·感受野维条件计算标杆**。ES-MoE: 多尺度专家(3×3/5×5/7×7 DWConv·E=4)+动态路由(GAP→γ=8→Soft→Hard Top-K·K=2)+负载均衡(λ=1.5)。COCO 42.4%@1.62ms(+0.8 vs YOLOv13-N·快17.8%); **VisDrone +2.1 mAP 跨基准最大增益**。关键发现: Backbone-only最优(级联梯度冲突→#5 P2专注Backbone获CVPR 2026独立验证); DFL移除共识(与YOLO26-OBB DFL-free双证); 条件计算路线扩充为五维(通道/感受野/空间/专家/token)。产出: [Summary](papers/summaries/YOLO-Master_CVPR2026.md)(~350行·9节·6研究方向) + database ⚡→🔬 + compare结论37 + timeline门控线+research_gap 9条目 + journal(第三十五次)
- **本轮更新(2026-07-19 续十九:🟠 OBB K1 知识补充 ✅)**：loss.md §🟠OBB(旋转Loss六方法谱系+推荐栈) / augmentation.md §🟠OBB(旋转增强挑战+策略+等变关系) / head.md §🟠OBB(五类头分类体系+三级解耦路线)。基于 FAA+YOLO26-OBB+RDCNet 三篇P0深读+OBB L1 21篇交叉提炼, **OBB方向知识基础设施就绪**。
- **本轮更新(2026-07-18 续十八:🟠 OBB P0 深读 RDCNet ✅)**：RDCNet (IEEE JSTARS 2026.04)——**极坐标DCN+AALA**。旋转等变最简实现: DCN偏移从笛卡尔(Δx,Δy)→极坐标(ρ,θ)→显式解耦尺度-方向, ~3M参数增量; AALA宽高比无关centerness→几何感知+任务对齐LA免阈值统一。DOTA **81.37%@35FPS/29.1M/108GFLOPs**(RTMDet-R-L 56%参数→+3.04 mAP)。关键发现: FAA FAE(FFT→极坐标)与RDC RDC(极坐标DCN)共享(ρ,θ)参数化→频域判据+空间旋转感知的数学桥梁→FAA+RDC+#30三线融合锚点。**OBB P0 深读全部完成(3/3)**: FAA(CVPR 2026·频域角度) + YOLO26-OBB(arXiv 2026.06·YOLO OBB最强基线) + RDCNet(IEEE JSTARS 2026.04·极坐标DCN+AALA) — 三角互补: 频域方向/空间域方向/检测头+Loss。产出: [Summary](papers/summaries/RDCNet_JSTARS2026.md)(~350行, 9节+6研究方向+YOLO迁移过滤器) + database ⚡→🔬 + compare结论36 + timeline旋转等变三范式线 + research_gap 9条目 + journal(第三十三次)
- **本轮更新(2026-07-18 续十七:🟠 OBB P0 深读 YOLO26-OBB ✅)**：YOLO26-OBB (arXiv 2026.06, Ultralytics)——**2026 YOLO OBB单一最强基线**。五项核心改进: ①长边角度定义[-45°,135°)→消除边界不连续 ②直接角度回归→移除sigmoid非线性 ③宽高比感知角度损失sin²(2Δθ̃)·ωᵢ(λ=3最优) ④NMS-free双头+Progressive Loss ⑤STAL+DFL-free+MuSGD。DOTA-v1.0 +2.5~3.4 mAP vs YOLO11-OBB; AP₇₅ +4.6~6.0。**YOLO11-OBB已过时**（角度表示有根本缺陷）。产出: [Summary](papers/summaries/YOLO26-OBB_arXiv2026.md) + database ⚡→🔬 + KB全线同步 + journal(第三十二次)
- **本轮更新(2026-07-18 续十六:🟠 OBB P0 深读 FAA CVPR 2026 ✅)**：FAA: Fourier Angle Alignment (CVPR 2026, 北理/港大/东北大学)——**频域×OBB首次系统性交叉**。FAE(FFT角度估计: 2D FFT→极坐标→径向加权积分→atan2主方向)+FAAFusion(低层方向引导高层对齐, 替换FPN加法)+FAA Head(RoI→规范角0°分类-回归解耦)。DOTA-v1.0 **78.72% SOTA**/v1.5 **72.28% SOTA**。YOLO迁移: ①FAE角度→OBB NMS频域相似度替代旋转IoU ②FAAFusion→YOLO PAN方向感知融合→#9第三对照臂 ③方向一致性→条件计算第四维判据(方向模糊区激进稀疏化)。项目协同: #11高频能量(重要性)+FAA角度(方向)+#25频率签名(形状)=三维频域判据族。产出: [Summary](papers/summaries/FAA_CVPR2026.md)(~350行, 9节+5研究方向+YOLO迁移过滤器) + database ⚡→🔬 + compare结论34 + timeline OBB×频域支线 + research_gap FAA段(8个新Gap) + journal(第三十一次)
- **本轮更新(2026-07-18 续十五:🟡 尺度变化 L1 补充检索 ✅)**：6 组关键词 × 4 轮检索, 命中 **30 篇**(P0×4: YOLO-Master CVPR 2026·MoE×YOLO多尺度专家 / DERNet·频域三阶段特征学习 / VALA·虚拟锚框尺度感知LA / FS-Mamba·频域门控+SR辅助零推理开销; P1×5; P2×21·自适应感受野7/尺度感知LA 5/极端小目标增强10/Neck 2/频域×尺度8/条件计算×尺度2)。核心发现: ①尺度维度存量最大(30篇vs OBB 21篇vs密集遮挡13篇) ②频域×尺度=最成熟交叉维度(8篇·DERNet三阶段频域/小波+Fourier双频域) ③尺度感知LA成为独立方向(5篇·VALA/DCNet/CVPR 2026 SA-Matching DETR) ④YOLO-Master=MoE进入YOLO·多尺度专家路由(CVPR 2026·Tencent) ⑤SR辅助分支=小目标增强最优雅方案(训练专用→零推理开销)。**三维度扩展 L1 检索全部完成** 🔴密集遮挡(13篇)+🟠OBB(21篇)+🟡尺度(30篇)=**64篇新文献入库**。database 98→**128**条
- **本轮更新(2026-07-18 续九:🔴 密集遮挡 L3 知识提取)**：**11篇论文知识体系闭环**——①loss.md 遮挡感知损失函数体系(七大类 taxonomy + 范式演化图谱 2017→Future) ②head.md 密集遮挡检测头设计(五大类 taxonomy + 五维对比表) ③NMS 演进线(完整演化图谱 + 六方法技术维度对比) ④compare.md 结论33(11篇知识全景 + 频域判据复用价值)。关键整合: 遮挡先验来源演化(人工→自动GT→物理先验→内容先验); 三阶段覆盖从未联合(训练期回归+匹配+推理后处理); 频域判据一次计算三次收益(#11/#35/#38); 检测头双维门控空白(通道×空间)。密集遮挡 L3 知识提取全部完成 ✅ → 下一: K1 Gap 分析
- **本轮更新(2026-07-18 续十:📋 数据库质量筛选)**：**移除 5 篇纯 arXiv 论文**——按用户四条标准(有venue/高引用/知名机构/有代码)逐篇审核 18 篇纯 arXiv 论文: ❌PST(arXiv 1年+无venue)/❌HI-MoE(preliminary自认)/❌DroneScan-YOLO(仅快评)/❌DisDop(仅快评)/❌RFAssigner(无详情无代码)。保留 13 篇(YOLOE/PRNet/CLIP-Bias/DERNet/FMC-DETR/D³R-DETR/DFIR-DETR/EFSI-DETR/TinyFormer/ViCrop-Det/STAL/MOCHA均深度集成知识库或满足机构/影响标准; Dome-DETR 已有 ACM MM 2025 venue)。数据库 82→**77** 条，快评 31→26。
- **本轮更新(2026-07-18 续六:📋 策略修订)**：用户决策——**DETR 降级为交叉融合副线，YOLO 回归唯一主战场**。推翻同日早些时候的「DETR 轨道强化」计划(DX1-DX5)。核心变化:①B轨从并行主方向降为 YOLO 灵感源(~5%资源);②DETR 论文阅读新原则——每篇必须通过「YOLO 迁移过滤器」(这对 YOLO 有什么用?)；③停止 DETR 独立 Idea 生成/设计文档;④#32💤 纯 DETR 机制存档;⑤DX1.5 P1 5 篇 DETR 深读全部取消;⑥DETR P1 深读队列取消。详见 [research_strategy.md](Decision/research_strategy.md) § DETR交叉融合。
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
- **本轮更新(2026-07-18)**：**文献检索轮 ✅——Dome 放码 + #5 哨点降级 + 双 gap 维持**——①**Dome-DETR 放码✅+ACM MM 2025 接收确认**(S/M/L 权重+训练日志;#30 E1 生死项升级"官方代码对照";⚠️动态query限单批训练);②**Unmasking the Tiny 见刊细节**(IVC Vol.172:STSM+FRM=**补强式加法** vs #5 跳过式减法方向相反 → 哨点降级普通近邻);③HF-DETR 仍付费墙(SSMG 裁决悬置);④新作划界:FSDETR=频域浪潮**第 7 篇**纯增强/HI-MoE 专家维 MoE 与#30正交+通路侧翼佐证/MFVL-YOLO 熵引导前景增强与#5划界;⑤数据点:PRNet VisDrone AP50 54.1=检索所见最高、Scale-Conscious KD=**#7 现成消融对照轴**;数据库 **60 条**/🔔×2
- **本轮更新(2026-07-18 续:PRNet 深读 🔬)**: PRNet(arXiv 2510.09531)升级深读——PRN(P2^in 多次复用+迭代精炼)单模块 +10.3 AP50/参数反降/FLOPs+110.7%=**#5 motivation 最强新证**;P2 路线图第四分支(骨干复用)确立;静态迭代深度→层深维条件计算入口;DETR 增益缩水→#24 跨架构实证;Summary 入库(全协议)。
- **本轮更新(2026-07-18 续二:🟪 DETR 轨道强化 → ⚠️ 已由续六策略修订取代)**: ~~用户指令—B轨 DETR 研究不足须加强。强化方案:DX1–DX5 五阶段推进,B轨占比 15%→30%,目标 B轨专属 Idea 2→8-12。~~ **2026-07-18 策略修订推翻此方案: DETR 降级为交叉融合副线,YOLO 回归唯一主战场。**
- **本轮更新(2026-07-18 续四:OPL 深读 🔬)**: OPL(ESWA 2025)**首个显式遮挡感知损失**深读(付费墙多源重构)——OPD(Transformer遮挡图)+OPL(bbox重叠×高斯模糊监督)+OPC(遮挡图注入)三元组;遮挡召回率95.4%(+22.6%);核心发现:①频域判据可替代bbox重叠→免重叠遮挡图生成(#35);②遮挡区域天然高熵假设(#36)→熵图可能=零参数遮挡先验;③DETR比CNN更适合OPL范式(Cross-Attn全局感受野+per-query建模);KB 4文件更新(loss/head/attention/research_gap)+database OPL ⚡→🔬;Idea **30→32**(🔴密集遮挡首批:#35频域遮挡先验 3.8+#36语义熵隐式遮挡检测器 3.9)。
- **本轮更新(2026-07-18 续五:🟪 Dynamic DETR ICML'25 深读 🔬 + #30 撞车裁决)**: DX1.5 P0 首篇深读完成(PMLR 全文 15 页)——**⚖️ 裁决:与 #30 不撞车**:其判据实为 **attention weight 离线统计先验**(COCO val-set 统计→stage 级保留率重排 ρ^s=ρ[I^s],非输入自适应/非端到端学习/未触频谱)→"免监督输入自适应判据"空白第三次确认,Dynamic DETR 从"概念红线威胁"转为 **#30 SOTA 对照基线**(DINO −42% FLOPs 仅 −0.7 AP,胜 Sparse/Lite/Focus 全系=唯一净省算力 token 稀疏化 SOTA)。核心收获:①重要性跨层迁移规律(浅层→深层,VisDrone 未验证=攻击面);②合并式(MTA 双轨聚合)>丢弃式硬证据;③RCDR 中心正则(+0.6 AP 零推理开销,判据无关)=#30 可直接引入组件;④"token 稀疏化×小目标基准"系统性空缺(四方法全部仅测 COCO 系)。产出:[Summary](papers/summaries/Dynamic-DETR_ICML2025.md)+KB 四件套(attention 条目10/detr_map 主线3+概念红线深读标记/research_gap/compare 结论29)+database ⚡→🔬(🔔 3→2)+新 Idea **#33**(频谱判据×MTA框架融合, 3.8, **#30 v1.1 候选升级件**:E1 三臂对照)/**#34**(密度自适应聚合窗口·小目标合并豁免, 3.5);Idea 总数 **28→30**(与 OPL 衍生 #35/#36 合计后实录 **32**,见 ranking 统计)。
- **本轮更新(2026-07-18 续十一:📊 论文质量分类体系)**：**论文分类前端上线**——按6级分类(【自】用户投喂/顶会顶刊/已发表/双重背书/单一背书/纯arXiv) × 6维标签(【自】/顶会/已发表/有代码/知名机构/纯arXiv) 组织全部77篇论文；[classification.json](papers/classification.json) 结构化数据 + Dashboard「📊 论文分类」交互视图；每篇论文按时间排序+点击弹窗查看summary；标签系统由后台agent逐篇核实代码/机构/venue。——**命中 22 篇**(密集13 + DETR9);密集方向:DALA(首个密度感知LA)/OPL(首个显式遮挡Loss,召回95.4%)/OAR-Loss(RepLoss 2025变体)/FAFL(五组件遮挡损失)/HEdge-MamYOLO(频域+Mamba,52.5%)等;DETR方向:**Dynamic DETR(ICML 2025,概念红线缺口)**/Adaptive Query Allocation(DETR query冲突)/RS-DETR+RO²-DETR(O²外旋转DETR)/Hausdorff Matching(WACV 2025)等。database 总条目 60→**78**(新增「九、🔴密集遮挡」10条+「十、🟪DETR专属扩展」8条);[quick_eval](papers/summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) 含深读优先级(P0×3/P1×8/P2×7)。

## Research Progress
| 指标 | 数量 |
|------|------|
| 已读论文 | 110 |
| 已总结论文 | 45 |
| 🟡 尺度 K1 知识补充(本日增量) | 1(loss/augmentation/head 三文件尺度专节·~520行·尺度知识基础设施就绪 ✅) |
| 🔬 FS-Mamba P0 深读(本日增量) | 1(Displays 2026·Mamba SSM×频域解耦×SR辅助·尺度P0收官) |
| 🔬 VALA P0 深读(本日增量) | 1(Neurocomputing 2026·虚拟锚框尺度校准·LA第三维度·尺度×密度双维LA空白) |
| 🔬 DERNet P0 深读(本日增量) | 1(arXiv 2026.06·频域全管线DER统一算子·增强vs节省路线分野) |
| 🔬 YOLO-Master 深读(本日增量) | 1(CVPR 2026·Tencent·首个MoE×YOLO·VisDrone+2.1 mAP跨基准最大) |
| 🔬 RDCNet 深读(本日增量) | 1(IEEE JSTARS 2026·极坐标DCN+AALA·OBB P0收官) |
| 🔬 PRNet 深读(本日增量) | 1(VisDrone 最高纪录拆解,#5 motivation 最强新证) |
| 🔬 Dynamic DETR 深读(本日增量) | 1(ICML 2025 全文;#30 撞车裁决=不撞车→SOTA 对照基线;#33/#34 新Idea) |
| 🆕 密集遮挡 L1 检索 | 13 篇快评(快速评估文档) |
| 🆕 DETR DX1 检索 | 9 篇快评(快速评估文档) |
| 已对比论文 | 43 |
| SOTA 最近更新 | 是（2026-07-17）|

## Knowledge Base Status
| Backbone | Neck | Head | Loss | Attention | Training | Augmentation | Dataset | Timeline | Compare | Research Gap | Future Work |
|----------|------|------|------|-----------|----------|-------------|---------|----------|---------|-------------|-------------|
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Idea Pipeline
| 候选Idea | 已验证Idea | 已设计方向 |
|----------|-----------|-----------|
| 41（🟦21 / 🟪4 / ⬜17 / 🟠2） | 0 | 6 (#5 v3.0→🆕**v3.3**·层级+空间双维 + #11 v1.1→🆕**v2.0**·频域双模 + #7 技术基线 + **#30 v1.0** + **D1 密集遮挡方向设计 v1.0** + 🆕**#42 v1.0**·训练-推理解耦三范式设计空间) |

## Current Ideas（按 innovation_ranking 排序）
> 🧭 **架构方向分类(2026-07-18 策略修订: YOLO 为主,DETR 交叉融合副线)**: 🟦YOLO主线 21个(#5#6#7#8#9#10#11#12#13#15#16#17#21#22#37#39#40#43#44#45+#1) | 🟪DETR交叉融合 4个(**#30**(判据通用)+#14(降级对照)+**#33**(Dynamic DETR交叉,判据通用)+**#34**(小目标×token稀疏化,概念层可迁移); **#32💤**(纯DETR机制存档) | ⬜通用理论 17个(#18#19#20#23#24#25#26#27#28#29#31#35#36#38#41#42) | 🟠OBB 2个(#17#44) | 🆕 2026-07-19 I1新增 #42–#45·Idea总数 37→41,详见 [innovation_ranking.md](Ideas/innovation_ranking.md)

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
| 30 | 🟪 **免监督频谱判据→DETR浅层token条件计算** | **3.9** B轨主Idea;查新✅+**技术方案 v1.0.1 ✅**(S1空域高通代理判据/D-FINE接入点无NMS/E1判据头对头=生死项;**Dome 放码✅→E1 官方对照**)→ [方案](Ideas/idea_030_technical_proposal_v1.md) |
| 19 | 三判据对照实验(CLIP vs DINOv2 vs FFT) | **3.8** 路径三;确定最佳判据前置实验 |
| 15 | 三源门控融合(振幅×熵×高频) | **3.8** CLIP偏差→双源互补价值提升 |
| 42 | ⬜ **训练-推理解耦三范式设计空间** | **4.2** 🆕 G1-S4·I1; **Designing ✅ v1.0** → [设计文档](Ideas/idea_042_train_inference_decoupling_design_space.md)(~450行·12节·三范式形式化+四轴设计空间+3×3兼容性+决策树+8臂实验协议) |
| 43 | 🟦 **频域驱动的MoE空间路由** | **4.0** 🆕 G1-S1·I1;条件计算×MoE首次交叉 |
| 44 | 🟠 **OBB旋转框双维LA** | **3.8** 🆕 G1-X2·I1;R-VIoU·FAA角度先验 |
| 45 | 🟦 **频域门控路线裁决** | **3.7** 🆕 G1-S5·I1;可学习vs免训练裁决 |
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
1. 🔴 **密集遮挡方向**: L1→L3→K1→I1→交叉分析→**D1 方向设计 ✅ 全部完成** → 下一: 实验模块就绪后 D1 Phase 0 判据确认(E0+E4)⏸
2. 🟠 **OBB 方向**: L1 检索 ✅(21篇) → **P0 深读 ✅(3/3) + K1 知识补充 ✅** → **G1 Gap分析 ✅(19Gap·8 I1入口)** → 下一: I1 Idea 生成
3. 🟡 **尺度变化方向**: L1 ✅(30篇) → P0 ✅(4/4) → K1 ✅ → G1 ✅(20Gap) → I1 ✅(8条Idea·4新+4升级·37→41) → 交叉分析 ✅(三维度·7个新高分交叉候选) → **#42 文档启动 ✅(v1.0·分析性论文初稿)** → 下一: OBB I1 或 #42 英文论文转写
4. **三维度扩展 L1 全部完成** 🔴密集遮挡(13篇·全链路闭环✅)+🟠OBB(21篇)+🟡尺度(30篇)=**64篇新文献**; database 77→128
2. 持续检索 2025–2026 顶会顶刊新作(双轨全类目;✅ 07-18 检索轮完成);🔔 **HF-DETR 全文(SSMG 判据裁决, 付费墙悬置)**; 🔔 Unmasking the Tiny 代码(**哨点已降级**→低频跟踪)
3. ⏸ 暂缓(待实验模块):B轨基线选型、#5 v3.0 M0–M4、**#30 E1 判据 vs DeFE 头对头+ E3 AUROC**、SLE baseline 复现(#6+#12)、密集遮挡方向全部实验验证
   > ✅ 已完成移出:~~K1 Gap分析~~/~~I1 Idea生成~~/~~交叉分析~~/~~D1 方向设计~~——**密集遮挡 L1→L3→K1→I1→交叉分析→D1 全链路闭环 ✅**

## Roadmap
| 阶段 | 状态 |
|------|------|
| 1. 阅读论文 | 🟩 进行中（54篇深读,双轨:🟦A轨 + 🟪B轨基础线4/4✅;🔴密集 L1→D1✅;🟠OBB L1→P0→K1→**G1✅**;🟡尺度 L1→P0→K1→G1→I1→交叉分析✅·全链路闭环）|
| 2. 总结论文 | 🟩 进行中（45篇深读总结）|
| 3. 构建知识库 | 🟩 12/12 + OBB K1 + 尺度 K1(loss/augmentation/head 三文件尺度专节) |
| 4. 分析研究缺口 | 🟨 多维度Gap(🔴密集K1 19Gap✅+🟡尺度K1 8Gap+G1 20Gap✅+🆕**🟠OBB G1 19Gap✅**;频域条件计算空白维持) |
| 5. 提出并评估 Idea | 🟨 41个候选(🟦21/🟪4/⬜17/🟠2) + 🆕 OBB I1 8条待录入 |
| 6. 设计研究方向 | 🟩 **5 设计文档**（🟦#5 v3.0+§十划界 + #11 v1.1 + #7 基线;🟪#30 v1.0·基线初判D-FINE;🆕🔴D1 v1.0）+ 🟠OBB+🟡尺度双K1 知识基础设施就绪 ✅ |
| 7. Idea 生成元研究 | 🟩 已完成（三路径分析, #18–#29 录入） |

## Records
| 类型 | 表格 |
|------|------|
| **论文数据库** | **papers/database.md(50 条结构化索引,八大主题分区)** |
| Idea 历史 | 见 Ideas/innovation_ranking.md |
| 阅读历史 | SEEN-DA（CVPR 2025）✅ \| SEMA-YOLO（RS 2025）✅ \| SFIDM（RS 2025）✅ \| RFLA（ECCV 2022）✅ \| YOLO-World（CVPR 2024）✅ \| YOLOE（arXiv 2025）✅ \| Token Cropr（CVPR 2025）✅ \| TinyFormer（arXiv 2026）✅ \| DERNet（arXiv 2026）✅ \| SET（CVPR 2025）✅ \| D3Q（JSTARS 2025）✅ \| SFDNet（ECCV 2026）✅ \| FMC-DETR（arXiv 2025）✅ \| FDConv（CVPR 2025）✅ \| YOLOv12（NeurIPS 2025）✅ \| MGS（MLSP 2025）✅ \| ELDET（NeurIPS 2025）✅ \| GCA2Net（RS 2025）✅ \| ACM-Coder（CVPR 2024）✅ \| ALGS（TGRS 2025）✅ \| **ViCrop-Det（arXiv 2026.04）✅** \| **D³R-DETR（arXiv 2026.01）✅** \| **DM-EFS（ICCV 2025）✅** \| **O²-DFINE/O²-RTDETR（TGRS 2026）✅** \| **MOCHA（arXiv 2026）✅** \| **CLIP-Bias（arXiv 2026.07）✅** \| **YOLO26 STAL（arXiv 2026.06）✅** \| **Mask-Guided Distillation（IEEE 2026）快速评估✅** \| **NSSA（SciRep 2026）快速评估✅** \| **SViT（WACV 2024）✅** \| **DFIR-DETR（arXiv 2026）✅** \| **DQ-DETR（ECCV 2024）✅** \| **FFCA-YOLO（IEEE 2024）快速评估✅** \| **MDI-YOLO（SciRep 2026）快速评估✅** \| **SFS-DETR（CVPR 2026F）快速评估✅** \| **AD-Det（RS 2025）✅** \| **HashEye（SciRep 2026）深度评估✅** \| **EFSI-DETR（arXiv 2026.01）深度评估✅** \| **DroneScan-YOLO（arXiv 2026.04）快速评估✅** \| **SPA/SPT（ICLR 2026）深度评估✅** \| **Unmasking the Tiny（IVC 2026）快速评估✅🔔跟踪** \| **PST（arXiv 2025.05）快速评估✅** \| **🟪 RT-DETR（CVPR 2024）✅** \| **🟪 D-FINE（ICLR 2025）✅** \| **🟪 Deformable DETR（ICLR 2021）✅** \| **🟪 DINO（ICLR 2023）✅** \| **OPL（ESWA 2025）✅(🔬深读 2026-07-18)** | **🟪🔴 Dome-DETR（arXiv 2025.05）✅** |
| 方向设计历史 | Idea 生成突破分析（三路径元研究）✅ \| **D1 密集遮挡方向设计（频域统一框架 v1.0）✅** |

---
*Last Update: 2026-07-19 | Maintainer: Claude Code | #42 v1.0 分析性论文初稿 ✅*
