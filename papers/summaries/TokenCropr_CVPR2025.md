# Token Cropr: Faster ViTs for Quite a Few Tasks

> **Venue**: CVPR 2025(pp. 9740–9750)| **arXiv**: 2412.00965 | **机构**: HPI + Google DeepMind
> **Code**: https://github.com/benbergner/cropr
> **阅读日期**: 2026-07-15(网络抓取受限,基于 openaccess/alphaXiv 检索精读)| **关联 Idea**: #5(查新最近邻,必须划界)

---

## 1. Problem

ViT 的 token 数随分辨率平方增长,dense prediction(分割/检测)无法像分类那样只留 CLS 相关 token。目标:一个跨任务通用的 token 剪枝框架,训练后开销近乎随机剪枝。

## 2. Method(Cropr 模块 = Router + Aggregator + 辅助头)

### 2.1 Router(scorer + selector)
- **单 query 简化 cross-attention**:`A = Q·K(X)ᵀ`,分数求和得每 token 单一相关性分,**Top-K 保留**
- 消融:简化版胜 16 头 MHA(85.3 vs 85.2 acc,还更快);Top-K 胜采样(85.3 vs 85.1)——**"简单判据够用"**

### 2.2 辅助头(训练后丢弃)
- 各任务定制:分类=单 query+CE;分割=每 patch 一 query+下采样监督;**检测=multi-label 分类代理头**(sigmoid+BCE,识别图中出现的类别)
- **stop-gradient**:辅助梯度不进 backbone(+0.3 acc);aggregator 的 MLP 也训练后丢弃

### 2.3 LLF(Last Layer Fusion)⚠️ 对 #5 最有价值
- 被剪 token 在**最后一个 ViT block 前按原空间位置重新插入**,与保留 token 一起过最后一层(被剪 token 得以 attend 深层特征)
- **零额外参数**(304M=304M);ADE20k 消融碾压所有替代:无再激活 47.7 / Token Concat 51.8 / DToP logit 融合 50.1 / **LLF 56.6**(无剪枝 56.7,几乎无损!)

## 3. Experiments(检测相关)

- **COCO,Cascade Mask R-CNN + EVA-02-L**,1536×1536(9216 patch),5 阶段渐进剪枝(block 5/8/11/14/20 后),累计**剪掉 97%** token
- 结果:**63.0 AP_box / 54.0 AP_mask**,FLOPs 2790→1273(−54%),encoder 2.4× / 整体 1.9× 提速
- 其他:ADE20k 2× 提速 mIoU 仅 −0.1;ImageNet EVA-02 89.7%(−0.2pp)2.1× 提速
- **未报告 AP_s**(小目标无数据)

## 4. Innovation(≥3)

1. **LLF**:被剪 token 的"最后一层复活"机制,dense prediction 下几乎无损——比 SViT 的逐层再激活更简单且零参数
2. 任务自适应辅助头 + stop-gradient:选择监督与主干解耦,训练后全部丢弃
3. 单 query cross-attn scorer:证明复杂度不必要,简单相关性分数即够
4. 跨 4 任务(分类/语义分割/检测/实例分割)统一框架

## 5. Weakness

1. **绑定 ViT 架构**:token = patch 序列的前提;CNN 多尺度特征图(YOLO)无对应机制,LLF 依赖"最后一个全局 attention block"——CNN 里不存在
2. 判据是**可学习 router**(需任务监督训练),非免训练先验;换数据集/任务需重训
3. 检测实验用 1536² 超大分辨率 + Cascade R-CNN(非实时);未报 AP_s,小目标未验证——97% 剪枝率在小目标密集场景(VisDrone)几乎必然误剪
4. 剪枝发生在 backbone(encoder),多尺度 neck/head 的稀疏化未涉及

## 6. 对本项目的启发(#5 划界定稿)

1. **与 #5 的四重区别(Related Work 划界语言)**:①对象:ViT encoder token vs CNN 多尺度特征图(P2);②判据:可学习 router(任务监督)vs 免训练语义熵/高频先验;③位置:backbone 内部 vs neck/head 的 P2 分支;④场景:大分辨率非实时 + 未验证小目标 vs VisDrone 实时小目标
2. **LLF 思想可移植 = #5 的误剪兜底设计**:被稀疏跳过的 P2 位置,在检测头前用一次轻量融合(如 P3 上采样填充 + 1×1 conv)"复活"——比 SViT 逐层再激活便宜,值得写进 #5 方法设计
3. **"简单判据够用"的旁证**:单 query 打分即可支撑 97% 剪枝——#5 的熵图(零参数)作判据在复杂度上完全站得住
4. 辅助头 + stop-gradient + 训练后丢弃:若 #5 的熵判据需要微调对齐,可用同款"训练期辅助、推理期移除"范式(与 SFIDM reweighting 同源)

## 7. 可继续研究的问题

1. LLF 式"末端复活"在 CNN 检测器上的对应物是什么?(#5 方法设计题)
2. 可学习 router vs 免训练熵判据的选择质量对比——预实验可加一列(需 GPU,暂缓)
3. 97% 剪枝率在小目标密集场景的召回崩溃点在哪?(反面论据,#5 论文可引)

---
*Sources: [CVPR 2025 openaccess](https://openaccess.thecvf.com/content/CVPR2025/html/Bergner_Token_Cropr_Faster_ViTs_for_Quite_a_Few_Tasks_CVPR_2025_paper.html) | [arXiv:2412.00965](https://www.alphaxiv.org/overview/2412.00965) | [GitHub](https://github.com/benbergner/cropr)*
