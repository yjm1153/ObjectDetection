# 🟡 尺度变化拓展 L1 补充检索快速评估 — 2026-07-18

> 检索方向: 自适应感受野 / 尺度感知标签分配 / 极端小目标增强 / 多尺度特征对齐 + 频域×尺度 / 条件计算×尺度
> 6 组关键词 × 4 轮检索, 命中 **30 篇** (P0×4 / P1×5 / P2×21)

---

## P0 🔴 必深读 (4篇·极高价值)

### YOLO-Master: MoE-Accelerated YOLO (Tencent·CVPR 2026) ⭐⭐⭐⭐⭐
- **链接**: arXiv:2512.23273 / github.com/Tencent/YOLO-Master
- **核心**: **首个MoE深度融合YOLO**——ES-MoE(多尺度专家组: 3×3/5×5/7×7深度可分离卷积) + 轻量动态路由(Soft Top-K训练→Hard Top-K推理) + 负载均衡Loss + 空间感知门控(GAP+两层1×1conv, γ=8)
- **性能**: 42.4% AP @ 1.62ms(COCO Nano); +0.8% AP vs YOLOv13-N 且 **推理快17.8%**; VisDrone/SKU-110K 密集场景增益明显
- **为什么是P0**: **尺度×条件计算的工程化标杆**——多尺度专家=感受野维的条件计算(不同尺度目标路由到不同核大小专家)。与项目#5(语义熵门控)/#11(高频能量门控)/#22(多阶段门控)形成对照——YOLO-Master是可学习门控路线，项目是免训练判据路线。CVPR 2026+Tencent+开源→最高质量参照
- **关联 Idea**: #5 P2稀疏化(对照·可学习vs免训练) / #22 多阶段门控(MoE替代方案) / 尺度自适应门控(TASKS指定)
- **局限**: MoE多分支→GPU利用率挑战; 负载均衡超参敏感

### DERNet: Decompose-Enhance-Reconstruct (arXiv 2026.06) ⭐⭐⭐⭐⭐
- **链接**: arXiv:2606.23825
- **核心**: **频域三阶段特征学习框架**——WDG(小波差分门控·backbone)→LGE(Log-Gabor增强·neck)→FDHead(频域驱动头·head)。Haar DWT分解→LL子带精炼+HF子带自派生门控先验; Log-Gabor方向特化频域增强; 高频能量注入密集回归
- **性能**: YOLOv11同尺度 **仅~1/6参数量** 超越; VisDrone/UAVDT/TinyPerson/DOTA 四基准验证
- **为什么是P0**: **频域×尺度的最系统化方案**——三阶段(backbone/neck/head)全管线频域注入。与项目D1(频域三线共享: 遮挡/NMS/LA)对称但维度不同(DERNet=特征学习, D1=检测后处理/训练信号)。小波工具选型直接对标项目#11判据族(S1空域/DCT→小波是第三选项)
- **关联 Idea**: #11(高频能量判据·小波实现选项) / D1(频域三线共享·对称架构) / 尺度自适应门控
- **局限**: 约1/6参数量但FLOPs未完全报告; 三阶段相互依赖→消融复杂性

### VALA: Virtual Anchor-guided Label Assignment (Neurocomputing 2026) ⭐⭐⭐⭐
- **链接**: ScienceDirect S0925231226014530
- **核心**: **Virtual IoU(VIoU)**——基于特征层级经验目标尺寸统计→动态缩放虚拟锚框→缩小锚框-微小目标尺度差距 + DSS动态缩放策略(训练早强正则→晚弱正则)
- **性能**: AI-TOD 27.9 / AI-TODv2 26.9 / VisDrone 29.4 AP; 即插即用(无架构修改)
- **为什么是P0**: **尺度感知LA的最新SOTA**——VIoU的虚拟锚框缩放思路与项目#40(连续密度LA)互补(#40控制正样本数, VALA控制锚框尺度)。此外VALA是anchor-based→YOLO anchor-free适配是差异化方向
- **关联 Idea**: #40(连续密度LA·样本数维) / #12(KLD分配·度量维) / OBB×尺度交叉
- **局限**: anchor-based→YOLO anchor-free需适配

### FS-Mamba: Frequency-Domain + SR Assistance (2025) ⭐⭐⭐⭐
- **链接**: ScienceDirect S0141938226001253
- **核心**: **训练专用SR辅助分支(零推理开销)** + FDGate(频域门控·高频响应注入) + FPU(频率保持上采样) + FDVSSBlock(频域视觉状态空间块)。SR分支仅在训练时使用→增强特征表示质量后丢弃
- **性能**: UAV小目标交通参与者的高精度检测
- **为什么是P0**: **"训练专用SR=零推理开销"范式**——与MambaIR-YOLO同路线。这是小目标增强的最优雅方案(不增加推理成本)。与项目#5的"训练期Gumbel→推理期硬阈值"同哲学(训练-推理解耦)。频域门控(FDGate)与项目#11/#30判据高度相关
- **关联 Idea**: #11(频域门控) / #5(训练-推理解耦哲学) / 极端小目标增强
- **局限**: Mamba backbone→CNN等价迁移待验证; SR分支设计复杂度

---

## P1 🟠 深读 (5篇·高价值)

### DCNet: Dynamic Scale-Awareness Label Assignment (Pattern Recognition 2025/2026)
- **链接**: ScienceDirect S0031320325011112
- **核心**: DSA(动态尺度感知LA)·锚框回归信息自适应调整分配 + CEM(上下文增强模块·位移卷积+多尺度自注意力)
- **性能**: 微小目标正样本数显著增加; 多基准验证
- **为什么是P1**: 尺度感知LA双路线对照——VALA(虚拟锚框缩放) vs DCNet(锚框回归自适应)→两种不同的尺度自适应策略
- **关联 Idea**: #40 / #12
- **局限**: CEM增加 Neck 复杂度

### SA-Matching DETR (CVPR 2026 Workshop)
- **链接**: CVPR 2026F
- **核心**: **尺度自适应匹配算法**——根据目标尺度自适应扩展GT框集合; 解决小目标假阳性(IoU匹配)+大目标假阴性(Hungarian匹配)
- **性能**: 54.8% COCO mAP @ 轻量架构
- **为什么是P1**: CVPR 2026 Workshop→尺度感知匹配的最新范式; DETR vs YOLO 尺度匹配策略对比参照
- **关联 Idea**: OBB×尺度交叉 / DETR匹配→YOLO LA迁移
- **局限**: DETR专属; YOLO迁移需适配

### RFAG-YOLO: Receptive Field Attention-Guided (Sensors 2025)
- **链接**: PMC11991089 / MDPI Sensors
- **核心**: RFN Block(动态核参数调整·打破静态参数共享) + SAF(尺度感知特征融合·尺度注意力动态加权高低层特征) + FasterNet backbone
- **性能**: VisDrone 38.9% mAP50; +12.43% vs YOLOv7; 仅YOLOv8s 53.51%参数量
- **为什么是P1**: **自适应感受野+尺度感知融合联合设计**——RFN(动态核)+SAF(动态融合权重)互补。VisDrone实测→可直接作为项目baseline组件候选
- **关联 Idea**: #5 P2稀疏化(SAF作为融合增强) / #9(GCP-ASFF对照·SAF提供第三种融合方案)
- **局限**: Sensors venue影响因子一般

### MFR-YOLO: Multi-scale Feature Refinement (Scientific Reports 2025)
- **链接**: Nature Scientific Reports
- **核心**: DCNv4全backbone可变形卷积 + MSFEM(SPDConv+DCNv4双分支并行) + GAM(全局注意力·双通道-空间自注意力) + PPA(金字塔池化注意力)
- **性能**: VisDrone2021/UA-DETRAC 小目标增益显著
- **为什么是P1**: DCNv4路线 vs 动态核路线(RFAG-YOLO)对照; MSFEM双分支并行是P2特征保留的另一种策略
- **关联 Idea**: #6 SLE(P2保留路线对照)
- **局限**: DCNv4工程实现复杂

### FA-YOLO: Frequency Domain Adaptation Neck (IEEE 2026.04)
- **链接**: IEEE 11542900
- **核心**: AFPN+ASFF+频域自适应特征增强(FDAFE)→复杂水域检测; 频域自适应融合
- **性能**: +4.1% Recall / +2.1% mAP@0.50 vs YOLOv11n
- **为什么是P1**: **频域×Neck融合**——AFPN+ASFF已是最强Neck组合之一, FDAFE的频域自适应增强为Neck设计提供新维度
- **关联 Idea**: #9(GCP-ASFF vs AFPN对照·FA-YOLO提供第三种频域Neck)
- **局限**: 水域场景→VisDrone泛化待验证

---

## P2 🟡 快评 (21篇·按子方向分组)

### 自适应感受野

| 论文 | Venue | 核心 | 一句话 |
|------|-------|------|------|
| **YOLO-SM** (Scale-Match) | IVC 2025.03 | SMBlock(膨胀卷积+空间注意力动态选择); DOTA 79.28%/-74.8%参数 | 动态感受野+即插即用 |
| **LGHVSS-Mamba YOLO** | DSP 2025 | GMSPPF(动态感受野SPP)+SEVSS-HSFPN; VisDrone +7.7%/-0.17M参数 | Mamba+动态感受野 |
| **SSAC-YOLO** | Springer LNEE 2026 | SAC(动态可切换空洞卷积)+多尺度池化; 密集小目标 | 空洞卷积自适应切换 |
| **SWL-YOLO** | IEEE Access 2026 | LSK(大核选择机制)+SAFM; VisDrone +5.1% | 大核选择动态感受野 |
| **HAD-YOLO** | IEEE 2025.07 | 动态感受野深度可分离卷积+HAT+AFPN; DIOR/AI-TOD | 混合注意力+动态RF |

### 尺度感知标签分配

| 论文 | Venue | 核心 | 一句话 |
|------|-------|------|------|
| **SARFA-Net (SALA)** | 2025 | 椭圆区域(非圆形)正样本选择+宽高比自适应; 旋转框 | 形状感知LA |
| **MFN-Net (SFLA)** | IJRS 2026 | 宽高比过滤+动态匹配; SODA-A +1.9%/AI-TOD +1.1% | 灵活标签分配 |

### 极端小目标增强

| 论文 | Venue | 核心 | 一句话 |
|------|-------|------|------|
| **HF-D-FINE** | 2025 | HF混合编码器+CAF通道自适应融合+Outer-SNWD Loss; VisDrone +3.2% AP | DETR高分辨率特征注入 |
| **PASR-YOLO** | Springer 2026 | HDI高分辨率细节注入单元; VisDrone +6.6% vs YOLO11 | P2特征→金字塔高层 |
| **CSD-DETR** | ACM 2026 | SOFFM(SPDConv P2保留)+CSP-OmniKernel; VisDrone +3.7%/-25%参数 | 高分辨率金字塔融合 |
| **DARE-YOLO** | 2025 | DRDU(动态分辨率双模上采样)+FMSFPN; VisDrone +9.2% | 动态分辨率+注意力上采样 |
| **MEF-DETR** | Neurocomputing 2026 | CSOL-FPN(线性参数高效卷积)+频域-空域互补OmniKernel | 频域+空域边缘增强 |
| **Super Mamba** | Scientific Reports 2025 | RFAConv+VSS+SAM+SE+BiFPN; VEDAI >92% mAP50 | Mamba特征增强 |
| **MambaIR-YOLO** | MDPI Sensors 2026 | SR辅助分支(训练专用·零推理开销)+ODSSBlock; 4.46M/19.97GFLOPs | 轻量SR+Mamba |
| **YOLOv11 BiFPN++** | IET/IEEE 2026 | 高分辨率预测头+小目标检测分支+双向加权FPN; 召回+22%/误检-37.2% | 高分辨率头+BiFPN |

### 多尺度特征对齐 (Neck)

| 论文 | Venue | 核心 | 一句话 |
|------|-------|------|------|
| **GFPN** (Queen-fusion) | 2025 | 跨层连接(log₂n-link)+Queen-fusion(同级+下级降采样+上级上采样); O(l·log₂l) | 全局特征金字塔 |
| **BiFPNGLSA** (GBF-YOLO) | 2025 | 全局局部注意力BiFPN+EMSCP; 参数-34.5%/FLOPs-15.7%/mAP+12.1 | 轻量BiFPN |

### 频域×尺度

| 论文 | Venue | 核心 | 一句话 |
|------|-------|------|------|
| **MS-YOLOv11** | Sensors 2025 | 2D Haar小波频带分解+小核深度卷积+MSPLCK(密集多尺度空洞卷积)+EPA自适应融合 | 小波多尺度 |
| **MAFS-YOLO** | J.FCST 2026 | MANet(小波四频带并行卷积)+FourierSPPF(FFT金字塔池化); VisDrone +1.9%/-13%参数 | 小波+Fourier双频域 |
| **WEYOLO** | RS 2026.04 | FaLH(频域感知提升Haar主干)+FDPP(小波金字塔池化)+尺寸感知质量回归Loss; AI-TOD 47.5%/-60%参数 | 频域主干+金字塔 |
| **SCMWNet** | Signal Processing 2026.08 | WMFM(小波增强多尺度融合)+SFCDown+C2fMSDA; 地下煤矿场景 | 小波融合+多尺度注意力 |
| **SDANet** | Optics & Laser Tech 2026 | HMD(无步长Haar小波下采样)+SWEM(多尺度小波卷积)+ARSA(注意力路由尺度自适应) | 无步长下采样+小波 |

### 条件计算×尺度

| 论文 | Venue | 核心 | 一句话 |
|------|-------|------|------|
| **Input-Adaptive DNN** | Electronics 2026.05 | 早退(33%/66%深度)+Straight-Through Gumbel-Softmax分组路由; YOLO26s -17.32% GFLOPs | 深度+宽度双维自适应 |

---

## 五大核心发现

### 1. 尺度维度是项目存量最大方向——检索确认

30篇命中远超OBB(21篇)和密集遮挡(13篇)→证实了TASKS中"存量最多"的判断。项目已有Idea中#5/#6/#7/#8/#9/#11/#22均直接或间接涉及尺度→需从"散点Idea"升级为"系统化尺度建模方向"。

### 2. 频域×尺度=最成熟的交叉维度

DERNet(三阶段频域管线)+MS-YOLOv11(小波)+MAFS-YOLO(小波+Fourier)+WEYOLO(FaLH)+SCMWNet+SDANet+FA-YOLO+FS-Mamba→**8篇频域×尺度论文**。关键分化: 频域用于特征增强(vs 项目频域判据用于条件计算/遮挡/NMS)→差异化空间明确。

### 3. 尺度感知LA成为独立研究方向

VALA(VIoU虚拟锚框)+DCNet(DSA动态尺度感知)+SA-Matching DETR(CVPR 2026·尺度自适应匹配)+SARFA-Net(SALA椭圆形状感知)+MFN-Net(SFLA宽高比过滤)→**5篇尺度感知LA**，从"均匀分配"→"尺度自适应分配"的范式迁移正在发生。与项目#40(密度感知LA)形成"密度×尺度"双维LA的交叉切入点。

### 4. YOLO-Master(CVPR 2026)=MoE×尺度=条件计算新范式

ES-MoE的多尺度专家(3×3/5×5/7×7核)本质是**感受野维的条件计算**——不同尺度目标路由到不同核大小专家。项目#5语义熵门控目前仅做"算不算"的二元决策→可扩展为"怎么算"的多专家路由(MoE from scratch vs 冻结backbone加轻量路由器)。

### 5. SR辅助分支=小目标增强最优雅方案

FS-Mamba/MambaIR-YOLO的"训练专用SR→零推理开销"范式是小目标增强的工程最优解。与项目#5的训练-推理解耦哲学(Gumbel→硬阈值)一脉相承。

---

## 深读优先级建议

| 优先级 | 论文 | 理由 |
|--------|------|------|
| **P0-1** | YOLO-Master (CVPR 2026) | MoE×YOLO标杆·尺度×条件计算交汇 |
| **P0-2** | DERNet (2026) | 频域三阶段特征学习·与D1对称架构 |
| **P0-3** | VALA (2026) | 尺度感知LA最新SOTA |
| **P0-4** | FS-Mamba (2025) | 频域门控+SR辅助·零推理开销范式 |
| P1-1 | DCNet (PR 2025/2026) | 尺度感知LA对照 |
| P1-2 | SA-Matching DETR (CVPR 2026F) | 尺度自适应匹配 |
| P1-3 | RFAG-YOLO (Sensors 2025) | 自适应感受野+尺度感知融合 VisDrone实测 |
| P1-4 | MFR-YOLO (SciRep 2025) | DCNv4路线对照 |
| P1-5 | FA-YOLO (IEEE 2026) | 频域×Neck融合 |

---

## 统计

- **总命中**: 30篇 (P0×4 / P1×5 / P2×21)
- **自适应感受野**: 7篇
- **尺度感知LA**: 5篇
- **极端小目标增强**: 10篇
- **多尺度特征对齐(Neck)**: 2篇
- **频域×尺度**: 8篇 ← **最活跃交叉方向**
- **条件计算×尺度**: 2篇
- **关联项目 Idea**: #5 #6 #7 #8 #9 #11 #12 #22 #40

---

*Generated: 2026-07-18 | 尺度变化拓展 L1 补充检索*
