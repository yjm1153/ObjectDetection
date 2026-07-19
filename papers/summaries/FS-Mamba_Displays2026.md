# FS-Mamba: Frequency-Domain State-Space Detector with Super-Resolution Assistance for Small Object Detection

> Displays 2026 (Vol. 94) | Xinyu Di, Yonghua Lu, Tianxing Xiao, Yujie Diao, Yinlong Zhu — Nanjing University of Aeronautics and Astronautics
> **P0 深读日期**: 2026-07-19 | **深读类型**: 🟡 尺度变化 P0 (4/4) | **获取方式**: ScienceDirect 付费墙 + 多源 WebSearch 重建

---

## 1. 问题与动机 (Problem & Motivation)

### 核心问题
无人机航拍图像中小型交通目标（车辆/行人）的检测面临**三重退化**：
1. **下采样低频化**: 步进卷积作为隐式低通滤波器→高频边缘/纹理在小目标中占比本就极少→被系统性抹除
2. **多尺度融合混叠**: Neck跨分辨率融合产生混叠伪影和语义不对齐→微弱的小目标信号被更强的低频率响应淹没
3. **极端分辨率极限**: 目标仅占几个像素→特征表示退化到不可区分的程度

### 为何选择 Mamba + 频域
- **Mamba/SSM**: 全局上下文建模能力强（线性复杂度 attention 替代）→适合无人机大视场长距离依赖
- **频域解耦**: 高频细节是小目标唯一判别信号→需要显式保护而非依赖网络自学
- **SR 辅助**: 超分辨率重建天然训练网络关注高频细节→作为辅助任务注入训练信号

---

## 2. 方法 (Method) — 四组件协同

### 2.1 FDVSSBlock (Frequency-Domain Vision State-Space Block) — Backbone

**核心设计**: 将频域解耦集成进视觉状态空间网络（SSM）的 Backbone 基本块。

**FDGate (Frequency-Domain Gate)** — 嵌入 FDVSSBlock:
- **门控高通滤波**: 在每个 Backbone 关键阶段显式注入高频线索
- **低参数增量**: 门控机制轻量（仅1×1 conv + sigmoid）
- **位置**: Backbone 早期阶段（C2/C3）——此时高频信息尚未被下采样完全消除

**设计直觉**:
```
标准 Backbone:  特征 → 下采样 → 高频损失 → 低通特征
FS-Mamba:      特征 → FDGate(高通门控→注入高频) → 下采样 → 频率均衡特征
```

### 2.2 FPU (Frequency-Preserving Upsampling) — Neck

**核心设计**: Neck 上采样阶段的双门控频率保持机制。

- **双门控设计**: 一个门控分离结构信息（边缘/纹理），另一个门控抑制上采样引入的噪声
- **作用**: 在分辨率变化时保持小目标的结构完整性→减少混叠伪影和特征退化
- **位置**: Neck 自上而下路径的每个上采样节点

### 2.3 PDFAM (Pyramid Dual Fusion Attention Module) — Neck 融合块

**核心设计**: 多尺度特征重校准——注意力机制放大显著目标响应、抑制背景杂波。

**作用**:
- 解决不同 UAV 飞行高度导致的大尺度变化
- 确保小目标微弱信号在多尺度融合中不被淹没
- 平滑特征不连续性

**PDFAXSSBlock**: PDFAM 在 SSM 架构中的等效实现。

### 2.4 SR Auxiliary Branch — 训练专用·零推理开销

**核心设计**: 一个**未经训练的辅助超分辨率重建头**——仅在训练时存在。

**工作机制**:
1. Backbone 特征 → 共享编码器 → 分叉: ①主检测头（分类+回归）②SR 辅助头（超分辨率重建）
2. SR 头引导 Backbone 学习更精细的细节表示
3. **推理时丢弃** SR 头 → 推理管线零额外计算/零额外参数

**与项目方法哲学对照**:
```
FS-Mamba SR:      训练专用辅助头 → 推理丢弃 → 零开销
#5 Gumbel:       训练期软门控 → 推理期硬阈值 → 零开销
YOLO-Master MoE: 训练期 Soft Top-K → 推理期 Hard Top-K → 推理加速
DSS (VALA):      训练早期强正则化 → 后期弱正则化 → 零开销
→ 训练-推理解耦 = 2026 共识设计模式
```

---

## 3. 关键实验结果（基于可获取信息）

### 3.1 基准数据集
| 数据集 | 类型 | 说明 |
|--------|------|------|
| **VisDrone** | 无人机密集小目标 | 主基准 |
| **UAV-ROD** | 无人机道路目标 | 交通参与者专项 |
| **WX-Road** | 道路目标 | 通用道路交通 |

### 3.2 声称性能
- 在三数据集上一致超越 **YOLO 系列**（YOLOv5/v8/v10/v11）和其他 **Mamba-based 检测器**
- 具体 mAP 数值因付费墙未获取

### 3.3 实验环境（已知）
- PyTorch 2.1.1, CUDA 11.8
- Intel i9-10900KF + 单卡 RTX 3090 (24GB)
- Windows 10
- 所有对比方法从头训练（官方实现）→ 控制训练差异

---

## 4. 创新点分析 (≥4)

1. **Mamba × 频域解耦首次融合**: 将 SSM 的全局上下文建模与频域高通门控的局部细节保持结合——解决 SSM 擅长全局但弱于局部的固有问题

2. **训练专用 SR 辅助 = 零推理开销范式**: 与 SET（CVPR 2025·训练专用辅助 loss 后丢弃）和 MambaIR-YOLO 同路线——但首次将 SR 重建作为 Mamba 检测器的辅助任务

3. **双门控频率保持上采样 (FPU)**: 上采样过程中的"结构保持+噪声抑制"双门控——比标准双线性/转置卷积/最近邻上采样更具频率意识

4. **全管线频域注入**: FDGate(Backbone) → FPU(Neck) → PDFAM(Neck) → SR辅助(训练)——四阶段频率感知设计，但各阶段使用不同的频域策略（高通门控/保持/注意力/重建）

---

## 5. 弱点与局限 (≥6)

1. **Mamba Backbone 生态不成熟**: 相比 CNN (YOLO) 和 Transformer (DETR)，Mamba 的工具链/预训练权重/部署支持（TensorRT/ncnn）严重不足→CNN 等价迁移是首要障碍

2. **论文付费墙 + 编码损坏**: 无法获取具体 mAP 数值、消融实验、参数/FLOPs 对比→评估完整性受限

3. **Displays 期刊影响因子 3.4**: 非顶会顶刊→方法的审稿标准低于 CVPR/ICCV/NeurIPS

4. **RTX 3090 单卡训练**: 暗示模型规模可控（非大模型路线）——但也可能限制了扩展性验证

5. **SR 辅助任务的超参敏感**: 检测 loss + SR loss 的权重平衡未报告→实际调参可能困难（两个 loss 的量级和收敛速度通常不同）

6. **小目标专项→通用目标退化未知**: 仅在 UAV 小目标场景验证——频域增强对中大目标的潜在负面影响未评估（类似 DERNet 无 COCO 基准的问题）

7. **Mamba→CNN 迁移代价**: 若要将 FDGate/FPU/PDFAM 迁移到 YOLO CNN backbone/neck——SSM 特有的全局建模能力会丢失，频域模块在 CNN 上的增益可能显著缩水

---

## 6. 可继续研究的 5 个方向

### R1: FDGate → #11 频域判据直接对照
FDGate 的门控高通滤波与 #11 的高频能量判据在**功能上等价**——都是"识别高频区域→优先处理"——但 FDGate 是可学习门控（需训练），#11 是免训练统计判据。同一个 VisDrone+YOLO baseline 上的头对头对比（可学习 FDGate vs 免训练 FFT 判据）是频域门控路线的根本性裁决。

### R2: SR 辅助 → #5 训练信号增强
FS-Mamba 的 SR 辅助训练策略可以迁移到 #5 P2 稀疏化——SR 头引导 P2 特征学习更精细的细节→帮助 #5 Gumbel 门控更准确地识别"值得保留的高信息量区域"→SR 辅助 + 稀疏化训练 = 联合优化。

### R3: CNN 等价实现——FDGate 的最小化移植
从 FS-Mamba 中提取 FDGate 和 FPU 的**最小化 CNN 等价实现**：FDGate = C2f 中插入 1×1 Conv+Sigmoid 门控（高通特征→门控权重）→ 仅 ~1K 参数增量。FPU = 上采样前的双门控注意（结构门控+噪声门控）→ 评估在 YOLO PAN 上的独立增益。

### R4: 训练专用辅助任务的设计空间
FS-Mamba(SR 重建) + SET(辅助 loss 训后丢弃) + #5(Gumbel 训后硬阈值) = 三种不同的"训练专用"机制。系统对比这三种范式在 YOLO+VisDrone 上的增益/稳定性/超参敏感性→"训练专用机制设计指南"。

### R5: Mamba→YOLO 混合 Backbone
不完整替换为 Mamba，而在 YOLO Backbone 的特定阶段（如 C2/C3 高分辨率层）混合使用 SSM 块 + 标准 C2f→保留 CNN 生态兼容性的同时引入全局上下文→频域门控在混合架构上的增益分析。

---

## 7. YOLO 迁移过滤器

| FS-Mamba 组件 | YOLO 迁移路径 | 难度 | 价值 |
|---------------|-------------|------|------|
| FDGate 门控高通 | → C2f 中插入轻量高通门控（1×1+σ→gated HF injection） | 低 | ⭐⭐⭐⭐ |
| FPU 双门控上采样 | → YOLO PAN 上采样前加结构/噪声双门控 | 中 | ⭐⭐⭐ |
| PDFAM 金字塔注意力 | → YOLO Neck 融合后的通道-空间重校准 | 中 | ⭐⭐ |
| SR 辅助训练 | → #5 P2 稀疏化训练增强（SR 头引导细节学习） | 中 | ⭐⭐⭐⭐ |
| Mamba Backbone | → ❌ 不推荐直接迁移（生态成本过高） | — | — |

---

## 8. 与已读论文的关系

| 论文 | 关系 |
|------|------|
| **DERNet** (arXiv 2026) | 同为全管线频域注入——DERNet: WDG(Backbone)+LGE(Neck)+FDHead(Head) vs FS-Mamba: FDGate(Backbone)+FPU(Neck)+PDFAM(Neck)+SR(训练)——DERNet 三阶段增强 vs FS-Mamba 四阶段(含训练辅助) |
| **SET** (CVPR 2025) | 同为"训练专用·推理零开销"范式——SET 辅助 loss 训后丢弃，FS-Mamba SR 头训后丢弃 |
| **YOLO-Master** (CVPR 2026) | 正交——YOLO-Master 做感受野维条件计算，FS-Mamba 做频率维特征增强 |
| **#11 高频能量判据** | FDGate 的可学习门控与 #11 免训练判据构成方法对照——同一目标（高频识别）的两种实现路线 |
| **MambaIR-YOLO** | 同 Mamba+YOLO 路线——但 MambaIR-YOLO 偏重超分辨率重建作为预处理，FS-Mamba 偏重频域解耦作为特征学习 |
| **HEdge-MamYOLO** | 同为 Mamba+频域——HEdge-MamYOLO 的 FM-CHFEM(频域+Mamba 协同高频增强)与 FS-Mamba FDGate 功能相似但架构不同 |

---

## 9. 与项目路线对照

```
FS-Mamba:  Mamba SSM + 频域门控(可学习) + SR辅助(训练专用)
    ↕
#11:      CNN YOLO + 频域判据(免训练) + P2稀疏化(推理节省)
    ↕
共享:      频域高通信息 → 小目标特征增强
分歧:      可学习门控 + Mamba生态 vs 免训练判据 + CNN生态
         SR辅助(增强·零推理) vs 稀疏化(节省·推理省算力)
```

---

## 10. 一句话总结

> FS-Mamba 首次将 Mamba SSM 全局上下文建模与频域解耦（FDGate 高通门控 + FPU 双门控保持 + PDFAM 注意力重校准）结合，并以训练专用 SR 辅助头实现零推理开销的小目标增强——其 FDGate 可学习频域门控与 #11 免训练频域判据构成方法对照，SR 辅助训练范式与 #5 Gumbel 训练-推理解耦共享哲学，但 Mamba Backbone 的生态不成熟使 CNN 等价迁移成为首要挑战。
