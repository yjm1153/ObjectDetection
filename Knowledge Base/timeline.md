# Detection Timeline
> 每读一篇论文更新。记录关键模型演进。

```
2015  Faster R-CNN
  ↓
2017  RetinaNet, YOLOv2
  ↓
2018  YOLOv3
  ↓
2020  DETR, YOLOv5
  ↓
2022  DINO, YOLOv7
  ↓
2024  RT-DETR, YOLOv9, YOLO11 | YOLO-World(开集YOLO实时化, CVPR)
  ↓
2025  YOLOv12(注意力中心) | SEEN-DA(语义熵+VLM adapter, CVPR) | SEMA-YOLO(SLE+GCP-ASFF, RS) | DQ-DETR(ECCV 2024,动态query小目标) | D3Q(DETR+密度估计+动态查询,JSTARS,AI-TOD SOTA) | SFIDM(空频交互+KLD分配, RS, FSOD) | SET(频谱增强小目标,CVPR,"去高频帮小目标") | FMC-DETR(频域解耦+KAN+多域协调,arXiv)
  ↓
2026  TinyFormer(YOLO-DETR混合,PBM+SSA,arXiv) | DERNet(频域全管线,小波+Log-Gabor+频域头,arXiv) | SFDNet(频谱解耦分治+原型蒸馏,ECCV) | ...
  ↓
2026  ...
```

### 支线时间线
- **DAOD**: DA-Faster(2018)→ 对抗对齐/解耦(2021–23)→ VLM-based: DA-Pro(2023)→ SEEN-DA(2025,语义进入视觉编码器)
- **FPN 演进**: FPN(2017)→ PAN(2018)→ BiFPN/NAS-FPN(2019)→ ASFF(2019)→ Recursive-FPN(2021)→ AFPN(2023)→ GCP-ASFF(2025)
- **小目标专线**: RFLA(2022)→ CAB Net/SCDNet(2022–24)→ DNTR(2024)→ DQ-DETR(ECCV 2024)→ D3Q(2025,DETR动态查询,AI-TOD SOTA)→ SEMA-YOLO(2025)→ TinyFormer(2026,YOLO-DETR混合,PBM捷径策略)
- **频域检测线(2025–2026 新兴)**: FcaNet(2021,频域通道注意力)→ BiSD-YOLO C3WT(2024,小波变换门控增强)→ SFIDM(2025,空频交互+高频定位,FSOD)→ SET(CVPR 2025,频谱增强,噪声抑制→小目标,推理零开销)→ FMC-DETR(arXiv 2025.09,频域解耦+KAN+多域协调,VisDrone +6.5 AP)→ DERNet(arXiv 2026.06,小波门控+Log-Gabor+频域头,1/6参数超YOLOv11)→ SFDNet(ECCV 2026,低/中/高三频谱解耦+原型蒸馏)——⚠️ 全线做特征增强,无人做条件计算/稀疏化(=#11 差异化生命线)
- **高斯化标签分配**: GWD(2021)→ KLD(Yang et al., 2021)→ NWD/DotD(2021)→ RFLA(2022,box高斯→ERF高斯+HLA补偿)→ SFIDM-DM(2025,进入FSOD);⚠️ 全线无人系统横向对比,且 RFLA 证实一阶段收益远小于两阶段(#12 的切入点与风险)
- **遥感 FSOD**: FSFR/Meta-YOLO(2019)→ TFA(2020)→ FSCE(2021)→ FSODM/MFDC(2022)→ MLII-FSOD(2024)→ SFIDM(2025,频域首入)
- **开集检测(OVD)**: CLIP(2021)→ GLIP(2022)→ Grounding DINO/DetCLIP(2023)→ YOLO-World(2024,实时化)→ YOLOE(2025,删融合改对齐+三prompt统一,✅已读);⚠️ 全线无 P2/小目标关注,与小目标专线尚未交汇——#5 位于两线交点;YOLOE 的 LRPC 已把"语义分数滤 anchor"做到 head 级,特征级仍空白
