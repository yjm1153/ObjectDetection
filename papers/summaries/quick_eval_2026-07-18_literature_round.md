# 快速评估: 2026-07-18 文献检索轮(跟踪项三连裁决 + 双轨新作扫描)

> 检索维度: YOLO P2/稀疏门控、DETR token/条件计算、频域、轻量化、遥感UAV、知识蒸馏(6 路并行)
> 本轮核心: **Dome-DETR 放码(ACM MM 2025 接收)** + Unmasking the Tiny 见刊细节 + 3 篇需划界新作

---

## 一、跟踪项状态变更(3 项全部有进展)

### 1.1 🔴→✅ Dome-DETR 放码 + ACM MM 2025 接收确认(重大利好)

- **状态**: 代码开源 https://github.com/RicePasteM/Dome-DETR ;论文正式接收 **ACM MM 2025**(此前记录为 arXiv 2025.05)
- **放出内容**: 完整 PyTorch 实现(D-FINE 底座,Python+CUDA+C++)、**S/M/L 三档预训练权重**(HuggingFace,含训练日志)、AI-TOD-v2 + VisDrone2019 双数据集支持(附 visdrone2coco 转换工具)
- **新数字**: Dome-DETR-S = AI-TOD 32.1 / VisDrone 35.9(论文报告的是更大档 34.6/39.0)
- **官方自认限制**: 动态 query 数量 → **每 GPU 仅支持单批训练**(#30 实验设计时需注意同样约束)
- **对 #30 的影响**:
  - **E1(判据 vs DeFE 头对头,生死项)从"按论文复现对照"升级为"官方代码对照"** — 可信度大幅提高,工程成本大幅下降
  - MWAS 实现细节可直接复核(此前只能按论文推断)→ #30 "token 稀疏结构照抄 Dome"的控制变量原则可落到代码级
  - venue 从 arXiv 升级为 ACM MM 2025 → 对照对象的分量更重,#30 若胜出说服力更强
- **行动**: #30 方案 §5/§6 已同步;⏸ 代码细读(MWAS/DeFE 模块)待实验模块启动时执行

### 1.2 Unmasking the Tiny 正式见刊 — 方法细节补全,#5 划界加固

- **状态**: 正式发表 **Image and Vision Computing Vol.172, 2026**(DOI: 10.1016/j.imavis.2026.106026);GitHub 仓库**仍是占位 README**(承诺 accept 后放码,但已见刊仍未放 → 跟踪保留但降频)
- **方法细节(本轮新获)**:
  - 核心洞察: 小目标漏检根因是 **foreground score 被背景主导特征抑制,而分类语义仍然 robust**
  - **STSM**(Sparse Token Selection Module): 粗剪枝,保留"有微弱初始信号"的候选前景 token
  - **FRM**(Foreground Refinement Module): 从分类特征蒸馏语义注意力图,token 自适应参考语义相似邻居 → **恢复被抑制的前景分数**
  - YOLOX 系;VisDrone/UAVDT SOTA(具体数字仍需全文)
- **#5 三轴划界复核(维持并加固)**:
  | 轴 | Unmasking the Tiny | #5 |
  |---|---|---|
  | 目的 | **召回恢复**(把弱信号 token 补强救回) | **算力分配**(把确定的背景跳过) |
  | 判据信号 | 检测器自身前景分数(弱信号挖掘) | VLM 语义熵(不确定性度量) |
  | 机制方向 | token **补强**(选中的做加法) | token **跳过**(选不中的做减法) |
  - 两者方向相反(它做加法/我做减法),同一特征图上甚至可以共存 → **威胁等级降级: 哨点→普通近邻**;RW 引用时按此三轴表述

### 1.3 HF-DETR 全文仍不可获取 — SSMG 裁决继续悬置

- IEEE SPL Vol.33 pp.1245–1249(2026-03-04 刊出),付费墙,无 arXiv 镜像
- 官方摘要确认三组件: FSD-Stem(**LoG 算子**早期边缘分离)/ FEFR-Encoder(小波逆投影重建)/ **SSMG "enforces token sparsity to suppress cluttered backgrounds"**
- 摘要措辞无法判定 SSMG 判据是可学习微门还是免监督统计 → **#30 撞车裁决维持悬置,跟踪继续**(方案 §6 风险 5 不变);LoG=S1 工具佐证再+1

---

## 二、需划界新作(3 篇)

### 2.1 FSDETR(IJCNN 2026)— 频域 DETR 浪潮第 7 篇 ⚡

- arXiv 2604.14884(2026-04);代码开源 github.com/YT3DVision/FSDETR
- RT-DETR-R18 基座: SHAB(空域分层注意力)+ DA-AIFI(可变形 AIFI)+ **FSFPN/CFSB(可学习 2D-DFT 频域滤波×空域边缘提取)**
- VisDrone: AP50 40.5 / **APs 13.9**(超 D-FINE-M 13.0/RT-DETRv2 12.7),14.7M(较基线 -26.5%);TinyPerson AP50_tiny 48.95
- **判定: 纯增强范式**。可学习频域滤波落"learnable frequency gating"已占区;不做 token 条件计算 → **不威胁 #30,反而是"频域增强拥挤/条件计算空白"gap 的第 7 个证据**。消融显示 FSFPN 贡献最大(+1.2 APs)=高频信息对小目标价值再证。
- 收录价值: 频域线计数+VisDrone APs 对比数据点(#30 E0 基线参照)

### 2.2 HI-MoE(arXiv 2604.04908, preliminary)— 条件计算的"专家维度"邻居 ⚡

- DETR(DINO 基座)两级 MoE: scene router 选场景一致专家子集 → instance router 给每 query 分配少量专家
- COCO 53.0 vs DINO 51.3,**+3.3 APs**;消融证 hierarchical > token-level-only / instance-only
- **判定: 与 #30 正交划界** — ①稀疏维度不同: MoE 在**专家/容量维**做条件计算,#30 在**token 空间维**;②判据不同: 学习式路由 vs 免监督统计;③自认 preliminary draft("支持进一步实验验证"),数字未定稿
- 关注价值: "条件计算利好小目标"(+3.3 APs)与 Dome(+2.5~3.3)相互印证 = **#30 通路侧翼佐证**;若后续版本扩展到 token 级路由需回读

### 2.3 MFVL-YOLO(Physica Scripta 2025.06)— 熵×频域×小目标三要素同现,须划界 ⚠️

- YOLOv10: 空域多尺度 + 频域高频增强 + **熵引导前景判别** + 统计约束损失 + 共享检测头
- VisDrone +3.1 mAP50 / +3.5 mAP50:95;NWPU 验证
- **判定: 与 #5 划清** — 其"熵引导"用于**增强前景/背景判别**(特征做加法),非熵引导的**空间计算分配**(#5 概念红线表述的价值再次显现);频域部分为增强非判据;无 P2 内稀疏化。低影响力期刊(Physica Scripta),不构成查新威胁,但 RW 检索时会撞关键词 → 记入 #5 近邻清单,引用时用三要素表述划界
- 侧面价值: 熵+高频两判据在同一模型中共存有效 → #15(三源门控)侧翼佐证

---

## 三、数据点条目(不深入,记录即用)

| 论文 | Venue | 关键数字/信息 | 服务对象 |
|---|---|---|---|
| **PRNet** | arXiv 2510.09531 | Progressive Refinement Neck+ESSamp 细节保留下采样;**VisDrone AP50 54.1(24.6M)/1024 输入 61.0 = 当前检索所见最高**;轻量版 49.9@7.77M | sota.md 刷新;#6 Neck 选型参照 |
| **FFKD-Net** | JRTIP 2026 | MobileNetV3+SE+多尺度融合+分层蒸馏 HKDM;**VisDrone 47.7 mAP50 @仅3.0M** | #7 蒸馏侧强参照(轻量+KD 上限证据) |
| **Scale-Conscious KD** | IEEE(TGRS线)2025.11 | MSFD 尺度解耦蒸馏+SAOD 按目标面积动态加权 — 直击"大目标主导蒸馏梯度、小目标被抑制"问题 | **#7 直接相关**: 语义熵加权 vs 面积加权 = 天然对照消融 |
| **DisDop** | arXiv 2605.24639 | RemoteCLIP+DINOv3 多级域先验蒸馏→轻量检测器;DIOR/DOTAv2 SOTA | #7/#18 谱系(基础模型→检测器蒸馏浪潮) |
| **ADD-Net** | DSP 2026 | RT-DETR 系+动态采样+单头注意力 gating sparsity+混合 KD;VisDrone 41.0(+4.7),参数-29.3% | "gating sparsity"细节付费墙,从摘要判断为可学习注意力内稀疏(已占区);低强度关注 |
| **HFSP-YOLO** | IEEE 2026.04 | **P2 信息利用第三路线**: Space-to-Depth 将 P2 细节无损注入 P3,避免 P2 头开销 | #5/#6 相关: P2 路线图新增分支(加头/头内稀疏/**注入 P3**);划界: 仍是静态结构,无输入自适应 |
| **SO-DETR** | IJCNN 2025 | 双域(空+频)hybrid encoder+KD;VisDrone/UAVVaste | 频域线计数项 |
| **SDD-YOLO** | arXiv 2603.25218 | YOLO26 系+P2 头,anti-UAV 地对空 | P2 侧计数项("加P2头"路线再+1) |
| **HierLight-YOLO** | arXiv 2025.09 | YOLOv8+HEPAN 分层扩展路径聚合,VisDrone tiny(4px 级) | 计数项 |
| **HA-DETR** | SciRep 2026 | decoder 自注意力→卷积自交互模块;48.4 AP@68FPS(V100),RT-DETR-R18 +1.9AP+13%提速 | B轨算力证据库(decoder 侧冗余又一证) |

**gap 状态复核**: 本轮 YOLO P2 侧新作(SDD/HFSP/HierLight/LAF 系)仍全部为"加 P2 头/注入"路线,**无人做 P2 内空间条件计算 → #5 gap 第 N+2 次确认**;DETR 侧条件计算仅 HI-MoE(专家维)与 Dome(密度判据)→ **#30 免监督频谱判据空白维持**。

---

## 四、本轮结论

1. **Dome 放码 = #30 最大利好**: E1 生死项获得官方对照物;ACM MM 2025 venue 确认使对照叙事分量更重
2. **#5 哨点降级**: Unmasking the Tiny 细节证实其为"补强式"(加法),与 #5"跳过式"(减法)方向相反 → 威胁降级,共存可能
3. **双 gap 均维持**: 频域增强范式第 7 篇(FSDETR)/P2 加头路线 N+2 篇,两条空白带继续无人进入
4. **#7 获新对照轴**: Scale-Conscious KD 的面积加权 vs #7 语义熵加权 = 现成消融设计
5. 撞车窗口估计不变(频域 DETR ~6-7 篇/年);下轮检索重点: HF-DETR 全文渠道、HI-MoE 正式版、Dome 代码细读(⏸实验模块)
