# 🟪 B轨衍生 Idea 查新裁决:#5-D ❌ / #11-D → #30 ✅

> 日期: 2026-07-17 | 触发: detr_map.md 规划的「B轨下一优先:#5-D/#11-D 查新与划界」
> 结论先行: **#5-D 不占编号(查新不通过,被 Dome-DETR 结构性占据)**;**#11-D 通过,正式占编号 #30**
> 关联: [detr_map.md](../Knowledge%20Base/detr_map.md) | [Dome-DETR summary](../papers/summaries/Dome-DETR_arXiv2025.md) | [innovation_ranking.md](innovation_ranking.md)

---

## 一、查新检索记录(2026-07-17)

三轮检索覆盖「熵引导 token 剪枝 DETR」「自适应 token 稀疏化小目标」「频域条件计算/门控」「免训练频谱判据剪枝」,新命中竞品:

| 竞品 | 出处 | 机制 | 威胁对象 |
|---|---|---|---|
| **Dome-DETR** 🔴 | arXiv 2505.05741 (USTC 2025) | DeFE 密度头(GT高斯监督)→ MWAS 浅层掩码窗口稀疏 + PAQI 自适应 query;D-FINE 底座;VisDrone 39.0/AI-TOD 34.6 双 SOTA | **#5-D 致命** |
| Dynamic DETR(Token Aggregation) | ICML 2025 (NWPU) | 学习式 importance 分布,逐级自适应 token 密度,近邻/整体双聚合策略 | #5-D 高 |
| Speedy-DETR | EAAI 2025 | 跨层相似度去重(SDE)+ 尺寸自适应注意力窗(HMoE);COCO APs 34.2 | #5-D 中 |
| GPQ | ICLR 2025 | 分类分数渐进剪 decoder query(3D DETR),1.31× 提速 | #5-D 低(decoder 侧) |
| MATP / EnTeR-Track | RS 2025 / Neurocomputing 2026 | (注意力)熵引导 ViT token 剪枝——分割/跟踪域 | #5-D 中(熵判据先例) |
| TREWA / TF-ATM | 在审 2025 / ACM MM 2025 | 免训练频谱(DWT/频域中值)token 剪枝/合并——分类域 | #30 需划界(方向相反,见下) |
| UAV-DETR / UAV-DETR+ | 复旦 2501.01855 / JEI 2025 | FFT 增强+频域下采样+SAC 内 **learnable gating**(融合加权) | #30 需划界(术语占据) |

## 二、#5-D 裁决:❌ 不占编号

**拟议内容回顾**:语义熵作为 QS 第三判据 + encoder token 门控(减少特征计算)。

**否决理由(三面夹击)**:
1. **结构占据**:Dome-DETR 已完整实现「判据热图 → 二值掩码 → 浅层 encoder token 稀疏化 + query 数量/位置自适应」,且**底座(D-FINE)、主战场(VisDrone/AI-TOD)、卖点(小目标+效率)与 #5-D 规划完全重合**。剩余增量只有"密度判据→熵判据"的替换,属审稿人最易攻击的判据替换型薄增量
2. **判据占据**:熵判据本身在相邻域已密集落地——ViCrop-Det(DETR 头级熵裁剪)、MATP/EnTeR-Track(ViT 熵剪枝)、TREWA(熵自适应剪枝强度);「熵×token 稀疏」组合无结构性空白
3. **机制占据**:学习式重要性分布(Dynamic DETR, ICML 2025)把"什么 token 重要"做成了端到端可学习问题,免训练熵判据在 DETR encoder 侧只剩"更便宜"一个卖点,而这恰是 #30 用频谱判据更干净地覆盖的位置

**资产处置**:
- 🟦 A轨 #5(YOLO P2 语义熵稀疏化,查新已通过)**不受影响**——载体/架构不同;但 v3.0 方案的 Related Work 必须新增 Dome-DETR 划界段(跨架构近邻,先手引用消毒)
- 🟪 B轨语义熵路线退守:熵判据不再单独成 Idea,并入 **#19 三判据对照**(CLIP vs DINOv2 vs FFT)的 DETR 侧对照列——作为 #30 的判据消融项存活,而非独立创新点

## 三、#11-D 裁决:✅ 正式占编号 **#30**

**#30 免监督频谱判据 → DETR 浅层 token 条件计算**(A轨 #11 的 DETR 同构体)

**幸存理由(检索确认的空白)**:频域方法在 DETR 侧**全部停留在"增强"范式**——EFSI(空域代理增强)、UAV-DETR(FFT 增强+融合内加权门控)、D³R(Gabor 核增强)、DFIR(频域聚合)、FMC(频域解耦);**无一用频谱判据做 token 级"算/不算"的条件计算决策**。分类域的 TREWA 甚至方向相反(保留低频、丢高频语义冗余),而小目标检测恰恰依赖高频——同一工具、相反判据,天然划界。

**三点划界(写方案时必须显式覆盖)**:
| vs | 对方 | #30 差异 |
|---|---|---|
| EFSI-DETR | 频域启发的特征**增强**,零条件计算 | #30 做**计算分配**,不改特征值 |
| UAV-DETR(+) | FFT 增强;SAC 的 "learnable gating" 是**融合权重**(soft, 全 token 都算) | #30 是 token 预算的 hard 分配(不算=真省);⚠️ 表述红线:避开 "frequency gating" 字样,落「频谱统计驱动的 token 预算分配」 |
| **Dome-DETR** | 同通路(判据→掩码→浅层稀疏),但判据 = **DeFE 学习头(0.8M + GT 高斯密度图 + DRFL 专用损失)** | #30 判据 = **免监督零参数频谱统计**(DCT/FFT 高频能量),免标注、免重训、跨数据集免调;且 Dome 攻击面(GFLOPs +37% 不降反升/保留 NMS/判据需监督)= #30 的对照叙事 |

**双重卖点**:
1. Dome-DETR 反向证明了通路有效性(+2.5~3.3 AP)→ #30 的问题从"这条路通不通"变成"判据能不能免费"——风险大幅下降
2. 与 🟦 A轨 #11 同判据、跨架构(YOLO P2 / DETR 浅层 token)→ 直接构成 ⬜ #24 信息瓶颈理论的**双轨验证**,"架构无关性"卖点成立

**主要风险**:审稿人必问「免监督频谱判据 vs 学习式 DeFE 谁强」→ 必须有头对头对照(⏸ 实验暂缓,列入实验模块需求);若免监督判据精度差距 >1 AP,退守叙事 = "1/40 判据成本保住 x% 增益"

**评分(录入 ranking)**:Novelty 4 / Difficulty 3(Med) / Impact 4 / Feasibility 4 / Risk 3 / Publish 4 → **Overall 3.9**(略高于 A轨 #11 的 3.4:通路已被 Dome 佐证 + 双轨验证卖点)

## 四、连带修正

1. **detr_map.md 结构空白①失效**:"全线无 P2/最浅 S3" 不再成立——Dome-DETR 已用最浅层特征(四尺度 stages 1-4)+ MWAS 控成本 → #6/#14 的"首次 DETR 浅层"新颖性消失,#14 降级回"结构对照实验"(不再是 B轨入口级)
2. **B轨入口更替**:#14 让位,**#30 成为 B轨主 Idea**;B轨叙事 = 「#30(条件计算)× #24(理论)× #26(层深)」
3. VisDrone SOTA 参照更新:Dome-L 39.0(val, 800×800)> D-FINE-L 36.5 —— 注意分辨率差异(多数工作 640)

---
*裁决: Claude Code | 2026-07-17 | 下游更新: ranking/candidate/detr_map/compare/timeline/sota/database + 面板数据源*
