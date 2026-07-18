# State of the Art
> 按年份整理顶会论文（2024-2026）：CVPR | ICCV | ECCV | NeurIPS | AAAI | WACV | TCSVT | TIP

| Year | Model | Venue | Dataset | mAP | Innovation | Github |
|------|-------|-------|---------|-----|------------|--------|
| 2025 | SEEN-DA | CVPR 2025 | C→Foggy C / K→C / S→C / VOC→Clipart | 57.5 / 67.1 / 66.8 / 47.9 | 语义熵注意力;冻结VLM+1.875M adapter;inter/intra域双分支 | 未公开 |
| 2025 | SEMA-YOLO | Remote Sens. 2025 | RS-STOD / AI-TOD(子集) | 72.5 / 61.5 (mAP50) | SLE(P2头+截短backbone减参19.7%);GCP-ASFF;RFA-C3k2 | 数据集已公开 |
| 2025 | SFIDM | Remote Sens. 2025 | NWPU VHR-10 / DIOR(FSOD novel) | NWPU 10-shot 68.2;DIOR 10-shot 37.3(mAP50) | 空频交互(高频定位/低频分类);KLD高斯分布匹配分配;遥感FSOD SOTA | 未公开 |
| 2025 | Token Cropr | CVPR 2025 | COCO(Cascade Mask R-CNN+EVA-02-L) / ADE20k | 63.0 AP_box(97%剪枝) / 56.6 mIoU(2×提速−0.1) | 单query router+任务辅助头(训后丢弃);LLF末端复活零参数近无损 | https://github.com/benbergner/cropr |
| 2025 | YOLOE | arXiv 2025(THU) | LVIS(zero-shot) / COCO(ft) | 35.9(v8-L) / 53.0 | 删跨模态融合+RepRTA重参数化对齐;SAVPE视觉prompt;LRPC检索式prompt-free(滤80% anchor) | https://github.com/THU-MIG/yoloe |
| 2024 | YOLO-World | CVPR 2024 | LVIS(zero-shot) / COCO(ft) | 35.4(L) / 53.3 | 开集YOLO首次实时;RepVL-PAN跨模态融合;离线词表重参数化(prompt-then-detect) | https://github.com/AILab-CVC/YOLO-World |
| 2026 | TinyFormer | arXiv 2026.05 (2605.25046) | COCO / VisDrone | 58.5 AP(COCO) / 34.7 AP(VisDrone);APS 40.9 / 24.7 | YOLO-DETR混合;PBM并行双向融合(阻断小目标信号逐层稀释);SSA空间语义解耦(ViT stride-16 tokenization退化补偿) | https://github.com/mmpmmpmmpjosh/TinyFormer |
| 2026 | DERNet | arXiv 2026.06 (2606.23825) | VisDrone / UAVDT / TinyPerson / DOTAv1 | 超越同规模YOLOv11(1/6参数量) | 频域全管线(WDG小波门控+LGE Log-Gabor增强+FDHead频域驱动头);CNN/Transformer通用 | 未公开 |
| 2026 | SFDNet | ECCV 2026 | AI-TOD / SODA-D / SODA-A | AI-TOD 31.7 AP(HBB);SODA-D 35.1 AP | ASD频谱解耦(低/中/高三频分治)+CPD类别原型蒸馏;HBB+OBB双支持 | https://github.com/ManOfStory/SFDNet |
| 2025 | SET | CVPR 2025 | AI-TOD / VisDrone / DOTA-v2 / COCO | AI-TOD 超越RFLA +3.2 AP | 频域归因分析→"抑制背景噪声(非增强信号)";HBS通道瓶颈平滑+API对抗扰动注入;推理零开销 | - |
| 2025 | D3Q | IEEE JSTARS 2025 | AI-TOD-v1/v2 / VisDrone / DOTA-v2 | AI-TOD-v2 32.1 mAP;VisDrone 36.7 AP | 连续密度回归(IDE+DFL)+动态查询数量(DQA);即插即用+1M参数+3.6 mAP−40% GFLOPs | https://github.com/XianHYe/mmdet3-D3Q |
| 2023 | DA-Pro | NeurIPS 2023 | C→Foggy C | 55.9 | 域自适应prompt检测头(可训参数仅0.008M) | - |
| 2025 | FMC-DETR | arXiv 2025.09 | VisDrone / HazyDet / SIMD | VisDrone 33.7 AP / 53.6 AP50(13.8M,SOTA) | WeKat(小波+KAN混合骨干);MDFC(振幅引导多域协调);检测层[D2,D4]非均匀设计 | https://github.com/bloomingvision/FMC-DETR |
| 2022 | RFLA | ECCV 2022 | AI-TOD / VisDrone / TinyPerson / DOTA-v2 | AI-TOD 24.8(DetectoRS);VisDrone AP_vt 0.1→4.8 | 高斯ERF先验+KLD尺度不变度量(RFD)+分层分配(HLA);推理零开销 | https://github.com/Chasel-Tsui/mmdet-rfla |
| 2025 | DM-EFS | ICCV 2025 | VisDrone / SODA-D / DarkFace | VisDrone 29.71(+2.11);AP50 51.80(+3.99) | EFS浅层特征扩展+DFM动态特征复用(Size-Codebook);小目标图像级自适应 | 未公开 |
| 2026 | ViCrop-Det | arXiv 2026.04 | VisDrone / DOTA-v1.5 / COCO | VisDrone 38.9(+1.4);DOTA 51.5(+0.9);COCO APS +2.1 | SAE空间注意力熵+免训练自适应裁剪路由;熵引导计算分配范式验证 | 未公开 |
| 2026 | D³R-DETR | arXiv 2026.01 | AI-TOD-v2 | 31.3 AP(SOTA,+2.6 over Dome-DETR) | D²FM双域融合(Gabor频域核+空洞空间)+密度引导注意力稀疏化 | github.com/wenzx18/D3R-DETR |
| 2026 | O²-DFINE/O²-RTDETR | TGRS 2026 | DOTA-v1.0/1.5/DIOR-R/FAIR1M | DOTA 80.15 AP50(O²-DEIM,119FPS);76.14(O²-DFINE-s,297FPS) | 首个实时旋转DETR;ADR角度分布细化+Chamfer距离匹配+旋转对比去噪 | github.com/wokaikaixinxin/ai4rs |
| 2026 | MOCHA | arXiv 2025/2026 | Few-shot个性化检测4基准 | +10.1 平均提升(vs YOLOv8n) | VLM(LLaVa)→YOLO蒸馏;Translation Module跨架构映射;关系保持蒸馏 | github.com/SamsungLabs/MOCHA |
| 2026 | CLIP-Bias | arXiv 2026.07 | COCO / LVIS | 小目标R@10 +19.6%(温度缩放修正) | 首次诊断CLIP检测置信度双重偏差(尺度膨胀+语义抑制);结构性不可逆 | 未公开 |
| 2025 | AD-Det | Remote Sens. 2025 | VisDrone / UAVDT | VisDrone 37.5 AP(X101,flip)/35.3(R50);UAVDT 20.1(R50) | ASOE(P3激活图零参数区域挖掘+K-means裁剪)+DCC(尾类记忆库copy-paste+簇中心BFS粘贴);coarse-to-fine赛道SOTA;⚠️非实时(0.5s+/img) | 未公开 |
| 2026 | EFSI-DETR | arXiv 2026.01 | VisDrone | 33.1 AP / 52.7 AP50 / 24.8 APs @640(188FPS);35.0 AP @800 | "频域启发非变换"DyFusNet(空域代理胜FFT);FFR弃F5反涨;DEConv专家卷积;超YOLOv12-X APs +6.9 | 未公开 |
| 2026 | DroneScan-YOLO | arXiv 2026.04 | VisDrone | mAP50 55.3 / mAP50-95 35.6(1280输入,96.7FPS) | YOLOv8s+stride-4 P2分支(仅+114.6K参数)+RPA动态filter剪枝;稀有小类暴涨(bicycle +187%) | 未公开 |
| 2026 | HashEye | SciRep 2026 | SeaDroneSee / K-WF(4K) | mAR 87.24 vs 75.44;5.25×加速(Jetson Orin NX) | 输入级LSH免训练空间剪枝(剪97.5% patch,丢失<1.76%);稠密重排+WBF;⚠️城市地形失效 | 未公开 |
| 2024 | 🟪 RT-DETR | CVPR 2024 | COCO val2017 | 53.1 AP/APs 34.8(R50,108FPS T4);O365后55.3 | 首个实时端到端检测器;AIFI(只对S5自注意力)+CCFF混合encoder;不确定性最小query selection;decoder砍层免重训调速;⚠️官方自认小目标短板 | github.com/lyuwenyu/RT-DETR |
| 2025 | 🟪 D-FINE | ICLR 2025 | COCO val2017 | 54.0 AP/APs 36.5(L,31M/91G/124FPS);O365后57.1/APs 40.0 | FDR分布式回归(四边独立分布残差精化+非均匀W(n))+GO-LSD定位自蒸馏(免教师);即插即用增强各DETR +2.0~5.3;B轨基线纸面初判 | github.com/Peterande/D-FINE |
| 2021 | 🟪 ⚠️ Deformable DETR | ICLR 2021 | COCO val/test-dev | 46.2 AP/APs 28.8(two-stage,50ep);test-dev 52.3(X101+DCN+TTA) | MSDeformAttn(K=4点稀疏采样,权重免QK内积,encoder线性复杂度);多尺度免FPN;迭代box精化+two-stage(=query selection诞生地);B轨全家底座算子 | github.com/fundamentalvision/Deformable-DETR |
| 2023 | 🟪 ⚠️ DINO | ICLR 2023 | COCO val/test-dev | 12ep 49.0/APs 32.0(R50-4scale);SwinL+O365后63.2/63.3(首登COCO榜端到端) | CDN对比去噪(难负样本拒锚)+混合query selection(位置top-K/内容留学习)+look forward twice;小目标增益全尺度最大(+7.2) | github.com/IDEACVR/DINO |
| 2025 | 🟪 🔴 Dome-DETR | **ACM MM 2025**(arXiv 2505.05741) | AI-TOD-V2 test / VisDrone val(800²) | **34.6 AP(+3.3)/39.0 AP(+2.5)双SOTA**(L,36M);Dome-S 32.1/35.9;碾压DQ-DETR(1782G→376G) | D-FINE底座;DeFE密度头(0.8M,GT高斯监督+DRFL)→MWAS浅层掩码窗口稀疏(APE轴置换注意力)+PAQI自适应query(Dynamic NMS);⚠️GFLOPs+37%非净省/保留NMS/判据需监督/动态query限单批训练 → #30 对照叙事;❌判死#5-D | **github.com/RicePasteM/Dome-DETR(07-18放码✅,S/M/L权重+训练日志)** |
| 2026 | FSDETR | IJCNN 2026(arXiv 2604.14884) | VisDrone / TinyPerson | AP50 40.5/**APs 13.9**(超D-FINE-M 13.0/RT-DETRv2 12.7);TinyPerson AP50_tiny 48.95 | RT-DETR-R18+SHAB+DA-AIFI+FSFPN/CFSB(可学习2D-DFT频域滤波×空域边缘,−26.5%参数);频域浪潮第7篇纯增强 | github.com/YT3DVision/FSDETR |
| 2025 | PRNet | arXiv 2510.09531 | VisDrone / AI-TOD / UAVDT | **VisDrone AP50 54.1(24.6M)/1024输入 61.0=检索所见最高**;轻量版 49.9@7.77M;AI-TOD-L 35.6;UAVDT 20.8 | PRN骨干特征复用+迭代精炼(单模块+10.3 AP50/参数反降)+ESSamp细节保留下采样;⚠️FLOPs+110.7%/无FPS;#5/#11 motivation 最强新证 | github(未核实) 🔬深读 |
| 2026 | FFKD-Net | JRTIP 2026 | VisDrone | **47.7 mAP50 @仅3.0M** | MobileNetV3+SE+多尺度融合+分层蒸馏HKDM;轻量+KD上限证据(#7参照) | 未核实 |
