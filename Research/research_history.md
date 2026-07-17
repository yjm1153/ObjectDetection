# Research History

## 2026-07-17 (续十一) — 文献检索轮:HF-DETR 撞车监控入库 + 双轨 gap 再确认

- **任务**: 双轨全类目 2025–2026 新作检索(设计文档栈闭环后唯一无阻塞工作线);检索面 = UFO-DETR 追查 / DETR token 稀疏 / YOLO P2 / #5 近邻(语义熵空间门控)/ Dome 放码跟踪
- **核心命中: HF-DETR(IEEE SPL 2026, Zhu & Zhang)⚠️🔔 → 新建 `papers/summaries/HF-DETR_SPL2026.md`**
  - 三组件: FSD-Stem(LoG 算子降采样前隔离边缘)/ FEFR-Encoder(小波逆投影重建细节)/ **SSMG(Sparse Saliency Micro-Gating,saliency 驱动 token 稀疏抑制背景)**;VisDrone2019-DET AP +4.3 / AP50 +6.0,参数 10.2M→8.6M,121 FPS
  - **撞车分析(入库核心目的)**: 「高频+token稀疏+VisDrone+实时」四要素齐聚 = #30 组合空间迄今最近的已发表邻居。划界(基于现有信息): ①其高频组件做**特征增强**(把高频加回特征)vs #30 做**判据统计**(用高频响应决定预算)——同工具不同用途;②SSMG 大概率可学习微门("Micro-Gating"命名)→ 落「learnable gating」已占概念区,与 #30 免监督零参数判据可划界;③未做 query 预算分配/跨数据集判据迁移
  - **风险敞口**: 无 arXiv 版、IEEE 全文不可获取 → **SSMG 判据性质未核实;若实为免监督统计门则直接命中 #30 核心卖点** → 🔔 挂跟踪(全项目第 2 项),#30 方案 §6 新增风险 5
  - 正面价值: LoG(Laplacian 家族)被 SPL 采用为高频提取器 = S1 空域高通代理工具选择又一独立佐证;同时强化「实现无关叙事」必要性(工具层已拥挤,贡献必须锚在判据→预算分配范式层)
- **UFO-DETR(CSCWD 2026)快评补全数字**: LSKNet(GFLOPs 103.5→37.6)+ DAttention/AIFI + DynFreq-C3(内用 FDConv);VisDrone mAP50 43.5→46.1(vs RT-DETR-L);判定维持——纯"频域增强+轻量化",不做条件计算,不威胁 #30/#11;频域浪潮计数: 5 核心 + 2 外围 + HF-DETR
- **无新撞车三确认**: ①#5 近邻检索(semantic entropy spatial gating CNN sparsification)无新命中;②Dome-DETR 代码未放;③YOLO P2 侧 2026 批量新作——LAF-YOLOv10(arXiv 2602.13378,P2头+删P5,VisDrone 35.1)/ Edge-Constrained P2+QIEA(arXiv 2606.09081,**P2 分支 alone +31.10% AP_small**=#5/#6 新 motivation 数据点)/ Enhanced YOLOv11n / DMS-YOLO / SODM-YOLOv9 等——**全部是"加 P2 头"路线,无人做 P2 内部空间条件计算 → #5 gap 再确认**(本次在 YOLO 工程社区侧确认)
- **产出文件(7)**: HF-DETR_SPL2026.md(新建)+ quick_eval_attention_round1(UFO-DETR 条目补全)+ database.md(50 条/频域线 13/🔔×2)+ idea_030_technical_proposal_v1.md(§6 风险 5)+ innovation_ranking(#30 行+续十一日志)+ journal(第十五次)+ TASKS/README
- **下一步**: ①🔔 三跟踪项(HF-DETR 全文=SSMG 判据裁决 / Dome 放码 / Unmasking 放码);②周期性双轨检索继续;③⏸ 实验类待实验模块(E3 判据 AUROC / M0 熵图方向性 = 最低成本首验候选)

## 2026-07-17 (续十) — 🟦 A轨双文档修订:#11 v1.1 + #5 v3.0 Dome 划界段

- **任务**: TASKS 既定 A轨两项纯文档修订(实验类继续 ⏸)
- **#11 频域交叉分析 v1.1**(`Ideas/frequency_domain_cross_analysis.md`):
  - 工具首选更替: FFT → **S1 空域高通代理**(固定核深度卷积 Laplacian/Sobel);依据 = EFSI 硬消融(空域代理 33.1 > FFT 32.3 > DWT 32.1)+ 四条工程理由;工具对比表扩至 7 行(新增空域代理/DCT 行,DWT 降"暂不推荐")
  - 叙事抽象:「高频响应统计判据(实现无关)」;新增消融 **F-impl**(同判据形式换 S1/S2/S3 实现,与 #30 E2 共用)支撑论断
  - 判据维度: 三频段默认 → "先高频+局部异常度,三频段留 F3 裁决"(门控容错不对称原则)
  - **判据族权威定义收敛至 idea_030_technical_proposal_v1.md §2**——#11(YOLO P2)/#30(DETR 浅层 token)共用,杜绝两处分叉;⬜#24 "架构无关性"的文档基础闭环
  - SPA(ICLR 2026)GT 栅格化 BCE 门控(α=0.01)+packing 记录为 #5/#22 侧可学习升级选项;#11 主打免监督版明确不采用
  - §七 修订日志表(v1.0→v1.1 五项对照);未被新证据推翻的部分(§一/§二/§五/§六)保持原文
- **#5 v3.0 新增 §十 Related Work 划界: Dome-DETR**(`Ideas/idea_005_v3_design.md`):
  - 四轴划界表: ①架构载体(CNN P2 **卷积分支**空间计算 vs DETR encoder token 窗口注意力;token selection 社区 SPA/SViT 均 ViT 系,CNN 特征级未覆盖)②判据(零参语义熵复用 YOLOE cls logits vs DeFE 0.8M+GT 高斯密度+DRFL)③判据语义(**语义不确定性 vs 密度 = 正交信息维度**)④成本叙事(P2 已在 baseline 中→门控是净减法 −19%,vs Dome 加浅层特征控增量 +37%——互补不冲突)
  - 英文 RW 段落草案三点式(differs in three aspects),写论文直接用 = 先手引用消毒完成
  - 概念红线落款: #5 表述统一「熵引导的空间计算分配(entropy-guided spatial computation allocation)」
- **产出文件(6)**: frequency_domain_cross_analysis.md(v1.1)+ idea_005_v3_design.md(§十)+ innovation_ranking(#5/#11 行+续十日志)+ TASKS(双任务 ✅+Completed 续六)+ journal(第十四次)+ README/research_history
- **阶段判断**: 双轨设计文档栈全部闭环(🟦 #5 v3.0+§十 / #11 v1.1;🟪 #30 v1.0)——余下推进依赖实验模块或新文献;唯一无阻塞工作线 = 持续检索
- **下一步**: ①持续检索 2025–2026 双轨全类目新作(UFO-DETR 频域第 6 篇候选);🔔 Dome-DETR/Unmasking the Tiny 放码跟踪;②⏸ 实验类待实验模块(E3/M0 为最低成本首验候选)

## 2026-07-17 (续九) — 🟪 #30 技术方案 v1.0(判据选型 × D-FINE 接入点 × Dome 对照叙事)

- **任务**: B轨主 Idea #30 技术方案 v1.0(TASKS 既定下一优先,纯文档轮,实验全部 ⏸ 待实验模块)→ 新建 `Ideas/idea_030_technical_proposal_v1.md`
- **判据设计(§2,与 A轨 #11 共用判据族)**:
  - 三选项: **S1 空域高通代理(固定核深度卷积 Laplacian/Sobel,首选)** / S2 DCT 块统计(备选) / S3 FFT 频段能量(对照)——选型依据=EFSI 硬消融(空域代理 33.1 > FFT 32.3 > DWT 32.1)+ 其四条工程理由(kernel 融合/复数带宽/形状敏感/NPU 无 FFT 核)
  - 公式继承 #11 修正版: 高频响应 → 局部异常度归一(k=7,点状孤立高值=小目标↑/线状连续高值=建筑边缘↓,回应 SET 警告)→ 窗口 max-pool(与 Dome MWAS 同粒度 H/W=10)→ 自适应阈值+保底机制(照抄 Dome 防零激活)
  - 消融阶梯: 零参数主打 → +1 参数(可学习τ)→ 4 参数(三频段线性组合)——证明"判据不需要 0.8M"
  - 叙事抽象: 从"FFT 判据"→「高频响应统计判据(实现无关)」,规避 FFT 工具层撞车
- **D-FINE 接入点(§3,控制变量原则)**: P=最浅层判据(与 DeFE 同位,公平对照)/ E=MWAS 窗口注意力结构**沿用并显式引用**(非贡献;背景 token identity 直通——SViT"硬删除是崩溃根因"教训)/ Q=query 弹性预算掩码过滤,**不引入 Dynamic NMS**(保 D-FINE 端到端性=回应 Dome 攻击面③)。全部差异集中「判据+无NMS」两点 → 增益归因干净
- **对照叙事(§4)**: Dome 三攻击面→#30 三卖点(判据成本 ≈1/40 / 免监督跨数据集零重训 / 端到端保持);**定位诚实声明**: 不许诺净省算力(Dome GFLOPs +37% 教训),= "以受控成本引入浅层高分辨率信息,判据免费化"
- **实验协议锁定(§5,E0–E6)**: **E1 判据 vs 复现版 DeFE 头对头 = 生死项**(>1AP 差则退守"1/40 成本保 x% 增益");**E3 免训练判据热图 AUROC/召回@预算 = 实验模块最低成本首验(不训检测器)**;E4 跨数据集 τ 直接迁移(卖点②独有实验);E6 GFLOPs 报输入依赖分布+必报 FPS(修 Dome 未报最坏开销/FPS 的漏洞)
- **产出文件(6)**: idea_030_technical_proposal_v1.md(新建)+ innovation_ranking(rank11 状态+续九日志行)+ candidate(#30 Current Status)+ detr_map(挂点表 #30 行)+ TASKS(#30 任务 ✅+Completed 续五+#11 任务加引用注)+ journal(第十三次记录)
- **下一步**: ①🟦 A轨 #11 v1.1 修订(判据引用 #30 §2 避免分叉);②🟦 #5 v3.0 RW 补 Dome 划界段;③持续检索;🔔 跟踪 Dome/Unmasking 放码
- **风险跟踪**: 撞车窗口 6–12 个月(频域 DETR ~6篇/年)→ #30 维持最高优先;Dome 放码 = E1 升级官方对照(利好)

## 2026-07-17 (续八) — 🟪 B轨衍生查新裁决:#5-D ❌ / #11-D→#30 ✅

- **任务**: detr_map 规划的「B轨下一优先:#5-D/#11-D 查新与划界」三轮检索执行完毕
- **致命竞品 Dome-DETR**(arXiv 2505.05741, USTC, D-FINE 底座, 未开源)深读入库: DeFE 密度头(0.8M, GT 高斯密度图监督+DRFL 损失)→ MWAS 浅层掩码窗口 token 稀疏(自适应阈值二值掩码→窗口 max-pool→仅前景窗经过 APE 轴置换注意力)+ PAQI 渐进自适应 query(核心 K_N 保底+弹性 query 密度过滤+Dynamic NMS), AI-TOD-V2 34.6(+3.3)/VisDrone val 39.0(+2.5) 双 SOTA。攻击面:①**GFLOPs 比 D-FINE 高 37%**(非净省算力,"加浅层特征换精度、稀疏化控成本"叙事);②**判据需 GT 监督**(高斯密度图+DRFL)+0.8M 头,跨数据集重训;③**保留 NMS**(Dynamic NMS,3 超参:IoU_N/0.4+I oU_M/0.9+T_init/0.05),破坏端到端;④FPS 全文未报告
- **裁决**:
  - **#5-D ❌ 不占编号** — 「判据热图→二值掩码→浅层 token 稀疏+query 预算自适应」被 Dome 完整且高质量占据(同底座 D-FINE+同主战场 VisDrone·AI-TOD+同卖点小目标·效率);叠加 Dynamic DETR(ICML 2025, 学习式 token importance)、MATP·EnTeR(ViT 熵剪枝)、TREWA(免训练频谱剪枝——分类域)夹击,"熵×token 稀疏"无结构性空白。**熵判据遗产并入 #19 DETR 侧对照列**(作为 #30 的判据消融项);🟦 A轨 #5 YOLO P2 不受影响,但 v3.0 Related Work 须补 Dome-DETR 划界段
  - **#11-D ✅ → 正式占编号 #30「免监督频谱判据→DETR 浅层 token 条件计算」(Overall 3.9,B轨主 Idea)**:频域 DETR 竞品 6+ 篇(EFSI/UAV-DETR/D³R/DFIR/FMC/SFS)**全部停留增强范式,无人做 token 级"算/不算"的条件计算**(空白确认成立);分类域 TREWA 判据方向相反(保低频弃高频,小目标恰需高频→同工具反判据天然划界);Dome 反向佐证通路有效(+2.5~3.3), #30 差异=判据免监督零参数 vs 学习式 DeFE 头;三点划界红线(vs EFSI 增强非条件计算/vs UAV-DETR 融合软门控·避"frequency gating"字样/vs Dome 判据免监督零参数)——裁决文档 `Ideas/detr_derivative_novelty_check.md`
- **连带修正**: ①「全线无 P2」结论**失效**(Dome 已用最浅层四尺度特征+MWAS 控成本)→ #14 降级回结构对照,B轨入口由 #30 接替;②**概念红线大幅扩充**:「密度引导 token 稀疏」(Dome)、「learnable frequency gating」(UAV-DETR 融合软门控)、「学习式 token importance」(Dynamic DETR, ICML 2025)均已被占 → B轨合法表述收敛为「免监督/零参数判据驱动的 token 预算分配」;③B轨 SOTA 参照更新:VisDrone val 39.0(Dome-L,800²)→ 注意分辨率差异(多数工作 640)
- **产出文件**:
  - papers/summaries/Dome-DETR_arXiv2025.md(深读 summary 新建)
  - Ideas/detr_derivative_novelty_check.md(裁决文档新建,检索记录×竞品分析×#5-D/#11-D 裁决×连带修正)
  - Knowledge Base/detr_map.md(主线 1/2/3 全面修订:主线 1 #5-D→裁决记录+铁律按 #30 继承;主线 2 空白①失效+ Dome 行追加;Idea 挂点 #5-D→#30 更替;概念红线扩充;基线表 Dome 注记)
  - Knowledge Base/compare.md(表新增 Dome-DETR-L 行;追加结论 25:裁决要点/攻击面/概念红线扩充)
  - Knowledge Base/timeline.md(2025 行+Dome·Dynamic·UAV 三条目;B轨基座线全文修订:小目标分支+无P2失效+QS链裁决)
  - Knowledge Base/sota.md(表新增 Dome-DETR-L 行)
  - papers/database.md(分区八新增 Dome-DETR 🔴 行;49 条/35 深读/八分区全面更新)
  - Ideas/candidate.md(末尾追加 #30 详情+#5-D 裁决记录)
  - Ideas/innovation_ranking.md(表格:#30 排名 11(3.9)+后续 12→26 顺移;B轨区块:#5-D ❌→#30 ✅;统计 26 Idea;底部追加裁决日志)
  - README.md(续八更新;阶段 47篇;Idea 26;Current Ideas+#30 行/#5·#14 修订;Next Steps/B轨方向·Gap·统计/Roadmap 全刷新)
  - TASKS.md(查新划界 ✅+Completed 续四;#30 技术方案 v1.0 新任务;#14 降级标记)
  - Research/journal.md(顶部插入第十二次记录)
  - Research/research_history.md(本条)
- **下一步**: ①🟪 #30 技术方案 v1.0(判据选型:空域高通代理 vs DCT vs FFT,取 EFSI 教训;D-FINE 浅层接入点;Dome 对照叙事;纯文档);②🟦 A轨 #11 v1.1 修订(与 #30 共用判据设计);③🟦 #5 v3.0 Related Work 补 Dome-DETR 划界段;④🔔 Dome-DETR/UAV-DETR 代码放出后回读
- **风险跟踪**: #30 审稿必问「免监督频谱判据 vs 学习式 DeFE 谁强」——头对头对照实验为 #30 生死项(⏸ 待实验模块);Dome 未开源,复现 MWAS 有工程成本但非阻塞人(可用 D-FINE 基线+公开 DeFE→MWAS 公式复现)

## 2026-07-17 (续七) — 研究面板修缮 + 🟪 B轨技术地图(DETR 方向知识小结)
- **面板修缮**(用户提醒"不要忘记更新可视化研究面板"): ①journal.md 补齐第十次(A轨深化+基础设施汇总)/第十一次(双轨决策+B轨基础线闭环)记录——此前滞后停在 07-16 第九次,面板「决策与日志」视图数据源恢复同步;②README 阶段行/Roadmap/Next Steps 全面刷新(26篇陈旧态→46篇双轨态),面板「总览」视图数据源修正;③dashboard/index.html:parsePaperMeta venue 识别扩充(ICLR/TGRS/WACV/SciRep/MLSP/IVC/IEEE,修复 Deformable/DINO/D-FINE/SPA 等论文卡片无会议标签问题);KB_FILES 新增 🟪「B轨·DETR地图」卡片
- **DETR 方向知识小结完成** → `Knowledge Base/detr_map.md`(整合 14 篇):①基础线谱系图(DETR→Deformable→DAB/DN→DINO→RT-DETR→D-FINE);②主线1 query 机制四代演进表(静态→纯QS→混合QS→不确定性QS→密度/熵引导,#5-D=第五代拟议+铁律"必须省特征计算");③主线2 小目标适配("query 离目标更近"主线+特化分支七篇对照表+三大结构空白:无P2/频域全增强无门控/CDN密集场景开销);④主线3 实时化算力证据库(#24/#26 挂点表);⑤B轨 Idea 挂点汇总表(8 项含划界红线);⑥概念红线(合法表述空间=「query/token 预算内容自适应分配+特征计算真实减少」);⑦基线选型三角色表
- 项目文件: detr_map.md(新建) / journal(+2条) / dashboard(2处) / README(阶段+Roadmap+Next Steps+续七) / TASKS(知识小结✅+Completed续三) / research_history(本条);B轨下一优先:#5-D/#11-D 查新划界

## 2026-07-17 (续六) — 🟪 B轨基础线闭环:Deformable DETR + DINO 补读(3/3)
- **任务选取**: 按 TASKS「DETR 基础线补读」推进剩余 2/3、3/3;pre-2025 基础方法解锁授权抓取(ar5iv HTML,arxiv.org/html 对 2020/2022 论文均为占位页,备用链路生效)
- **Deformable DETR (ICLR 2021) 深读**: DETR 两痛点根因诊断(均匀初始化注意力→收敛慢500ep;O(H²W²C)→高分辨率不可承受→APs 20.5);deformable attention 每 query 只采 K=4 点(**offset 与权重均由 query 线性投影直接预测,免 QK 内积**);MSDeformAttn 跨尺度采样天然免 FPN(加 FPN 零提升);encoder 线性复杂度/decoder 与分辨率无关;50ep 43.8→two-stage 46.2/APs 28.8(1/10 训练代价,APs +5.9 为最大收益项);两变体=后续全家火种:迭代精化(梯度截断="look forward once")+two-stage(=**query selection 诞生地**)
- **DINO (ICLR 2023) 深读**: DETR 谱系集大成(DAB anchor-box query+DN 去噪+Deformable 算子);三创新——**CDN 对比去噪**(λ₁内圈正样本重建/λ₁~λ₂环带难负样本拒锚,小目标 +1.3AP)+**混合 QS**(位置用 encoder top-K/内容留可学习,初选特征含多物体或部分物体不可作 content)+**LFT**(Δb 更新两次,层间梯度贯通);12ep 49.0/**APs 32.0(+7.2,全尺度最大项)**;SwinL+O365 63.2/63.3 首登 COCO 榜;层数网格消融:enc 6→2 −2.0 / dec 6→2 −3.0(混合QS使其远稳于 Dynamic DETR −13.8)
- **结构性结论**(compare 结论24): ①QS 判据三代演进链闭环:纯 top-K(Deformable)→混合(DINO)→不确定性最小(RT-DETR)→ #5-D 第三判据(语义熵)顺承谱系;②小目标增益是 DETR 谱系每环最大收益项 → DETR 系主线="query 离小目标更近",与 YOLO 系"分辨率更高(P2)"正交 → B轨引 P2 是跨路线组合创新;③encoder 冗余>decoder 冗余定量化(#24);#26 与 QS 质量强交互须联合建模;④DINO 全部创新为训练期技术 → #5-D/#11-D(推理算力自适应)与 DINO 家族无冲突;⑤划界警示:「注意力稀疏采样」已被 MSDeformAttn(15000+引用)占据,B轨 Idea 表述必须落「query/token 预算的内容自适应分配」或「特征层级条件门控」
- 项目文件: 2篇summary(DeformableDETR_ICLR2021/DINO_ICLR2023) / compare(+2行+结论24) / timeline(🟪支线闭环标记+2🔑) / sota(+2行) / database(2行⏳→🔬,🔬34/pre-2025 11) / TASKS(基础线3/3✅,知识小结解锁为下一优先) / README;累计论文 **46 篇**

## 2026-07-17 (续五) — 🟪 B轨首轮:RT-DETR + D-FINE 对照深读
- **任务选取**: 双轨决策后 B轨零积累,入口任务第一步「DETR 基础线补读」;RT-DETR 是 2025–2026 全部小目标 DETR 的共同底座,D-FINE 同批读为基线选型提供对照
- **RT-DETR (CVPR 2024) 深读**: 首个实时端到端检测器——AIFI(只对 S5 自注意力,"低层自注意力冗余",时延−35%且AP+0.4)+CCFF(CNN跨尺度融合)+不确定性最小 query selection(U=‖P−C‖并入loss,+0.8AP)+decoder砍层免重训调速;COCO 53.1@108FPS(R50);**⚠️官方自认小目标短板**(APs 低于同级 YOLO 0.5–0.9)→ B轨 VisDrone 改进空间有原作者背书
- **D-FINE (ICLR 2025) 深读**: FDR(框回归→四边独立概率分布残差逐层精化,非均匀W(n))+GO-LSD(末层分布→浅层KL自蒸馏,免教师);54.0@31M/91G 比 RT-DETR-R50 小26%快12%高0.9AP;**O365 后 APs 40.0**(实时检测器最高);FDR+GO-LSD 即插即用增强各 DETR +2.0~5.3(零参数)
- **决策**: **B轨基线纸面初判 D-FINE**(RT-DETR 为机制理解层+ultralytics 生态兜底;最终确认⏸待实验模块)→ decision_history
- **Idea 挂点**: #5-D 干净落点=QS 第三判据(cls/loc/熵),但增量必须是"减少特征计算"否则退化为 QS 改良;#7 迁 B轨须与 GO-LSD 的 IoU×Conf 加权划界;#26 最优停止获 decoder 层深维现成载体(6层→5层仅−0.1AP/−0.5ms);#24 获 encoder 49% FLOPs/11% AP 论据;#17 ADR 与 FDR 同构(角度分布↔边缘分布)
- 项目文件: 2篇summary(RT-DETR_CVPR2024/D-FINE_ICLR2025) / compare(+2行+结论23) / timeline(2025主线+🟪实时DETR基座支线) / sota(+2行) / database(「八、实时DETR基座」分区,48条) / decision_history(+1) / TASKS / README / research_history(本条);累计论文 **44 篇**

## 2026-07-17 (续四) — 研究战略升级:YOLO + DETR 双轨并行(用户决策)
- **决策**: 用户明确"YOLO 和 DETR 都很好" → 按两大方法方向组织研究任务,并对全部 Idea 分类;修订 2026-07-15「坚持 YOLO 单轨」(旧结论只适用通用 DETR,小目标专用 DETR 2025–2026 进展快:EFSI-DETR APs 24.8/188FPS、FMC-DETR VisDrone 33.7)
- **Idea 分类(25个+#1)** → innovation_ranking.md 🧭 区块:
  - 🟦 A轨·YOLO(15): #5(v3.0✅) #6 #7 #8 #9 #10 #11 #12 #13 #15 #16 #17 #21 #22 + #1 —— 全部工程型稀疏化/蒸馏/Neck/分配
  - 🟪 B轨·DETR(1+2衍生): #14 从"不独立追踪"升级为 B轨入口;衍生候选 #5-D(语义熵→query稀疏化)/#11-D(频域门控DETR版)待查新后占编号
  - ⬜ C类·双轨通用/理论(10): #18 #19(判据层) #20 #23–#27(理论框架) #28 #29 —— 双轨各验证一次 = "架构无关性"卖点
- **任务重组** → TASKS.md 新增 🟦/🟪 两大方向任务区;B轨入口任务:基础线补读(RT-DETR/Deformable DETR/DINO,pre-2025 解锁授权适用)→ DETR 知识小结(依托 database.md 已读 10+ 篇)→ 基线选型(RT-DETR vs D-FINE)→ #5-D/#11-D 查新划界
- **战略文档** → research_strategy.md 新增双轨战略表(A轨~60%/B轨~25%/C类~15%)+ B轨推进门槛(查新不过则退守"跨架构验证平台")
- 项目文件: decision_history(+1决策) / innovation_ranking(🧭区块) / TASKS(双轨重组) / research_strategy(双轨战略) / README(基线+分类+本轮更新) / research_history(本条)

## 2026-07-17 (续三) — 论文数据库建立
- **任务选取**: High Priority 长期未启动项「建立目标检测论文数据库」;42 篇规模正是结构化时机;连续两轮文献后回到基础设施(纯文档)
- **产出**: `papers/database.md` — **46 条**(37 单篇 summary + 9 快评汇总条目)
  - 七大主题分区: 开集/VLM 基座(6) | 频域检测(12) | Token选择/门控(7) | 小目标架构/P2(10) | 裁剪式 coarse-to-fine(2) | 标签分配/损失/蒸馏(5) | 旋转框/其他(4)
  - 每条含: Venue × 类型(🔬深读/🔍深度评估/⚡快评)× 关联 Idea × 一句话 × summary 链接
  - 统计速览(VisDrone 相关 18+/频域线 12/pre-2025 8/跟踪项 1)+ 三条维护规则(新增追加/状态就地更新/跨主题归最重要区)
- **价值**: ①任务选取时可按主题分区查漏(如"裁剪式仅 2 条"提示该线已覆盖够);②写论文 Related Work 时按分区直接取引用链;③跟踪项(🔔Unmasking the Tiny)有了归属地
- 项目文件: papers/database.md(新建) / TASKS(High Priority 勾选+Completed) / README(Records+本轮更新) / research_history(本条)

## 2026-07-17 (续二) — 注意力机制首轮(SPA + Unmasking the Tiny)
- **任务选取**: Literature Tasks 最后一条未启动项「阅读注意力机制论文」;检索视角=稀疏/动态注意力与 token 选择(服务 #5/#22)
- **SPA/SPT (ICLR 2026) 深度评估**: 线性门控(GT框栅格化BCE监督,α=0.01)+Gumbel → **packing 打包固定容器组新batch**(变长token的GPU批处理解法)→ 首个**训练期也真实省算力**的token选择;BDD100K +0.6 mAP 且 −16.4% FLOPs;⚠️ 明确避开浅层(第三stage起才剪)
- **⚠️ Unmasking the Tiny (IVC 2026) 判定为 #5 查新最近哨点**: YOLOX 上 STSM(top-K前景token粗筛)+FRM(分类/回归自注意力门控组合)修复小目标前景分数压低;**迄今与 #5 重叠面最大**(YOLO系+稀疏token+语义信号),三轴划开:①目的=召回增强 vs #5 省算力;②层级=检测头token级 vs #5 P2特征计算前;③判据=自身分数 vs VLM语义熵 → **#5 novelty 仍成立但挂跟踪项**(代码未放/数字未获取,放出后必回读)
- **快评**: PST(粗训细推解耦,k=8甜点,neck层不威胁#5)/ UFO-DETR(降级为频域计数项,会议级细节不明)/ DFE-DETR/YOLO-FB/DSPE-ViT(组合型简评)
- **三个关键收获**:
  1. **v3.0 双补丁**: λ_g 扫描范围加入 0.01(SPA先例);packing=特征级稠密重排训练期方案(v3.1预留)——与 HashEye(输入级)构成两级证据链
  2. **"浅层不剪 vs 专剪浅层"张力浮出**: SPA 主动避开浅层(外观分数在浅层区分不了前景)——#5 的回答=语义熵(外部知识)+LLF兜底,M0 预实验是裁判;若 M0 失败此即反面证据(#5 死刑判据+1)
  3. **CNN 特征图空间条件计算空白在最近邻社区(token selection)再确认**;判据两大阵营格局成形:免训练(语义熵/高频/LSH)vs 可学习(MGS/SViT/SPA GT监督)
- 项目文件: SPA summary + 注意力快评汇总 / attention(+2模块) / compare(+2行+结论22) / research_gap(+2段) / timeline(门控线重写) / idea_005_v3_design(§5补丁) / TASKS(+跟踪项) / README

## 2026-07-17 (续) — 轻量化检测首轮(HashEye + EFSI-DETR + DroneScan)
- **任务选取**: Literature Tasks 仅剩两条未启动项之一「阅读轻量化检测论文」;检索视角=条件计算/截短backbone/端侧部署(服务 #5/#6/#11)
- **HashEye (SciRep 2026) 深度评估**: 输入级免训练空间剪枝——LSH哈希碰撞频率识别重复背景patch(剪最多97.5%,丢失<1.76%)→稠密重排(mosaic/batch)→Jetson Orin NX 4K 5.25×加速;WBF融合跨patch碎片
- **EFSI-DETR (arXiv 2026.01) 深度评估**: 频域浪潮**第5篇**——但走向是"频域启发非变换"(空域三通路代理胜真FFT 33.1vs32.3);FFR弃F5反涨1.2 AP;VisDrone 33.1 AP/APs 24.8@640/188FPS(超YOLOv12-X APs+6.9)
- **DroneScan-YOLO (arXiv 2026.04) 快评**: YOLOv8s+1280输入+stride-4 P2分支(仅+114.6K参数)→mAP50 55.3;P2价值第3次独立验证
- **三个关键修正/发现**:
  1. **v3.0 工程路线定稿**: HashEye 实测论证 masked conv 不省GPU时间+稀疏kernel warp divergence → #5 v3.0 推理路径修正为"gather→稠密重排→计算→scatter"(已补入 v3.0 文档 3.3 节);且"预处理占53%延迟仍净赚5.25×"证明判据计算开销预算可放宽
  2. **#11 判据实现警示**: EFSI 消融显示空域高通代理>真FFT>DWT(部署导向逃离真变换)→ #11 实现层需真FFT/Gabor/空域代理三选项对照,叙事升级为"高频响应判据(实现无关)";⚠️ DMSD 的 α_high 改成硬门控即 #11 空域代理版——接近警报
  3. **#5 划界素材+互补叙事**: HashEye 判据(LSH纹理统计)自认**城市地形失效**——VisDrone 恰是城市 = #5 语义判据的主场;判据演化链更新:RPN框→密度图→P3激活→注意力熵→LSH统计→语义熵(#5,空白依旧)
- **附带**: #23 SNR 退化第4个独立数据点(EFSI弃F5反涨);#29 时序Gap获HashEye future work背书;频域赛道拥挤度上升(5篇+UFO-DETR候选第6篇)发表窗口收窄
- 项目文件: 2 summary + 1 快评 / compare(+3行+结论20-21) / research_gap(+2段) / sota(+3) / timeline(频域线+裁剪线更新) / idea_005_v3_design(3.3节补丁) / TASKS / README

## 2026-07-17 — Idea#5 v3.0 代码级设计(纯文档轮)
- **任务选取**: 实验类全部暂缓约束下,选 TASKS 中唯一"待执行"的非实验工作项——Idea#5 v2.0→v3.0 代码级细化(纯伪代码/接口文档,不运行任何模型)
- **v2.0 五个开放问题全部落地**:
  1. 门控信号源 = **P3 cls logits 复用**(YOLOE RepRTA 重参数化后 cls 分支即"anchor×K 相似度",零额外前向)→ 上采样至 P2 分辨率;因果顺序成立(P2 计算前门控图可得)
  2. 训练 **Gumbel-Sigmoid 软门控** + 推理硬阈值(SViT 验证范式)
  3. 被剪 token **保留残差直通**(SViT Token Preserving: 硬删除是 DynamicViT -4.6 AP 崩溃根因)+ **LLF 复活**(Token Cropr, 仅 32.8K 参数)
  4. **图像级自适应稀疏度**(SViT 动态率正则, λ_s=4.0 同款)
  5. 3×3 卷积稀疏化两方案挂起待消融(掩码膨胀 submanifold vs 可分离卷积)
- **产出**: `Ideas/idea_005_v3_design.md` — 三大模块(SemanticEntropyGate/SparseP2Branch/LLFRevive)接口+伪代码+张量形状;ultralytics 逐文件集成点(5 文件+yaml 草案);FLOPs 纸面预算(t=0.7 → P2 分支省 ~4.1 GFLOPs,全模型约 −19%,新增参数仅 +0.033M);损失函数与超参默认表
- **诚实边界**: 所有 FLOPs 为公式推导未经 profiler;熵判据方向性(高熵=保留)待 M0 预实验验证,若反向门控翻转接口不变;验证点 M0–M4 全部 ⏸ 待实验模块
- 项目文件: TASKS(条目✅) / innovation_ranking(#5 状态+v3.0) / README / research_history(本条)

## 2026-07-16 (深夜续四) — 工作流整理 + 增强类文献首轮(AD-Det)
- **工作流整理(用户指令)**: TASKS 中 4 条工作项(SNR分析/预实验脚本化/v3.0细化/路径三抓取)从 Long-term Tasks 移至 Literature Tasks,避免污染长期方向类条目
- **暂缓范围扩大(用户决策)**: 系统实验模块尚未设计→**实验类任务全部暂缓,含 CPU 可执行的分析/统计类**(SNR 退化分析、预实验脚本化等);已记入 decision_history
- **AD-Det (Remote Sensing 2025) 深度阅读**: coarse-to-fine 赛道 VisDrone 37.5 AP SOTA;ASOE(P3激活图零参数区域挖掘+K-means裁剪)+DCC(尾类记忆库copy-paste+簇中心BFS粘贴)
- **产出**: AD-Det summary + **augmentation.md 首次填充(Knowledge Base 12/12 全部完成 ✅)** + compare+1行+1结论 / timeline+2条支线(裁剪式coarse-to-fine线+UAV copy-paste线) / sota+1
- **关键发现**:
  1. ASOE 与 #5 构成"裁剪式 vs 门控式"赛道划分:同一先验(浅层激活≈小目标位置),ASOE 图像级两阶段(0.5s+/img 非实时),#5 特征级单阶段(实时)→ Related Work 划界素材
  2. P3→P4 聚类 AP_S 暴跌(27.5→21.3)→ #23 SNR 退化假设的又一独立证据
  3. DCC 洞察:copy-paste 收益瓶颈在"贴哪里"而非"贴什么"→ #6 可零推理开销纳入(待实验模块)
  4. 裁剪式判据演化链:RPN框→密度图→P3激活→注意力熵——与 #5 语义熵一脉相承
- 项目文件: TASKS(整理+暂缓标注) / decision_history(+1) / augmentation(首填) / compare / timeline / sota / README

## 2026-07-16 (深夜续三) — 路径一+路径二高分Idea正式录入
- **补漏**: 突破分析预留 #23–#29 但在文献第二轮仅创建了 #22(路径三产物)，路径一和路径二的高分Idea从未正式录入
- **新增 7 个 Idea**:
  1. **#23 SNR退化统一理论 (4.6)**: backbone下采样系统性破坏P2 SNR;非线性衰减曲线;为#5/#6/#11提供统一数学解释
  2. **#24 信息瓶颈形式化 (4.6)**: Tishby IB→小目标信息在压缩时"自然淘汰";语义熵=P(small_object|Z_P2)免训练代理;#5从heuristic升级为理论最优解
  3. **#25 频率签名理论 (4.4)**: 点状(宽谱平坦)/线状(窄谱尖锐)/面状(离散峰值)频域区分;超越"绝对高频能量"粗糙判据
  4. **#28 多模态遥感×频域门控 (4.3)**: SAR散斑高频 vs RGB纹理混合→模态自适应条件计算;路径一#1
  5. **#29 时序一致性×P2稀疏化 (4.2)**: 帧间熵图预测计算分配;静态背景跳过高分辨率计算;路径一#2
  6. **#26 计算最优停止理论 (4.1)**: τ*=argmax AP/FLOPs Pareto前沿;#5零超参数自动化
  7. **#27 语义-空间不确定性原理 (4.1)**: Δspace×Δsemantic≥C;量子力学类比→跨层级语义引导是唯一解
- **评分影响**: #23/#24(4.6)并列登顶→超越原#20(4.2); 4.0+ Idea从4个增至10个
- **项目文件**: innovation_ranking(重排) / README(22→25) / TASKS(新条目) / research_history(本条)
- **关键认知**: 路径二(机制洞察升级)潜力远超路径一(新交叉维度)和路径三(外部注入)——两个4.6分Idea都来自"把小目标检测从经验观察重新定义为数学/物理规律"

## 2026-07-16 (深夜续二) — 文献第二轮：Literature Tasks 持续推进
- **SViT (WACV 2024) 深度阅读**: 四大原则(Token保留/再激活/动态率/轻量MLP); 再激活+0.4 AP; 50%+再激活token在紧邻层重用 → Idea #22(多阶段P2门控:语义熵初筛+可学习再激活)
- **DFIR-DETR (arXiv 2026) 深度阅读**: FIRC3频域最小二乘框架; DKSA动态K-稀疏注意力直接验证Focal Computation范式; ANUP振幅归一化上采样
- **DQ-DETR (ECCV 2024) 深度阅读**: CCM四档密度→自适应query数量; CGFE计数引导特征增强; DQS动态query选择; AI-TOD-V2 30.2 AP(SOTA)
- **快速评估**: FFCA-YOLO(IEEE 2024, 遥感小目标baseline) + MDI-YOLO(SciRep 2026, C2f-MCC通道分组) + SFS-DETR(CVPR 2026F, 空间-频域联合选择, 全文不可获取)
- **产出**: 3篇深度summary + 1篇快速评估汇总 + KB全面更新(compare+6/timeline+7/attention+3/research_gap+3新Gap)
- **Idea更新**: 新增 #22(多阶段P2门控, 3.5); 累计22个候选Idea
- **关键发现**: 
  1. SViT再激活→#5误剪兜底方案(混合免训练+可学习门控)
  2. DFIR-DETR DKSA→#20 Focal Computation范式在DETR侧已有工程雏形
  3. DQ-DETR密度自适应→双粒度P2门控(图像级×token级)
  4. 频域检测2025-2026累计≥6篇顶会/顶刊论文→#11差异化生命线稳固
- 项目文件: TASKS(第二轮✅) / README(34篇, Idea Pipeline 22) / innovation_ranking(#22) / research_gap(SViT+DFIR+DQ-DETR)

## 2026-07-16 (深夜续) — 路径三 pre-2025 论文抓取执行
- **用户授权**: 解除 pre-2025 文献抓取限制，以近年为主、可抓取关键旧论文
- **P0 论文**: DINOv2 (ICCV 2023) — 自监督ViT, patch features涌现objectness无文本监督, PCA前景分离 → Idea #18
- **P0 论文**: Focal Loss (ICCV 2017) — "难例聚焦"→计算分配:"Focal Computation" → Idea #20 (当前最高分 4.2)
- **P1 论文**: FcaNet (ICCV 2021) — GAP=最低频DCT, 多频谱通道注意力, 空间→通道维频域推广 → Idea #21
- **产出**: 3篇paper summary + KB全面更新(compare/timeline/attention/research_gap) + Idea #18–#21评分定档
- **关键突破**: #20 Focal Computation (4.2) 超越 #5 (4.0) 成最高分 Idea；#18 DINOv2 (4.0) 与 #5 并列开辟免VLM路线
- 项目文件：TASKS(路径三✅) / README(29篇, Idea Pipeline 21) / innovation_ranking(#18–#21) / research_gap(3新Gap)

## 2026-07-16 (深夜) — Idea 生成突破分析：三路径元研究
- **触发问题**："为什么最初产生的 Idea 评分最高，后续没有产生更高评价的 Idea？如何才能产生更高评价的 Idea？"
- **核心诊断**：早期 Idea 捕获了全部跨域交叉红利（VLM×检测、频域×条件计算）；后期 Idea 在已交叉框架内微调（"引力捕获"效应）；评分天花板 4.0 是当前知识边界的真实反映
- **路径一 — 新交叉维度**：评估 6 个候选维度，前三名：多模态×频域门控(~4.3)、时序×P2稀疏化(~4.2)、焦点计算理论框架(~4.1)
- **路径二 — 机制洞察升级**：评估 5 个候选洞察，前两名：SNR退化定律(~4.6)、信息瓶颈形式化(~4.6)——均来自将小目标检测从"经验观察"重新定义为"数学/物理规律"
- **路径三 — 外部注入**：精选 6 篇 pre-2025 论文，P0：DINOv2(新判据类型, ~4.0)、Focal Loss(理论框架平移, ~4.1)
- **推荐策略**：第一阶段走路径二（纯理论，无外部依赖）→ 第二阶段走路径三（需用户授权破例抓取 2-3 篇 pre-2025 论文）
- **预留 Idea 编号**：#18-#24（共 7 个潜在新高分 Idea）
- **产出**：`Ideas/idea_generation_breakthrough_analysis.md`（~450 行完整分析）
- 项目文件更新：research_history（本条）/ README / TASKS

## 2026-07-16 (晚间) — Week 2 方向设计阶段：4份核心文档产出
- **risk_assessment.md**: 17个Idea系统风险评估矩阵, 含核心Idea(5/15/7/6/11/16/17/8/9/12)四维度分析+非Idea层面风险+优先级行动清单
- **Idea#5 v2.0 设计文档**: ViCrop-Det×CLIP-Bias×DM-EFS三篇交叉分析;统一叙事"从尺寸引导到语义引导";完整技术架构(语义熵计算模块+P2稀疏处理+CLIP-Bias应对+LLF兜底);预实验+消融+对照实验设计
- **频域路线交叉分析**: SET/DERNet/SFDNet/FMC-DETR/D³R-DETR五篇定位矩阵;SET"去高频帮小目标"→#11判据修正(绝对高频→局部异常度+三频段);频谱工具选型(FFT首选→Gabor备选);#11统一技术方案v1.0;Related Work叙事策略
- **Idea#7 技术基线设计**: MOCHA蒸馏管线复用方案;核心改动(均匀权重→语义熵权重,一行公式);3个关键假设(H1/H2/H3);消融+对照实验设计;终止条件;与#5/#11的协同策略
- 项目文件更新: README(Next Steps+阶段+产出) / TASKS(5项新增) / research_strategy(Week2全完成+Week3规划) / innovation_ranking(新增设计文档引用)
- 项目阶段推进: 文献调研 → 方向设计; 已设计方向数: 0→2(#5 v2.0 + #7 基线)

## 2026-07-16 (下午) — 6篇顶会论文深度调研
- 搜索覆盖: CVPR/ICCV/ECCV/NeurIPS/ICLR/AAAI/TGRS 2025-2026
- 筛选: 从50+搜索结果中筛选6篇最相关论文
- 全部完成 Deep Read + Summary + KB更新
- **关键发现**:
  1. ViCrop-Det 验证熵引导计算分配范式(但DETR专属/免训练/推理时)
  2. CLIP-Bias 证实CLIP特征结构性歧视小目标 → Idea#5新增风险
  3. DM-EFS 验证P2浅层特征价值 + 为#5提供粗粒度baseline演化路径
  4. MOCHA 为#7提供VLM→YOLO蒸馏技术基线
  5. D³R-DETR 验证Gabor>Fourier>Haar + 密度引导稀疏化有效
  6. O² 首个实时旋转DETR(297FPS) → "坚持YOLO"论点需更新
- 新增Idea #16(D³R-DETR Gabor核→P2频域门控) #17(YOLO版ADR)
- 项目累计: 26篇论文(20+6) | 17个候选Idea(15+2)

## 2026-07-16 (上午) — 5篇论文阅读(FMC-DETR等)+ 6篇快速评估
- FMC-DETR: 频域解耦+KAN+多域协调;VisDrone 33.7 SOTA;D2/D4检测层设计
- FDConv快速评估: 频域动态卷积核;不涉及条件计算→不威胁#11
- YOLOv12快速评估: 注意力YOLO;无P2;FlashAttention硬依赖;不切换基线
- 新增Idea #13(振幅门控) #14(D2=SLE) #15(三源门控)
- Knowledge Base 8项更新;Decision ×4;Journal ×1

## 2026-07-15 — 主体工作日
- 阅读+总结: YOLO-World, YOLOE, Token Cropr, RFLA, SEEN-DA, SEMA-YOLO, SFIDM
- 查新: Idea#5 token pruning/熵稀疏化 → novelty确认
- Knowledge Base 11/12项首轮填充
- 提出8个新候选Idea + 多维评分
- 搭建本地研究面板;环境检测(torch CPU/无GPU/无VisDrone)
- 用户决策: VisDrone+GPU暂不提供 → 实验类任务暂缓;文献自动抓取(仅2025+)

## 2026-07-09
- 初始化研究目录结构

## Template
```
## YYYY-MM
### 当月目标
### 完成事项
### 未完成事项
### 下月计划
```
