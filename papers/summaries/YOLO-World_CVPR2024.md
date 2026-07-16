# YOLO-World: Real-Time Open-Vocabulary Object Detection

> **Venue**: CVPR 2024 | **arXiv**: 2401.17270 | **机构**: 腾讯 AI Lab + 华中科大
> **Code**: https://github.com/AILab-CVC/YOLO-World
> **阅读日期**: 2026-07-15(arXiv 抓取版)| **关联 Idea**: #5 #7 #8(开集基座依赖)

---

## 1. Problem(要解决什么)

开放词汇检测(OVD)被大模型垄断:GLIP-T 0.12 FPS、Grounding DINO-T 1.5 FPS、DetCLIP-T 2.3 FPS——全部无法实时。固定词表的传统 YOLO 又无法泛化到新类别。目标:**把开放词汇能力装进实时 YOLO**。

## 2. Method

### 2.1 架构
YOLOv8 基座(Darknet backbone + PAN + 解耦头)+ **冻结的 CLIP text encoder**(D=512)。检测头输出物体嵌入而非类别 logits,与文本嵌入算相似度 `s = α·norm(e)·norm(w)ᵀ + β`。

### 2.2 RepVL-PAN(核心贡献)
在 PAN 的 {P3, P4, P5} 上做双向跨模态融合:
- **T-CSPLayer(文本→图像)**:max-sigmoid 注意力 `X' = X · δ(max_j(X Wjᵀ))ᵀ`——每个空间位置取与所有文本嵌入的最大相似度作门控
- **I-Pooling Attention(图像→文本)**:多尺度特征 max-pool 成 3×3(27 个 token),`W' = W + MHA(W, X̃, X̃)`
- **重参数化**:离线词表的文本嵌入转成 1×1 卷积权重/简化 softmax 运算 → **推理时完全移除文本编码器**(FPS 19.9→74.1)

### 2.3 Prompt-then-Detect 范式 + 预训练
- 用户 prompt → 编码一次 → 离线词表 → 重参数化进权重
- Region-text 对比损失 `L = L_con + λ_I(L_iou + L_dfl)`,image-text 数据时 λ_I=0(伪框不准)
- 数据:O365(609k)+ GoldG(GQA 621k + Flickr30k 149k)+ CC3M† 伪标签(246k,GLIP 生成框 + CLIP 重打分)

## 3. Experiments

**LVIS zero-shot(V100)**:
| 模型 | Params | FPS(重参数化) | AP | APr |
|------|--------|------|-----|-----|
| YOLO-World-S | 13M | 74.1 | 26.2 | 19.1 |
| YOLO-World-M | 29M | 58.1 | 31.0 | 23.8 |
| YOLO-World-L | 48M | 52.0 | 35.4 | 27.6 |

vs GLIP-T(232M)26.0 AP @0.12 FPS、DetCLIP-T(155M)34.4 AP @2.3 FPS —— **同精度 20×~400× 加速**。

**COCO fine-tune**:L 达 53.3 AP @156 FPS(fine-tune 时**移除 RepVL-PAN**);zero-shot COCO 45.1 AP。

**消融**:
- RepVL-PAN:O365 上 +1.1 AP,O365+GQA 上 +2.2 AP(文本越丰富收益越大);T→I 贡献大于 I→T
- 数据:GoldG 是最大功臣(23.5→32.5,+9.0);CC3M† 再 +0.5(APr +1.3)
- 文本编码器:冻结 CLIP 22.4 >> 冻结 BERT 14.6;**微调 CLIP 反而掉到 19.3**(O365 文本太贫瘠,破坏 CLIP 泛化)

**训练**:32×V100,batch 512,AdamW lr 0.002,100 epoch,mosaic,在线词表 M=80。

## 4. Innovation(≥3)

1. **重参数化开集检测**:离线词表→权重,推理零文本编码开销——"prompt-then-detect"范式使 OVD 首次实时化
2. **max-sigmoid 文本门控**:比 cross-attention 便宜得多的 T→I 融合,天然适配 CNN 特征图
3. **YOLO 系首个区域-文本对比预训练配方**(检测+grounding+伪标签 image-text 三源混合,λ_I 门控伪框噪声)
4. 冻结 CLIP > 微调 CLIP 的反直觉结论(小词表数据会破坏对齐)——对本项目用 CLIP 的所有 idea 都是警示

## 5. Weakness

1. **无 P2 层**:金字塔只有 P3–P5,小目标先天不利;LVIS 上也未报告 AP_small
2. **文本注入只在 PAN**:backbone 低层特征完全没有语义引导——**这正是 #5 要占的空白(P2/浅层的语义引导完全无人做)**
3. I-Pooling 把全图压成 3×3=27 token,空间细节几乎全丢——图像→文本方向的融合非常粗糙
4. COCO fine-tune 时 RepVL-PAN 被移除——侧面承认固定小词表下跨模态融合冗余
5. 伪标签数据对小模型有负作用(论文自认);CC3M 只用了 8%
6. 预训练成本高(32×V100×100ep),复现门槛高——**本项目只能用其发布权重,不可能重训**

## 6. 对本项目的启发

1. **#5 的基座与词表机制确定**:YOLO-World 的离线词表重参数化与 #5 的"离线语义熵图"哲学同源——熵图可以在同样的离线阶段预计算类别文本嵌入,推理时只做特征-嵌入相似度 + 熵计算,不破坏实时性
2. **#5 的 Gap 再次确认(结构层面)**:YOLO-World 文本只进 PAN P3–P5,无 P2、无 backbone 注入、无稀疏化——「语义熵×P2 稀疏化」与其正交且互补,Related Work 划界清晰
3. **max-sigmoid 门控可以直接复用**:#5 的熵图门控可采用同款轻量形式(sigmoid 门控而非 attention),工程成本低
4. **警示**:①微调 CLIP 有害——#5/#7 的文本编码器必须冻结;②VisDrone 类别只有 10 个,属"文本贫瘠"场景,RepVL-PAN 消融显示此时跨模态收益缩水——#5 的收益应主要押在"熵图做空间稀疏化判据"而非"跨模态融合涨点"
5. #7(熵图蒸馏)可用 YOLO-World-L 作教师:开集能力 + YOLO 同构,蒸馏对齐成本低

## 7. 可继续研究的问题

1. YOLO-World 的物体嵌入-文本相似度分布,在 VisDrone 俯视小目标上熵值如何?(= CLIP 对齐验证任务,可直接用其发布权重做,**不需训练**——环境就绪后优先)
2. RepVL-PAN 下探到 P2 会怎样?(算力爆炸 → 必须配稀疏化 → 恰是 #5 的故事线)
3. YOLOE(后续工作)是否已解决无 P2/小目标问题?→ 下一篇优先读

---
*Sources: [ar5iv/2401.17270](https://ar5iv.labs.arxiv.org/html/2401.17270)*
