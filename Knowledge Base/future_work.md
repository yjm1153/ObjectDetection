# Future Work Tracker
> 任何新Idea立即加入，永久保存，不要只放上下文。

| # | Idea | 来源 | 价值 | 难度 | 预计实验 | 状态 |
|---|------|------|------|------|----------|------|
| 1 | SLE(P2头+截短backbone)迁移到 YOLO11+VisDrone | SEMA-YOLO | 高(强baseline) | Easy | VisDrone 训练对照 | 候选 |
| 2 | 熵引导的 P2 特征稀疏化(原型熵替代VLM) | SEEN-DA×SEMA 交叉 | 高(双痛点互解) | Hard | VisDrone+AI-TOD | 候选 |
| 3 | 尺度感知语义熵(分层prompt) | SEEN-DA | 中 | Medium | 需YOLO-World基座 | 候选 |
| 4 | GCP-ASFF vs AFPN 同基准对比 | SEMA-YOLO + 已有Idea#1 | 中(排除实验) | Easy | VisDrone neck 替换 | 候选 |
| 5 | 语义熵图引导蒸馏(VLM教师→YOLO11n学生) | SEEN-DA | 高(轻量化方向) | Hard | 蒸馏 pipeline | 候选 |
| 6 | RFA-ASFF 协同机制分析 | SEMA-YOLO | 中(分析型论文) | Medium | 梯度/特征谱分析 | 候选 |
| 7 | P2头 + RFLA 高斯感受野标签分配 | SEMA-YOLO + RFLA | 中 | Medium | VisDrone | 候选 |
| 8 | 高频能量引导的 P2 稀疏化(免 VLM,#5 备胎/对照) | SFIDM | 高(风险对冲) | Medium | VisDrone 预实验与#5共用 | 候选 |
| 9 | KLD/高斯分布匹配分配迁移 VisDrone P2 头 | SFIDM + RFLA | 中(#6增强件) | Easy | 与#6同批实验 | 候选 |
| 10 | 特征级频域分解替代图像级 DFT | SFIDM 弱点 | 中 | Medium | 需查 FcaNet/FreqFusion | 观察 |
