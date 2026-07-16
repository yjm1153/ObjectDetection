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
| 2022 | RFLA | ECCV 2022 | AI-TOD / VisDrone / TinyPerson / DOTA-v2 | AI-TOD 24.8(DetectoRS);VisDrone AP_vt 0.1→4.8 | 高斯ERF先验+KLD尺度不变度量(RFD)+分层分配(HLA);推理零开销 | https://github.com/Chasel-Tsui/mmdet-rfla |
