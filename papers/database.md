# 论文数据库(Paper Database)

> 全项目文献结构化索引 | 建立: 2026-07-17 | 维护规则: 每轮新增论文后追加一行,变更状态就地更新
> 类型: 🔬深读(全文) / 🔍深度评估(WebFetch提炼) / ⚡快评 | 状态: 🔔=挂跟踪项 | 来源: 【自】=用户提供文献,未标=Agent 检索 | 论文名=原文链接(arXiv/DOI/出版方)
> 统计: **50 条**(41 单篇 summary + 9 快评汇总条目)

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
| [HF-DETR](https://ieeexplore.ieee.org/document/11420990) 🔔 | IEEE SPL 2026 | ⚡ | **#30⚠️撞车监控** #11 #22 | LoG stem+小波重建+**SSMG saliency token门控**;VisDrone AP+4.3/121FPS;SSMG判据性质待全文核实 | [→](summaries/HF-DETR_SPL2026.md) |

## 三、Token 选择 / 门控 / 稀疏计算(#5/#22 最近邻社区)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [Token Cropr](https://arxiv.org/abs/2412.00965) | CVPR 2025 | 🔬 | #5划界+**LLF兜底** | 单query router+任务辅助头;LLF末端复活零参数近无损 | [→](summaries/TokenCropr_CVPR2025.md) |
| [SViT](https://arxiv.org/abs/2306.07050) | WACV 2024 ⚠️pre-2025 | 🔬 | #5兜底 **#22** | Token保留/再激活/动态率;硬删除是DynamicViT崩溃根因 | [→](summaries/SViT_WACV2024.md) |
| [MGS](https://arxiv.org/abs/2510.09380) | MLSP 2025 | 🔬 | #5/#11工程范式 | 分组门控+冻结主干+BCE→85-95% MLP稀疏率(DETR通道级) | [→](summaries/MGS_MLSP2025.md) |
| [SPA/SPT](https://arxiv.org/abs/2410.23608) | ICLR 2026 | 🔍 | #5工程+L_gate先例 #19 | GT监督门控+**packing打包**;训练期也真实省算力;⚠️浅层不剪 | [→](summaries/SPA_ICLR2026.md) |
| [Unmasking the Tiny](https://doi.org/10.1016/j.imavis.2026.106026) 🔔 | IVC 2026 | ⚡ | **#5最近哨点** #22 | YOLOX+STSM前景token选择+FRM;目的召回非算力;代码未放必回读 | [→](summaries/quick_eval_2026-07-17_attention_round1.md) |
| [PST](https://arxiv.org/abs/2505.12772) | arXiv 2025.05 | ⚡ | #5(粗训细推借鉴) | coarse-to-fine Top-K(k=8);训练-推理解耦 | [→](summaries/quick_eval_2026-07-17_attention_round1.md) |
| [HashEye](https://www.nature.com/articles/s41598-026-51941-w) | SciRep 2026 | 🔍 | #5划界+**v3.0稠密重排** #29 | 输入级LSH免训练剪97.5%patch;Jetson 5.25×;城市失效 | [→](summaries/HashEye_SciRep2026.md) |

## 四、小目标架构 / P2 路线(#6/#14 证据链)

| 论文 | Venue | 类型 | 关联 Idea | 一句话 | Summary |
|---|---|---|---|---|---|
| [SEMA-YOLO](https://doi.org/10.3390/rs17111917) 【自】 | RS 2025 | 🔬 | **#6原型(SLE)** #9 #10 | P2头+截短backbone减参19.7%;GCP-ASFF | [→](summaries/SEMA-YOLO_RemoteSensing2025.md) |
| [DM-EFS](https://openaccess.thecvf.com/content/ICCV2025/html/Sharma_DM-EFS_Dynamically_Multiplexed_Expanded_Features_Set_Form_for_Robust_and_ICCV_2025_paper.html) | ICCV 2025 | 🔬 | #5粗粒度baseline #6 | P2浅层价值验证;Size-Codebook尺寸引导 | [→](summaries/DM-EFS_ICCV2025.md) |
| [TinyFormer](https://arxiv.org/abs/2605.25046) | arXiv 2026.05 | 🔬 | #5竞争论述 #6 | YOLO-DETR混合;PBM阻断小目标信号稀释 | [→](summaries/TinyFormer_2026.md) |
| [DQ-DETR](https://arxiv.org/abs/2404.03507) | ECCV 2024 ⚠️pre-2025 | 🔬 | #5双粒度启发 | 密度四档→自适应query数;AI-TOD-V2 30.2 | [→](summaries/DQ-DETR_ECCV2024.md) |
| [D3Q](https://ieeexplore.ieee.org/document/11007261) | JSTARS 2025 | 🔬 | "坚持YOLO"确认 | 连续密度回归+动态查询;DQ-DETR升级版 | [→](summaries/D3Q_JSTARS2025.md) |
| [DroneScan-YOLO](https://arxiv.org/abs/2604.13278) | arXiv 2026.04 | ⚡ | #6佐证 | stride-4 P2分支仅+114.6K参数;VisDrone mAP50 55.3@1280 | [→](summaries/quick_eval_2026-07-17_lightweight_round1.md) |
| [FFCA-YOLO](https://doi.org/10.1109/TGRS.2024.3363057) | IEEE TGRS 2024 ⚠️ | ⚡ | 遥感baseline | 三即插即用模块;L版107FPS | [→](summaries/FFCA-YOLO_IEEE2024.md) |
| [MDI-YOLO](https://www.nature.com/articles/s41598-026-38378-x) | SciRep 2026 | ⚡ | (无直接关联) | C2f-MCC通道分组Transformer-CNN混合 | [→](summaries/quick_eval_2026-07-16_literature_round2.md) |
| [YOLOv12](https://arxiv.org/abs/2502.12524) | NeurIPS 2025 | ⚡ | 基线不切换 | 注意力中心YOLO;无P2;FlashAttention硬依赖 | [→](summaries/YOLOv12_NeurIPS2025.md) |
| [NSSA](https://www.nature.com/articles/s41598-026-39381-y) | SciRep 2026 | ⚡ | (无直接关联) | 快速评估,详见晚间汇总 | [→](summaries/quick_eval_2026-07-16_evening.md) |

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
| [Dome-DETR](https://arxiv.org/abs/2505.05741) 🔴 | arXiv 2025.05 (USTC) | 🔬 | **❌判死#5-D / ✅#30对照** #24 #26 | D-FINE底座+DeFE密度头→MWAS浅层token稀疏+PAQI自适应query;AI-TOD 34.6/VisDrone 39.0双SOTA;GFLOPs+37%非净省 | [→](summaries/Dome-DETR_arXiv2025.md) |

---

## 统计速览

| 维度 | 数量 |
|---|---|
| 总条目 | 50(🔬深读 35 + 🔍深度评估 3 + ⚡快评 14) |
| VisDrone 相关 | 19+ |
| 频域检测线 | 13(核心 5 + 工具/外围 8) |
| Token选择/门控线 | 7 |
| 🟪 B轨·实时DETR基座 | 5(基础线 4 闭环 ✅ + Dome-DETR 竞品深读 🔴) |
| pre-2025(路径三+基础) | 11 |
| 挂跟踪项 🔔 | 2(Unmasking the Tiny / **HF-DETR SSMG判据核实=#30撞车裁决**) |

## 维护规则
1. 新论文读毕 → 本文件对应主题分区追加一行 + README 计数同步
2. 状态变更(如跟踪项代码放出、快评升级深读)→ 就地更新该行
3. 一篇论文跨多主题时,归入**对项目最重要**的主题,其他关联写在"关联 Idea"列
4. 论文名统一为原文链接(优先 arXiv abs,无则 DOI/出版方页面);新增论文录入时必须带原文链接

---
*Last Update: 2026-07-17 | Maintainer: Claude Code*
