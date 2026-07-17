# 快速评估 — 2026-07-17 注意力机制首轮

> 检索范围:2025–2026 稀疏/动态注意力 × 小目标检测(token 选择/门控视角,服务 #5/#22)
> 深度评估另见:SPA_ICLR2026.md

---

## 1. ⚠️ Unmasking the Tiny(Image and Vision Computing 2026)— #5 查新级邻居,持续跟踪

**一句话**:前景探测(Foreground Probing)范式——STSM 全特征图 top-K 前景分数选 token(剪掉确定背景),FRM 用**分类特征蒸馏的语义注意力图**门控组合回归/分类自注意力,修复"前景分数被背景淹没"的小目标漏检;YOLOX-X 基线,VisDrone(1504²)/UAVDT SOTA,"minimal FPS drop"。

- **与 #5 的关系判定(关键)**:
  - **同**:稀疏 token 选择 + 作用于 YOLO 系(YOLOX)+ 判据含语义信号(分类特征)——迄今与 #5 重叠面最大的工作
  - **异(三条命门)**:①**目的相反**——该文是**提升召回**(拯救被压低的前景分数),不省算力("minimal FPS drop"=开销中性,非 FLOPs 节省);②选择发生在**检测头 token 级后处理**,非 P2 特征计算前的门控(backbone/neck 稠密计算未省);③判据是模型自身前景/分类分数,非 VLM 语义熵
  - **结论**:#5 novelty 仍成立(条件计算 vs 召回增强),但 Related Work **必引并划界**;其"分类特征在被压制区域仍鲁棒"的洞察反而支持 #5 用分类分支信号(v3.0 的 P3 cls logits 复用)做判据
- **风险**:全文数字未获取(ScienceDirect/OpenReview 均被拦,GitHub 仅占位 README"接收后放码")→ 挂**跟踪项**:代码/arXiv 放出后回读,验证三条命门判定
- 天津大学 Tong Zhang 等;DOI 10.1016/j.imavis.2026.106026

## 2. PST — Pyramid Sparse Transformer(arXiv 2025.05,快评)

coarse-to-fine 两段注意力:粗注意力算显著性向量 → 仅 top-k(k=8)token 进细粒度注意力;O(N²)→¼O(N²)+O(4Nk);**可只用粗注意力训练、推理时零重训开启细注意力**。YOLOv11-N COCO +0.9 mAP。
- **对项目**:①用在**特征融合层**(neck),非 P2 空间稀疏化——不构成 #5 威胁;②"训练-推理解耦"(粗训细推)思路可借鉴到 #5 的 masked-conv 训练→稠密重排推理的数值一致性问题;③k=8 的"甜点"提示门控保留量可以极低

## 3. DFE-DETR(SciRep 2025)/ YOLO-FB(JSA 2026)/ DSPE-ViT(Front. Neurorobot 2026)— 组合型,不单独深读

- DFE-DETR:SAEM top-k 剪 token + 可变形大核卷积,VisDrone mAP50 47.34/65.8FPS/23.6M——DETR 系 token 剪枝应用型
- YOLO-FB:C3k2 内嵌 BiFormer 双层路由注意力(2023 技术应用),USOD mAP50 0.906,L 版 1.4M/6.4 GFLOPs——轻量注意力组合
- DSPE-ViT:**位置编码维度**的软门控剪枝(保留~62% PE 维度),VisDrone mAP50 43.2/6.0M——剪的是 PE 维度,与空间 token 稀疏化正交,概念有趣但不威胁
- 共同点:全部是注意力内部稀疏(attention matrix/PE/路由),**无人做特征图空间条件计算**

## 4. UFO-DETR(arXiv 2602.22712,CSCWD 2026)— 占位快评(2026-07-17 晚补全数字)

LSKNet backbone(GFLOPs 103.5→37.6,模型 66.2MB→26.0MB)+ DAttention/AIFI + DynFreq-C3 跨空间频域增强(内用 **FDConv** 捕高频边缘纹理 + DWConv 空域);华南农大等。**VisDrone2019 mAP50 43.5→46.1(vs RT-DETR-L,+2.6),算力 -60%**。
- **判定(补全数字后维持)**:纯"频域特征增强+轻量化"组合路线,不做条件计算/判据驱动预算——不威胁 #30/#11;FDConv 被再次用作现成工具(与 FDConv 快评判定一致)。频域浪潮计数:5 篇核心 + 2 篇外围(SFS-DETR/UFO-DETR)+ **HF-DETR(SPL 2026,→ 单独快评,#30 撞车监控)**

---

## 结论(注意力首轮净信息)

1. **token 选择社区 2025-2026 全面转向动态/上下文感知**(Top-K 为主流,k 可以很小),但**全部作用于注意力矩阵/ViT token/PE 维度/检测头 token——CNN 特征图空间条件计算依旧无人**(#5 空白第 N 次确认,且这轮是在其最近邻社区确认的)
2. **Unmasking the Tiny 是迄今与 #5 重叠面最大的工作**(YOLO系+稀疏token+语义信号),但目的(召回 vs 算力)/层级(头 vs 特征)/判据(自身分数 vs VLM熵)三轴划开;必引;挂跟踪
3. SPA 的 packing + GT 监督门控为 #5 v3.0 提供顶会级工程参照(详见 SPA summary)
4. "浅层剪枝危险"(SPA 第三 stage 起才剪)与"#5 专剪最浅层"的张力是 M0 预实验之外新增的叙事必答题

*检索日期: 2026-07-17*
