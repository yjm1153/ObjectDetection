# TinyFormer: Preserving Tiny Objects in YOLO-DETR Hybrid Real-time Detectors

> arXiv 2026.05 (2605.25046) | Jun-Wei Hsieh, Meng-Yu Kao, Ghufron Wahyu Kurniawan, Kuan-Chuan Peng
> 代码: github.com/mmpmmpmmpjosh/TinyFormer

---

## 1. 问题 (Problem)
YOLO 和 DETR 两类检测器在微小目标上**系统性失败**，根因不同但殊途同归：
- **YOLO**: 32× 下采样使微小目标在深层特征图中消失；网格分配 + NMS 进一步伤害小目标
- **DETR**: stride-16 tokenization 将微小目标坍缩为少量低能量 token，在全局 self-attention 中被抑制；二分匹配偏向大目标

## 2. 方法 (Method)
统一的 YOLO-DETR 混合架构：ViT backbone + DETR NMS-free set prediction + YOLO 式特征金字塔 Neck。

### 2.1 Parallel Bi-fusion Module (PBM) —— Neck 级空间细节保留
- **双向捷径通路**：浅层→深层（高分辨率空间细节，绿色通路）+ 深层→浅层（语义上下文，橙色通路），**并行**注入 Neck
- **"Align-then-Injection" 三尺度融合**：当前尺度 + 深层语义 + 浅层细节同时融合
- **递归 CSP 式通道分割**（3× 递归）：丰富表示同时保持高效
- **与 FPN/PAN 关键区别**：FPN/PAN 是**串行** top-down→bottom-up，PBM 是**并行**多尺度聚合——微小目标信号不会被逐层稀释

### 2.2 Spatial Semantic Adapter (SSA) —— Backbone 级空间恢复
双分支结构，在 stride-8 (F3) 中间尺度融合：
- **Spatial Detail Extractor (SDE)**：轻量卷积通路，直接在原始输入图上操作，在 tokenization 退化前提取 1/4 和 1/8 尺度的高分辨率空间先验
- **Semantic Purification Block (SPB)**：轻量卷积投影精炼 ViT 深层特征 (F4, F5)，改善与检测管线的兼容性

## 3. 关键实验结果

### COCO val2017
| 配置 | AP | AP_S |
|------|-----|------|
| TinyFormer-X (无 PBM) | 58.4% | — |
| TinyFormer-X-PBM | **58.5%** | **40.9%** |
| TinyFormer-X-PBM + Objects365 pretrain | **60.2%** | **43.0%** |
| TinyFormer-XL-PBM | **60.6%** | — |

- 首个无外部预训练数据突破 60% AP 的实时检测器
- SSA 单独贡献 +0.58% AP_S → 39.33%（有限，因为 ViT tokenization 瓶颈仍在）
- PBM 单独贡献 +0.58% AP_S（有限，因为缺少空间基础）
- **SSA + PBM 协同** → 40.94% AP_S（+1.6% over baseline）：SSA 提供空间基础，PBM 确保金字塔中不稀释

### VisDrone2019
| 指标 | TinyFormer | DEIMv2-X | 优势 |
|------|-----------|----------|------|
| AP | **34.7%** | 32.2% | +2.5% |
| AP_S | **24.7%** | 21.5% | +3.2% |

### 架构无关性验证
PBM 插入 RT-DETRv2-X：+1.62% AP_S | 插入 DEIM-X：+0.68% AP_S
→ PBM 是通用 Neck 增强件，不限于特定 backbone

## 4. 创新点分析 (≥3)
1. **首次系统分析** YOLO 和 DETR 在微小目标上的失败机制（空间退化 + token 坍缩），统一框架
2. **PBM 并行双向融合**替代串行 FPN/PAN，阻断微小目标信号的逐层稀释——这是 Neck 设计的新范式
3. **SSA 双分支空间-语义解耦**：首次将"原始图像空间先验"显式注入 ViT 检测器的特征金字塔
4. **架构无关的 PBM**：证明空间细节保留是一个跨架构的通用需求，不仅限于 CNN 或 Transformer

## 5. 弱点 (≥5)
1. **VisDrone 只报了总 AP**：没有 AP_vt/AP_t/AP_s/AP_m 分尺度指标，无法判断在极小目标 (2–8 px) 上的真实表现（AI-TOD 未测试）
2. **PBM 的并行设计虽好但通道开销**：递归 CSP 分割在 X 模型上仍增加参数（虽未明确报告增量 GFLOPs）
3. **SSA 的 SDE 分支依赖原始图像**：对低质量/模糊无人机图像（VisDrone 的常见情况）的鲁棒性未验证
4. **无 P2 层讨论**：PBM 的"浅层细节保留"本质上是 P2 的替代方案（用跨层捷径代替显式 P2 头），但论文未讨论与 P2 头的关系/对比
5. **ViT backbone 预训练依赖**：无 Objects365 预训练时 AP_S 从 43.0 降到 40.9，小目标对预训练质量的敏感性高于大目标
6. **检测头仍是标准 DETR head**：未针对微小目标做专门的 head 设计（如 RFLA 式的高斯分配）
7. **仅在 COCO + VisDrone 验证**：未在 TinyPerson、AI-TOD 等更极端的微小目标基准上测试

## 6. 对本项目的启发

### 对"坚持 YOLO"决策的影响 ⚠️ 关键
TinyFormer 的出现**不改变"坚持 YOLO"决策**，但提供了重要的架构演进信号：
- **正面证据（坚持 YOLO）**：(1) TinyFormer 的核心贡献 PBM 本质上是 Neck 改进，与 backbone 类型无关——已证明插入 RT-DETR/DEIM 同样涨点；(2) YOLO 检测头的小目标适应性（Grid assignment、NMS）问题在论文中被指出但 TinyFormer 用 DETR head 绕过而非解决——**YOLO head 的小目标改进仍是开放问题**；(3) TinyFormer 的 ViT backbone 参数量大（X 模型 60%+ AP 但参数量未明确），YOLO 的轻量优势在边缘部署上仍成立
- **警示信号**：(1) YOLO-DETR 混合是 2026 年的明显趋势，纯 YOLO 架构可能在学术 benchmark 上逐渐落后；(2) PBM 的"并行双向融合"直接质疑了 FPN/PAN 的串行设计——我们的 #6 SLE（P2+截短backbone）仍基于 PAN，可能需要升级为 PBM 式设计

### 对 #5 (熵引导 P2 稀疏化) 的影响
- **PBM 是 P2 头的替代方案**：PBM 通过"浅层→深层捷径"保留空间细节，不需要显式 P2 头即可将高分辨率信息送达检测头。#5 的叙事需明确定位：为什么我们要 P2 头 + 稀疏化，而非 PBM 式捷径？
  - **回答**：PBM 保留的是**稠密的空间细节**（所有位置），算力开销在 Neck 融合；#5 用熵**选择性保留**（只在前景区域），省算力。PBM 和 #5 是互补而非互斥——PBM 解决"如何传递"，#5 解决"传什么"
- **SSA 的 SDE 分支思路可借鉴**：SSA 用轻量 CNN 在原始图像上提取空间先验 → #5 的熵图也可以从原始图像层面计算（而非依赖 backbone 特征），进一步降低计算开销

### 对 #6 (SLE baseline) 的影响
- PBM 的出现意味着 #6 的 Neck 选型需要从 PAN vs AFPN vs ASFF 扩展为 PAN vs PBM vs AFPN vs ASFF
- 但 PBM 需要 ViT backbone（原论文设计），在 CNN backbone 上的适配性待验证

### 对 #11 (高频能量稀疏化) 的间接影响
- SSA 证明"原始图像空间先验"对微小目标检测有显著价值（+1.6% AP_S）
- 高频能量（FFT）是另一种"原始图像先验"，比 SSA 的 CNN 提取更便宜（零参数）

## 7. 可继续研究的问题
- PBM 在纯 CNN backbone（如 YOLO11 的 CSPDarknet）上是否有效？还是依赖 ViT 的全局特征？
- PBM + 显式 P2 头是否有叠加收益？还是功能重叠？
- SDE 的空间先验 vs 熵图 vs 高频能量：三种"免费"空间先验在 VisDrone 上的 head-to-head 比较

## 8. 标签分配
- 无特定标签分配创新（使用标准 DETR 二分匹配）

## 9. 与已读论文的关系
| 论文 | 关系 |
|------|------|
| SEMA-YOLO (P2头+SLE) | P2头方案 vs PBM捷径方案——两种"保留浅层细节"的路线，需对照 |
| YOLOE (OVD基座) | TinyFormer用ViT+YOLO Neck，YOLOE用纯CNN；#5基座定为YOLOE后PBM的适配性是开放问题 |
| Token Cropr (token pruning) | 都在解决"如何选择性保留信息"——Cropr剪token，TinyFormer保留空间细节 |
| RFLA (高斯分配) | TinyFormer标准DETR head未做小目标head优化→RFLA式分配可能叠加 |

## 10. 可复现性
- 代码已公开: github.com/mmpmmpmmpjosh/TinyFormer
- 需要 Objects365 预训练才能达到最高 AP_S（43.0%），仅 COCO 预训练为 40.9%
- ViT backbone 预训练权重依赖 timm/torchvision

## 11. 训练与超参
- COCO: 标准 1× schedule (12 epochs), 640×640
- 预训练: Objects365 (可选)
- ViT backbone: 未明确型号（推测 ViT-L 或类似）

## 12. 数据集
- COCO val2017: 主 benchmark
- VisDrone2019: 小目标验证

## 13. 一句话总结
> TinyFormer 用 PBM 并行双向融合 + SSA 空间语义解耦系统性地解决了 YOLO/DETR 在微小目标上的空间退化问题，但其 PBM 捷径方案与 #5 的 P2+稀疏化方案形成"稠密传递 vs 选择性传递"的路线竞争——两者互补而非互斥，PBM 可作 #6 的 Neck 升级候选。
