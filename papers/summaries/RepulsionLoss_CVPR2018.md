# Repulsion Loss: Detecting Pedestrians in a Crowd

> **Venue**: CVPR 2018 | **Authors**: Xinlong Wang, Tete Xiao, Yuning Jiang, Shuai Shao, Jian Sun, Chunhua Shen (旷视 Face++ / 同济大学 / 阿德莱德大学)
> **类型**: 🔬 深读（经典补读·密集遮挡 L2） | **日期**: 2026-07-18
> **关联 Idea**: #35 频域遮挡先验 / #36 语义熵隐式遮挡检测器 / DOMino-YOLO OAR-Loss 演化线

---

## 一、问题与动机

### 核心问题：密集人群中的遮挡导致检测器失效

在密集场景（行人聚集、互相遮挡）中，标准检测器面临两类系统性错误：

1. **漏检（Missed Detection）**：预测框被相邻的「错误」目标吸引而偏移，随后被 NMS 抑制
2. **误检（False Positive）**：预测框与相邻非目标物体高度重叠，产生高置信度假阳性

**数据支撑**：CityPersons 上 ~60% 遮挡由人群间互相遮挡造成，~20% 假阳性来自 crowd errors。

### 旧方法缺陷
- 需要像素级标注（如分割 mask）来建模遮挡 → 标注成本高
- 仅依赖 NMS 后处理而非训练期解决 → 治标不治本
- 无损失函数层面对「预测框不应与错误目标重叠」的显式约束

---

## 二、核心创新：排斥损失（Repulsion Loss）

### 设计哲学
> 磁力吸引-排斥类比：预测框应被**吸引**到指定 GT（L_Attr），同时被**排斥**远离其他 GT（L_RepGT）和其他预测框（L_RepBox）。

### 完整公式

$$L = L_{Attr} + \alpha \cdot L_{RepGT} + \beta \cdot L_{RepBox}$$

默认 α = 0.5, β = 0.5。

---

### 2.1 L_Attr（吸引力 — 标准回归）

标准 Smooth_L1，预测框 `B^P` 向其分配的目标 GT `G^P_Attr` 回归：

$$L_{Attr} = \frac{\sum_{P \in P_+} \text{Smooth}_{L1}(B^P, G^P_{Attr})}{|P_+|}$$

---

### 2.2 L_RepGT（对 GT 的排斥力）

**排斥对象**：除指定目标外，与当前 proposal 的 IoU 最大的那个 GT：

$$G^P_{Rep} = \arg\max_{G \in G \setminus \{G^P_{Attr}\}} \text{IoU}(G, P)$$

**关键设计 — 使用 IoG 而非 IoU**：
- IoU = area(B∩G) / area(B∪G)，优化时模型可放大 B 来增大分母 → 降低 loss（作弊）
- IoG = area(B∩G) / area(G)，分母固定 → 唯一途径是减小 area(B∩G) → 真正排斥

$$\text{IoG}(B, G) \triangleq \frac{\text{area}(B \cap G)}{\text{area}(G)} \in [0, 1]$$

$$L_{RepGT} = \frac{\sum_{P \in P_+} \text{Smooth}_{\ln}(\text{IoG}(B^P, G^P_{Rep}))}{|P_+|}$$

**Smooth_ln**（对 (0,1) 区间的稳健损失函数，σ ∈ [0,1) 调节敏感度）：

$$\text{Smooth}_{\ln}(x) = \begin{cases} -\ln(1-x), & x \leq \sigma \\ \frac{x-\sigma}{1-\sigma} - \ln(1-\sigma), & x > \sigma \end{cases}$$

---

### 2.3 L_RepBox（对框的排斥力）

降低来自**不同 GT 分配**的预测框之间的 IoU，缓解 NMS 阈值敏感性：

$$L_{RepBox} = \frac{\sum_{i \neq j} \text{Smooth}_{\ln}(\text{IoU}(B^{P_i}, B^{P_j}))}{\sum_{i \neq j} \mathbb{1}[\text{IoU}(B^{P_i}, B^{P_j}) > 0] + \epsilon}$$

核心思想：不同目标的预测框互相推开 → NMS 前分布更清晰 → 降低 NMS 误杀率。

---

## 三、消融实验（CityPersons，Faster R-CNN + ResNet-50）

| 配置 | Reasonable MR⁻² | Heavy MR⁻² | Partial MR⁻² | Bare MR⁻² |
|------|:--------------:|:----------:|:------------:|:---------:|
| Baseline | 14.6 | 60.6 | 18.6 | 7.9 |
| +RepGT only | 13.7 (−0.9) | 57.5 (−3.1) | 17.3 (−1.3) | 7.2 |
| +RepBox only | 13.7 (−0.9) | 59.1 (−1.5) | 17.2 (−1.4) | 7.8 |
| +RepGT + RepBox | **13.2 (−1.4)** | **56.9 (−3.7)** | **16.8 (−1.8)** | 7.6 |
| +Multi-scale (×1.5) | **10.9** | **52.9** | **13.4** | 6.3 |

### 关键发现
- **RepGT 对 Heavy 遮挡增益最大**（−3.1），证明排斥远离错误 GT 是遮挡核心解
- **RepBox 对 Partial 遮挡增益更大**（−1.4 vs −1.3），证明框间排斥减轻 NMS 误杀
- **Bare 子集几乎无改善**（7.9→7.6），证明 RepLoss 精准作用于遮挡而非无差别提升
- **两者联合效果叠加**（14.6→13.2, −1.4），非冗余

---

## 四、跨数据集泛化

### Caltech-USA（行人检测）

| 方法 | IoU=0.5 MR⁻² | IoU=0.75 MR⁻² |
|------|:----------:|:-----------:|
| Baseline | 5.6 | 28.7 |
| +RepLoss | **4.0** | **23.0** |

IoU 阈值升高时优势扩大 — RepLoss 提升定位精度。

### PASCAL VOC 2007（通用检测）

| 场景 | Baseline mAP | +RepGT mAP |
|------|:----------:|:--------:|
| Crowd 子集（同类 IoU > 0.1）| 38.7 | **40.8 (+2.1)** |
| 全测试集 | — | +1.0 |

**证明 RepLoss 可泛化至通用目标检测的密集场景**。

---

## 五、局限与可改进之处

1. **需要额外超参数** α/β/σ → 后续工作（如 OAR-Loss）的自动化方向
2. **RepBox 计算 O(N²)** 在密集 proposal 场景下开销大 → 可采样或基于空间哈希加速
3. **仅作用于 box 回归**，分类分支未利用排斥信号 → 分类置信度与定位质量的 misalignment 问题
4. **IoG 对极度重叠 (IoG→1) 的排斥力有界**（Smooth_ln 截断）→ 极端遮挡仍需更强约束
5. **对遮挡程度的感知是被动的**（仅靠 IoU 阈值），无显式遮挡先验 → #35 频域判据可补充

---

## 六、与项目的关系

### 对 DOMino-YOLO OAR-Loss 的奠基作用
- OAR-Loss = RepLoss + Visibility-Weighted Classification → RepLoss 是 OAR-Loss 的直接前身
- OAR-Loss 需要 VOD-UAV 五级遮挡标注，RepLoss **无需任何遮挡标注** → #35 频域遮挡先验的目标：保持免标注 + 引入显式遮挡感知

### 对 #35 频域遮挡先验的启发
- RepLoss 证明「排斥远离相邻 GT」是有效的遮挡处理策略 → #35 的方向：用频域判据**自动识别遮挡区域**，对遮挡区施加更强的 RepGT 权重（自适应 α_occ > α_free）
- 频域判据作为 RepLoss 权重调节器的上游输入，不改变 RepLoss 公式本身

### 对损失函数设计的通用启示
- **IoG vs IoU 的设计洞察**：分母固定→避免 cheat gradient — 这一原则可推广到任何 overlap-based loss
- **训练期解决 NMS 问题**：RepBox 在训练期提前布局，降低推理时 NMS 的误杀 → #5 P2 门控也有类似哲学（训练期学会跳过、推理时直接省算力）

---

## 七、可研究方向（≥3 个）

1. **频域自适应 RepLoss**：用高频能量图识别遮挡区域 → 遮挡区 α↑（加大排斥力）→ 非遮挡区 α↓（减少不必要的排斥惩罚）。比 uniform α 更精细，且无需额外标注
2. **RepBox 高效化**：当前 O(N²) 两两计算 → 基于空间哈希或 KNN 的近似排斥（仅对「可能冲突」的框对计算 RepBox），使 RepBox 可部署到密集 anchor 的一阶段检测器
3. **分类-回归一致性增强**：RepLoss 仅改善定位 → 将 IoG 排斥信号反馈给分类分支（如「高 IoG 预测框的分类分数应被惩罚」），解决「定位好但分高」的 NMS 后假阳性
4. **YOLO 一阶段适配**：RepLoss 原为两阶段 Faster R-CNN 设计 → 适配 YOLO 的 anchor-free + 密集预测范式（需解决 proposal 替代品、RepBox 计算爆炸、与 TAL 标签分配的兼容性）
