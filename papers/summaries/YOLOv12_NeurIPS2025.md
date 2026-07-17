# YOLOv12: Attention-Centric Real-Time Object Detectors

- **论文**: YOLOv12 | NeurIPS 2025 (arXiv: 2502.12524)
- **作者**: Tian, Ye, Doermann
- **代码**: https://github.com/sunsmarterjie/yolov12
- **阅读日期**: 2026-07-16
- **状态**: ⚡ 快速评估 (非完整阅读协议)

## 一句话总结
首个注意力中心YOLO框架,用Area Attention(A²)+R-ELAN替代CNN为主的模块,匹配CNN系速度的同时提点。**无P2头、无小目标专项优化、FlashAttention硬依赖**→不构成基线切换。

## 核心方法

### Area Attention (A²)
- 特征图按等分切为l段(l=4),每段内做self-attention
- 感受野为原始的1/4,复杂度从2n²hd降至½n²hd
- 7×7可分离卷积作Position Perceiver替代位置编码

### R-ELAN
- 块级残差连接 + 重新设计特征聚合(瓶颈结构)
- 大模型(L/X)必须加残差+极小缩放因子(0.01)才收敛

## 小目标
- AP_small: N=20.2%, S=29.8%, M=35.7%, L=36.9%, X=39.6%
- 提升归因于注意力的大感受野,无非P2或其他小目标专项设计

## 与本项目关系
- **不切换基线**: ①无P2头→SLE(#6)无法直接迁移;②FlashAttention依赖(Turing+ GPU)→本机CPU无法复现;③小目标无专项优势
- **基线决策**: YOLO11不变,待YOLO26提供更多轻量/小目标优化证据后再评估
- **参考价值**: A²的条带注意力模式可借鉴到#5的P2稀疏化(条带内熵一致性判据)
