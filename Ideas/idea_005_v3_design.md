# Idea#5 v3.0: 语义熵引导 P2 特征稀疏化 — 代码级设计

> v2.0 → v3.0 细化 | 2026-07-17
> 范围:伪代码 + 模块接口 + 张量形状 + ultralytics 集成点 + FLOPs 纸面预算
> ⚠️ 本文档为**纯设计文档**,不含任何已运行的实验;所有数值为纸面推导估算,待实验模块就绪后验证

---

## 〇、v2.0 → v3.0 的关键决策落地

| v2.0 遗留的开放问题 | v3.0 决策 | 依据 |
|---|---|---|
| 语义熵从哪层特征计算? | **P3 特征计算 → 双线性上采样至 P2 分辨率**(变体 E-P3↑,免新参数) | 因果顺序:门控图必须在 P2 分支计算**之前**可得;P3 由 backbone 天然产出;P2 上加嵌入头(变体 E-P2)作 ablation |
| 物体嵌入怎么取? | **复用 YOLOE 重参数化分类头的 logits**(`K' = R(f_θ(P)) ⊛ Kᵀ` 已合并进 cls 分支) | YOLOE RepRTA:推理时 cls 分支输出即"每 anchor × K 类相似度",零额外前向 |
| 硬门控还是软门控? | **训练 Gumbel-Sigmoid 软门控 + 推理硬阈值** | SViT 验证 Gumbel 端到端可训;推理硬化才有真实 FLOPs 节省 |
| 被剪 token 置零还是保留? | **保留(残差直通)+ LLF 复活** | SViT Token Preserving(-4.6→-0.3 AP 的关键)+ Token Cropr LLF |
| 稀疏度固定还是自适应? | **图像级自适应(SViT 式 batch 平均正则)**,目标稀疏度 t 为超参 | SViT 动态率 +0.2 AP;VisDrone 场景密度差异大 |

---

## 一、整体数据流(张量形状标注)

输入 640×640,基座 YOLOE-11s(P2 改造版,#6 SLE 截短 backbone):

```
Image (B,3,640,640)
  │ Backbone (截短, #6 SLE)
  ├─→ F_P2 (B,128,160,160)   ← stage2 输出,未经 neck
  ├─→ F_P3 (B,256, 80, 80)
  └─→ F_P4 (B,512, 40, 40)
        │
        │ ① SemanticEntropyGate(F_P3) ──────────────┐
        │    cls_logits (B,K,80,80)                  │
        │    → H (B,1,80,80) → upsample              │
        │    → G_soft (B,1,160,160) ∈ [0,1]          │
        │                                            ↓
        │ ② SparseP2Branch(F_P2, G)          G_hard (B,1,160,160) ∈ {0,1}
        │    neck C3k2 + head conv 仅前景计算         (推理时)
        │    被剪位置:残差直通                        │
        │                                            │
        │ ③ LLFRevive(F_P3, G): 被剪区用 P3↑ 填充    │
        ↓
  PAN Neck (P2'+P3+P4) → Detect Head (3 检测层: P2/P3/P4)
```

---

## 二、模块 1:SemanticEntropyGate

### 2.1 接口

```python
class SemanticEntropyGate(nn.Module):
    """从 P3 分类 logits 计算语义熵图,上采样为 P2 门控图。

    Args:
        k_classes:   词表类别数 K(YOLOE 文本嵌入数;VisDrone 微调后 K=10)
        tau_thresh:  熵阈值 τ ∈ (0,1),初始 0.5,可学习
        beta:        sigmoid 锐度 β,固定 10.0
        alpha:       温度缩放尺度系数 α ∈ [-0.2,0.2](CLIP-Bias 校正),可学习
        tau_base:    基础温度,YOLOE 默认对齐温度
        target_sparsity: 目标稀疏度 t(被剪比例),默认 0.7
    新增参数量: 2 个标量(τ, α)——近零参数
    """
    def forward(self, cls_logits_p3, training: bool):
        # cls_logits_p3: (B, K, 80, 80) — 复用 YOLOE cls 分支输出,零额外前向
        # returns: G (B,1,160,160), H (B,1,80,80)  [H 供可视化/L_gate/蒸馏#7]
```

### 2.2 前向伪代码

```python
def forward(self, cls_logits_p3, scale_prior=None, training=True):
    B, K, H3, W3 = cls_logits_p3.shape

    # (1) 温度缩放(CLIP-Bias 校正): 小目标区域温度调低 → 抵消置信度压低
    #     scale_prior: (B,1,H3,W3) 可选,来自 P3 objectness 或感受野尺寸先验
    #     v3.0 baseline: scale_prior=None → tau = tau_base(退化为全局温度)
    tau = self.tau_base * (1 + self.alpha * scale_prior) if scale_prior is not None \
          else self.tau_base

    # (2) 归一化语义熵  H ∈ [0,1]
    p = softmax(cls_logits_p3 / tau, dim=1)              # (B,K,80,80)
    H = -(p * (p + 1e-8).log()).sum(1, keepdim=True) / math.log(K)

    # (3) 上采样到 P2 分辨率
    H_p2 = F.interpolate(H, scale_factor=2, mode='bilinear')  # (B,1,160,160)

    # (4) 门控
    logit = (H_p2 - self.tau_thresh) * self.beta
    if training:
        G = gumbel_sigmoid(logit, hard=True)   # 前向硬 0/1,反向 straight-through
    else:
        G = (H_p2 > self.tau_thresh).float()   # 推理硬阈值
    return G, H
```

> **判据方向说明**(v2.0 已定):高熵 = 模型不确定 = 可能存在难判别的小目标 → **保留计算**;低熵 = 确定(明确背景或明确大目标,P3/P4 已能处理)→ 剪。E0.2 预实验(⏸ 待实验模块)将验证该方向在 VisDrone 上成立;若反向(小目标呈现低熵尖峰),门控翻转为 `1-H`,接口不变。

### 2.3 Gumbel-Sigmoid(工具函数)

```python
def gumbel_sigmoid(logit, hard=True, tau_g=1.0):
    g1, g2 = -torch.log(-torch.log(torch.rand_like(logit))), \
             -torch.log(-torch.log(torch.rand_like(logit)))
    y_soft = torch.sigmoid((logit + g1 - g2) / tau_g)
    if hard:
        y_hard = (y_soft > 0.5).float()
        return y_hard + y_soft - y_soft.detach()   # straight-through
    return y_soft
```

---

## 三、模块 2:SparseP2Branch

### 3.1 训练路径(掩码计算,方案 A)

```python
class MaskedBlock(nn.Module):
    """包裹任意 P2 分支 block(C3k2 / Conv),训练时按 G 掩码 + 残差保留。
    SViT 原则 (i) Token Preserving: x ← M⊙Block(x) + (1−M)⊙x
    """
    def __init__(self, block: nn.Module, channels: int):
        self.block = block
        self.proj = nn.Identity() if block 输入输出同形 else nn.Conv2d(c_in, c_out, 1)

    def forward(self, x, G):            # x:(B,C,160,160), G:(B,1,160,160)
        return G * self.block(x) + (1 - G) * self.proj(x)
```

- FLOPs 训练时**不节省**(全量计算后掩码)——训练目的只是让网络适应稀疏模式
- 被剪位置经 `proj` 直通 → 检测头仍能看到弱信号(SViT: 硬删除是 DynamicViT 崩溃根因)

### 3.2 推理路径(gather/scatter,方案 B)

```python
class SparseBlockInfer(nn.Module):
    """推理专用: 只对前景位置计算。与 MaskedBlock 共享权重,导出时切换。"""
    def forward(self, x, G_hard):
        B, C, Hh, Ww = x.shape
        idx = G_hard.flatten(2).squeeze(1).bool()          # (B, H*W)
        out = self.proj(x)                                  # 背景直通(1×1, 便宜)
        for b in range(B):                                  # 部署时 B=1,无循环开销
            fg = x[b, :, idx[b].view(Hh, Ww)]               # gather 前景 token
            fg = self.block_as_pointwise(fg)                # 见 3.3 限制
            out[b, :, idx[b].view(Hh, Ww)] = fg             # scatter back
        return out
```

### 3.3 工程限制与对策(诚实记录)

| 问题 | 说明 | 对策 |
|---|---|---|
| 3×3 卷积不可直接 gather | 空间邻域被打散 | ① 前景掩码**膨胀 1 像素**后 gather 成 patch(submanifold 卷积思想);② 或 P2 分支改用 1×3+3×1 可分离/1×1 为主的 block(需消融) |
| batch 内稀疏模式不一致 | GPU 上难并行 | 部署场景 B=1(无人机端侧),训练用方案 A 不受影响 |
| 掩码卷积训练≠稀疏推理数值一致 | 膨胀边界差异 | 训练后期(最后 10 ep)switch 到膨胀掩码微调 |
| **风险(v2.0 已列, 4/5)**: GPU 实际不加速 | 稀疏 kernel 开销 | 里程碑序:先证精度与理论 FLOPs ↓(masked conv 报告),再做 spconv/Triton 优化;论文主 claim 用理论 FLOPs。**2026-07-17 更新(HashEye 印证)**:HashEye(SciRep 2026)实测论证 masked conv 不省时、稀疏 kernel warp divergence,其**稠密重排**(gather 幸存区域成稠密张量→跑稠密 kernel→scatter)在 Jetson 上净赚 5.25×(预处理占 53% 延迟仍划算)→ 方案 B 推理路径定稿为稠密重排式 gather/scatter,弃逐点稀疏 kernel |

---

## 四、模块 3:LLFRevive(误剪兜底)

```python
class LLFRevive(nn.Module):
    """Token Cropr LLF: 被剪 P2 位置用 P3 上采样特征复活。
    新增参数: 仅 1×1 conv (256→128): 32.8K params
    """
    def __init__(self, c_p3=256, c_p2=128):
        self.reduce = nn.Conv2d(c_p3, c_p2, 1)

    def forward(self, p2_out, f_p3, G):
        revive = F.interpolate(self.reduce(f_p3), scale_factor=2, mode='bilinear')
        return G * p2_out + (1 - G) * revive     # 只填被剪区,不逆转稀疏收益
```

**v3.1 预留(不进首发)**:SViT 式可学习再激活——在 P2 分支中段插入第二个门控(2-layer MLP),允许被初筛剪掉的 token 重新激活(= Idea#22 多阶段门控)。首发保持单门控 + LLF,复杂度可控。

---

## 五、损失函数(代码级)

```python
# 挂载点: ultralytics v8DetectionLoss 扩展
L_total = L_det + λ_s * L_sparse + λ_g * L_gate

# (1) 稀疏度正则 — SViT 动态率版(batch 平均后再罚,允许 per-image 波动)
L_sparse = ( G.mean() - (1 - target_sparsity) )**2        # 标量; λ_s = 4.0 (SViT 同款)

# (2) 门控-GT 对齐(弱监督, 可选, 首发 λ_g=0 关闭)
#     用 GT 小目标框栅格化为 M_gt (B,1,160,160): 框内=1
L_gate = F.binary_cross_entropy(G, M_gt, weight=M_gt*w_pos + (1-M_gt))
#     开启条件: 若消融显示纯稀疏正则下小目标召回损失 >1% → 打开 λ_g=0.5
```

超参默认表:`target_sparsity=0.7, λ_s=4.0, λ_g=0(→0.5), β=10, τ_thresh init 0.5(可学习), tau_g: 5.0→0.5 线性退火(30ep)`

> **2026-07-17 补充(SPA, ICLR 2026)**:GT 框栅格化 selection label + BCE 监督门控已有顶会先例(SPA 用 α=0.01,远小于本表 λ_g=0.5)→ λ_g 若开启,扫描范围改为 {0.01, 0.1, 0.5};另 SPA 的 packing(选中 token 打包固定容器)证明**训练期**也能真实省算力——masked conv 训练(方案 A)的升级选项,列为 v3.1 预留。

---

## 六、ultralytics 集成点(逐文件)

| 文件 | 改动 | 量级 |
|---|---|---|
| `ultralytics/nn/modules/entropy_gate.py` | 新增:`SemanticEntropyGate` / `MaskedBlock` / `LLFRevive` / `gumbel_sigmoid` | ~200 行,新文件 |
| `ultralytics/nn/tasks.py` | `parse_model()` 注册三个新模块名;`DetectionModel.forward` 支持门控图跨层传递(P3 cls → P2 分支,存 `self._gate_cache`) | ~30 行 |
| `ultralytics/cfg/models/11/yoloe-11s-p2sparse.yaml` | 新配置(见 6.1) | 新文件 |
| `ultralytics/utils/loss.py` | `v8DetectionLoss.__call__` 末尾加 `L_sparse`(读 `model._gate_cache`) | ~15 行 |
| `ultralytics/engine/trainer.py` | Gumbel 温度退火 callback(`on_train_epoch_start`) | ~10 行 |

### 6.1 yaml 草案(核心段)

```yaml
# yoloe-11s-p2sparse.yaml — #6 SLE 截短 backbone + #5 稀疏 P2
backbone:
  # [from, repeats, module, args]
  - [-1, 1, Conv,  [64, 3, 2]]           # 0-P1/2
  - [-1, 1, Conv,  [128, 3, 2]]          # 1-P2/4
  - [-1, 2, C3k2,  [256, False, 0.25]]   # 2      ← F_P2 源
  - [-1, 1, Conv,  [256, 3, 2]]          # 3-P3/8
  - [-1, 2, C3k2,  [512, False, 0.25]]   # 4      ← F_P3 源
  - [-1, 1, Conv,  [512, 3, 2]]          # 5-P4/16
  - [-1, 2, C3k2,  [512, True]]          # 6
  - [-1, 1, SPPF,  [512, 5]]             # 7      ← SLE: 截去 P5 stage
head:
  - [4, 1, EntropyGateSource, []]                    # 8: 取 P3 cls logits → G
  - [[2, 8], 1, MaskedC3k2, [128, False]]            # 9: 稀疏 P2 分支
  - [[9, 4, 8], 1, LLFRevive, [128]]                 # 10: 兜底
  # ... PAN 融合 P2'(10)/P3(4)/P4(7) → Detect [P2,P3,P4]
```

> 注:`EntropyGateSource` 需要 P3 的 cls logits,而标准 yaml 中 cls 在 Detect 内——实现上让 Detect 的 P3 cls 分支前置共享(重参数化后它就是一个 1×1 conv 栈,可提取为独立节点)。这是集成的最大工程点,预计 ~50 行 tasks.py 特判。

---

## 七、FLOPs 纸面预算(估算,待验证)

按 YOLO11s-P2 改造版、640 输入、P2 分支(neck C3k2 128ch @160×160 + head 分支)估算:

| 项 | 公式 | 估算值 |
|---|---|---|
| P2 分支稠密 FLOPs | C3k2(128,160²) + Detect-P2 分支 | ~6.5 GFLOPs(约占全模型 30%,P2 分辨率是 P3 的 4×) |
| 门控开销 | softmax+熵(K=10, 80²) + 上采样 | ~0.003 GFLOPs(**可忽略,复用 cls 前向**) |
| LLF 开销 | 1×1 conv 256→128 @80² + 上采样 | ~0.42 GFLOPs |
| **净节省 @ t=0.7** | 6.5×0.7 − 0.42 | **~4.1 GFLOPs(全模型约 −19%)** |
| **净节省 @ t=0.5** | 6.5×0.5 − 0.42 | ~2.8 GFLOPs(约 −13%) |

新增参数:LLF 32.8K + 门控标量 2 ≈ **0.033M(全模型 +0.35%)**。

> ⚠️ 以上为结构公式推导(卷积 FLOPs = 2·C_in·C_out·K²·H·W),未运行任何 profiler;YOLO11 各 stage 精确通道数以 ultralytics yaml 为准,待实验模块就绪后用 `model.info()` 校准。

---

## 八、验证点对接(全部 ⏸ 待实验模块)

| 里程碑 | 验证内容 | 对应 v2.0 实验编号 |
|---|---|---|
| M0 | 熵图方向性:H@GT小目标 vs H@背景 显著差异 | E0.1–E0.2 |
| M1 | τ 扫描 ROC,AUC>0.7;CLIP-Bias 偏差量化 | E0.3–E0.4 |
| M2 | MaskedBlock 训练收敛,AP_s 不低于 #6 SLE baseline −0.3 | A1 |
| M3 | 理论 FLOPs −15% 以上且 AP_s 持平 | A2–A4 |
| M4 | (可选)稀疏推理 kernel 实测加速 | 部署阶段 |

---

## 九、v3.0 状态与遗留

- ✅ 已定:门控信号源(P3 cls logits 复用)、训练/推理双路径、保留+LLF 兜底、损失与超参默认值、集成点清单、FLOPs 预算
- 🔲 遗留(需实验数据才能定):熵判据方向(M0)、τ/α 初值(M1)、3×3 卷积稀疏化方案①vs②(M3 消融)、λ_g 是否开启
- 🔲 v3.1 预留:SViT 式再激活第二门控(=#22)、#11 高频双判据 OR 融合(=#15 前身)

---

## 十、Related Work 划界:Dome-DETR(2026-07-17 补,B轨查新裁决连带要求)

> Dome-DETR(arXiv 2505.05741, USTC)是 #5 的**跨架构最近邻**——「判据热图→二值掩码→浅层特征稀疏化」通路与 #5 同构,且同打 VisDrone/小目标。B轨衍生 #5-D 已被其判死([裁决](detr_derivative_novelty_check.md)),#5(YOLO 载体)不受影响,但论文 Related Work **必须先手引用消毒**。划界四轴:

| 轴 | Dome-DETR | #5 v3.0 |
|---|---|---|
| 架构载体 | D-FINE(DETR 系),稀疏化的是 encoder token 的窗口注意力 | YOLOE(CNN 系),稀疏化的是 **P2 卷积分支的空间计算**——CNN 特征级条件计算,token selection 社区未覆盖(SPA/SViT 均 ViT 系) |
| 判据 | DeFE 学习头:0.8M 参数 + GT 高斯密度图监督 + DRFL 专用损失,跨数据集需重训 | **语义熵,零新增判据参数**(复用 YOLOE cls logits),免密度标注;LLF 兜底 |
| 判据语义 | 密度(哪里目标多) | **语义不确定性(哪里模型拿不准)**——正交信息维度,密度低但难例区仍被保留 |
| 成本叙事 | GFLOPs +37%(加浅层特征换精度、稀疏化控成本) | P2 本已在 baseline(#6 SLE)中,门控是**净减法**(纸面 −19% P2 分支 FLOPs)——与 Dome"控增量"定位相反,叙事不冲突反而互补 |

**RW 段落草案(英文,写论文时直接用)**:
> *Dome-DETR [cite] recently demonstrated that a density heatmap can drive masked window attention sparsification on shallow DETR features. Our work differs in three aspects: (i) we target the convolutional P2 branch of a CNN detector, where token-selection techniques do not directly apply; (ii) our criterion is semantic entropy reused from the classification logits — parameter-free and annotation-free, whereas DeFE requires 0.8M parameters, Gaussian density supervision and a dedicated loss; (iii) our gating is a net computation reduction over a P2-equipped baseline, rather than a cost-control mechanism for newly added features.*

⚠️ 概念红线提醒(与 B轨共享):「密度引导 token 稀疏」(Dome)、「learnable (frequency) gating」(UAV-DETR)、「学习式 token importance」(Dynamic DETR)已被占——#5 表述统一落「**熵引导的空间计算分配**(entropy-guided spatial computation allocation)」。

---

*Last Update: 2026-07-17 (补 §十 Dome 划界) | 上游: idea_005_v2_design.md | 素材: YOLOE(RepRTA/LRPC) + SViT(保留/再激活/动态率) + Token Cropr(LLF) + CLIP-Bias(温度缩放) + Dome-DETR(跨架构划界)*
