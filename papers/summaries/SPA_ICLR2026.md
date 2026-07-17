# SPA / SPT: Enhancing Vision Transformers for Object Detection via Context-Aware Token Selection and Packing

> ICLR 2026 (arXiv 2410.23608, 初版 2024.10) | 深度评估(WebFetch/检索提炼) | 阅读日期: 2026-07-17
> 关联 Idea: #5(GT监督门控先例 + 特征级packing工程方案 + "浅层不剪"划界点)| #22

## 一句话总结
线性门控(GT 框监督 BCE + Gumbel-Softmax)选 token → **打包(packing)进固定尺寸容器组成新 batch**,解决变长 token 的 GPU 批处理难题;Swin 上 BDD100K **+0.6 mAP 且 −16.4% FLOPs**,训练与推理都真实省算力。

---

## 核心机制

### 1. 门控选择(有监督!与免训练路线相反)
- 低成本**线性门控层**逐 token 打分;多尺度融合:分数与浅层 stage 上采样特征做 max 合并
- **Gumbel-Softmax** 二值化正/负 token(端到端可微)
- **选择监督**:GT 框/mask 栅格化为多尺度 selection labels → `L_SPT = L_task + α·L_select`(BCE, α=0.01)——防止门控学会"全保留"作弊

### 2. Packing(⚠️ 对 #5 v3.0 最有价值)
- 每图选中 token 数不同 → 不做 padding(SparseViT 的做法,浪费),而是**打包进固定尺寸"package 容器"组成紧凑新 batch**
- 容器内 attention mask 保证 token 只 attend 同图 token;每两个 block 做 feature shift 让跨容器 token 交互
- 效果:**训练与推理都真实节省**(DynamicViT/EViT 只在推理省,训练仍全量)

### 3. 集成位置(⚠️ 关键设计决策)
- 集成进 Swin 层级架构(SPT backbone),**SPA block 只从第三 stage 起用**——作者明确:浅层特征过早剪 token 会信息损失
- 即:**SPA 主动避开浅层/高分辨率特征**

## 结果
| 任务 | 数字 |
|---|---|
| BDD100K 检测 | +0.6 mAP over DynamicSwin,**−16.4% FLOPs** |
| BDD-S 稀疏场景检测 | 比 DynamicSwin-T 最高 +19.1% |
| VOC-S 多标签分类 | +0.24 mAP @ ~70% token 保留率 |
| Tiny IN-1K | +7.05 Top-1 |

## 局限
- Swin/ViT 系,CNN/YOLO 未涉及;BDD100K 为驾驶场景,无 VisDrone/小目标专项
- 门控需 GT 监督训练(非免训练);浅层不敢剪(第三 stage 起)——高分辨率层的稀疏化仍空白

---

## 对本项目的启示

1. **⚠️ #5 v3.0 推理路径的顶会级参照**:packing = **特征级稠密重排**,与 HashEye(输入级)构成两级证据链——"gather 成稠密张量跑稠密 kernel"是 GPU 稀疏计算唯一已验证路线,且 SPA 证明**训练期也能省**(v3.0 目前训练用 masked conv 全量计算,SPA 的容器打包是升级选项)
2. **#5 L_gate 的先例**:SPA 的 GT 框栅格化 selection label + BCE(α=0.01)与 v3.0 §5 的 λ_g 选项几乎同构 → 该选项从"可选"升为"有顶会先例背书",且 α=0.01 提供超参起点(v3.0 目前写 0.5,应下调对照)
3. **⚠️ "浅层不剪" vs "专剪浅层"——#5 的核心划界点与风险提示**:SPA 明确避开浅层(信息损失);#5 恰恰要在最浅 P2 上剪。差异化叙事:SPA 的门控是**任务无关外观分数**,浅层剪不动;#5 用**语义熵判据+LLF兜底**,主张浅层可剪。但这同时是风险:若 M0 预实验失败,SPA 的"浅层不剪"结论就是反面证据——#5 死刑判据又添一条(与 E0.2 绑定)
4. **判据家族+1(有监督门控)**:免训练(语义熵/高频/LSH)vs 可学习(MGS BCE/SViT Gumbel/SPA GT监督)两大阵营对垒格局成形;#19 三判据对照实验可考虑纳入 SPA 式 GT 监督上限组(≈GT 门控 oracle 的可学习近似)
5. **YOLO CNN 特征级空白第 N 次确认**:token selection 社区最强新作仍在 Swin/ViT 系

*Sources: [arXiv 2410.23608](https://arxiv.org/abs/2410.23608) | [ICLR 2026 poster](https://iclr.cc/virtual/2026/poster/10009628)*
