# Model Comparison
> 每读一篇论文必须更新对比表。

| Model | Backbone | Neck | Head | Loss | Dataset | mAP | FPS | Params | GFLOPs | Advantages | Weakness |
|-------|----------|------|------|------|---------|-----|-----|--------|--------|------------|----------|
| SEEN-DA (CVPR'25) | RegionCLIP R50(冻结)+域感知注意力 | - | Faster R-CNN + 文本嵌入分类 | CE+伪标签CE+对抗+回归 | C→Foggy C | 57.5 (mAP50) | 非实时 | 36.7M(可训1.875M) | - | 语义熵引导特征选择;DAOD 四基准 SOTA;参数高效 | 依赖VLM;两阶段;目标域prompt需先验 |
| DA-Pro (NeurIPS'23) | RegionCLIP R50(冻结) | - | 域自适应prompt检测头 | CE+对抗 | C→Foggy C | 55.9 | 非实时 | 34.8M(可训0.008M) | - | 极少可训参数 | 语义只用在head,视觉特征未受益 |
| RegionCLIP (CVPR'22) | R50 | - | Faster R-CNN | CE | C→Foggy C | 48.6 | 非实时 | - | - | VLM区域级预训练基座 | 无域自适应机制 |
| YOLOv11n (baseline) | CSPDarknet系+C3k2 | PAN | 三头 anchor-free | BCE+CIoU+DFL | RS-STOD | 67.2 (mAP50) | 232 | 2.6M | 6.3 | 实时、轻量 | 小目标弱(P5冗余,P2缺失) |
| SEMA-YOLO-n (RS'25) | YOLOv11截短至P4 | GCP-ASFF×4 + RFA-C3k2 | 四头(P2–P5) | 同YOLOv11 | RS-STOD | 72.5 (mAP50) | 185 | 3.6M | 14.2 | 小目标+5.3;单卡可复现 | GFLOPs翻倍;组件拼装创新有限 |
| RT-DETR-R50 | R50 | Hybrid Encoder | DETR query | Hungarian | RS-STOD | 50.0 (mAP50) | 156 | 41.9M | 136 | 端到端无NMS | 小目标灾难性差(比YOLOv11n低17点) |
| SFIDM (RS'25) | YOLOv3 + 双FF-Block(高/低频) | 空频Concat(SFI) | YOLOv3头 + KLD分布匹配分配 | CE+DIoU+DFL | DIOR(FSOD) | novel 10-shot 37.3;base 0.62 | - | 66.0M | 225.3 | 频域首入FSOD;KLD分配尺度无关 | 三路提取算力大;YOLOv3基线陈旧 |
| SFIDM-L (RS'25) | YOLOv8s + 双FF-Block | 同上 | 同上 | 同上 | DIOR(FSOD) | 10-shot total 0.669 | - | 15.7M | 35.7 | 15.7M打赢50–81M的R-CNN系FSOD | shot增加→base类退化(遗忘) |
| Faster R-CNN+RFLA (ECCV'22) | R50 | FPN | 两阶段 | CE+SmoothL1(分配换RFD+HLA) | AI-TOD / VisDrone | 21.1 / 23.4(AP_vt 0.1→4.8) | - | - | 与baseline同 | 推理零开销;AI-TOD +10 AP;VisDrone极小目标质变 | 一阶段检测器上仅+0.4~0.9(迁移YOLO存疑) |
| YOLO-World-S (CVPR'24) | YOLOv8-S+冻结CLIP文本 | RepVL-PAN(P3–P5) | 解耦头+文本相似度 | Region-text对比+IoU+DFL | LVIS(zero-shot) | 26.2 AP | 74.1(V100 TRT) | 13M | - | 开集实时化;重参数化零文本开销;胜232M的GLIP-T | 无P2;backbone无语义;小目标盲区;预训练32×V100不可复现 |
| YOLOE-v8-S (arXiv'25) | YOLOv8-S+MobileCLIP文本 | 纯PAN(删跨模态融合) | RepRTA重参数化分类头(推理=原生YOLO) | 同上+分割BCE | LVIS(zero-shot) | 27.9 AP(APr 22.3) | 305.8(T4 TRT) | 12M | - | 3×省训练(8×4090×12h可复现);三prompt统一;LRPC滤80% anchor提速1.7× | 仍无P2、不报AP_s;APf掉点(多任务代价);prompt-free限4585类词表 |
| TinyFormer-X (arXiv'26) | ViT+PBM+SSA | PBM并行双向融合 | DETR head(NMS-free) | 标准DETR loss | COCO / VisDrone | 58.5(COCO) / 34.7(VisDrone);APS 40.9 / 24.7 | 实时 | — | — | PBM阻断小目标空间退化;SSA补ViT tokenization损失;RT-DETR/DEIM可插PBM | ViT backbone参数量大;无P2讨论;PBM+P2功能重叠/互补未知 |
| DERNet (arXiv'26) | CNN/Transformer通用+WDG | LGE(Log-Gabor增强) | FDHead(频域驱动) | 标准检测loss | VisDrone/UAVDT/TinyPerson/DOTAv1 | 超越同规模YOLOv11(1/6参数) | — | ~1/6 YOLOv11 | — | 全管线频域处理;参数效率极高;架构无关 | 代码未公开;小波GPU效率存疑;缺COCO对比;频域批归一化FP16稳定性 |
| SET (CVPR'25) | R50 / 通用+HBS | FPN | FCOS/Faster R-CNN/DINO头 | 标准loss+辅助loss(训后丢弃) | AI-TOD/VisDrone/DOTA/COCO | AI-TOD 超越RFLA+3.2 | 推理零开销(仅训练时) | 同baseline | 同baseline | 推理零开销;反直觉发现(去高频帮小目标);架构通用 | 依赖GT box mask(HBS);训练开销大;小波等多尺度频域工具未用 |
| D3Q (JSTARS'25) | DINO+IDE(密度头) | DETR Hybrid Encoder | DETR head+动态查询 | DFL(密度)+标准DETR loss | AI-TOD-v1/v2/VisDrone/DOTA | AI-TOD-v2 32.1;VisDrone 36.7 | — | 49M(+1M) | 543(−40% vs DQ-DETR) | 连续密度回归+动态查询;仅+1M即+3.6 mAP;即插即用 | 训练epochs长(500+);DETR专属;VisDrone分尺度缺失;T=3每数据集需重调 |
| SFDNet (ECCV'26) | 通用+ASD(三频解耦) | 通用 | 标准头+CPD原型蒸馏 | 标准loss+原型蒸馏loss | AI-TOD/SODA-D/SODA-A | AI-TOD 31.7;SODA-D 35.1 | — | — | — | 频谱解耦分治(低/中/高三路);原型蒸馏改善小目标特征紧凑性;HBB+OBB双支持 | VisDrone未测;三路处理墙钟开销;类别数对CPD敏感;频谱分界超参 |

### 关键横向结论
1. **小目标场景 RT-DETR 系全面落后 YOLO 系**(RS-STOD/AI-TOD 上差 15–40 点)——本项目坚持 YOLO11 基线是对的。
2. 两条正交提升路线浮现:**结构级算力再分配**(SEMA:P2头+截短backbone)与**语义级特征选择**(SEEN-DA:语义熵注意力)——两者可结合。
3. 参数高效范式(冻结+adapter)在 DAOD 已验证,YOLO 侧未见,存在空白。
4. **免训练前景判据已有两种来源**:语义熵(SEEN-DA,需 VLM)与高频能量(SFIDM,只需 DFT)——后者是前者失效时的低成本备胎(Idea #5 vs #11 对照)。
5. YOLO 系轻量 backbone 在 FSOD 同样碾压 R-CNN 系参数效率(SFIDM-L 15.7M vs 50–81M)。
6. **标签分配是零成本提升点但收益依架构而异**:RFLA 在两阶段 +10 AP、一阶段仅 +0.4~0.9——#12 迁移 YOLO11(TAL)预期收益应保守估为 +1~2 AP,主看 AP_vt。
7. ⚠️ **2026-07-16 新增:YOLO-DETR 混合是 2026 年明确趋势**(TinyFormer)。纯 YOLO 需在 P2 改进上加速以避免学术 benchmark 落后,但轻量/边缘部署优势仍不可替代。
8. ⚠️ **2026-07-16 新增:频域+小目标已成 2025–2026 独立子方向**,至少 3 篇独立工作(SET/DERNet/SFDNet)同时瞄准——**但全部做特征增强,无人做条件计算**(=#11 差异化生命线)。
9. ⚠️ **2026-07-16 新增:"坚持 YOLO 基座"再确认**:D3Q (DETR 系小目标最佳) VisDrone 36.7 未显著超越 YOLO 系,且参数量/GFLOPs 劣势巨大(49M/543 vs 2.6M/6.3)。
