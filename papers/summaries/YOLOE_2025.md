# YOLOE: Real-Time Seeing Anything

> **Venue**: arXiv 2025(2503.07465,THU)| **Code**: https://github.com/THU-MIG/yoloe
> **阅读日期**: 2026-07-15(arXiv 抓取版)| **关联 Idea**: #5 #7(基座二选一的答案)

---

## 1. Problem

YOLO-World 的三个痛点:①跨模态融合(RepVL-PAN)拖慢推理;②只支持文本 prompt;③预训练成本高。YOLOE 目标:一个模型统一 **文本 / 视觉 / 无 prompt** 三种开集模式,更快更省。

## 2. Method(三个机制)

### 2.1 RepRTA(文本 prompt,零开销)
- **删掉 RepVL-PAN**(−1.9 AP,换 1.28× 提速)→ 用轻量辅助网络(一个 SwiGLU FFN)增强文本嵌入(+2.0 AP 补回)
- 推理时辅助网络与物体嵌入头**重参数化合并进原生 YOLO 分类头**:`K' = R(f_θ(P)) ⊛ Kᵀ` → 结构与闭集 YOLO 完全相同,零开销
- 文本编码器换 MobileCLIP-B(LT)(+1.5 AP);全局负样本词典(+0.9 AP)

### 2.2 SAVPE(视觉 prompt)
语义分支(P3–P5 → S∈R^{D×H×W})+ 激活分支(prompt mask → 低维 A=16 权重,区域内 softmax)→ 分组聚合。比 mask-pool +1.5 AP,仅训 2 epoch。

### 2.3 LRPC(prompt-free,⚠️ 与 #5 相关)
- 生成问题重构为检索问题:专用嵌入 P_s 先过滤 anchor 点 `O' = {o | o·P_sᵀ > δ}`(δ=0.001),**过滤掉 ~80% anchor**,只对剩余的做 4585 类词表检索
- v8-S FPS 56.5→95.8(1.7×)精度不掉;比 GenerateU(297M, 0.48 FPS)少 6.3× 参数快 53×

## 3. Experiments

**LVIS zero-shot(vs YOLO-Worldv2,8×RTX4090)**:
| 模型 | AP | APr | T4 FPS | 训练时长 |
|------|----|-----|--------|---------|
| YWv2-S → YOLOE-v8-S | 24.4→**27.9** | 17.1→**22.3** | 216→306 | 41.7h→**12.0h** |
| YWv2-L → YOLOE-v8-L | 35.5→**35.9** | 25.6→**33.2** | 80→102.5 | 80h→**22.5h** |

- 训练 3× 更省(**8×4090×12h——首个"平民可复现"的开集 YOLO**);零 shot 分割 APm 还赢过微调过的 YWv2(+3.0~3.7)
- COCO full tuning:比 from-scratch YOLOv8 少 4× epoch 还高 +0.3~0.6 APb —— **开集预训练权重是极好的检测初始化**
- 消融路线图:去融合 −1.9 → RepRTA +2.0 → 净效果精度持平、速度 +28%

**训练**:三阶段(文本 30ep → 视觉 SAVPE 2ep → prompt-free 1ep);O365+GQA+Flickr(1.4M 图);AdamW lr 0.002,batch 128;SAM-2.1 生成伪 mask。

## 4. Innovation(≥3)

1. **"融合不如对齐"**:证明跨模态融合(YOLO-World 核心卖点)可以删掉,用训练期对齐(RepRTA)+ 重参数化替代——推理结构回归纯 YOLO
2. **LRPC 检索式 prompt-free**:开集识别不需要语言模型,anchor 过滤 + 词表检索即可(53× 加速)
3. 三 prompt 统一 + 检测分割一体,训练成本降到消费级 GPU 可复现
4. 开集预训练作为闭集初始化的价值被定量证明(4× 省 epoch 还涨点)

## 5. Weakness

1. **仍无 P2**(P3–P5),仍不报 AP_s/小目标指标——开集线与小目标线依旧未交汇
2. 多任务 trade-off:APf 低于 YWv2(常见类掉点)
3. 视觉 prompt 仅训 2ep,上限未探;prompt-free 受限于固定 4585 类词表
4. LRPC 的过滤发生在**头部输出级**(anchor 分类前),backbone/neck 的稠密计算一点没省——特征级稀疏化仍是空白
5. 数据 1.4M,远小于 T-Rex2(3.1M)

## 6. 对本项目的启发(#5 基座定论)

1. **#5 基座选 YOLOE**,理由:①推理结构=纯 YOLO(加 P2/稀疏化改造无跨模态纠缠);②8×4090×12h 训练成本,租卡可复现(YOLO-World 32×V100 不可能);③RepRTA 重参数化与 #5 的离线熵图哲学完全同构;④物体嵌入-文本相似度可直接产出语义熵图
2. **⚠️ #5 查新边界新增一条(重要)**:LRPC 的 anchor 过滤(`o·P_sᵀ>δ` 滤 80%)是"语义引导的稀疏计算"最近邻!划界:LRPC 在**头部输出级**滤 anchor、目的是省词表检索;#5 在**特征级(P2 neck/head 计算前)**做空间稀疏化、目的是省稠密卷积 FLOPs——层级、对象、目的均不同,但 Related Work 必须引用并划界,且 LRPC 佐证"逐点语义分数过滤在 YOLO 上可行且无损"
3. **δ=0.001 的启示**:极低阈值即可无损滤 80%——背景 anchor 的语义分数分布与前景高度可分,间接支持 #5 的熵判据假设
4. #7 教师选择更新:YOLOE-v8-L(45M)优于 YOLO-World-L(结构纯净、零 shot 更强 APr 33.2)

## 7. 可继续研究的问题

1. YOLOE + P2 + 熵稀疏化 = #5 的完整故事;LRPC 思想能否从 head 级下沉到特征级?(= #5 本体)
2. YOLOE 的物体嵌入在 VisDrone 俯视小目标上的熵分布(CLIP 对齐验证的具体载体,MobileCLIP 版)
3. 开集预训练初始化 + VisDrone 微调,是否比 COCO 预训练更好?(#6 的免费改进项,零创新但实用)

---
*Sources: [ar5iv/2503.07465](https://ar5iv.labs.arxiv.org/html/2503.07465)*
