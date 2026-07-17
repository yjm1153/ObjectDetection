# Data Augmentation Knowledge Base
> 每读一篇论文必须更新。记录数据增强方法。

## 几何变换
Random Flip | Random Crop | Random Scale | Random Rotate | Random Translate

## 色彩变换
HSV | Brightness | Contrast

## 高级增强
Mosaic | MixUp | CutMix | Copy-Paste

## 小目标/UAV 专用增强(2025+)

### DCC — Dynamic Class-balanced Copy-paste(AD-Det, Remote Sensing 2025)🆕 首篇填充
> 针对传统 copy-paste 在 UAV 图像失效的两大原因(多样性不足+位置不合理)给出的目标级重采样方案,**仅训练期,零推理开销**

| 组件 | 机制 | 作用 |
|------|------|------|
| DA 多样性增强 | 每个尾类一个容量 10 的 FIFO 记忆库;实例裁剪带 1.5× bbox 扩展保留上下文;粘贴前 shift-scale-rotate + 随机亮度对比度 | 防止重复重采样同一实例导致过拟合 |
| DS 动态搜索 | 从 ASOE 簇中心(=目标分布中心)BFS 搜索粘贴位置;与现有 GT 的二值 mask 校验不重叠;以待贴框宽高为自适应步长 | 位置合理性——贴在目标聚集区而非随机背景 |

- 效果:VisDrone AP 35.3→35.9;尾类(bicycle/tricycle/awning-tricycle/bus)AP +0.9~1.9;不损害头部类
- 消融:DA 单独 +0.3 AP(AP_S +0.4);DS 再 +0.3 AP
- 关键洞察:**copy-paste 的收益瓶颈在"贴哪里"而非"贴什么"**——位置先验(目标分布簇中心)是 UAV 场景 copy-paste 生效的前提

### 同期相关(检索所得,未深读)
- **场景理解式实例级增强**(IEEE TAES 2025):inpainting+tagging+SAM+姿态估计联合建模实例-背景关系,解决贴图的光照/视角/尺度不真实问题;VisDrone mAP@0.5:0.95 +1.6 —— DCC 的"真实感"互补路线
- **Copy-paste 用于稀缺目标扩充**(Drone-vs-Bird IJCNN 2025 冠军方案):copy-paste 扩充无人机/鸟类稀缺样本 + 多尺度分块推理

## 适用场景
小目标 | 遥感 | 通用 | **长尾类不平衡(DCC)**

## 改进方向
- 与 #6 (SLE baseline) 结合:训练期对 VisDrone 尾类加 DCC 式增强,零推理开销的免费涨点(待实验模块就绪)
- DCC 均匀采样 → 实例级难例挖掘加权采样(AD-Det 作者自述的未来方向)
- 贴图真实感:DCC(位置合理) × 场景理解式增强(外观真实)——两条正交改进线尚无人融合

---
*Last Update: 2026-07-16 | 来源: AD-Det(RS 2025)深度阅读*
