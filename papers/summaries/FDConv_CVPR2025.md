# FDConv: Frequency Dynamic Convolution for Dense Image Prediction

- **论文**: FDConv | CVPR 2025 (arXiv: 2503.18783)
- **作者**: Linwei Chen, Lin Gu, Liang Li, Chenggang Yan, Ying Fu
- **代码**: https://github.com/Linwei-Chen/FDConv
- **阅读日期**: 2026-07-16
- **状态**: ⚡ 快速评估 (非完整阅读协议)

## 一句话总结
在傅里叶域学习频率多样化卷积核(FDW),替代空间域动态卷积,以 +3.6M 参数达到比 +90M CondConv 更好的性能。**不做条件计算/稀疏化。**

## 核心方法

### FDW (Fourier Disjoint Weight)
- 将k×k×Cin×Cout参数按L2范数从低频→高频排序后均匀分为n=64组
- 每组通过IFFT变换到空间域→64个频率多样化的卷积核(余弦相似度≈0)
- 仅+3.6M参数(vs CondConv 4× +90M)

### KSM (Kernel Spatial Modulation)
- 局部通道分支(1D conv)+全局通道分支(FC)→预测稠密调制矩阵
- 逐元素调制卷积核权重

### FBM (Frequency Band Modulation)
- 4个频带(八度分割)+每频带独立空间调制图(标准卷积+sigmoid)
- 等价简化: 分解输入特征→各频带与完整核卷积

## 与 #11 的关系
- **不做条件计算**: KSM对所有权重元素做稠密调制,FBM在所有空间位置预测调制值→无gating/dropping
- **不做稀疏化**: 无选择性计算跳过
- **频率信息的用途**: 构造更好的卷积核(频率→参数空间),而非判据(频率→计算决策)
- **结论**: 不威胁 #11 的 novelty;可作为 Related Work 引用(频率域方法的另一条路线)

## 值得借鉴
- FDW的"不相交频率索引分组"思想→#11 可以做"不相交频率带的独立稀疏化判据"
- FBM的频率分解+空间调制→#11 的技术方案参考
