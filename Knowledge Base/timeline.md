# Detection Timeline
> 每读一篇论文更新。记录关键模型演进。

```
2015  Faster R-CNN
  ↓
2017  RetinaNet+Focal Loss("难例聚焦"开创性工作,ICCV) | YOLOv2
  ↓
2018  YOLOv3
  ↓
2020  DETR, YOLOv5
  ↓
2021  FcaNet(多频谱通道注意力,GAP=最低频DCT特例,ICCV)
  ↓
2022  DINO, YOLOv7
  ↓
2023  DINOv2(自监督ViT+涌现objectness+无需文本监督,ICCV)
  ↓
2024  RT-DETR, YOLOv9, YOLO11 | YOLO-World(开集YOLO实时化, CVPR) | DQ-DETR(ECCV,动态query小目标) | ACM-Coder(复指数角度编码→消除旋转框边界不连续,CVPR) | SViT(WACV,token保留/再激活,仅-0.3 AP→34%加速) | FFCA-YOLO(IEEE TGRS,遥感小目标,FEM+FFM+SCAM)
  ↓
2025  YOLOv12(注意力中心,NeurIPS) | D-FINE(分布式回归FDR+定位自蒸馏GO-LSD,ICLR,实时DETR新基座,COCO 54.0@31M) | SEEN-DA(语义熵+VLM adapter, CVPR) | SEMA-YOLO(SLE+GCP-ASFF, RS) | D3Q(DETR+密度估计+动态查询,JSTARS,AI-TOD SOTA) | SFIDM(空频交互+KLD分配, RS, FSOD) | SET(频谱增强小目标,CVPR,"去高频帮小目标") | FMC-DETR(频域解耦+KAN+多域协调,arXiv,VisDrone 33.7 SOTA) | FDConv(频域动态卷积核,CVPR,不涉及条件计算) | **PRNet(PRN骨干特征复用+迭代精炼Neck,VisDrone 54.1@24.6M=检索最高,arXiv)** | MGS(微门控稀疏化,MLSP,冻结主干+12%开销→85–95%稀疏率) | ELDET(早学蒸馏,NeurIPS,定位/分类噪声时序不对称epoch 4 vs 11) | GCA2Net(ARU条件路由+DRC动态旋转核,RS,旋转框) | ALGS(自适应标签粒度,TGRS,遥感多粒度分类) | DM-EFS(动态复用扩展特征集,ICCV,P2浅层特征利用范式验证) | O²(首个实时旋转DETR,TGRS,ADR+CDC+OCD,297FPS) | MOCHA(VLM→YOLO蒸馏,Samsung,翻译模块+关系保持loss) | AD-Det(RS,ASOE P3激活裁剪+DCC尾类copy-paste,VisDrone 37.5 coarse-to-fine SOTA) | Dome-DETR(密度引导特征-query操纵,arXiv/USTC,DeFE+MWAS+PAQI,AI-TOD-V2 34.6/VisDrone val 39.0双SOTA) | Dynamic DETR/Token Aggregation(学习式token importance逐级聚合,ICML) | UAV-DETR(FFT增强+频域下采样+SAC融合门控,复旦) | **OPL/OPD/OPC(首个显式遮挡感知损失,ESWA,bbox重叠+高斯模糊自动GT,遮挡召回率95.4%)**
  ↓
2026  TinyFormer(YOLO-DETR混合,PBM+SSA,arXiv) | DERNet(频域全管线,小波+Log-Gabor+频域头,arXiv) | SFDNet(频谱解耦分治+原型蒸馏,ECCV) | ViCrop-Det(SAE熵引导裁剪,arXiv,DETR小目标免训练增强) | D³R-DETR(双域密度优化DETR,arXiv,Gabor频域核+密度稀疏化) | CLIP-Bias(CLIP置信度偏差诊断,arXiv,尺度/语义双重偏差结构证实) | DFIR-DETR(频域迭代优化+动态K-稀疏注意力,arXiv,VisDrone 51.6) | MDI-YOLO(C2f-MCC通道分组Transformer-CNN,SciRep,VisDrone+4%) | SFS-DETR(空间-频域联合选择,CVPR Findings,5 UAV数据集) | YOLO26 STAL(候选筛选阶段膨胀代理框,arXiv) | Mask-Guided Distillation(teacher objectness蒸馏mask,IEEE) | FSDETR(可学习频域滤波FSFPN/CFSB,IJCNN,频域浪潮第7篇纯增强) | HI-MoE(DETR两级MoE scene→instance路由,arXiv preliminary,专家维条件计算) | Unmasking the Tiny(STSM+FRM前景分数补强,IVC正式见刊) | HFSP-YOLO(Space-to-Depth P2→P3注入,IEEE,P2利用第三路线)
  ↓
2026  ...
```

### 支线时间线
- **🟪 实时 DETR 基座线(B轨主线,2026-07-17 起追踪;基础线 4/4 全部读毕 ✅)**: DETR(2020,端到端开创但慢:500ep+APs 20.5,根因=均匀初始化注意力+二次复杂度)→ **Deformable DETR(ICLR 2021,MSDeformAttn K点稀疏采样+多尺度免FPN,1/10训练代价 APs→26.4;two-stage=QS诞生地,✅已读)** → DAB/DN-DETR(2021–22,anchor box query+去噪训练)→ **DINO(ICLR 2023,CDN对比去噪+混合QS+LFT,12ep 49.0/APs +7.2,首登COCO榜端到端,✅已读)** → **RT-DETR(CVPR 2024,首个实时端到端:AIFI只算S5+CCFF+不确定性最小QS,53.1@108FPS,✅已读)** → LW-DETR(2024,证明DETR预训练收益>YOLO)→ RT-DETRv2/v3(2024–25,训练策略升级)→ **D-FINE(ICLR 2025,FDR分布式回归+GO-LSD自蒸馏,54.0@31M/91G,O365后APs 40.0,✅已读,B轨基线纸面初判)** → 小目标特化分支:FMC-DETR/EFSI-DETR/**Dome-DETR(✅已读,密度→MWAS+PAQI,双SOTA;**07-18放码✅+ACM MM 2025 接收**,S/M/L权重→#30 E1官方对照)**/D³R-DETR/DFIR-DETR/SFS-DETR(2025–26,底座 RT-DETR 系/D-FINE);⚠️ RT-DETR官方自认小目标短板(APs低于同级YOLO)→ B轨改进空间由原作者背书;⚠️ ~~全线无P2检测层~~ **2026-07-17 失效**:Dome-DETR 已用最浅层四尺度特征+MWAS控成本 → #14 降级回结构对照;🔑 QS判据演进链(纯top-K→混合→不确定性最小→密度/熵引导)的下一格 **#5-D 查新❌**(Dome-DETR 结构性占据)——B轨主Idea 更替为 **#30 免监督频谱判据→浅层token条件计算**(✅查新通过,裁决见 Ideas/detr_derivative_novelty_check.md);🔑 小目标增益是谱系每环最大收益项(Deformable +5.9/DINO +7.2)= DETR系主线是"query离小目标更近",与YOLO系"分辨率更高"正交
- **DAOD**: DA-Faster(2018)→ 对抗对齐/解耦(2021–23)→ VLM-based: DA-Pro(2023)→ SEEN-DA(2025,语义进入视觉编码器)
- **FPN 演进**: FPN(2017)→ PAN(2018)→ BiFPN/NAS-FPN(2019)→ ASFF(2019)→ Recursive-FPN(2021)→ AFPN(2023)→ GCP-ASFF(2025)→ PRN(2025,backbone原始特征多次复用+迭代精炼,VisDrone单模块+10.3 AP50/参数反降/FLOPs+110.7%)
- **小目标专线**: RFLA(2022)→ CAB Net/SCDNet(2022–24)→ DNTR(2024)→ DQ-DETR(ECCV 2024)→ D3Q(2025,DETR动态查询,AI-TOD SOTA)→ SEMA-YOLO(2025)→ PRNet(2025,PRN骨干复用+10.3,VisDrone最高纪录)→ TinyFormer(2026,YOLO-DETR混合,PBM捷径策略)→ DFIR-DETR(2026,频域迭代优化+DKSA K-稀疏注意力)
- **频域检测线(2025–2026 新兴)**: FcaNet(2021,频域通道注意力)→ BiSD-YOLO C3WT(2024,小波变换门控增强)→ SFIDM(2025,空频交互+高频定位,FSOD)→ SET(CVPR 2025,频谱增强,噪声抑制→小目标,推理零开销)→ FMC-DETR(arXiv 2025.09,频域解耦+KAN+多域协调,VisDrone +6.5 AP)→ DERNet(arXiv 2026.06,小波门控+Log-Gabor+频域头,1/6参数超YOLOv11)→ SFDNet(ECCV 2026,低/中/高三频谱解耦+原型蒸馏)→ EFSI-DETR(arXiv 2026.01,**"频域启发非变换"**——空域三通路代理胜真FFT 33.1vs32.3,VisDrone APs 24.8@640/188FPS)→ FSDETR(IJCNN 2026,可学习2D-DFT频域滤波FSFPN/CFSB,VisDrone APs 13.9,**频域浪潮第7篇**;另有SO-DETR(IJCNN 2025,双域encoder+KD)计数入线)——⚠️ 全线做特征增强,无人做条件计算/稀疏化(=#11/#30 差异化生命线,**2026-07-18 第7篇后空白维持**);⚠️ EFSI 揭示新走向:部署导向的工作正逃离真变换 → #11 判据实现需真FFT/Gabor/空域代理三选项对照
- **高斯化标签分配**: GWD(2021)→ KLD(Yang et al., 2021)→ NWD/DotD(2021)→ RFLA(2022,box高斯→ERF高斯+HLA补偿)→ SFIDM-DM(2025,进入FSOD);⚠️ 全线无人系统横向对比,且 RFLA 证实一阶段收益远小于两阶段(#12 的切入点与风险)
- **遥感 FSOD**: FSFR/Meta-YOLO(2019)→ TFA(2020)→ FSCE(2021)→ FSODM/MFDC(2022)→ MLII-FSOD(2024)→ SFIDM(2025,频域首入)
- **开集检测(OVD)**: CLIP(2021)→ GLIP(2022)→ Grounding DINO/DetCLIP(2023)→ YOLO-World(2024,实时化)→ YOLOE(2025,删融合改对齐+三prompt统一,✅已读);⚠️ 全线无 P2/小目标关注,与小目标专线尚未交汇——#5 位于两线交点;YOLOE 的 LRPC 已把"语义分数滤 anchor"做到 head 级,特征级仍空白
- **门控/稀疏计算(新兴跨界,2025–2026)**: MGS(MLSP 2025,分组门控+冻结主干→85–95% MLP稀疏率,DETR通道级) → GCA2Net(RS 2025,ARU自适应路由+DRC动态核旋转,旋转框空间级路由) → SPA/SPT(ICLR 2026,GT监督门控+packing打包,**首个训练期也真实省算力的token选择**,但明确避开浅层) → Unmasking the Tiny(IVC 2026,YOLO系首个稀疏token选择;**07-18见刊细节:STSM+FRM=前景分数补强式加法,与#5跳过式减法方向相反→哨点降级普通近邻**) → HI-MoE(arXiv 2026.04 preliminary,DETR两级MoE路由,条件计算在**专家维**,与#30 token空间维正交) → 本项目 #5/#11(P2特征级空间门控,CNN YOLO,省算力,免训练判据)+#30(免监督频谱判据→DETR浅层token预算分配);⚠️ 工程方案三支柱齐备:Conv1×1门控(ARU范式)+BCE训练(MGS/SPA范式)+稠密重排推理(HashEye输入级/SPA特征级双先例);⚠️ 张力必答题:SPA"浅层不剪"vs #5"专剪最浅P2"——语义判据+LLF兜底是答案,M0预实验是裁判
- **蒸馏新范式(2025)**: LD(TPAMI 2023,定位蒸馏开创)→ FGD(2022,细粒度蒸馏)→ CLD-FCOS(2026,课程蒸馏,分类→定位递进;未深入评估)→ ELDET(NeurIPS 2025,早学蒸馏,定位/分类噪声时序不对称epoch 4 vs 11)→ #7(语义熵蒸馏,可借鉴ELDET时序分阶段策略;定位蒸馏早期集中+语义蒸馏持续后期)
- **旋转框角度编码(2023–2025)**: CSL(ECCV 2020,角度分类)→ GWD(2021,高斯分布联合优化)→ KLD(2021,KL散度度量)→ KFIoU(2023,卡尔曼滤波IoU)→ PSC(CVPR 2023,相位编码)→ ACM-Coder(CVPR 2024,复指数编码,证明KLD/GWD未真正解决边界不连续)→ GCA2Net(RS 2025,ARU路由+DRC动态核旋转);⚠️ ACM-Coder的教训"换了度量≠解决了问题"对#12 KLD标签分配构成方法论警示
- **多粒度分类(2025)**: ALGS(TGRS 2025,遥感MGC首次,语义距离loss+Accuracy-Specificity曲线+Pareto集推理);⚠️ 纯分类—"自适应粒度选择"概念在精神上与检测中"自适应特征层选择"相通,但无直接技术迁移路径
- **裁剪式 coarse-to-fine(UAV 专线)**: ClusDet(2019,RPN聚类)→ DMNet(2020,密度图引导裁剪)→ GLSAN(2020,全局-局部融合)→ CDMNet(2021)→ AMRNet(2022)→ CZDet(2023,高密度子区域级联)→ YOLC(2024,局部尺度模块)→ AD-Det(RS 2025,P3激活图零参数裁剪+DCC,37.5 SOTA)→ ViCrop-Det(2026,SAE注意力熵裁剪,免训练)→ HashEye(SciRep 2026,**反向变体:剪背景而非裁前景**——LSH碰撞频率免训练识别背景patch,稠密重排,Jetson 5.25×,⚠️城市失效);⚠️ 全线两阶段非实时(0.5s+/img;HashEye 例外但仅限均质背景)——与 #5 的"门控式"(单阶段实时)构成赛道分界;判据演化:RPN框→密度图→P3激活→注意力熵→LSH纹理统计,与 #5 的语义熵一脉相承但均为图像级
- **UAV copy-paste 增强线(2021–2025)**: Simple Copy-Paste(CVPR 2021,随机贴图)→ AD-Det DCC(RS 2025,记忆库多样性+簇中心BFS位置合理性,仅训练期)→ 场景理解式实例增强(IEEE TAES 2025,SAM+inpainting建模光照/视角真实感);⚠️ 位置合理性(DCC)与外观真实感(TAES)两条正交改进线尚无人融合
- **🟦 P2 浅层特征利用路线(YOLO 系,2025–2026 新兴)**: ①加P2头(RSI-YOLO/SEMA-YOLO/LAF-YOLOv10/SDD-YOLO,算力大涨);②P2→P3 注入(HFSP-YOLO,Space-to-Depth 细节无损,2026);③头内粗粒度尺度选择(DM-EFS,Codebook,非空间自适应);④骨干P2复用+迭代精炼(PRNet,PRN,单模块+10.3 AP50/FLOPs+110.7%);⚠️ 四条路线**全部静态稠密,无输入自适应空间条件计算** → #5 gap 第 N+3 次确认;PRNet FLOPs 代价最直观=条件计算 motivation 最强数据点
- **🔴 遮挡感知/密集检测线(2026-07-18 起追踪; L2经典补读完成✅)**: **Repulsion Loss(CVPR 2018,✅已读,L_Attr+L_RepGT(IoG)+L_RepBox(Smooth_ln);训练期排斥远离错误GT/预测框;Heavy遮挡−3.7 MR⁻²;IoG避cheat gradient→OAR-Loss前身)** → **Soft-NMS(ICCV 2017,✅已读,IoU-based分数衰减替代硬清零;高斯罚函数σ=0.5;COCO+1.3%/Recall@100+8.4;一行代码即插即用→NWD-Soft-NMS演化起点)** → Adaptive NMS(CVPR 2019,密度感知NMS阈值) → **CrowdDet(CVPR 2020 Oral,✅已读,EMD Loss K=2+Set NMS同源跳过;CrowdHuman+4.9%AP/密集召回+8.9%;局部集合预测vs DETR全局集合→grid-cell EMD适配空白)** → PedHunter(AAAI 2020,遮挡鲁棒)→ 2025–26 新浪潮: **OPL/OPD/OPC(ESWA 2025,🔬已读,首个显式遮挡感知损失——遮挡建模从隐式(增强/repulsion)转向显式(预测遮挡图+注入补偿),bbox重叠+高斯模糊零标注GT,遮挡召回率95.4%/+22.6%)** → OAR-Loss(DOMino-YOLO,RepLoss 2025变体,⏳)→ FAFL(五组件遮挡损失,⏳)→ DALA(ESWA 2026,🔬已读,密度感知标签分配双轨O2O/Decreasing);⚠️ 演化主轴: 回归排斥(2018)→预测去重(2020)→NMS改良(2017–19)→**显式遮挡图建模(2025,OPL开创)**;⚠️ 双 Gap: ①OPL 的 bbox重叠 GT 有结构性盲区(并排假阳性/完全遮挡不可建模/截断与背景遮挡盲区)→频域判据替代=免重叠遮挡先验(#35);②遮挡区域-高熵相关性未被验证(#36)——遮挡线与条件计算线(#5/#30)的交汇由本项目首次打通
  ↓
2026  **DOMino-YOLO(OAR-Loss=RepLoss+Visibility-Weighted CLS, MDPI RS, YOLOv11+VOD-UAV 5级遮挡数据集)** | **DRONet(OAKB=KAN+GRAM频域参数化核+PSI+SDEA, Displays, VisDrone 50.1%@60FPS)** | **HEdge-MamYOLO(FM-CHFEM=频域+Mamba协同高频增强→遮挡修复, IEEE TGRS, VisDrone 52.5%检索最高)** | **MFF-YOLO(NWD-Soft-NMS=NWD替代IoU进衰减函数+9.0%, DMBD/Springer)** | **GCS-DETR(FreqDyNet频域backbone+OAM-FPN小波融合+NWD-MPDIoU, Multimedia Systems, 三组件均可YOLO迁移)** | ...
