# 主流机器人操作流水线与 CAP：Evidence

## Primary sources

- [RT-2 project](https://robotics-transformer2.github.io/)：把视觉、语言与动作统一为 VLA，目标是利用视觉语言预训练知识完成机器人控制。
- [Open X-Embodiment / RT-X](https://robotics-transformer-x.github.io/)：来自 21 个机构、22 种机器人、527 种技能的标准化跨机器人数据与 RT-X 实验。
- [OpenVLA](https://openvla.github.io/)：7B 开源 VLA，使用 Open X-Embodiment 中约 97 万条机器人轨迹训练。
- [π0 paper](https://www.physicalintelligence.company/download/pi0.pdf)：预训练 VLM 加连续动作专家，以 Flow Matching 生成连续动作。
- [DROID](https://droid-dataset.github.io/)：使用遥操作设备，在 564 个场景收集约 7.6 万条、350 小时真实机器人示范。
- [LIBERO](https://libero-project.github.io/main.html)：面向持续机器人学习和知识迁移的仿真操作基准，包含四组共 130 个任务及遥操作示范。
- [RoboCasa](https://robocasa.ai/)：厨房场景的大规模仿真训练与评测框架，包含人工和自动生成示范。
- [Isaac Lab](https://developer.nvidia.com/isaac/lab)：支持强化学习、模仿学习、运动规划、并行仿真和域随机化的机器人学习框架。

## What these sources support

- 现代通用机器人策略常把视觉、语言和动作放入同一模型或紧密连接的模型栈。
- 真实遥操作示范、跨机器人数据混合以及仿真数据是常见数据来源。
- 动作既可被离散化为 token，也可由连续动作专家生成一段动作轨迹。
- 仿真常用于训练、基准评测、扰动测试和低成本扩大数据，但不能替代真机验证。

## CAP design claims, not established results

- 用 AR 模型生成可执行策略程序会比直接生成动作提供更多有效监督。
- 监督目标、约束、检查点和恢复分支会缩短问题定位时间。
- 在仿真中围绕显式端点生成反事实失败，可以改善真机恢复能力。
- 策略程序比动作序列更容易跨机器人迁移。

这些必须通过同数据、同动作底座、同硬件预算的对照实验验证。
