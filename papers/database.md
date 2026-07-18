# 论文数据库(Paper Database)

> 全项目文献结构化索引 | 建立: 2026-07-17 | 维护规则: 每轮新增论文后追加一行,变更状态就地更新
> 类型: 🔬深读(全文) / 🔍深度评估(WebFetch提炼) / ⚡快评 | 状态: 🔔=挂跟踪项 | 来源: 【自】=用户提供文献,未标=Agent 检索 | 论文名=原文链接(arXiv/DOI/出版方)
> 统计: **77 条**(48 单篇 🔬 + 3 🔍 + 26 ⚡)| 2026-07-18 质量筛选: 移除 PST/HI-MoE/DroneScan-YOLO/DisDop/RFAssigner (纯arXiv+无venue+无代码+无机构背书)
> 📊 质量分类体系: [classification.json](classification.json) — **6级分类×6维标签**; Dashboard「论文分类」视图可交互浏览

## 一、开集 / VLM 基座(#5/#7/#8 依赖链)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [YOLO-World](https://arxiv.org/abs/2401.17270) | CVPR 2024 | 🔬 | #5 #7 #8 | 开集YOLO首次实时;RepVL-PAN跨模态融合 | [→](summaries/YOLO-World_CVPR2024.md) |
| [YOLOE](https://arxiv.org/abs/2503.07465) | arXiv 2025 | 🔬 | **#5基座定论** #7 | 删融合改对齐(RepRTA);LRPC滤80%anchor=头级语义稀疏最近邻 | [→](summaries/YOLOE_2025.md) |
| [SEEN-DA](https://openaccess.thecvf.com/content/CVPR2025/html/Li_SEEN-DA_SEmantic_ENtropy_guided_Domain-aware_Attention_for_Domain_Adaptive_Object_CVPR_2025_paper.html) 【自】 | CVPR 2025 | 🔬 | #5(语义熵源头) | 语义熵注意力;冻结VLM+1.875M adapter | [→](summaries/SEEN-DA_CVPR2025.md) |
| [CLIP-Bias](https://arxiv.org/abs/2607.10993) | arXiv 2026.07 | 🔬 | #5⚠️风险 #11↑ #15 | CLIP置信度双重偏差(尺度膨胀+语义抑制),结构性不可逆 | [→](summaries/CLIP-Confidence-Bias_arXiv2026.md) |
| [MOCHA](https://arxiv.org/abs/2509.14001) | arXiv 2026 | 🔬 | **#7技术基线** | VLM(LLaVa)→YOLO蒸馏;Translation Module跨架构映射 | [→](summaries/MOCHA_arXiv2026.md) |
| [DINOv2](https://arxiv.org/abs/2304.07193) | ICCV 2023 ⚠️pre-2025 | 🔬 | **#18** #19 | 自监督patch features涌现objectness;免VLM中立判据 | [→](summaries/DINOv2_ICCV2023.md) |

## 二、频域检测(#11/#13/#21/#25 竞争与工具)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [SET](https://openaccess.thecvf.com/content/CVPR2025/html/Sun_SET_Spectral_Enhancement_for_Tiny_Object_Detection_CVPR_2025_paper.html) | CVPR 2025 | 🔬 | #11判据修正 | 频域归因:"抑制背景噪声而非增强信号";去高频帮小目标 | [→](summaries/SET_CVPR2025.md) |
| [DERNet](https://arxiv.org/abs/2606.23825) | arXiv 2026.06 | 🔬 | #11最强竞争+佐证 | 频域全管线(WDG+LGE+FDHead);1/6参数超YOLOv11 | [→](summaries/DERNet_2026.md) |
| [SFDNet](https://arxiv.org/abs/2606.29029) | ECCV 2026 | 🔬 | #11竞争者 | 低/中/高三频谱解耦+类别原型蒸馏 | [→](summaries/SFDNet_ECCV2026.md) |
| [FMC-DETR](https://arxiv.org/abs/2509.23056) | arXiv 2025.09 | 🔬 | #11 #13技术方案 #14 | 振幅-相位解耦;[D2,D4]非均匀检测层;VisDrone 33.7 | [→](summaries/FMC-DETR_arXiv2025.md) |
| [D³R-DETR](https://arxiv.org/abs/2601.02747) | arXiv 2026.01 | 🔬 | #13 #16(Gabor工具) | Gabor频域核+密度引导注意力稀疏化;Gabor>Fourier>Haar | [→](summaries/D3R-DETR_arXiv2026.md) |
| [DFIR-DETR](https://arxiv.org/abs/2512.07078) | arXiv 2026.05 | 🔬 | #20工程雏形 #11 | 频域最小二乘聚合+DKSA动态K-稀疏注意力 | [→](summaries/DFIR-DETR_arXiv2026.md) |
| [EFSI-DETR](https://arxiv.org/abs/2601.18597) | arXiv 2026.01 | 🔍 | #11⚠️三选项 #6佐证 | **"频域启发非变换"**空域代理胜FFT;弃F5反涨;APs 24.8@640/188FPS | [→](summaries/EFSI-DETR_arXiv2026.md) |
| [SFIDM](https://doi.org/10.3390/rs17060972) 【自】 | RS 2025 | 🔬 | #11源头 #12 | 空频交互(高频定位/低频分类)+KLD分布匹配,FSOD | [→](summaries/SFIDM_RemoteSensing2025.md) |
| [FcaNet](https://arxiv.org/abs/2012.11879) | ICCV 2021 ⚠️pre-2025 | 🔬 | **#21** | GAP=最低频DCT;多频谱通道注意力 | [→](summaries/FcaNet_ICCV2021.md) |
| [FDConv](https://arxiv.org/abs/2503.18783) | CVPR 2025 | ⚡ | #11(不威胁) | 频域动态卷积核;不做条件计算 | [→](summaries/FDConv_CVPR2025.md) |
| [SFS-DETR](https://openaccess.thecvf.com/content/CVPR2026F/html/Jia_SFS-DETR_Spatial-Frequency_Selection_for_UAV_Object_Detection_CVPRF_2026_paper.html) | CVPR 2026F | ⚡ | #11(计数项) | 空间-频域联合选择;曾记"全文不可获取",CVF Findings 页已检索到 | [→](summaries/quick_eval_2026-07-16_literature_round2.md) |
| [UFO-DETR](https://arxiv.org/abs/2602.22712) | CSCWD 2026 | ⚡ | #11(计数项) | LSKNet+DynFreq-C3(FDConv);VisDrone mAP50 46.1/算力-60%;纯增强不做条件计算 | [→](summaries/quick_eval_2026-07-17_attention_round1.md) |
| [HF-DETR](https://ieeexplore.ieee.org/document/11420990) 🔔 | IEEE SPL 2026 | ⚡ | **#30⚠️撞车监控** #11 #22 | LoG stem+小波重建+**SSMG saliency token门控**;VisDrone AP+4.3/121FPS;SSMG判据性质待全文核实(07-18复查:仍付费墙无arXiv镜像) | [→](summaries/HF-DETR_SPL2026.md) |
| [FSDETR](https://arxiv.org/abs/2604.14884) | IJCNN 2026 | ⚡ | #11 #30(频域浪潮第7篇) | RT-DETR基座+FSFPN/CFSB可学习频域滤波;VisDrone APs 13.9超D-FINE-M;纯增强不做条件计算→#30 gap再证 | [→](summaries/quick_eval_2026-07-18_literature_round.md) |
| [SO-DETR](https://dtic.dimensions.ai/details/publication/pub.1195037651) | IJCNN 2025 | ⚡ | #11(计数项) #7 | 双域(空+频)hybrid encoder+KD+轻量backbone;VisDrone/UAVVaste | [→](summaries/quick_eval_2026-07-18_literature_round.md) |
| [MFVL-YOLO](https://doi.org/10.1088/1402-4896/ade1b6) ⚠️ | Physica Scripta 2025 | ⚡ | **#5近邻划界** #15佐证 | YOLOv10+频域高频增强+**熵引导前景判别**;VisDrone +3.1;熵用于增强判别非计算分配→与#5三要素划界 | [→](summaries/quick_eval_2026-07-18_literature_round.md) |

## 三、Token 选择 / 门控 / 稀疏计算(#5/#22 最近邻社区)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [Token Cropr](https://arxiv.org/abs/2412.00965) | CVPR 2025 | 🔬 | #5划界+**LLF兜底** | 单query router+任务辅助头;LLF末端复活零参数近无损 | [→](summaries/TokenCropr_CVPR2025.md) |
| [SViT](https://arxiv.org/abs/2306.07050) | WACV 2024 ⚠️pre-2025 | 🔬 | #5兜底 **#22** | Token保留/再激活/动态率;硬删除是DynamicViT崩溃根因 | [→](summaries/SViT_WACV2024.md) |
| [MGS](https://arxiv.org/abs/2510.09380) | MLSP 2025 | 🔬 | #5/#11工程范式 | 分组门控+冻结主干+BCE→85-95% MLP稀疏率(DETR通道级) | [→](summaries/MGS_MLSP2025.md) |
| [SPA/SPT](https://arxiv.org/abs/2410.23608) | ICLR 2026 | 🔍 | #5工程+L_gate先例 #19 | GT监督门控+**packing打包**;训练期也真实省算力;⚠️浅层不剪 | [→](summaries/SPA_ICLR2026.md) |
| [Unmasking the Tiny](https://doi.org/10.1016/j.imavis.2026.106026) 🔔 | IVC 2026 | ⚡ | **#5近邻(哨点降级)** #22 | YOLOX+STSM前景token选择+FRM语义细化;07-18见刊细节:**补强式(加法)vs #5跳过式(减法)方向相反**→威胁降级;代码仍占位低频跟踪 | [→](summaries/quick_eval_2026-07-18_literature_round.md) |
| [HashEye](https://www.nature.com/articles/s41598-026-51941-w) | SciRep 2026 | 🔍 | #5划界+**v3.0稠密重排** #29 | 输入级LSH免训练剪97.5%patch;Jetson 5.25×;城市失效 | [→](summaries/HashEye_SciRep2026.md) |

## 四、小目标架构 / P2 路线(#6/#14 证据链)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [SEMA-YOLO](https://doi.org/10.3390/rs17111917) 【自】 | RS 2025 | 🔬 | **#6原型(SLE)** #9 #10 | P2头+截短backbone减参19.7%;GCP-ASFF | [→](summaries/SEMA-YOLO_RemoteSensing2025.md) |
| [DM-EFS](https://openaccess.thecvf.com/content/ICCV2025/html/Sharma_DM-EFS_Dynamically_Multiplexed_Expanded_Features_Set_Form_for_Robust_and_ICCV_2025_paper.html) | ICCV 2025 | 🔬 | #5粗粒度baseline #6 | P2浅层价值验证;Size-Codebook尺寸引导 | [→](summaries/DM-EFS_ICCV2025.md) |
| [TinyFormer](https://arxiv.org/abs/2605.25046) | arXiv 2026.05 | 🔬 | #5竞争论述 #6 | YOLO-DETR混合;PBM阻断小目标信号稀释 | [→](summaries/TinyFormer_2026.md) |
| [DQ-DETR](https://arxiv.org/abs/2404.03507) | ECCV 2024 ⚠️pre-2025 | 🔬 | #5双粒度启发 | 密度四档→自适应query数;AI-TOD-V2 30.2 | [→](summaries/DQ-DETR_ECCV2024.md) |
| [D3Q](https://ieeexplore.ieee.org/document/11007261) | JSTARS 2025 | 🔬 | "坚持YOLO"确认 | 连续密度回归+动态查询;DQ-DETR升级版 | [→](summaries/D3Q_JSTARS2025.md) |
| [FFCA-YOLO](https://doi.org/10.1109/TGRS.2024.3363057) | IEEE TGRS 2024 ⚠️ | ⚡ | 遥感baseline | 三即插即用模块;L版107FPS | [→](summaries/FFCA-YOLO_IEEE2024.md) |
| [MDI-YOLO](https://www.nature.com/articles/s41598-026-38378-x) | SciRep 2026 | ⚡ | (无直接关联) | C2f-MCC通道分组Transformer-CNN混合 | [→](summaries/quick_eval_2026-07-16_literature_round2.md) |
| [YOLOv12](https://arxiv.org/abs/2502.12524) | NeurIPS 2025 | ⚡ | 基线不切换 | 注意力中心YOLO;无P2;FlashAttention硬依赖 | [→](summaries/YOLOv12_NeurIPS2025.md) |
| [NSSA](https://www.nature.com/articles/s41598-026-39381-y) | SciRep 2026 | ⚡ | (无直接关联) | 快速评估,详见晚间汇总 | [→](summaries/quick_eval_2026-07-16_evening.md) |
| [PRNet](https://arxiv.org/abs/2510.09531) | arXiv 2025.10 | 🔬 | 🟦#5/#6/#24/#26 | PRN(骨干P2^in多次复用+迭代精炼,单模块+10.3 AP50/参数反降/FLOPs+110.7%)+ESSamp(PixelUnShuffle+d=2);**VisDrone AP50 49.9@7.77M/54.1(L)/61.0@1024=检索所见最高**;P2复用价值-代价矛盾=#5 motivation 最强新证;P2利用第四路线(骨干复用);静态迭代深度=层深维条件计算入口 | [→](summaries/PRNet_arXiv2025.md) |
| [HFSP-YOLO](https://ieeexplore.ieee.org/document/11543048) | IEEE 2026.04 | ⚡ | #5/#6 P2第三路线 | Space-to-Depth将P2细节无损注入P3,避免P2头开销;静态结构无输入自适应→与#5划界 | [→](summaries/quick_eval_2026-07-18_literature_round.md) |

## 五、裁剪式 coarse-to-fine(#5 赛道分界线)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [AD-Det](https://arxiv.org/abs/2504.05601) | RS 2025 | 🔬 | #5划界 #23证据 #6(DCC) | P3激活图零参数裁剪+DCC尾类copy-paste;37.5 AP非实时 | [→](summaries/AD-Det_RemoteSensing2025.md) |
| [ViCrop-Det](https://arxiv.org/abs/2604.26806) | arXiv 2026.04 | 🔬 | #5正交佐证 | SAE注意力熵免训练裁剪;熵范式验证 | [→](summaries/ViCrop-Det_arXiv2026.md) |

## 六、标签分配 / 损失 / 蒸馏(#7/#12 配套)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [RFLA](https://arxiv.org/abs/2208.08738) | ECCV 2022 ⚠️pre-2025 | 🔬 | **#12前置** #7 | 高斯ERF先验+KLD尺度不变分配;一阶段收益远小于两阶段 | [→](summaries/RFLA_ECCV2022.md) |
| [Focal Loss](https://arxiv.org/abs/1708.02002) | ICCV 2017 ⚠️pre-2025 | 🔬 | **#20源头** | 难例聚焦→"Focal Computation"理论平移 | [→](summaries/FocalLoss_ICCV2017.md) |
| [YOLO26 STAL](https://arxiv.org/abs/2606.03748) | arXiv 2026.06 | ⚡ | #12互补 #6默认启用 | 候选筛选阶段膨胀极小目标代理框 | [→](summaries/quick_eval_2026-07-16_evening.md) |
| [ELDET](https://proceedings.neurips.cc/paper_files/paper/2025/hash/6460e378f24da3a79f20ac2640732a00-Abstract-Conference.html) | NeurIPS 2025 | 🔬 | #7时序schedule | 定位噪声比分类噪声更早记忆(epoch 4 vs 11) | [→](summaries/ELDET_NeurIPS2025.md) |
| [Mask-Guided Distill](https://ieeexplore.ieee.org/document/11542828) | IEEE 2026 | ⚡ | #7 baseline | teacher objectness做蒸馏mask | [→](summaries/quick_eval_2026-07-16_evening.md) |
| [Scale-Conscious KD](https://ieeexplore.ieee.org/document/11251277) | IEEE 2025.11 | ⚡ | **#7对照轴** | MSFD尺度解耦+SAOD按目标面积动态加权蒸馏;直击大目标主导梯度问题→**面积加权 vs #7语义熵加权=现成消融** | [→](summaries/quick_eval_2026-07-18_literature_round.md) |
| [FFKD-Net](https://doi.org/10.1007/s11554-026-01910-3) | JRTIP 2026 | ⚡ | #7参照 | MobileNetV3+分层蒸馏HKDM;**VisDrone 47.7 mAP50@仅3.0M**=轻量+KD上限证据 | [→](summaries/quick_eval_2026-07-18_literature_round.md) |

## 七、旋转框 / 其他

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [O²系列](https://arxiv.org/abs/2603.15497) | TGRS 2026 | 🔬 | #17源头 | 首个实时旋转DETR(297FPS);ADR角度分布 | [→](summaries/O2_TGRS2026.md) |
| [GCA2Net](https://doi.org/10.3390/rs17061077) 【自】 | RS 2025 | 🔬 | #5/#11路由范式 | ARU自适应路由+DRC动态核旋转 | [→](summaries/GCA2Net_RemoteSensing2025.md) |
| [ACM-Coder](https://arxiv.org/abs/2305.10061) 【自】 | CVPR 2024 ⚠️ | 🔬 | #12方法论警示 | 证明KLD/GWD未真正解决边界不连续;"换度量≠解决问题" | [→](summaries/BoundaryDiscontinuity_CVPR2024.md) |
| [ALGS](https://doi.org/10.1109/tgrs.2025.3604077) 【自】 | TGRS 2025 | 🔬 | 概念参考 | 自适应标签粒度;纯分类,迁移路径有限 | [→](summaries/AdaptiveLabelGranularity_TGRS2025.md) |

---

## 八、🟪 实时 DETR 基座(B轨基础线,2026-07-17 双轨决策新增)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [RT-DETR](https://arxiv.org/abs/2304.08069) | CVPR 2024 ⚠️pre-2025 | 🔬 | B轨底座 #5-D #26 | 首个实时端到端;AIFI+CCFF+不确定性QS;⚠️官方自认小目标短板 | [→](summaries/RT-DETR_CVPR2024.md) |
| [D-FINE](https://arxiv.org/abs/2410.13842) | ICLR 2025 | 🔬 | **B轨基线初判** #7 #17 #26 | FDR分布式回归+GO-LSD自蒸馏;54.0@31M;O365后APs 40.0 | [→](summaries/D-FINE_ICLR2025.md) |
| [Deformable DETR](https://arxiv.org/abs/2010.04159) | ICLR 2021 ⚠️pre-2025 | 🔬 | B轨底座算子 #5-D #24 #26 | MSDeformAttn(K点稀疏采样,权重免QK内积);two-stage=QS诞生地;1/10训练代价APs 20.5→26.4 | [→](summaries/DeformableDETR_ICLR2021.md) |
| [DINO](https://arxiv.org/abs/2203.03605) | ICLR 2023 ⚠️pre-2025 | 🔬 | B轨谱系集大成 ~~#5-D~~ #26 #24 | CDN对比去噪+混合QS+LFT;12ep 49.0/APs +7.5;首个登顶COCO榜端到端检测器 | [→](summaries/DINO_ICLR2023.md) |
| [Dome-DETR](https://arxiv.org/abs/2505.05741) 🔴 | **ACM MM 2025** (USTC) | 🔬 | **❌判死#5-D / ✅#30对照** #24 #26 | D-FINE底座+DeFE密度头→MWAS浅层token稀疏+PAQI自适应query;AI-TOD 34.6/VisDrone 39.0双SOTA;GFLOPs+37%非净省;**07-18放码✅**(S/M/L权重+训练日志,动态query限单批训练)→#30 E1升级官方对照 | [→](summaries/Dome-DETR_arXiv2025.md) |

---

## 九、🔴 密集遮挡与 Crowd Detection（2026-07-18 L1 检索新增）

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [DALA](https://www.sciencedirect.com/science/article/abs/pii/S0957417426020981) | ESWA 2026 | 🔬 | 🔴密集遮挡·标签分配 | 按空间密度分类→密集O2O/稀疏Decreasing LA；首个密度显式建模进LA；密度×频域判据空白确认 | [→](summaries/DALA_ESWA2026.md) |
| [OPL (Occlusion Perception Loss)](https://www.sciencedirect.com/science/article/abs/pii/S0957417425030805) | ESWA 2025/2026 | 🔬 | 🔴密集遮挡·Loss, #30扩展, #5验证 | 显式遮挡感知学习：GT重叠区域→高斯模糊→OPD监督→OPC注入检测头；遮挡召回率95.4%(+22.6%)；首个显式遮挡感知损失 | [→](summaries/OPL_ESWA2025.md) |
| [DOMino-YOLO (OAR-Loss)](https://doi.org/10.3390/rs18010066) | MDPI Remote Sensing 2025.12 | 🔬 | 🔴密集遮挡·RepLoss, #35, #36 | YOLOv11+DCEM(DCN)+VASA(可见度聚合)+CSIM-Head(通道抑制); OAR-Loss=RepLoss+Visibility-Weighted CLS; VOD-UAV数据集(5级遮挡); ⚠️非VisDrone | [→](summaries/DOMino-YOLO_RS2025.md) |
| [FAFL (FragmentAware Focal Loss)](https://ieeexplore.ieee.org/document/11549881) | IEEE Conf 2026.05 | ⚡ | 🔴密集遮挡·Loss #5 | 五组件组合式损失(可见度/一致性/几何/熵正则/注意力)；50%遮挡下+53.9%相对提升 | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |
| [NWD-Soft-NMS (MFF-YOLO)](https://link.springer.com/chapter/10.1007/978-981-96-7175-5_19) | DMBD 2024 (CCIS Vol.2356) | 🔬 | 🔴密集遮挡·NMS, #35, #6增强 | YOLOv8+MFF多级融合+NWD-Soft-NMS(NWD替代IoU进衰减函数); VisDrone +9.0% mAP; NWD=小目标友好度量 | [→](summaries/MFF-YOLO_NWD-Soft-NMS_DMBD2025.md) |
| [DRONet](https://www.sciencedirect.com/science/article/abs/pii/S014193822600051X) | Displays (Elsevier) 2026.02 | 🔬 | 🔴密集遮挡·架构, #35, #36 | RT-DETR+ResNet18; OAKB(KAN+GRAM频域参数化核)+PSI(选择性空间集成)+SDEA(多速率膨胀); VisDrone 50.1%@60FPS; KAN在检测backbone首批实践 | [→](summaries/DRONet_Displays2026.md) |
| [HEdge-MamYOLO](https://ieeexplore.ieee.org/document/11489323) | IEEE TGRS 2026.04 | 🔬 | 🔴密集遮挡·频域, **#11 v2.0**, #25, #35 | FM-CHFEM(频域+Mamba协同高频增强→遮挡修复)+DSFFM(动态尺度融合)+LLFFH(PConv+P2融合); VisDrone **52.5%**(检索最高); 范式突破:频域增强→频域修复 | [→](summaries/HEdge-MamYOLO_TGRS2026.md) |
| [GCS-DETR](https://link.springer.com/article/10.1007/s00530-026-02378-8) | Multimedia Systems 2026.05 | 🔬 | 🔴密集×DETR×频域, #30, #35, 🟪YOLO迁移✅ | FreqDyNet(频域动态backbone)+OAM-FPN(小波+自适应融合+混合注意力)+NWD-MPDIoU; RT-DETR基座; VisDrone +3.0%/-20.6%参数; Jetson Orin部署; 三组件均可YOLO迁移 | [→](summaries/GCS-DETR_MultimediaSystems2026.md) |
| [FSS](https://www.sciencedirect.com/org/science/article/pii/S1546221826004236) | 2026 | ⚡ | 🔴密集遮挡·标签分配 #12 | 次优样本聚焦；概率矩阵+Gaussian-prior dynamic-k；50.8 AP零推理开销 | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |

## 十、🟪 DETR 专属扩展（2026-07-18 DX1 检索新增）

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [Adaptive Query Allocation (Ha et al.)](https://www.sciencedirect.com/science/article/pii/S2590123025036163) | Results in Engineering 2025 | ⚡ | 🟪DETR×密集 #30 | 密度图引导动态query选择；Deformable DETR；密集多分稀疏少分 | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |
| [Pe-DETR](https://cdn.sciengine.com/doi/10.19678/j.issn.1000-3428.0070106) | Computer Engineering 2026 | ⚡ | 🟪DETR×密集 | 密集不同query+不引入无效相似query；CrowdHuman +3.7 AP | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |
| [SCOPE-DETR](https://www.sciencedirect.com/science/article/abs/pii/S1051200426001508) | DSP 2026 | ⚡ | 🟪DETR×密集 #30 | 温度参数化调节空间注意力+通道能量抑制；防密集注意力稀释 | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |
| [RS-DETR](https://www.sciencedirect.com/science/article/abs/pii/S0952197625036280) | EAAI 2025 | ⚡ | 🟪DETR×OBB #17 #30 | 旋转-语义双分支协同注意力解码器；DIOR-R/DOTA SOTA | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |
| [RO²-DETR](https://www.sciencedirect.com/science/article/abs/pii/S0924271625002552) | ISPRS 2025 | ⚡ | 🟪DETR×OBB #17 | 1D旋转等变卷积+定向可变形解码器+o2m匹配；DOTA 77.82% | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |
| [Hausdorff Distance Matching (WACV 2025)](https://openaccess.thecvf.com/content/WACV2025/html/Lee_Hausdorff_Distance_Matching_with_Adaptive_Query_Denoising_for_Rotated_Detection_WACV_2025_paper.html) | WACV 2025 | ⚡ | 🟪DETR×OBB·匹配 | Hausdorff距离→匈牙利代价+Adaptive Query Denoising；DOTA +4.18 | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |
| [Dynamic DETR (ICML 2025)](https://proceedings.mlr.press/v267/cheng25i.html) | **ICML 2025** | 🔬 | 🟪B轨 **#30对照基线** #24 #33 #34 | 三阶段动态保留率(attention统计先验)+双轨聚合(低层Proximal窗口合并/高层Holistic亲合注入)+RCDR中心正则;DINO −42% FLOPs仅−0.7 AP胜Sparse/Lite/Focus全系;**深读裁定与#30不撞车**(统计先验vs物理先验,非输入自适应) | [→](summaries/Dynamic-DETR_ICML2025.md) |
| [Predictive Imbalance (LAD loss)](https://ieeexplore.ieee.org/document/11302474) | IEEE 2025.12 | ⚡ | 🟪B轨·匹配稳定性 | 分类-定位不一致定量分析→LAD loss对齐；51.5 AP无额外开销 | [→](summaries/quick_eval_2026-07-18_dense_occlusion_detr_dx1.md) |

## 统计速览

| 维度 | 数量 |
|---|---|
| 总条目 | **77**(🔬深读 48 + 🔍深度评估 3 + ⚡快评 26)| 2026-07-18 质量筛选: 移除5篇纯arXiv无venue/无代码/无机构背书论文 |
| VisDrone 相关 | 30+ |
| 频域检测线 | 18(核心 5 + 工具/外围 13) |
| Token选择/门控线 | **7** |
| 🔴 密集遮挡 | **12** |
| 🟪 B轨·实时DETR基座 | 5(基础线 4 闭环 ✅ + Dome-DETR 竞品深读 🔴 **已放码✅**) |
| 🟪 DETR 专属扩展（DX1 新增） | **8** |
| pre-2025(路径三+基础+经典补读) | 15 |
| 挂跟踪项 🔔 | 2(Unmasking the Tiny(哨点降级,低频) / **HF-DETR SSMG判据核实=#30撞车裁决**);~~Dynamic DETR~~ 深读完成✅ 2026-07-18(裁定不撞车,升级#30对照基线) |

## 维护规则
1. 新论文读毕 → 本文件对应主题分区追加一行 + README 计数同步
2. 状态变更(如跟踪项代码放出、快评升级深读)→ 就地更新该行
3. 一篇论文跨多主题时,归入**对项目最重要**的主题,其他关联写在"关联 Idea"列
4. 论文名统一为原文链接(优先 arXiv abs,无则 DOI/出版方页面);新增论文录入时必须带原文链接
5. 📊 新论文读毕 → 同步更新 [classification.json](classification.json) (追加论文条目+标签), Dashboard 自动生效

---
*Last Update: 2026-07-18 | Maintainer: Claude Code*
| [Repulsion Loss](https://openaccess.thecvf.com/content_cvpr_2018/html/Wang_Repulsion_Loss_Detecting_CVPR_2018_paper.html) | CVPR 2018 ⚠️pre-2025·经典 | 🔬 L2补读 | 🔴密集遮挡·Loss, #35, DOMino-YOLO OAR-Loss演化线起点 | L_Attr+L_RepGT(IoG)+L_RepBox(Smooth_ln)；训练期排斥远离错误GT/预测框；Heavy遮挡 −3.7 MR⁻²；仅需box标注 | [→](summaries/RepulsionLoss_CVPR2018.md) |
| [CrowdDet (EMD Loss)](https://arxiv.org/abs/2003.09163) | CVPR 2020 Oral ⚠️pre-2025·经典 | 🔬 L2补读 | 🔴密集遮挡·检测架构, #35, DETR集合预测对照 | One Proposal→K Predictions(K=2)；EMD Loss最优匹配+Set NMS同源跳过；CrowdHuman +4.9% AP/密集召回+8.9%；仅proposal-based | [→](summaries/CrowdDet_CVPR2020.md) |
| [Soft-NMS](https://openaccess.thecvf.com/content_iccv_2017/html/Bodla_Soft-NMS_--_Improving_ICCV_2017_paper.html) | ICCV 2017 ⚠️pre-2025·经典 | 🔬 L2补读 | 🔴密集遮挡·NMS, NWD-Soft-NMS演化线起点, #6 baseline | IoU-based分数衰减替代硬清零；高斯罚函数推荐(σ=0.5)；COCO +1.3%/Recall@100 +8.4；一行代码即插即用 | [→](summaries/Soft-NMS_ICCV2017.md) |
