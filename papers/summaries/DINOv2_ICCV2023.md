# DINOv2: Learning Robust Visual Features without Supervision (ICCV 2023)

> Oquab et al., Meta AI | ICCV 2023 | ⚠️ pre-2025, 路径三 P0

## One-Liner
自监督 ViT 在无文本监督下自动涌现 patch-level objectness → 避免 CLIP 小目标偏差 → 第三种 P2 门控判据。

## Core Architecture
- **Base**: ViT (patch size 14), variants S/B/L/g
- **ViT-g**: 1.1B params, emb_dim=1536, 24 heads (64 dim/head → GPU aligned)
- **Mods**: SwiGLU FFN + LayerScale + untied heads (image/patch)
- **Resolution**: train 224² → short fine-tune 518²

## Training = DINO + iBOT + KoLeo
| 组件 | 层级 | 作用 |
|------|------|------|
| DINO (image-level) | class token CE | 语义理解——教师EMA+学生不同crop |
| iBOT (patch-level) | masked patch CE | 空间细节重建——"对密集预测任务关键，贡献~3 mIoU" |
| KoLeo regularizer | batch内 | 均匀特征分布——负log最近邻距离 |
| Sinkhorn-Knopp | 教师centering | 3轮迭代替代softmax-centering |

**蒸馏**: ViT-g (teacher) → 冻结 → 蒸馏 S/B/L (性能优于从头训练)

## 关键发现：Patch Features 的 Emergent Objectness

### PCA 前景分离（无监督，无需训练）
> "The first PCA component separates the image's main object from the background — an emerging property, our model was not trained to parse parts of objects."

操作：对 patch features 做 PCA → 第一主成分阈值化 → 自动分割前景/背景。**此过程零文本监督，完全涌现。**

### 语义对应（跨域、跨风格）
- PCA 高阶分量对应物体部件，跨姿态/风格/域匹配
- 例：飞机翅膀 ↔ 鸟翅膀；照片 ↔ 线稿

### 细粒度优于 CLIP
- iNaturalist 2018: DINOv2-G **+8.6%** vs OpenCLIP-G
- iNaturalist 2021: **+9.7%**
- Something-Something v2 (时空细节): **+2.5%**
- → CLIP 的 caption 级别监督粗粒度，小物体信息在文本描述中被忽略

### 密集预测优于 CLIP
- Depth (NYUd→SUN-RGBd): DINOv2-L **优于** OpenCLIP-G (更大的模型)
- OpenCLIP-G depth 产生 "many artifacts and disconnected components"
- → DINOv2 对每个 patch 的监督（iBOT）远比 CLIP 的 image-level caption 精细

## 为什么 DINOv2 对小目标更好
> "Text captions only approximate the rich information in images, and complex pixel-level information may not surface."

**根本机制差异**：
- CLIP: image-level caption → 大目标主导 caption → 小目标被系统性忽略（CLIP-Bias 论文验证了 r=0.579）
- DINOv2: patch-level MIM → 每个空间位置平等监督 → 小目标 patch 与 大目标 patch 同权

## 模型规模
| Variant | Params | 适用 |
|---------|--------|------|
| ViT-S/14 | ~22M | 快速原型 |
| ViT-B/14 | ~86M | 精度/速度均衡 |
| ViT-L/14 | ~307M | 最佳密集特征 |
| ViT-g/14 | ~1.1B | 教师(蒸馏用) |

训练 ViT-g: 22,016 A100 GPU-hours

## 对本项目的启示

### Idea#18: DINOv2 特征熵 → P2 门控（"中立判据"）
- **操作**: 对 P2 级每个 token 提取 DINOv2-ViT-S patch feature → 计算特征空间熵 → 门控
- **优势**: 免 VLM（规避 CLIP-Bias）+ 免频域（与 #11 完全独立）+ 零训练（离线提取）
- **成本**: ViT-S/14 ~22M params ~87MB, P2 256个token 离线提取 ~ms 级（需实测）→ **可作推理时轻量判据**
- **叙事**: CLIP遭偏差质疑 → 转向自监督判据 → DINOv2无文本监督自动捕获objectness → 更"公正"的判据

### Idea#19: 三判据对照实验
- CLIP entropy vs DINOv2-PCA vs FFT-spectral → 谁与 GT 小目标 mask 重合率最高？
- **预测**: DINOv2 在小目标上优于 CLIP（因为是 patch-level 监督），接近 FFT（因为都是 spatial prior）

### 关键引用
- DINOv2 作为 "unbiased visual features" 被越来越广泛接受
- 可作为 #5/#11/#15 的第三种判据实验参照

---
*Pre-2025 (ICCV 2023) | 路径三 P0 | Read 2026-07-16*
