# 🟪 B轨·DETR 技术地图(DETR Track Map)

> 建立: 2026-07-17 | 数据源: 已读 15 篇 DETR 侧论文(基础线 4 + 小目标特化 9 + 旋转/裁剪 2)
> 定位: B轨(DETR 方向)的知识小结与作战地图——三条主线 × Idea 挂点 × 竞争格局
> 2026-07-17 修订: #5-D/#11-D 查新裁决落地(#5-D ❌ / #11-D→#30 ✅);Dome-DETR 入图,结构空白①失效、#14 降级
> 关联: [timeline.md](timeline.md) 实时DETR基座线 | [compare.md](compare.md) 结论23/24/25 | [papers/database.md](../papers/database.md) 分区八

---

## 〇、基础线谱系(4/4 全部深读 ✅)

```
DETR(2020)          端到端开创;痛点:500ep 收敛 + APs 20.5(均匀注意力初始化 + O(H²W²C))
  ↓
Deformable(ICLR'21) MSDeformAttn K=4点稀疏采样(权重免QK内积);多尺度免FPN;two-stage=QS诞生地
  ↓                 50ep 46.2 / APs 28.8
DAB/DN(2021-22)     query=4D anchor box + 去噪训练稳定二分匹配(未单独深读,经 DINO 溯源)
  ↓
DINO(ICLR'23)       CDN对比去噪 + 混合QS + LFT;12ep 49.0 / APs 32.0(+7.2);首登COCO榜
  ↓
RT-DETR(CVPR'24)    首个实时:AIFI只算S5 + CCFF + 不确定性最小QS;53.1@108FPS;⚠️官方自认小目标短板
  ↓
D-FINE(ICLR'25)     FDR分布式回归 + GO-LSD自蒸馏;54.0@31M/91G;O365后APs 40.0 ← 🎯 B轨基线纸面初判
```

---

## 一、主线 1:Query 机制线(#5-D 的战场)

| 代际 | 机制 | 论文 | 与 #5-D 关系 |
|---|---|---|---|
| 0 | 静态可学习 query(与图像无关) | DETR/DN-DETR | 前史 |
| 1 | **纯 QS**:encoder top-K 分类分数 → 位置+内容 | Deformable two-stage | QS 诞生地 |
| 2 | **混合 QS**:top-K 只给位置,内容留可学习 | DINO(+0.5 AP,APs 获益最大) | 判据仍单一(cls) |
| 3 | **不确定性最小 QS**:U=‖P−C‖ 显式入 loss | RT-DETR(+0.8 AP) | 判据变双元(cls×loc) |
| 4a | **密度自适应 query 数**:四档密度→query 预算 | DQ-DETR(ECCV'24)→D3Q(连续化)→**Dome-DETR PAQI**(密度掩码过滤+Dynamic NMS,免分档) | 图像级预算,非 token 级 |
| 4b | **注意力熵引导裁剪**:SAE 熵图→自适应 crop | ViCrop-Det(免训练,VisDrone +1.4) | 熵范式验证,但 DETR 头级 |
| ~~→~~ | ~~#5-D 拟议:语义熵第三判据~~ | **查新 ❌(2026-07-17)**:Dome-DETR 结构性占据 + Dynamic DETR(ICML'25 学习式 importance)夹击 | 熵判据遗产→#19 DETR侧对照列 |

**🔑 铁律**(裁决后仍成立,由 #30 继承):增量必须落「**减少 encoder/特征计算**」——但注意 Dome-DETR 教训:其 MWAS 实际 GFLOPs **不降反升**(+37%,加浅层特征换精度、稀疏化控成本)→ #30 若做"净省算力"叙事需与 Dome 的"控成本"叙事显式区分。

## 二、主线 2:小目标适配线(VisDrone 战场)

**DETR 系小目标主线 = "让 query 初始化离小目标更近"**(与 YOLO 系"分辨率更高/P2"正交):
- Deformable:多尺度输入 APs +2.9,整体 APs +5.9(谱系最大收益项)
- DINO:CDN 为小目标找更近初始锚(ATD 指标),APs +7.2(全尺度最大)
- D-FINE:FDR 分布式回归细化边缘定位,O365 后 APs 40.0(实时最高)
- ⚠️ RT-DETR 官方自认 APs 低于同级 YOLO 0.5–0.9 → **改进空间有原作者背书**

**小目标特化分支**(全部以 RT-DETR 系为底座):
| 论文 | 路数 | VisDrone/AI-TOD 数字 | 空白确认 |
|---|---|---|---|
| FMC-DETR | 频域解耦 + **[D2,D4] 非均匀检测层** | VisDrone 33.7(13.8M SOTA) | D2 单点验证浅层价值 |
| EFSI-DETR | "频域启发非变换"空域代理 + 弃F5 | 33.1/APs 24.8@640/188FPS | 纯特征增强,零条件计算 |
| D³R-DETR | Gabor 频域核 + 密度引导注意力稀疏化 | AI-TOD-v2 31.3 SOTA | 密度判据,非语义/频谱判据 |
| DFIR-DETR | 频域最小二乘聚合 + DKSA K-稀疏注意力 | VisDrone 51.6 mAP50 | #20 工程雏形 |
| SFS-DETR | 空间-频域联合选择(细节不明) | 5 UAV 数据集 SOTA | 计数项 |
| TinyFormer | YOLO-DETR 混合,PBM 阻断信号稀释 | VisDrone 34.7/APS 24.7 | 混合趋势代表 |
| DQ-DETR/D3Q | 密度→query 数量 | AI-TOD-v2 30.2/32.1 | 见主线1 |
| **Dome-DETR** 🔴 | DeFE密度头(GT监督)→MWAS浅层掩码窗口稀疏+PAQI自适应query | **AI-TOD-v2 34.6 / VisDrone val 39.0(800²)双SOTA** | ❌判死#5-D;✅佐证#30通路;判据需监督+保留NMS+GFLOPs↑37% = #30 对照叙事 |

**🔑 结构空白**(2026-07-17 修订):①~~全线无 P2~~ **已失效**——Dome-DETR 已用最浅层特征(四尺度)+MWAS 控成本 → #6/#14 的"首次 DETR 浅层"新颖性消失,#14 降级回结构对照实验;②频域分支全部做特征增强,**无人做条件计算**(✅ 已由 **#30** 正式占据,查新通过);③CDN 900 query 在 VisDrone 密集场景(每图数百目标)的显存/组数开销无人评估(仍空白)。

## 三、主线 3:实时化/算力线(#24/#26 的证据库)

| 手段 | 论文 | 定量证据 | Idea 挂点 |
|---|---|---|---|
| encoder 瘦身 | RT-DETR AIFI | 只算 S5:时延 −35% 且 AP +0.4;Deformable encoder 曾占 49% FLOPs 只给 11% AP | **#24 信息瓶颈** |
| encoder 层数 | DINO 消融 | 6→2 层仅 −2.0 AP(decoder −3.0)→ encoder 冗余>decoder | #24 |
| decoder 砍层 | RT-DETR | 免重训调速,6→5 层仅 −0.1 AP | **#26 最优停止** |
| 层深×QS 交互 | DINO | 混合 QS 使 decoder 砍层损失远稳于 Dynamic DETR-2021(−3.0 vs −13.8;⚠️此为 2021 旧版,非 ICML'25 同名篇) | #26 须与 QS 质量联合建模 |
| 轻量骨干 | D-FINE | HGNetv2+GELAN 减半隐藏维:31M/91G 反超 42M/136G | 基线红利 |
| 自蒸馏 | D-FINE GO-LSD | 末层分布→浅层 KL,免教师,即插即用 +2.0~5.3 | **#7 迁移须划界**(IoU×Conf 已被占) |
| 输入级裁剪 | ViCrop-Det | 免训练熵引导 crop,−20% 时延 | #5 正交佐证 |
| **encoder token 聚合** | **Dynamic DETR(ICML'25,🔬深读 2026-07-18)** | 三阶段(2/3/1 blocks)动态保留率+双轨聚合(低层 Proximal 窗口合并/高层 Holistic 亲合注入)+RCDR 中心对齐:DINO −42% FLOPs 仅 −0.7 AP;H-DETR −47.4%;胜 Sparse/Lite/Focus 全系 | **#30 SOTA 对照基线**(统计先验 vs 物理先验);#24 IB 实例;#33/#34 新Idea 源 |

## 四、B轨 Idea 挂点汇总

| Idea | 载体/落点 | 划界红线 |
|---|---|---|
| **#30**(✅ 查新通过 2026-07-17,原 #11-D,**B轨主Idea**;**技术方案 v1.0 ✅** → [idea_030_technical_proposal_v1.md](../Ideas/idea_030_technical_proposal_v1.md)) | 免监督频谱统计判据→D-FINE 浅层 token 条件计算(判据首选 S1 空域高通代理+局部异常度;MWAS 结构沿用引用;query 预算无 NMS 保端到端) | vs EFSI(增强非条件计算)/UAV-DETR(融合软门控,避 "frequency gating" 字样)/Dome-DETR(判据免监督零参数 vs DeFE 学习头);详见 [detr_derivative_novelty_check.md](../Ideas/detr_derivative_novelty_check.md) |
| ~~#5-D~~(❌ 查新不通过) | ~~QS 第三判据(语义熵)+ encoder token 门控~~ | Dome-DETR 结构性占据;熵判据遗产→#19 DETR侧对照列 |
| #14(降级:结构对照) | D2=SLE 跨架构验证(FMC [D2,D4] 单点已证) | Dome 已用最浅层特征,"首次 DETR 浅层"新颖性消失;仅作 #6 的跨架构对照 |
| #7(迁移候选) | 蒸馏 mask 熵加权 | vs GO-LSD(IoU×Conf 加权)/LFT(梯度贯通)三方划界 |
| #24(C类) | encoder 冗余定量证据链(49%/11% + DINO 消融) | 理论框架,双轨各验证一次 |
| #26(C类) | decoder 层深维现成载体 + 与 QS 质量交互项 | 同上 |
| #17 | ADR(角度分布)与 FDR(边缘分布)同构 | O² 已用 D-FINE 作底座,迁移即撞车,只作理论印证 |
| #6 | P2/D2 检测层(全线空白) | 与 #14 合并推进 |

**概念红线**(compare 结论24 + 2026-07-17 查新扩充 + 2026-07-18 Dynamic DETR 深读裁决):「注意力稀疏采样」已被 MSDeformAttn(15000+ 引用)占据;「query 数量自适应」已被 DQ-DETR/D3Q/Dome-PAQI 占据;「熵引导裁剪」已被 ViCrop-Det 占据;「密度引导 token 稀疏」已被 Dome-DETR 占据;「learnable (frequency) gating」字样已被 UAV-DETR 占据;「学习式 token importance」已被 Dynamic DETR(ICML'25,**已深读 ✅ 2026-07-18**)占据——**深读裁定:其判据实为 attention weight 离线统计先验(stage 级重排,非输入自适应、非端到端学习),且完全未触碰频谱/梯度信息 → #30 的「免监督物理判据+输入级自适应」空白不仅未被侵占,反而获得最强对照基线**(Summary §8.4)→ B轨 Idea 的合法表述空间 = **「免监督/零参数判据驱动的 token 预算分配 + 与学习式判据头的成本-精度对照」**(即 #30 的定位)。

## 五、基线选型(纸面初判,⏸ 最终确认待实验模块)

| 角色 | 选择 | 理由 |
|---|---|---|
| 主基座 | **D-FINE(HGNetv2-L)** | 54.0@31M/91G 全面占优;O365 后 APs 40.0;FDR/GO-LSD 即插即用;O² 已用作底座(生态验证);**Dome-DETR 亦以其为底座且未开源 → D-FINE 同时是 #30 的公平对照基线** |
| 机制理解层 | RT-DETR | AIFI/CCFF/不确定性 QS 三机制是全部特化分支的共同底座 |
| 生态兜底 | ultralytics RT-DETR | 若实验模块要求 ultralytics 单栈则切换 |

---
*Last Update: 2026-07-18(Dynamic DETR ICML'25 深读入图) | Maintainer: Claude Code*
