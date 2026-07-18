# Loss Function Knowledge Base
> 每读一篇论文必须更新。记录所有损失函数设计。

## Template
- **Name**: CIoU | DIoU | SIoU | Wise-IoU | Focal | Varifocal | DFL | ...
- **Type**: Classification | Regression | Distribution | Matching | ...
- **Formula**: （记录关键公式）
- **Advantages**:
- **Weakness**:
- **Suitable Tasks**: 小目标 | 遮挡 | 遥感 | 实时 | ...
- **Improvement Direction**:

---

## Entries

### 1. 语义熵(Semantic Entropy)— 度量/正则信号
- **Name**: Semantic Entropy(SEEN-DA, CVPR 2025)
- **Type**: 特征重要性度量(非直接 Loss,但可作正则/加权信号)
- **Formula**: `p(t_c,f)=softmax(cos(t_c,f)/τ)`;`SE(T,f)=-Σ p·log p`;注意力形式 `Σ p·log p + logK`
- **Advantages**: 语义感知(基于文本嵌入而非 one-hot);低熵=前景/可迁移,高熵=冗余;免额外标注
- **Weakness**: 依赖 VLM 对齐质量;小目标天然高熵;与对抗损失存在"升熵 vs 降熵"的潜在冲突(论文未分析)
- **Suitable Tasks**: 域自适应 | 伪标签过滤 | 特征选择 | 蒸馏区域加权
- **Improvement Direction**: 作为伪标签置信度过滤器;作为蒸馏 mask;作为小目标损失的尺度感知加权

### 2. 对抗域对齐损失(SEEN-DA 使用)
- **Name**: L_adv(最小二乘形式域判别)
- **Type**: 域对齐(Matching)
- **Formula**: `L_adv = -Σ_i [E_xs||D_i(f')||² + E_xt||D_i(f')-1||²]`,总损失 `L = L_s + λ_t·L_t + λ_adv·L_adv + L_reg`(λ_adv=0.1, λ_t=1.0)
- **Advantages**: 逐 block 多层对齐;只作用于 inter-domain 分支输出,不破坏域特定特征
- **Weakness**: 对抗训练不稳定;需要目标域数据同批参与
- **Suitable Tasks**: 域自适应(晴→雾、仿真→真实)
- **Improvement Direction**: 熵引导的对抗强度自适应(高语义熵区域降低对抗权重)

### 3. KLD 高斯分布匹配(SFIDM 标签分配)
- **Name**: KLD Distribution Matching(SFIDM, Remote Sens. 2025)
- **Type**: 标签分配度量 / Matching(替代 IoU)
- **Formula**: bbox→N(μ,Σ),μ=[x,y]ᵀ,Σ^{1/2}=diag(w/2,h/2);`D_KL(Np||Ng)=½[Tr(Σg⁻¹Σp)+(μp-μg)ᵀΣg⁻¹(μp-μg)-log(detΣp/detΣg)-d]`;样本按 Class_score·KL_score 排序取 Top-k
- **Advantages**: 尺度无关(小框不吃亏);可度量不重叠框的偏移(IoU=0 时仍有梯度信号);优于 GWD(GWD 缺尺度不变性)
- **Weakness**: 与 RFLA/NWD/KLD(Yang et al.)高度同源但未对比;水平框假设(旋转框需扩展)
- **Suitable Tasks**: 小目标 | 遥感 | 密集场景标签分配
- **Improvement Direction**: 迁移到 VisDrone P2 头的标签分配(→ Idea #12,与 RFLA 对照)

### 5. RFLA:高斯感受野标签分配(RFD + HLA)
- **Name**: RFLA(ECCV 2022,Xu et al.,武汉大学——与 NWD 同组)
- **Type**: 标签分配(替代 IoU/centerness 的先验+度量+分配策略全套)
- **Formula**: 特征点 ERF→N(μ_e, diag(er², er²)),er=TRF半径/2;GT→N(μ_g, diag(w²/4, h²/4));RFD=1/(1+D_KL),`D_KL = 2er²/w²+2er²/h²+2Δx²/w²+2Δy²/h²+ln(w/2er)+ln(h/2er)-1`;HLA:top-k(k=3)+ β=0.9 衰减补 1 个正样本
- **Advantages**: KLD 尺度不变 → AP_vt 碾压 WD(9.5 vs 6.6);高斯先验无阶跃边界,任意点-GT 可比;推理零开销;AI-TOD 上 FR +10.0 AP、VisDrone AP_vt 0.1→4.8
- **Weakness**: **一阶段检测器提升有限**(RetinaNet +0.4、FCOS +0.9,远低于两阶段 +10)——迁移 YOLO 需预期管理;er=TRF/2 近似粗糙;HLA decay 纯启发式
- **Suitable Tasks**: 微小目标(<16px)| AI-TOD/VisDrone/TinyPerson | P2 头配套
- **Improvement Direction**: #12 三方对照 {TAL, SFIDM-DM(box-box KLD), RFLA(ERF-box KLD)};把 TAL 对齐度中的 IoU 项换成尺度不变度量(而非照搬 HLA)

### 与 SFIDM-DM 的谱系关系(KLD 分配双源)
- SFIDM-DM:**预测框↔GT** 的 box-box KLD(用于分配排序 Class_score·KL_score)
- RFLA:**特征点 ERF↔GT** 的 ERF-box KLD(先验层面,配 HLA 补偿)
- 谱系:GWD(2021)→ KLD-loss(2021)→ NWD(2021)→ DotD → **RFLA(2022)** → SFIDM-DM(2025);后来者均未系统横向对比 → 这是 #12 的写作切入点

### 4. SFIDM 总损失(CE + DIoU + DFL)
- **Name**: L = L_cls + λ_reg·DIoU + λ_DFL·DFL
- **Type**: Classification + Regression + Distribution
- **Formula**: DIoU = 1-IoU+ρ²(b,b_gt)/c²;DFL 见 GFL 论文;最优 λ_reg=0.8, λ_DFL=1.2(网格搜索)
- **Advantages**: DIoU 中心距离惩罚利于小目标定位;DFL 边界分布建模
- **Weakness**: 权重靠网格搜索,无自适应;组合本身无新意
- **Suitable Tasks**: 小目标 | 遥感
- **Improvement Direction**: 损失权重随目标尺度自适应

---

## 标签分配·密度感知

### 5. DALA 密度感知标签分配 (Density-aware Adaptive Label Assignment)
- **Name**: DALA (Liu et al., ESWA 2026)
- **Type**: 标签分配策略（非直接损失函数，但决定正/负样本分布→间接影响 Loss 计算）
- **机制**:
  1. **密度分类**: 基于 GT 空间分布（邻域 GT 数量）将目标分为密集/稀疏两类
  2. **密集目标**: O2O（One-to-One）标签分配——每 GT 仅 1 正样本→避免密集区域重复预测→端到端 NMS-free
  3. **稀疏目标**: Decreasing LA——训练早期 K_max 个正样本（充分表征学习）→训练中后期逐步衰减至 1（过渡到 O2O）
  4. **衰减函数（推断）**: `K(t) = max(1, K_max · decay(t))`，线性/余弦衰减
- **Advantages**: 打破"统一标签分配"假设；端到端检测无需 NMS；兼顾稀疏目标的表征学习和密集目标的去重
- **Weakness**: 密度阈值 τ_dense 需数据集特化；衰减 schedule 静态（epoch 驱动而非数据驱动）；仅 CNN 检测器验证；纯空间密度→忽略特征空间语义密度
- **Suitable Tasks**: 无人机密集检测 | 分布不均场景 | NMS-free 端到端检测
- **Improvement Direction**: ①密度阈值→连续软值替代二分类；②衰减节奏→数据驱动（loss 收敛速度控制）；③密度定义→融合频域/语义正交度量；④移植 DETR→query 配额自适应

### 6. 标签分配方法对比速查

| 方法 | 正样本选择 | 分配粒度 | 密度感知 | 端到端 | 局限性 |
|------|-----------|---------|---------|--------|--------|
| ATSS | 自适应 top-k (IoU 均值+标准差) | per-GT 局部 | ❌ | ❌ | k 全局共享，密集/稀疏不加区分 |
| SimOTA | 最优传输 cost→动态 k | per-GT 局部 | ❌ | ❌ | 密集区域 cost 平坦→不稳定 |
| TaskAlign | `s^α·u^β` 打分+top-k | per-GT 局部 | ❌ | ❌ | 最高分 anchor 可能语义混淆 |
| RFLA | 高斯 ERF×GT 匹配 | per-anchor 先验 | ❌ (尺度感知但非密度) | ❌ | 一阶段增益小 |
| FSS | 实例概率矩阵+次优样本保留 | per-GT | ❌ (聚焦子优而非密度) | ❌ | 零推理开销但无密度分类 |
| **DALA** | **密度分类→双轨(O2O/Decreasing)** | per-GT + **密度先验** | ✅ **首个** | ✅ | 阈值敏感；衰减静态

---

## 遮挡感知损失

### 7. OPL — Occlusion Perception Loss (遮挡感知损失)
- **Name**: OPL (Li & Li, ESWA 2025)
- **Type**: 遮挡感知辅助损失 / 多任务监督信号
- **机制**:
  1. **GT遮挡图生成**: 从已有 bbox 标注提取重叠区域（IoU>0 的 bbox 对→重叠部分 = 遮挡区域）+ 高斯模糊（软化边界，生成连续遮挡概率图 [0,1]）→ **零额外标注成本**
  2. **OPL 监督**: OPD（Occlusion Perception Decoder）预测遮挡图，OPL 计算 `L(O_pred, O_gt)` 监督训练
  3. **OPC 注入**: 遮挡图作为辅助特征注入主检测解码器，补偿被遮挡区域的信息缺失
- **Formula** (推断): `L_total = L_det + λ_opl · L_supervised(O_pred, O_gt)`，其中 `O_gt = GaussianBlur(BboxOverlap(GTs))`，`L_supervised` 可能是 BCE/Focal Loss
- **Advantages**:
  - **首个显式遮挡感知损失**——从"隐式处理遮挡"到"显式建模遮挡"的范式转换
  - **零额外标注**: GT 遮挡图完全从已有 bbox 标注自动生成（重叠+高斯模糊）
  - 遮挡目标召回率 **95.4%（+22.6%）**，CrowdHuman + CityPersons 双数据集验证
  - 即插即用：OPD 作为辅助头，不修改主检测器架构
- **Weakness**:
  - **Bbox 重叠 ≠ 真实遮挡**: 并排无遮挡的 bbox 重叠也会被标记为"遮挡"——假阳性遮挡 GT
  - 完全被遮挡（无 bbox 标注）的目标无法建模（依赖重叠）
  - 仅验证行人检测（CrowdHuman/CityPersons），通用目标检测效果未知
  - 高斯模糊参数（σ/kernel size）需手工设置，无法自适应
  - Transformer OPD 的训练开销未消融
- **Suitable Tasks**: 密集行人检测 | 拥挤场景 | 遮挡鲁棒检测 | 可扩展至通用目标遮挡建模
- **Improvement Direction**:
  1. **频域判据替代 bbox 重叠**: 高频局部异常度→遮挡先验，不依赖 bbox 重叠，覆盖孤立截断/背景遮挡（→ #30 扩展）
  2. **语义熵替代/验证遮挡图**: 遮挡区域天然高熵（混合特征→语义不纯）→熵图可能隐含遮挡信息
  3. **可学习遮挡边界**: 用轻量 CNN 替代固定高斯核→自适应遮挡边界软化
  4. **DETR 化 OPL**: DETR 的 per-query 遮挡图（而非整图一张）→更精细的遮挡建模

### 12. OAR-Loss — Occlusion-Aware Repulsion Loss (DOMino-YOLO)
- **Name**: OAR-Loss (Occlusion-Aware Repulsion Loss)
- **Type**: Regression + Classification (组合损失)
- **Paper**: DOMino-YOLO | MDPI Remote Sensing | 2025.12
- **Formula**: ⚠️ 精确公式未获取（MDPI WebFetch 403）; 结构 = Repulsion Loss组件 + Visibility-Weighted Classification Loss组件
  - Repulsion组件: 预测框间排斥 + 预测框-GT吸引（继承 RepLoss CVPR 2018）
  - Visibility-Weighted CLS: 分类损失按目标遮挡等级加权——遮挡越严重→损失权重越高
- **Advantages**: 首次将遮挡可见度量化纳入排斥损失权重体系; RepLoss 2025 演进节点; 同时抑制冗余预测+强调遮挡目标
- **Weakness**: 依赖遮挡等级标注（VOD-UAV 数据集）→泛化到无遮挡标注的数据集困难; VOD-UAV 仅车辆类→多类别密集场景的泛化未知; 合成+真实混合训练的 domain gap 未详述
- **Suitable Tasks**: 密集遮挡场景 | UAV 车辆检测 | RepLoss 演化线的参考基线
- **Improvement Direction**:
  1. **免标注遮挡权重**: 用频域判据（#35）/语义熵（#36）替代人工遮挡标注→OAR-Loss 可泛化到任意数据集
  2. **类条件排斥**: VisDrone 10 类中类间遮挡与类内遮挡的排斥力应不同→类条件排斥损失
  3. **与 OPL 融合**: OAR-Loss（排斥）+ OPL（遮挡图感知）→同时解决"不要合并框"和"要检测遮挡目标"

### 13. NWD-MPDIoU Loss (GCS-DETR)
- **Name**: NWD-MPDIoU (Normalized Wasserstein Distance + Multi-Point Distance IoU)
- **Type**: Regression (混合损失)
- **Paper**: GCS-DETR | Multimedia Systems | 2026.05
- **Formula**: ⚠️ NWD与MPDIoU融合方式未获取; NWD=高斯分布Wasserstein距离; MPDIoU=标准IoU+多点距离约束(如四角点距离)
- **Advantages**: NWD对小目标定位更平滑（微小偏移不会导致IoU剧烈变化）; MPDIoU多点约束消除IoU"重叠相同但位置不同"盲区; 架构无关——CNN/DETR通用; 参数量减少20.6%同时精度+3.0%
- **Weakness**: NWD计算开销高于IoU; 两个度量的融合权重需手工调节; 遮挡导致的"只预测到可见部分"vs"正确但部分重叠"——MPDIoU是否真正能区分未验证
- **Suitable Tasks**: 小目标检测 | 密集遮挡场景 | 航拍/遥感 | 可替换IoU-based损失
- **Improvement Direction**:
  1. **YOLOv11 交叉验证**: 在 YOLOv11 上验证 NWD-MPDIoU 的架构无关性
  2. **融合方式自适应**: 根据目标尺度动态调整 NWD vs MPDIoU 的权重（小目标偏 NWD/大目标偏 MPDIoU）

### 14. NWD-Soft-NMS (MFF-YOLO)
- **Name**: NWD-Soft-NMS (Normalized Wasserstein Distance Soft-NMS)
- **Type**: 后处理（NMS 衰减函数中的距离度量替换）
- **Paper**: MFF-YOLO | DMBD 2024 (CCIS Vol.2356) | 2025
- **Formula**: `s_i = s_i × f(NWD(M, b_i))` — 将 Soft-NMS 衰减函数的输入从 IoU 替换为 NWD
  - NWD: 将目标框建模为二维高斯→计算 Wasserstein 距离→归一化为相似度
  - Soft-NMS 衰减: 线性 `1 - NWD` 或高斯 `exp(-NWD²/σ)`
- **Advantages**: NWD 对小目标平滑敏感（vs IoU 对小偏移剧烈响应）; Soft-NMS 衰减替代 NMS 硬删除→密集区域保留更多真实检测; 即插即用（仅替换 NMS 步骤）; VisDrone +9.0%（联合 MFF 模块）
- **Weakness**: ⚠️ +9.0% 是 MFF+NWD-Soft-NMS 联合增益（非 NWD-Soft-NMS 单独）; NWD 计算开销高于 IoU; σ 参数全局固定→无密度自适应; 仅在 YOLOv8 验证
- **Suitable Tasks**: 密集/遮挡场景后处理 | 小目标 NMS | YOLO 系通用
- **Improvement Direction**:
  1. **密度自适应 σ**: 根据局部密度动态调整 Soft-NMS σ→密集区宽容（大σ）/稀疏区严格（小σ）
  2. **频域距离度量**: 用频域判据（高频能量/频谱相似度）替代 NWD→可能对遮挡场景更鲁棒
  3. **YOLOv11 + P2 头验证**: 在 #6 baseline 上验证 NWD-Soft-NMS 增益

### 15. Repulsion Loss (RepLoss) — 排斥损失三件套
- **Name**: Repulsion Loss (RepLoss) = L_Attr + α·L_RepGT + β·L_RepBox
- **Type**: Regression (Bounding Box) — 训练期损失函数
- **Paper**: Wang et al., CVPR 2018 (旷视 Face++)
- **Formula**: `L = L_Attr + α·L_RepGT + β·L_RepBox` (α=β=0.5)
  - **L_Attr**: 标准 Smooth_L1 — 预测框向其指定 GT 回归
  - **L_RepGT**: `Smooth_ln(IoG(B^P, G^P_Rep))` — 预测框远离相邻非目标 GT。「IoG」(Intersection over GT, =area(B∩G)/area(G))而非 IoU——分母固定GT面积，避免模型放大预测框作弊
  - **L_RepBox**: `Smooth_ln(IoU(B^Pi, B^Pj))` for i≠j — 不同GT分配的预测框互相推开，降低NMS敏感性
  - **Smooth_ln**: `-ln(1-x)`(x≤σ) 或 `(x-σ)/(1-σ)-ln(1-σ)`(x>σ)，对(0,1)区间稳健
- **Advantages**: 训练期直接建模遮挡排斥（NMS问题前置解决）；RepGT用IoG避cheat gradient；RepBox降低NMS误杀；无需像素级标注；即插即用（Faster R-CNN系列）；泛化至通用检测（VOC Crowd子集+2.1）
- **Weakness**: 三个超参数(α/β/σ)需手工调节；RepBox O(N²)两两计算；仅作用回归分支（分类无排斥信号）；IoG→1时惩罚饱和（Smooth_ln截断）；遮挡感知被动（仅靠IoU阈值，无显式遮挡先验）
- **Suitable Tasks**: 密集行人检测 | 遮挡场景 | 通用密集检测
- **Improvement Direction**:
  1. **频域自适应权重**: 高频能量图识别遮挡区域→遮挡区α↑（强排斥）/空旷区α↓（弱排斥），无需额外标注
  2. **分类-回归一致性**: IoG排斥信号反馈给分类分支→「高IoG预测框的分类分数应被惩罚」→解决分类-定位misalignment
  3. **YOLO一阶段适配**: anchor-free+密集预测下的RepBox高效近似（空间哈希/KNN替代O(N²)）
- **References**: Wang et al., "Repulsion Loss: Detecting Pedestrians in a Crowd", CVPR 2018

### 16. EMD Loss (CrowdDet) — 推土机距离集合匹配损失
- **Name**: EMD Loss (Earth Mover's Distance Loss) — 集合预测的最优匹配
- **Type**: Matching + Classification + Regression — 训练期集合匹配损失
- **Paper**: Chu et al., CVPR 2020 Oral (旷视 Megvii)
- **Formula**: `L_b_i = min_{π∈Π} Σ_{k=1}^K [L_cls(c_i^{(k)}, g_{π_k}) + L_reg(l_i^{(k)}, g_{π_k})]`
  - 每个proposal预测K个实例（K=2），GT实例集合 G(b_i) = {g_j | IoU(b_i, g_j) ≥ θ}
  - 遍历K!种排列π，选总损失最小的匹配方案（最优一对一匹配）
  - |G(b_i)| < K时用dummy boxes填充（背景类、不参与回归损失）→ 与DETR ∅ 同机制
  - K=1时退化为标准单实例损失
- **Advantages**: 解决「高度重叠实例特征相似→单prediction难以区分」的根本矛盾；K=2即可捕获大多数密集重叠；dummy机制优雅处理可变实例数；COCO上仍有+1.0 AP→非密集场景无退化；CVPR 2020 Oral
- **Weakness**: 仅适用proposal-based检测器（Faster R-CNN系）→YOLO一阶段无显式proposal无法直接迁移；K值静态(K=2)→稀疏区浪费、极密集区不足；O(K!)匹配复杂度→K>3不可扩展；预测实例间无硬互斥约束（可收敛到同一实例）；依赖proposal质量（偏差→G(b_i)为空→退背景）
- **Suitable Tasks**: 密集人群检测 | 高度重叠实例 | proposal-based检测器
- **Improvement Direction**:
  1. **自适应K选择**: 频域/熵判据估计proposal的实例密度→密集区K↑/稀疏区K=1→算力-精度动态平衡
  2. **YOLO grid-cell EMD适配**: 将EMD从proposal级搬到P2 grid cell级→每cell预测K个实例，匹配YOLO密集预测范式
  3. **EMD + RepLoss联合**: proposal内EMD匹配多实例 + proposal间RepBox推开不同目标的预测→完整的密集检测训练方案
- **References**: Chu et al., "Detection in Crowded Scenes: One Proposal, Multiple Predictions", CVPR 2020 Oral

### 17. Soft-NMS (Classic) — 分数衰减替代硬清零
- **Name**: Soft-NMS — 连续分数衰减函数替代NMS硬阈值清零
- **Type**: 后处理（NMS改进）— 推理期组件
- **Paper**: Bodla et al., ICCV 2017 (马里兰大学)
- **Formula**: 
  - **线性**: `s_i = s_i · (1 - IoU(M, b_i))` when IoU ≥ N_t
  - **高斯（推荐）**: `s_i = s_i · exp(-IoU(M, b_i)² / σ)`, ∀b_i ∉ D, σ=0.5
  - 与传统NMS的唯一差异：`s_i = 0` → `s_i = s_i · f(IoU(M, b_i))`
- **Advantages**: 一行代码替换传统NMS；无需重新训练；O(N²)同复杂度；高斯版处处连续无突变；Recall@100 +8.4（大量被硬NMS误杀的框恢复）；COCO +1.3%/VOC +1.7% (R-FCN)；小/中/大目标均受益
- **Weakness**: 仍为贪心算法（非全局最优）；仅用IoU度量冗余（小目标不友好→NWD-Soft-NMS进化方向）；f(IoU)手工固定不可学习；σ全局静态（无密度自适应）；无类别感知（异类目标可能误衰减）
- **Suitable Tasks**: 所有检测器的NMS后处理 | 密集/遮挡场景 | 需高召回率场景
- **Improvement Direction**:
  1. **NWD-Soft-NMS** (MFF-YOLO已实现): IoU→NWD作为距离度量→小目标更友好
  2. **密度自适应σ**: 局部密度/频域统计→动态σ→密集区大σ（弱衰减保召回）/稀疏区小σ（强衰减杀冗余）
  3. **频域感知衰减**: IoU/NWD + 框内频谱余弦相似度双因子→内容不同的框即使NWD高也不衰减
  4. **可学习衰减函数**: f(IoU, NWD, 频域)→小MLP学出的衰减函数→端到端优化
- **References**: Bodla et al., "Soft-NMS — Improving Object Detection With One Line of Code", ICCV 2017

---

## 🔴 遮挡感知损失函数体系（密集遮挡 L3 知识提取·2026-07-18）

> 涵盖 11 篇密集遮挡论文的全部损失相关组件，按范式组织。此体系为上层的 "遮挡损失 taxonomy"，下层各条目（#1–#17）为独立技术记录。

### 分类学（Taxonomy）

```
遮挡感知损失
├── 一、训练期回归排斥（Repulsion-based）
│   ├── RepLoss (CVPR 2018, #15): L_Attr + L_RepGT + L_RepBox
│   └── OAR-Loss (DOMino-YOLO RS 2025, #12): RepLoss + Visibility-Weighted CLS
│
├── 二、显式遮挡图建模（Explicit Occlusion Map）
│   └── OPL/OPD/OPC (ESWA 2025, #11): bbox重叠→高斯模糊→GT遮挡图→OPC注入
│
├── 三、组合式遮挡损失（Composite Occlusion Loss）
│   └── FAFL (IEEE 2026, ⚡快评): 五组件（可见度+一致性+几何+熵正则+注意力）
│
├── 四、集合预测匹配（Set Prediction Matching）
│   ├── EMD Loss (CrowdDet CVPR 2020, #16): proposal级局部集合最优匹配
│   └── Hungarian Matching (DETR系): 图像级全局集合最优匹配
│
├── 五、遮挡感知定位度量（Occlusion-Aware Localization）
│   ├── NWD (Wasserstein距离, #14): 小目标平滑敏感的框距离度量
│   └── NWD-MPDIoU (GCS-DETR 2026, #13): NWD + 多点距离约束
│
├── 六、后处理NMS（Post-processing NMS）
│   ├── Soft-NMS (ICCV 2017, #17): IoU-based 分数衰减
│   ├── Set NMS (CrowdDet CVPR 2020, #16附): 同源proposal跳过抑制
│   └── NWD-Soft-NMS (MFF-YOLO 2025, #14): NWD替代IoU进衰减函数
│
└── 七、未来方向·频域遮挡先验（Frequency-domain Occlusion Prior）
    ├── #35 频域遮挡先验→RepLoss/OPL权重调节（免标注遮挡感知）
    ├── #38 频谱感知Soft-NMS（框内频谱相似度→NMS第二判据）
    └── #39 EMD+RepLoss联合（proposal内匹配+proposal间排斥）
```

### 范式演化图谱

| 年份 | 里程碑 | 范式 | 遮挡先验来源 |
|------|--------|------|-------------|
| 2017 | Soft-NMS | 推理期后处理 | IoU空间重叠 |
| 2018 | RepLoss | 训练期回归排斥 | IoU空间重叠 + GT标注 |
| 2020 | CrowdDet EMD | 训练期集合匹配 | IoU空间重叠 |
| 2025 | OPL | **显式遮挡图建模** | bbox重叠+高斯模糊（自动GT） |
| 2025 | OAR-Loss | 回归排斥+可见度加权 | 五级遮挡标注（人工） |
| 2025 | NWD-Soft-NMS | 后处理距离度量升级 | NWD（高斯Wasserstein） |
| 2026 | FAFL | 组合式五组件损失 | 熵正则+注意力+多源 |
| **Future** | **#35 频域遮挡先验** | **频域判据→遮挡感知权重的免标注上游** | **高频局部异常度（物理先验）** |
| **Future** | **#38 频谱感知NMS** | **框内内容相似度→NMS第二判据** | **框内频谱统计（内容先验）** |

### 关键洞察

1. **遮挡先验来源的演化**: 人工标注(RepLoss GT/OAR-Loss 5级)→自动GT(OPL bbox重叠)→物理先验(#35 频域)→内容先验(#38 频谱)——**从"需要人告诉模型什么是遮挡"到"模型从信号本身感知遮挡"**

2. **三阶段覆盖**: RepLoss(训练期回归) + EMD Loss(训练期匹配) + Soft-NMS(推理期后处理) = 密集检测的完整损失管线——**但三者从未在同一检测器上联合使用**

3. **频域判据的「判据复用」价值**: 同一高频异常度图可同时服务——①#11 P2门控(省算力) ②#35 RepLoss权重(遮挡感知) ③#38 Soft-NMS内容判据(频谱感知)——**一次计算、三次收益**

4. **NWD度量共识**: 密集遮挡 L1.5 的5篇中3篇使用NWD + MFF-YOLO NWD-Soft-NMS + GCS-DETR NWD-MPDIoU → **NWD是小目标+密集场景的共识度量**

---

## 🔴 NMS 演进线: 从硬清零到内容感知（密集遮挡 L3 知识提取·2026-07-18）

> 覆盖 NMS 技术从 2017 到 2025+ 的完整演化，从后处理视角审视密集遮挡问题。

### 演化图谱

```
传统 NMS (Ever)
  → s_i = 0 when IoU ≥ N_t
  → 问题: 密集场景下有效目标被误清零 → 漏检
    │
    ├── Soft-NMS (ICCV 2017, #17)
    │   → s_i = s_i · f(IoU), f = 高斯/线性衰减
    │   → 贡献: 分数衰减替代硬清零
    │   → 局限: IoU对小目标不敏感; σ全局静态
    │     │
    │     ├── Adaptive NMS (CVPR 2019)
    │     │   → N_t = f(density), 密集区N_t↑(更宽容)
    │     │   → 局限: 密度估计粗糙（仅靠检测框数量）
    │     │
    │     └── NWD-Soft-NMS (MFF-YOLO DMBD 2025, #14)
    │         → IoU → NWD(Wasserstein距离)进衰减函数
    │         → 贡献: 小目标平滑敏感
    │         → 局限: σ仍全局静态; 衰减函数仍手工固定
    │           │
    │           └── #38 频谱感知Soft-NMS (本项目·2026-07-18提出)
    │               → NWD + 框内频谱相似度双因子衰减
    │               → 贡献: 首次引入「内容」维度判断冗余
    │               → 状态: Thinking, 待验证
    │
    ├── Set NMS (CrowdDet CVPR 2020, #16附)
    │   → 同一proposal的K个预测跳过抑制
    │   → 贡献: 利用EMD Loss的先验（同源不重复）
    │   → 局限: 仅适用proposal-based检测器
    │
    └── DETR式NMS-Free (2020+)
        → Hungarian匹配 + 固定query数量 = 天然无重复预测
        → 贡献: 理论上从根源消除NMS
        → 局限: 小目标query不足; 训练收敛慢
```

### 技术维度对比

| NMS方法 | 距离度量 | 衰减函数 | 自适应 | 内容感知 | 适用检测器 | 额外训练 |
|----------|---------|---------|--------|---------|-----------|---------|
| 传统NMS | IoU | 硬清零(0/1) | ❌ | ❌ | 所有 | ❌ |
| Soft-NMS | IoU | 高斯/线性 | ❌ | ❌ | 所有 | ❌ |
| Adaptive NMS | IoU | 硬清零 | ✅(密度→N_t) | ❌ | 所有 | ❌ |
| Set NMS | IoU | 硬清零 | ❌ | ❌(proposal源) | proposal-based | ❌ |
| NWD-Soft-NMS | **NWD** | 高斯/线性 | ❌ | ❌ | 所有(YOLOv8验证) | ❌ |
| **#38 频谱感知** | **NWD** | **双因子(空间×内容)** | **✅(频域→σ)** | **✅(频谱相似度)** | **所有(YOLO优先)** | **❌(免训练)** |

### 关键洞察

1. **NMS 改进的三维度**: ①距离度量(IoU→NWD) ②衰减函数(硬→软→可学习) ③自适应(全局→密度感知→内容感知)——每个维度都有独立的技术演进线

2. **「内容感知 NMS」是完全空白的第四维度**: 过去9年所有NMS改进仅用box坐标判断冗余——两个不同实例即使IoU=0.9，其框内纹理/频谱模式可能完全不同 → 频谱相似度独立于空间重叠的第二判断轴

3. **项目NMS策略推荐**: #6 baseline 默认采用 NWD-Soft-NMS; σ 用 σ=0.5(Soft-NMS默认); 后续升级路径: 密度自适应σ → #38 频谱感知

4. **NMS与训练期损失的协同**: RepBox(训练期推开预测框) + Soft-NMS(推理期保留被推开的框) = 完整的「训练-推理NMS优化」
