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

---

## 🟠 OBB 旋转损失函数体系（OBB K1 知识补充·2026-07-19）

> 基于 FAA(CVPR 2026) / YOLO26-OBB(arXiv 2026.06) / RDCNet(IEEE JSTARS 2026.04) 三篇 P0 深读 + OBB L1 检索知识合成。

### 一、旋转框回归损失的数学基础

旋转框回归的核心挑战: 角度周期性(PoA)、边界不连续性(BoC)、旋转IoU不可微、尺度-角度耦合。

#### 1.1 五参数表示法

所有方法的共同输入: `(x, y, w, h, θ)` 或 `(t, l, b, r, θ)`

| 表示法 | 角度域 | 边界问题 | 使用方 |
|--------|--------|---------|--------|
| OpenCV (θ∈(0,90°]) | 90°周期 | **边缘交换**(w↔h跳变) | YOLO11-OBB ❌ |
| 长边 (θ∈[-45°,135°)) | 180°周期 | 消除边缘交换 | **YOLO26-OBB ✅** |
| 规范角 (θ→0°) | 任意角度 | 无(解耦了) | **FAA Head ✅** |
| 极坐标 (ρ,θ) | 无角度边界 | 连续 | **RDCNet RDC ✅** |

#### 1.2 旋转IoU的不可微问题

旋转IoU = 两旋转框交集面积 / 并集面积——计算涉及凸多边形求交(O(nlogn)), 不可微。两条绕过路线:
- **近似替代**: GWD/KLD/KFIoU/BD Loss → 将旋转框建模为2D高斯分布→闭式距离度量
- **角度分离**: YOLO26角度损失 + ProbIoU → 角度用独立Loss, IoU用可微近似

### 二、旋转Loss方法谱系

#### 2.1 GWD (Gaussian Wasserstein Distance, 2021) — 开创性工作
- **原理**: 旋转框→2D高斯分布 `(μ, Σ)` → Wasserstein距离 → 归一化
- **DOTA**: FCOS-OBB 70.07(RetinaNet)
- **局限**: ①中心距离对尺度敏感(非尺度不变)→小目标吃亏 ②高斯假设对正方形目标合理、狭长目标扭曲

#### 2.2 KLD (KL Divergence, 2021)
- **原理**: 旋转框→2D高斯 → KL散度 → 非对称→对称化
- **DOTA**: 70.31(RetinaNet) vs GWD 70.07
- **优势**: 尺度不变性(比GWD好); 非重叠框仍有梯度
- **局限**: 不满足三角不等式(不是真距离度量); ACM-Coder(2024)证明未真正解决边界不连续

#### 2.3 KFIoU (Kalman Filter IoU, 2023)
- **原理**: 卡尔曼滤波视角→高斯分布重叠→趋势项+修正项
- **DOTA**: 69.96(RetinaNet)
- **局限**: 近似IoU, 对极端旋转框精度退化

#### 2.4 BD Loss (Bhattacharyya Distance, 2025 Survey) — 最新旋转Loss SOTA
- **原理**: `D_B = 1/8·(μ₁−μ₂)ᵀΣ⁻¹(μ₁−μ₂) + 1/2·ln(det(Σ)/√(det(Σ₁)·det(Σ₂)))` → `L_BD = 1 − 1/(1+√D_B)`
- **优势**: 满足**全部**IoU理想属性(非负/对称/三角不等式/尺度不变)→GWD/KLD缺失部分属性
- **DOTA**: RetinaNet 71.86(vs GWD 70.07/KLD 70.31/KFIoU 69.96) / R³Det 73.41(vs GWD 72.82)
- **局限**: 2025年刚提出→验证不充分; α超参数需调节
- **对项目**: 比KLD更优的旋转Loss→#12 KLD标签分配可升级为BD分配

#### 2.5 YOLO26-OBB 角度损失（2026） — 宽高比感知
- **公式**: `L_angle = (1/S)·Σ qᵢ·ωᵢ·sin²(2·Δθ̃ᵢ)`, 其中 `ωᵢ = exp(−log²(wᵢ/hᵢ)/λ²)`
- **核心创新**: **宽高比感知权重ωᵢ**——正方形目标(ω→1)→角度损失主导; 狭长目标(ω→0)→ProbIoU主导
- **λ=3最优**（DOTA消融: λ=3 +1.2 mAP vs 无角度损失）
- **长边角度定义**: [-45°,135°) 消除OpenCV边缘交换
- **直接角度回归**: θ̂=z(无sigmoid)→梯度更稳定
- **优势**: 自动在角度敏感目标(正方形)与不敏感目标(狭长)之间平衡——无需手工权重
- **局限**: λ=3为DOTA最优→VisDrone/新数据集需重调

#### 2.6 Rotated IoU Loss（FAA/RDCNet 使用） — 直接旋转IoU优化
- **原理**: 直接计算旋转框IoU的可微近似(通常基于像素区域或PLN近似)
- **使用**: FAA Head(回归分支) / RDCNet(Rotated IoU Loss权重1.0)
- **优势**: 直接优化目标度量
- **局限**: 近似质量依赖实现; 训练不稳定(角度小变化→IoU大变化)

### 三、角度表示 vs 角度回归 vs 角度Loss

| 层次 | FAA (CVPR 2026) | YOLO26-OBB (2026) | RDCNet (2026) |
|------|-----------------|-------------------|---------------|
| **角度来源** | FFT频谱→atan2**物理读取** | 特征→FC**回归** | 极坐标θ子网络**学习** |
| **角度表示** | 规范角0°(分类) + 残差(回归) | 长边[-45°,135°) 直接回归 | 极坐标隐式(非标量角度) |
| **角度Loss** | Rotated IoU + 规范角分类CE | sin²(2Δθ̃)·ωᵢ + ProbIoU | Rotated IoU Loss |
| **边界连续性** | 结构化解耦→天然连续 | 长边定义+sin周期函数 | 极坐标→θ连续 |
| **工程成本** | FFT per-forward(实时待验证) | 最轻(纯公式修改) | ~3M参数(极坐标DCN) |

### 四、ACM-Coder (CVPR 2024) 方法论警示

- **核心发现**: GWD/KLD/KFIoU的"边界不连续修复"是**假象**——换了度量≠解决了问题, 根因是**角度编码模式**(OpenCV边缘交换 → 度量修补无法根治)
- **正确修复**: 改变角度表示(如长边定义→YOLO26) 或 改变回归方式(如极坐标→RDCNet) 或 改变信息源(如频域→FAA)
- **对项目的教训**: #12 KLD标签分配的边界问题需在OBB场景下重新验证——KLD分配+OpenCV角度=双重边界不连续风险

### 五、YOLO-OBB 损失函数推荐栈

| 组件 | 推荐 | 替代 | 理由 |
|------|------|------|------|
| 角度表示 | YOLO26长边[-45°,135°) | — | 消除边界不连续根因 |
| 回归Loss | sin²(2Δθ̃)·ωᵢ(YOLO26) + ProbIoU | BD Loss | YOLO26方法无超参λ=3更鲁棒; BD Loss数学更优雅 |
| 分类Loss | Focal Loss | — | 标准选择 |
| 标签分配 | STAL(YOLO26, 小目标膨胀) | AALA(RDCNet, 宽高比无关centerness) | STAL+O2M训练→NMS-free推理; AALA可增强极端宽高比场景 |
| DFL | **移除**(YOLO26结论) | — | DFL在旋转框上约束回归分布不合理 |
| NMS | **NMS-free**(YOLO26 O2O) | NWD-Soft-NMS | NMS-free消除旋转IoU昂贵计算; 密集场景需O2K扩展 |

---

## 🟡 尺度感知损失与标签分配（尺度变化 K1 知识补充·2026-07-19）

> 基于 YOLO-Master(CVPR 2026) / DERNet(arXiv 2026) / VALA(Neurocomputing 2026) / FS-Mamba(Displays 2026) 四篇 P0 深读 + 尺度 L1 检索(30篇)知识合成。

### 一、标签分配的三维创新空间

标签分配(Label Assignment, LA)决定"哪些预测框匹配哪些GT"，是检测器性能的关键杠杆。2026年LA研究已形成三个独立创新维度：

| 维度 | 问题 | 代表方法 | 创新年份 |
|------|------|---------|---------|
| **规则维 (Rules)** | 如何选择正样本？ | ATSS→SimOTA→TaskAlign→DALA | 2019–2026 |
| **度量维 (Metrics)** | 用什么距离度量匹配质量？ | IoU→RFD(KLD)→NWD→DotD→BD Loss | 2021–2026 |
| **尺度维 (Scale)** | 锚框/正样本区域应该多大？ | **VALA VIoU (2026·首个)** | **2026·新开辟** |

**关键洞察**: 前两个维度已有大量工作，尺度维是2026年VALA首次系统性探索的新维度——这意味着：
- 尺度维LA = 完全空白的创新空间（仅VALA一篇）
- 与规则维(DALA密度感知)和度量维(KLD/NWD尺度不变度量)正交可叠加
- **DALA(密度维·控制"选多少个") × VALA(尺度维·控制"锚框多大") = 双维自适应LA** → #40最明确升级方向

### 二、VALA VIoU — 虚拟锚框尺度重校准

#### 2.1 核心问题
传统anchor-based检测器的锚框尺度是**固定先验**（基于COCO等通用数据集统计），与无人机场景的极端小目标分布严重失配→GT与最匹配锚框的IoU≈0→**微小目标无法获得正样本分配**。

#### 2.2 VIoU机制

```
传统IoU: IoU(固定锚框, GT)        → 小目标IoU≈0 → 无正样本
VIoU:    IoU(虚拟锚框, GT)        → 虚拟锚框已按层级尺度重校准 → IoU可正常匹配
         其中 虚拟锚框 = 锚框 × 逐层尺度因子 s^l
         s^l = f(GT尺寸统计^l)    → 基于训练集GT的层级尺度先验
```

**三步计算**:
1. **训练前统计**: 对每层特征 `P_l`，统计该层负责的GT尺寸分布→计算最优锚框尺度因子 `s^l`
2. **标签分配时**: 将固定锚框乘以 `s^l` → 虚拟锚框与GT尺寸匹配→IoU正常计算
3. **保持IoU一致性**: VIoU仅改变匹配过程中的锚框尺寸，**不改变回归目标**——推理时仍用原始锚框解码

#### 2.3 优势

| 特性 | 说明 |
|------|------|
| **零架构修改** | 仅改变标签分配中的锚框尺寸计算 |
| **零推理开销** | 训练期组件，推理时完全不存在 |
| **即插即用** | 可叠加任何anchor-based检测器 |
| **IoU语义保持** | 不改变IoU的计算方式和物理含义 |
| **层级自适应** | 不同特征层独立计算 `s^l` → 粗粒度层(P5)缩小小锚框、细粒度层(P3)放大 |

#### 2.4 局限性
- **静态统计**: `s^l` 基于训练集统计→测试分布偏移时失配
- **Anchor-based限定**: YOLO的anchor-free设计(每grid cell直接回归)无显式锚框→需等效设计
- **全局层级统一**: 同一层内所有位置使用相同 `s^l` → 无空间自适应

### 三、DSS — 动态缩放策略

VALA的第二个创新：训练期候选相似度归一化 + 渐进衰减。

#### 机制
```
训练早期: 强正则化 → 候选相似度严格归一化 → 微小目标也能获得正样本(包容模式)
训练后期: 弱正则化 → 衰减归一化强度 → 模型自行判断匹配质量(选择模式)
```

**课程学习哲学**: 早期"教"模型关注小目标（包容），后期让模型自己判断（严格）——避免早期小目标无监督信号导致永不学习。

#### 与DALA Decreasing LA的对比

| 维度 | VALA DSS | DALA Decreasing LA |
|------|---------|-------------------|
| 衰减对象 | 候选相似度正则化强度 | 正样本数量 K(t) |
| 衰减驱动 | epoch/training progress | epoch |
| 作用维度 | **尺度维**（锚框大小） | **规则维**（正样本数） |
| 早期策略 | 强正则化=包容小目标 | 大K=多正样本 |
| 后期策略 | 弱正则化=模型自主 | K→1=端到端 |
| 共同点 | 课程学习→训练期渐进变化 | ← 同 |

**两者互补**: DALA控制"选几个正样本"，VALA控制"锚框多大才算正样本"→联合升级可同时优化两个维度。

### 四、尺度感知LA方法全景对比

| 方法 | 创新维度 | 核心机制 | 检测器类型 | 推理开销 | 局限 |
|------|---------|---------|-----------|---------|------|
| **VALA (2026)** | **尺度维·锚框大小** | 虚拟锚框尺度重校准 | Anchor-based | 零 | Anchor-free需适配 |
| **DALA (2026)** | 规则维·密度感知 | 二分类→双轨(O2O/Decreasing) | CNN Anchor-free | 零 | 密度阈值敏感 |
| **DCNet (2025/2026)** | 尺度维·回归自适应 | 锚框回归信息→自适应调整分配 | Anchor-based | 轻微 | CEM增加Neck复杂度 |
| **RFLA (2022)** | 度量维·高斯先验 | ERF↔GT高斯KLD匹配 | Anchor-free | 零 | 一阶段增益小 |
| **STAL (YOLO26, 2026)** | 尺度维·小目标膨胀 | 候选筛选阶段膨胀代理框 | Anchor-free | 零 | 仅影响mask不影响回归 |
| **SA-Matching (CVPR 2026)** | 尺度维·GT扩展 | 小目标扩展GT→增加匹配机会 | DETR | 零 | DETR专属 |
| **SFIDM-DM (2025)** | 度量维·KLD | box-box KLD分配排序 | Anchor-free | 零 | 未与RFLA对比 |

### 五、尺度自适应损失权重

#### 5.1 目标尺度→损失权重自适应

多个尺度L1论文报告了"按目标面积调整损失权重"策略：

| 策略 | 公式思路 | 效果 | 来源 |
|------|---------|------|------|
| 面积加权 | `w_i = 1/√(w_i·h_i)` → 小目标权重↑ | 小目标回归精度提升 | 多篇L1 |
| 尺寸感知质量回归 | `L_reg = Σ w(size_i)·L_iou` | AI-TOD +% | WEYOLO (RS 2026) |
| 层级自适应权重 | 不同FPN层不同损失权重 | 平衡各层梯度 | 通用实践 |

#### 5.2 宽高比感知损失权重（YOLO26-OBB启示）

YOLO26-OBB的 `ωᵢ = exp(−log²(wᵢ/hᵢ)/λ²)` 策略可迁移到HBB场景：
- 正方形目标(ω→1)→定位损失权重正常
- 极端宽高比目标(ω→0)→降低定位损失权重（边界框本身不确定）
- VisDrone pedestrian(高宽比~2)/bicycle(宽高比~0.5)→宽高比感知权重有价值

### 六、尺度变化场景的损失函数推荐栈

| 组件 | 推荐 | 替代/增强 | 理由 |
|------|------|----------|------|
| 标签分配 | TAL(YOLOv11默认) + STAL小目标膨胀 | **+VALA anchor-free等效**(待设计) | STAL零成本增加小目标正样本 |
| 回归Loss | CIoU | WIoU(明智IoU·注意力变体) | WIoU对异常值更鲁棒 |
| 分类Loss | Focal Loss | 面积加权Focal Loss | 小目标分类困难→需要更高权重 |
| DFL | 保留(YOLOv11) | **移除**(YOLO-Master+YOLO26双证) | 2026双证DFL约束回归分布不合理 |
| 辅助Loss | — | **SR辅助重建Loss**(FS-Mamba·训后丢弃) | 零推理开销的最优雅小目标增强 |
| 尺度自适应 | — | **DALA密度×VALA尺度双维**(#40方向) | LA双维自适应→理论最优匹配 |

### 七、Anchor-free 检测器的尺度感知LA适配挑战

VALA的核心机制(虚拟锚框缩放)依赖显式锚框→YOLO anchor-free需等效设计：

| VALA组件 | Anchor-based实现 | YOLO Anchor-free等效 |
|----------|-----------------|---------------------|
| `s^l` 计算 | 缩放锚框wh | **缩放grid cell的感受野范围** |
| VIoU计算 | IoU(虚拟锚框, GT) | **基于缩放后感受野的匹配度量** |
| 逐层统计 | 每层锚框尺度的GT统计 | **每层grid cell有效感受野的GT统计** |
| DSS | 候选相似度归一化 | 直接迁移(独立于锚框机制) |

**理论上等价**: anchor-free的每个grid cell可视为一个"隐式锚框"(其感受野 = 锚框)→RFLA已证明ERF建模在anchor-free上有效→VALA的尺度因子可作用于ERF而非锚框。

### 八、关键洞察

1. **LA三维度独立可叠加**: 规则(DALA) × 度量(KLD/NWD) × 尺度(VALA) = 三维自适应LA——目前无人同时覆盖两个以上维度
2. **VALA→#40的直接升级路径**: #40连续密度LA + VALA尺度校准 = **联合密度-尺度软标签分配**——每个GT的K个正样本中，每个样本的匹配质量同时考虑密度(该位置有几个GT竞争)和尺度(锚框大小是否合适)
3. **频域判据可升级静态s^l**: VALA的s^l基于训练集统计(静态)→频域高频能量图可提供**逐位置的动态尺度指示**(高频响应强→小目标聚集区→s^l放大)→动态虚拟锚框
4. **训练-推理解耦的LA**: VALA(训练期虚拟锚框→推理期原始锚框)与FS-Mamba(SR训练→推理丢弃)、#5(Gumbel训练→硬阈值推理)共享哲学→"训练期可以有额外复杂度，推理回归简单"是2026共识范式
