# Dataset Knowledge Base
> 记录所有目标检测数据集及其特性。

## 通用
COCO | VOC | Objects365

## 小目标
VisDrone | UAVDT | TinyPerson

## 遥感
DOTA | DIOR | NWPU VHR-10

## 行人
CrowdHuman | CityPersons | WiderPerson

## 开放词汇
LVIS

## 特性对比
| Dataset | 类别数 | 图片数 | 小目标比例 | 用途 |
|---------|--------|--------|-----------|------|
| RS-STOD | 5(SV/LV/船/飞机/油罐) | 2,354(50,854实例) | 93% | 遥感小目标(0.4–2m 分辨率,新西兰土地网+Bing Maps)|
| AI-TOD | 8 | 28,036(700,621实例) | 极高(tiny) | 航拍微小目标基准 |
| Cityscapes / Foggy Cityscapes | 8 | 2,975 / 8,925 train | 中 | DAOD 跨天气基准 |
| SIM10k | 1(car) | 10,000 | 低 | 仿真→真实 DAOD |
| Clipart | 20(同VOC) | 1,000 | 低 | 跨风格 DAOD |
| NWPU VHR-10 | 10 | 800(640正+140负) | 中 | 遥感检测/FSOD 基准(Google Earth+ISPRS,常用 novel 划分:飞机/棒球场/网球场)|
| DIOR | 20 | 23,463(192,472实例) | 中高(0.4–30m 分辨率,800×800) | 遥感大规模基准/FSOD(常用 novel:飞机/棒球场/网球场/火车站/风车)|
| TinyPerson | 1(person) | 1,610(72,651实例) | 极高(海边远距人员) | 微小人员检测基准(AP50^tiny 分 tiny1/2/3 子档)|
| DOTA-v2.0 | 18 | 11,268 | 高 | 遥感旋转框大规模基准(RFLA 用其水平框协议)|

> 注:SEMA-YOLO 只用了 AI-TOD 的 2700/300 子集,其结果与全量 AI-TOD 文献不可直接比较。
> 注:FSOD 文献(如 SFIDM)常用 VOC2007 11-point mAP50 协议,与 COCO 协议数值不可互比。
> 注:AI-TOD 评估协议含 AP_vt(very tiny, 2–8px)/AP_t(8–16px)/AP_s/AP_m 分档——VisDrone 实验也建议报告此分档(RFLA 证明 AP_vt 是区分度最大的指标:baseline 普遍 ≈0)。
> RS-STOD 下载:https://github.com/lixinghua5540/STOD ;AI-TOD:https://github.com/jwwangchn/AI-TOD ;NWPU/DIOR:https://gcheng-nwpu.github.io/#Datasets
