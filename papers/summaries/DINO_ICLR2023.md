# DINO: DETR with Improved DeNoising Anchor Boxes for End-to-End Object Detection

> **Venue**: ICLR 2023(arXiv 2203.03605)⚠️ pre-2025 基础方法(按 2026-07-16 解锁授权抓取)
> **机构**: HKUST + Tsinghua + IDEA(Zhang, Li, Liu, Lei Zhang, Su, Zhu, Ni, Shum)
> **代码**: https://github.com/IDEACVR/DINO
> **阅读日期**: 2026-07-17 | **类型**: 🔬 深读(ar5iv HTML 全文)
> **项目定位**: 🟪 B轨基础线 3/3——DETR 谱系集大成者;**首个登顶 COCO 榜的端到端检测器**;RT-DETR/D-FINE 的直接上游
> ⚠️ 与 DINOv2(自监督特征,Idea#18)同名不同物,勿混淆

---

## 一、谱系定位(B轨技术树主干)

DETR(2020) → **Deformable**(deformable attn + two-stage/查询选择) → Conditional/DAB(query = 4D anchor box (x,y,w,h),逐层精化) → DN-DETR(去噪训练稳定二分匹配) → **DINO = DAB + DN + Deformable 三合一 + 三项新技术**

DINO 继承:query=动态 anchor box(DAB)、DN 辅助分支(DN-DETR)、deformable attention + query selection + 迭代精化(Deformable)。

## 二、三大创新

### 2.1 CDN 对比去噪(Contrastive DeNoising)

- DN-DETR 只教模型"从噪声框重建 GT",**缺"拒绝"能力**(锚点附近无物体时不会预测 no object)
- CDN:对同一 GT 加两档噪声 λ₁<λ₂(实际 1.0/2.0)——内圈(<λ₁)= 正样本重建 GT;环带(λ₁~λ₂)= **难负样本预测 "no object"**(focal loss 归背景)
- 每 GT 出 1 正 + 1 负,用 100 CDN 组(=200 query);动态 DN 组数按图内物体数调整(省显存)
- 效果:抑制重复预测(案例:同一男孩 3 框 → 1 框);ATD(k) 指标显示 CDN 为**小目标**找到更近的初始锚 → 小目标 +1.3 AP

### 2.2 混合查询选择(Mixed Query Selection)

三种初始化对照:
| 方案 | 位置 query | 内容 query | 代表 |
|---|---|---|---|
| 静态 | 学习 | 学习/零 | DETR/DN-DETR |
| 纯 QS | encoder top-K | encoder top-K | Deformable two-stage / Efficient DETR |
| **混合 QS** | **encoder top-K** | **保持可学习** | **DINO** |

理由:初选 encoder 特征未经 decoder 精化,**可能含多物体或只含物体一部分**,直接作 content query 会误导 → 只取其位置信息初始化 anchor,内容留白让 decoder 自己去池化。消融 +0.5 AP(APs 29.6→31.1,**小目标获益最大**)。
→ **#5-D 的落点机制在此定型**:top-K 选择只看 encoder 分类分数;RT-DETR 在其上加定位不确定性判据;#5-D 拟加第三判据(语义熵),且必须绑定"减少特征计算"增量。

### 2.3 Look Forward Twice

- Deformable 的迭代精化在层间**截断梯度**("look forward once"):layer i 参数只受本层 loss 影响
- LFT:Δb_i 更新两次(b'_i 与 b_{i+1}^{pred}),使 layer i 参数同时受 layer i 与 i+1 的 loss 影响 → 后层的更优 box 信息回传给前层
- 消融 +0.4 AP
- → 与 D-FINE 的 GO-LSD(末层分布蒸馏所有浅层)是同一思想的两代实现:LFT 靠**梯度路径**,GO-LSD 靠**显式 KL 蒸馏**——#7 若迁 B轨,与这两者的三方划界都要写清

## 三、COCO 数字

### 12-epoch(R50, val2017)
| 模型 | AP | APs | 参数 | FPS(A100) |
|---|---|---|---|---|
| DN-Deformable-DETR(4s) | 43.4 | 24.8 | 48M | 23 |
| **DINO-4scale** | **49.0(+5.6)** | **32.0(+7.2)** | 47M | 24 |
| **DINO-5scale** | **49.4(+6.0)** | **32.3(+7.5)** | 47M | 10 |

**小目标增益(+7.5)是全尺度中最大项** —— CDN 选锚 + 混合 QS 双重贡献,VisDrone 方向的直接背书。

### 收敛后(R50):24ep 51.3(5s)/APs 34.5;36ep 51.2
### SOTA:SwinL + O365 预训练 → **val 63.2 / test-dev 63.3**,首次端到端检测器登顶;218M 参数 = SwinV2-G 的 1/15,数据 = Florence 的 1/5~1/60

### 消融链(12ep, R50)
优化版 DN-DETR 44.9 → +纯 QS 46.5 → +混合 QS 47.0 → +LFT 47.4 → +CDN **47.9**

### 层数消融(→ #26 关键数据)
| Enc/Dec | 6/6 | 4/6 | 2/6 | 6/4 | 6/2 | 2/2 |
|---|---|---|---|---|---|---|
| AP | 47.4 | 46.2 | 45.4 | 46.0 | 44.4 | 41.2 |

- decoder 6→2 掉 3.0 AP,但远好于 Dynamic DETR 的 −13.8 —— 归因:混合 QS 使 query 初始化好,**不深度依赖逐层精化**
- encoder 6→2 掉 2.0 AP —— encoder 深度冗余的又一证据(#24)
- DN 数量:100 CDN 最优(47.9),1000 DN 反而 47.6 —— 去噪 query 边际收益快速饱和

## 四、与本项目的关系

1. **B轨基础线闭环**:DETR→Deformable→DINO→RT-DETR→D-FINE 谱系全部读毕,每一环的继承关系已可追溯(query selection 的三代演进:Deformable 纯 QS → DINO 混合 QS → RT-DETR 不确定性最小 QS → #5-D 拟议第三判据)
2. **#26 最优停止**:获得最完整的 encoder×decoder 层数网格消融——"层深-精度曲线"在 DINO 处平缓(混合 QS 解耦了 query 质量与层深),提示最优停止的收益空间取决于 QS 质量,两者有交互作用(设计文档须记)
3. **#24 信息瓶颈**:encoder 6→2 仅 −2.0 AP(decoder −3.0)再证 encoder 冗余 > decoder
4. **CDN 与 VisDrone**:难负样本(环带)机制在密集小目标场景(VisDrone 每图数百目标)的组数/显存开销需重新评估——D-FINE 沿用 CDN,B轨基线实验时是调参重点
5. **划界**:DINO 的一切改进都是**训练期技术**(CDN/LFT 推理零开销,混合 QS 推理仅 top-K)——B轨 Idea 若主打"推理算力自适应"(#5-D/#11-D),与 DINO 家族无正面冲突,冲突点全部集中在 RT-DETR/D-FINE 及其后的小目标特化分支
