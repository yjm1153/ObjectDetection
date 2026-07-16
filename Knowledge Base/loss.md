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
