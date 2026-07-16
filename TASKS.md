# TASKS

> Current Sprint: Improve Object Detection Performance | Baseline: YOLO11 | Dataset: VisDrone | Stage: Literature Review

## High Priority
- [ ] ⏸【暂缓】熵图+高频能量图 vs GT 小目标重合率预实验(一次实验定 Idea#5/#11 生死)——2026-07-15 用户决策:VisDrone 暂不提供,待数据集就绪后恢复
- [ ] ⏸【暂缓】VisDrone + YOLO11n 环境搭建,复现 SLE baseline(Idea#6:P2头+截短backbone,同批加 #12 KLD 分配)——2026-07-15 用户决策:本机无 GPU(torch CPU 版),训练类任务暂不执行
- [ ] 阅读近三年(2024–2026)CVPR、ICCV、ECCV、NeurIPS、AAAI 目标检测代表性论文(进度:12篇)
- [ ] 建立目标检测论文数据库
- [ ] 建立 Compare Table(已起步,持续扩充)
- [ ] 建立 Research Gap(已起步,持续扩充)

## Literature Tasks
> 模式变更(2026-07-15 用户授权):不再等待投喂 PDF,由 Agent 直接从 arXiv 等公开渠道抓取全文阅读
> ⚠️ 约束(2026-07-15 用户规定):**仅主动抓取 2025 年及以后的论文**;更早的论文标注「待用户提供」,仅在用户投喂 PDF 或点名时处理
- [x] 阅读 YOLO-World(✅ 2026-07-15,#5 基座确认,详见 papers/summaries/YOLO-World_CVPR2024.md)
- [x] 阅读 YOLOE(✅ 2026-07-15,#5 基座定论:选 YOLOE;LRPC 为查新新增最近邻,详见 papers/summaries/YOLOE_2025.md)
- [x] 阅读 Token Cropr(✅ 2026-07-15,#5 划界定稿+LLF兜底方案,详见 papers/summaries/TokenCropr_CVPR2025.md)
- [x] 阅读 TinyFormer(✅ 2026-07-16,YOLO-DETR混合,PBM+SSA;#5 P2路线竞争论述;#6 Neck选型扩展,详见 papers/summaries/TinyFormer_2026.md)
- [x] 阅读 DERNet(✅ 2026-07-16,频域全管线,WDG+LGE+FDHead;#11最强竞争者+最强佐证,详见 papers/summaries/DERNet_2026.md)
- [x] 阅读 SET(✅ 2026-07-16,CVPR 2025频谱增强;"去高频帮小目标"关键发现;#11判据修正,详见 papers/summaries/SET_CVPR2025.md)
- [x] 阅读 D3Q(✅ 2026-07-16,替代DQ-DETR;DETR动态查询;AI-TOD 32.1 SOTA;"坚持YOLO"第三次确认,详见 papers/summaries/D3Q_JSTARS2025.md)
- [x] 阅读 SFDNet(✅ 2026-07-16,ECCV 2026频谱解耦+原型蒸馏;#11频域竞争者之三,详见 papers/summaries/SFDNet_ECCV2026.md)
- [ ] 阅读 DQ-DETR / DNTR(小目标 DETR 路线,验证"坚持YOLO"决策)——⚠️ DQ-DETR 实际为 ECCV 2024(非 AAAI 2025),⏸ 待用户提供;2025 升级版 D3Q 已读替代
- [x] 阅读 RFLA(✅ 2026-07-15,P2头标签分配,Idea#7 #12 配套;#12 实验设计已就绪)
- [ ] 阅读 SViT(WACV 2024,token 再激活机制可作 #5 误剪兜底)——⏸ 待用户提供(2025 前)
- [ ] 阅读 FcaNet / FreqFusion(特征级频域分解,Idea#11 支撑)——⏸ 待用户提供(2025 前)
- [ ] 阅读 FFCA-YOLO(遥感小目标 SOTA 对比)——⏸ 待用户提供(2025 前)
- [ ] 阅读 YOLO 系列论文(仅主动抓 2025+ 如 YOLOv12/YOLOE;更早待用户提供)
- [ ] 阅读 RT-DETR 系列论文——⏸ 原始论文 2024 前,待用户提供;2025+ 后续版本可主动抓
- [ ] 阅读 DINO 系列论文——⏸ 待用户提供(2025 前)
- [ ] 阅读 Grounding DINO——⏸ 待用户提供(2025 前)
- [ ] 阅读小目标检测论文(2025+ 自动抓取;已检索到 TinyFormer/DERNet/SET/D3Q/SFDNet 并处理 ✅;持续检索 2025–2026 新作)
- [ ] 阅读频域检测论文(SET/DERNet/SFDNet 已读 ✅;持续检索)
- [ ] 阅读遥感目标检测论文
- [ ] 阅读轻量化检测论文
- [ ] 阅读注意力机制论文

## Knowledge Tasks
- [ ] 更新 augmentation.md(两篇论文无增强内容,待读增强类论文)
- [x] 更新 backbone.md
- [x] 更新 neck.md
- [x] 更新 head.md
- [x] 更新 attention.md
- [x] 更新 loss.md
- [x] 更新 training.md
- [x] 更新 dataset.md
- [x] 更新 compare.md
- [x] 更新 timeline.md
- [x] 更新 sota.md
- [x] 更新 research_gap.md
- [x] 更新 future_work.md

## Long-term Tasks
- [ ] 寻找新的 Research Gap
- [ ] 提出新的研究思路
- [ ] 设计研究方向
- [ ] 整理 SOTA 对比
- [ ] 维护 Idea 评估体系

## Auto-generated Tasks
- [ ] ⏸【暂缓】下载 RS-STOD(https://github.com/lixinghua5540/STOD)与 AI-TOD 数据集,作为遥感方向备用基准——随实验类任务一并暂缓
- [ ] ⏸【暂缓】验证 CLIP/RegionCLIP 文本嵌入对 VisDrone 俯视视角的对齐质量(Idea#5/#7/#8 共同前置)——依赖 VisDrone,暂缓
- [ ] Idea#9:统一协议下 PAN/AFPN/ASFF/GCP-ASFF 对照实验设计

## Completed Tasks
- [x] 2026-07-15 阅读+总结 SEEN-DA(CVPR 2025)→ papers/summaries/SEEN-DA_CVPR2025.md
- [x] 2026-07-15 阅读+总结 SEMA-YOLO(Remote Sens. 2025)→ papers/summaries/SEMA-YOLO_RemoteSensing2025.md
- [x] 2026-07-15 阅读+总结 SFIDM(Remote Sens. 2025)→ papers/summaries/SFIDM_RemoteSensing2025.md
- [x] 2026-07-15 查新:token pruning/熵稀疏化 → Idea#5 novelty 确认成立(结果见 research_gap.md)
- [x] 2026-07-15 Knowledge Base 12 项中 11 项完成首轮填充
- [x] 2026-07-15 提出 8 个新候选 Idea 并完成多维评分(innovation_ranking.md)
- [x] 2026-07-15 记录 5 条决策(decision_history.md)、2 篇 Research Journal
- [x] 2026-07-15 搭建本地研究面板(dashboard/index.html + 启动研究面板.bat)
- [x] 2026-07-15 环境检测:torch 2.11.0+cpu(无GPU)/ultralytics 8.4.47/无VisDrone → 实验类任务暂缓(用户决策)
- [x] 2026-07-15 阅读+总结 RFLA(ECCV 2022)→ papers/summaries/RFLA_ECCV2022.md(arXiv 抓取,#12 前置解锁)
- [x] 2026-07-15 阅读+总结 YOLO-World(CVPR 2024)→ papers/summaries/YOLO-World_CVPR2024.md(arXiv 抓取,#5 基座确认)
- [x] 2026-07-15 阅读+总结 YOLOE(arXiv 2025)→ papers/summaries/YOLOE_2025.md(#5/#7 基座定论:YOLOE;查新边界新增 LRPC)
- [x] 2026-07-15 阅读+总结 Token Cropr(CVPR 2025)→ papers/summaries/TokenCropr_CVPR2025.md(#5 划界定稿;LLF 兜底方案确定)
- [x] 2026-07-16 阅读+总结 TinyFormer(arXiv 2026)→ papers/summaries/TinyFormer_2026.md(YOLO-DETR混合;PBM+SSA;#5 P2路线竞争)
- [x] 2026-07-16 阅读+总结 DERNet(arXiv 2026)→ papers/summaries/DERNet_2026.md(频域全管线;#11最强竞争者)
- [x] 2026-07-16 阅读+总结 SET(CVPR 2025)→ papers/summaries/SET_CVPR2025.md(频谱增强;去高频帮小目标关键发现)
- [x] 2026-07-16 阅读+总结 D3Q(JSTARS 2025)→ papers/summaries/D3Q_JSTARS2025.md(DETR动态查询;"坚持YOLO"第三次确认)
- [x] 2026-07-16 阅读+总结 SFDNet(ECCV 2026)→ papers/summaries/SFDNet_ECCV2026.md(频谱解耦+原型蒸馏;#11竞争者之三)

---
Last Update: 2026-07-16 | Maintainer: OpenCode Research Agent
