# Risk Assessment

> 2026-07-16 更新：基于26篇论文阅读 + 17个Idea的系统风险评估
> 评分：1(低风险) → 5(极高风险)

---

## 一、核心 Idea 风险评估

### #5 语义熵引导的 P2 特征稀疏化（Rank#1, Score 4.0）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟢 2/5 | 查新已通过（2026-07-15）；ViCrop-Det 正交佐证；Token Cropr/SViT 均在不同维度 | Related Work 五线划界已就绪 |
| Engineering Risk | 🔴 4/5 | ①YOLO P2 头稀疏化无现成框架；②稀疏卷积在 GPU 上实际加速比存疑（memory-bound）；③动态掩码→batch 内样本间形状不一致 | ①先做静态剪枝→动态掩码渐进验证；②用 torch.sparse 或 masked conv2d；③统一 padding 或 per-sample forward |
| Dataset Risk | 🟡 3/5 | VisDrone 标注噪声（小目标漏标/错标→熵图误判）；COCO 小目标少不适合验证 | VisDrone 为主 + AI-TOD 备选；标注质量人工抽检 |
| Research Risk | 🟡 3/5 | ⚠️ **CLIP-Bias**: CLIP 特征天然歧视小目标(r=0.579)→语义熵门控可能系统性地误杀小目标 | ①温度缩放校正(CLIP-Bias 验证 +19.6% R@10)；②#11 频域门控作为并行判据；③消融：熵门控 vs 随机门控 vs GT 门控 |
| Publish Risk | 🟢 2/5 | 交叉 Gap 干净（VLM×实时检测×条件计算），三条线各自没做过 | 故事完整：问题→分析→方案→验证 |
| **Overall** | 🟡 **3.0/5** | 最大风险是 CLIP 偏差 + 工程实现 | **先做预实验验证熵图与GT小目标重合率（一次实验定生死）** |

### #15 三源门控融合：振幅×语义熵×高频能量（Rank#2, Score 3.8）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟢 1/5 | 三源信息融合做条件计算→无人做过（频域只做增强、语义只做后处理、空间只做注意力） | Related Work 清晰 |
| Engineering Risk | 🔴 5/5 | 三路信号同步、归一化、融合权重→调试空间爆炸；三源计算开销可能吃掉稀疏化收益 | ①渐进验证：#5(语义)→#11(频域)→#15(融合)；②共享预处理（FFT一次、CLIP嵌入一次） |
| Dataset Risk | 🟡 3/5 | 同#5 | 同#5 |
| Research Risk | 🟡 3/5 | 三源信号可能存在冗余（语义熵与高频能量在小目标上可能高度相关） | 先做三源信号相关性分析→确定融合方式(加权/乘法/级联) |
| Publish Risk | 🟡 3/5 | 三源融合故事可能太复杂，审稿人质疑"过度设计" | 消融实验必须严格证明每源独立贡献；适合大论文/期刊而非短文 |
| **Overall** | 🟡 **3.4/5** | 最大风险是工程复杂度 + 冗余 | 优先#5单独验证→#11单独验证→再考虑融合；**不适合作为第一个实验** |

### #7 语义熵图引导知识蒸馏（Rank#3, Score 3.7）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟢 2/5 | MOCHA 已做 VLM→YOLO 蒸馏但用均匀权重；熵加权蒸馏无人做 | MOCHA 作为技术基线引用，差异化清晰 |
| Engineering Risk | 🟡 3/5 | MOCHA Translation Module 开源可用；蒸馏框架成熟 | MOCHA 代码→修改 loss 权重计算模块 |
| Dataset Risk | 🟡 3/5 | 需要选择教师 VLM（CLIP/LLaVa/GPT-4V）并验证其文本嵌入质量 | 先用 CLIP（已有偏差认知）→备选 SigLIP |
| Research Risk | 🟡 3/5 | 熵加权蒸馏对小目标的增益可能被 CLIP 偏差抵消（同#5） | 蒸馏实验比稀疏化更容易做消融→先做蒸馏验证熵的有效性 |
| Publish Risk | 🟢 2/5 | 蒸馏+熵加权=改进有明确归因 | MOCHA 提供完整 baseline + ablation 模板 |
| **Overall** | 🟢 **2.6/5** | 风险可控 | **可作为#5的平行验证路线（蒸馏比稀疏化容易实现）** |

### #6 SLE（P2头+截短backbone）迁移 VisDrone（Rank#4, Score 3.5）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🔴 4/5 | SEMA-YOLO 已做 SLE；DM-EFS 已做 P2 动态特征复用；纯 SLE 迁移 novelty 低 | 必须与#12 KLD 分配绑在一起作为"P2 基线包"→不单独发表 |
| Engineering Risk | 🟢 1/5 | YOLO11 + ultralytics 框架→P2 头添加是标准操作 | YOLO11 YAML 配置改 backbone depth + head |
| Dataset Risk | 🟢 2/5 | VisDrone 是标准基准 | 直接可用 |
| Research Risk | 🟢 1/5 | SLE 已被 SEMA 在遥感数据集上验证有效 | 只需确认 VisDrone 上的迁移效果 |
| Publish Risk | 🔴 5/5 | 纯 SLE 迁移→任何审稿人都会说"incremental" | **不单独投稿**；作为#5/#7/#11 的 baseline ablation |
| **Overall** | 🟢 **2.6/5** | 工程风险极低 | **应最先做→作为后续所有 P2 实验的 baseline 基础设施** |

### #11 高频能量引导 P2 稀疏化（免VLM）（Rank#5, Score 3.4）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟡 3/5 | 频域+检测在 2025-2026 形成浪潮（4篇确认），但全部做特征增强→无人做条件计算 | "首个频域→计算资源分配"故事干净 |
| Engineering Risk | 🟡 3/5 | ①DFT/小波在 GPU 上的实际 wall-time 可能高于理论 FLOPs；②P2 分辨率最高→频域变换开销最大 | ①用 torch.fft（cuFFT 高度优化）；②只在 P2 做→面积虽大但通道数最少 |
| Dataset Risk | 🟡 3/5 | 同#5 | 同#5 |
| Research Risk | 🟡 3/5 | ⚠️ SET 发现"去高频帮小目标"→高频能量作前景判据可能反向错误 | **#11 判据修正**："高频能量局部异常度"取代"绝对高频能量"（小目标高频点状孤立 vs 背景高频规则分布） |
| Publish Risk | 🟡 3/5 | 频域+条件计算交叉→审稿人可能不熟悉任一方 | 需要充分铺垫频域基础（引用 SET/DERNet/FMC-DETR）|
| **Overall** | 🟡 **3.0/5** | 最大风险是 SET 反直觉发现的冲击 | **修正判据后与#5共用预实验→高频+熵双判据比较** |

### #16 Gabor核→P2频域门控（Rank#16, Score 3.0）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟡 3/5 | Gabor 核选型已被 D³R-DETR 验证(Gabor>Fourier>Haar)，但用于门控而非特征增强→差异化 | 作为#11/#13的频域工具备选，不独立成 Idea |
| Engineering Risk | 🟡 3/5 | Gabor 核 GPU 实现不如 FFT 成熟（cuFFT vs 手写 Gabor conv） | 先用 torch.fft 验证→有必要再优化 Gabor 实现 |
| Dataset Risk | 🟡 3/5 | 同#5 | 同#5 |
| Research Risk | 🟢 2/5 | D³R-DETR 已提供 Gabor>Fourier>Haar 的硬消融证据 | 频域工具选型→选 DFT（工程成熟）vs Gabor（性能更优） |
| Publish Risk | 🟡 3/5 | 作为#11的子方案→独立发表空间有限 | 并入#11作为频域工具选型 ablation |
| **Overall** | 🟢 **2.8/5** | 工具级备选 | 保持记录，不独立追踪 |

### #17 YOLO版ADR角度分布头（Rank#17, Score 2.8）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟡 3/5 | O² 在 DETR 上验证 ADR；YOLO 移植有工程价值但理论 novelty 低 | 若项目转向 OBB→优先级提升；否则作为技术储备 |
| Engineering Risk | 🟡 3/5 | ADR 分布建模→YOLO dense prediction head 的适配（DETR 用 set-based loss，YOLO 用 dense assignment） | O² 代码开源→分析 ADR 核心模块可移植性 |
| Dataset Risk | 🟢 2/5 | DOTA/DIOR-R 标准旋转检测基准 | 直接可用 |
| Research Risk | 🟢 2/5 | 角度分布在 O² 上已验证稳定 | 迁移到 YOLO 的 dense prediction→可能需调整分布参数化 |
| Publish Risk | 🔴 4/5 | "YOLO 移植 DETR 头改进"→典型的 incremental | 必须绑在更大的故事上（如"YOLO-OBB + 角度分布 + 小目标优化"完整方案）|
| **Overall** | 🟡 **2.8/5** | 低优先+低 novelty | 保留备选；若项目转向 OBB 则自动激活 |

### #8 尺度感知语义熵（分层 prompt）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟡 3/5 | 分层 prompt 在 VLM 领域常见但未进入检测 | 作为#5的增强方案→独立 novelty 不足 |
| Engineering Risk | 🟢 2/5 | 多尺度 prompt 嵌入离线计算→推理开销不变 | 直接可做 |
| **Overall** | 🟢 **2.4/5** | 可并入#5/#7 | 不独立追踪 |

### #9 GCP-ASFF vs AFPN 对照（Neck 选型实验）

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🔴 5/5 | 对照实验→零 novelty | **纯内部决策实验，不发表** |
| Engineering Risk | 🟢 1/5 | AFPN/GCP-ASFF 均有开源实现 | 配置级改动 |
| **Overall** | 🟢 **2.2/5** | 无风险（因为是纯内部决策） | #6 完成后顺手做 |

### #12 KLD 分布匹配分配迁移 P2

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| Novelty Risk | 🟡 3/5 | RFLA 在通用检测上验证 KLD；YOLO P2 + KLD 组合未见 | 作为#6的标签分配增强→不独立 |
| Engineering Risk | 🟢 2/5 | Ultralytics 框架支持自定义 label assigner | RFLA 代码参考 |
| **Overall** | 🟢 **2.4/5** | 低风险 | 与#6同批实验 |

---

## 二、非 Idea 层面风险

| Risk Type | Level | Detail | Mitigation |
|-----------|-------|--------|------------|
| 环境风险 | 🔴 5/5 | **无 GPU**（torch CPU 版）→所有训练实验无法执行 | ⏸ 暂缓；等待用户提供 GPU 或云实例 |
| 数据风险 | 🟡 3/5 | VisDrone 未提供；标注质量未验证 | ⏸ 暂缓；可先用 COCO 小目标子集做方法验证 |
| 时间风险 | 🟡 3/5 | 频域浪潮 4 篇论文确认→方向正在变热，窗口期有限 | 优先完成预实验方案设计→等到 GPU 立即执行 |
| 竞争风险 | 🟡 3/5 | ViCrop-Det 已占"熵引导计算分配"（DETR 推理级）；MOCHA 已占"VLM→YOLO 蒸馏" | **"YOLO 特征级 VLM 稀疏化"仍是空白**→#5 核心地位不变 |
| 基线漂移风险 | 🟢 2/5 | YOLO12(注意力 YOLO)和 YOLO26(STAL 未知)可能改变基线格局 | YOLOv12 已评估→无 P2→不威胁；YOLO26 待追踪 |

---

## 三、整体风险矩阵

| 维度 | 评分 | 说明 |
|------|------|------|
| 方向可行性 | 🟢 2/5 | P2 + 条件计算 + 小目标方向有 17 个 Idea 支撑，三条技术路线（语义/频域/蒸馏）互为备份 |
| Novelty 保障 | 🟢 2/5 | #5 查新通过；#11 差异化确认为"首个频域→计算分配"；频域浪潮 4 篇均不做条件计算 |
| 工程可行性 | 🔴 4/5 | 稀疏化在 YOLO 框架上的实现是最大工程挑战（动态掩码、batch 一致性、GPU 加速比） |
| 发表竞争力 | 🟢 2/5 | 交叉 Gap 干净；Related Work 五线划界已备齐；baseline 证据链完整 |
| 环境瓶颈 | 🔴 5/5 | **GPU 缺失→所有实验 blocked** |
| **Overall** | 🟡 **3.0/5** | 方向正确、novelty 有保障、工程有挑战、环境 blocked |

---

## 四、风险优先级行动清单

| 优先级 | 行动 | 目标 | 前置条件 |
|--------|------|------|----------|
| 🔴 P0 | 预实验方案设计 | #5 vs #11 一次实验定生死（熵图+高频图 vs GT 小目标重合率） | 仅 CPU 可做（只需推理，不需训练） |
| 🔴 P0 | GPU/数据集获取 | 解除环境瓶颈 | 用户提供 |
| 🟡 P1 | #6 SLE baseline 搭建 | P2 实验基础设施 | GPU |
| 🟡 P1 | MOCHA 代码复现 | #7 蒸馏基线验证 | GPU |
| 🟢 P2 | CLIP-Bias 温度校正预验证 | #5 偏差应对方案量化 | VisDrone + GPU |
| 🟢 P2 | 三源信号相关性分析 | #15 融合策略决策 | #5 + #11 预实验完成 |
| 🟢 P3 | #9 Neck 对照实验 | 内部决策 | #6 baseline 稳定后 |
| 🟢 P3 | YOLO26 STAL 追踪 | 评估对 #12 的威胁 | Ultralytics 公开细节 |

---

*Last Update: 2026-07-16 | Maintainer: Claude Code*
