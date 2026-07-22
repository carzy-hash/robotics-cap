# Code as Runtime: Open Questions

## Definition

- “Inference RL” 在本文中到底指在线搜索/选择、环境交互优化，还是某种具体的 RL 更新？名称是否应改成 `inference-time agentic collection`？
- Code as Runtime 的必要组件是什么？代码若不跨思考周期持久存在，是否仍属于本文范围？

## Data

- 训练数据保存完整事件流、结构化 decision summary，还是只保存工具调用和检查结果？
- 如何识别“成功但理由错误”的轨迹，避免 reward hacking 被蒸馏？
- 人工接管前后的片段如何归因、切分与标记？
- 怎样对失败数据采样，避免极端失败淹没正常策略学习？

## Learning

- SFT 的预测目标是下一子目标、下一技能调用、完整策略程序，还是多任务组合？
- 高层 SFT 与低层 action policy 更新是否分开进行？联合训练需要怎样的梯度/接口边界？
- 是否需要 DAgger 式再收集、offline RL、preference optimization 或 verifier training 才能处理分布偏移？

## Evaluation

- 最小硬件/任务矩阵是什么，才能区分“记住演示”与“学会恢复”？
- 怎样报告 robot-minutes、设备磨损、人工工时和云端推理成本？
- 哪些指标能揭示 SFT policy 相比在线 agent 的能力损失，而不只看平均成功率？

## Safety and governance

- 哪些决策必须由独立安全控制器覆盖，不能由 learned verifier 决定？
- 日志中的图像、语音、网络请求和人员信息如何脱敏？
- 轨迹、模型输出和人工修正分别拥有怎样的许可与署名？

## Publication

- 首个公开版本是否已有一条可回放的真机轨迹和 schema 示例？
- 何时从 Research Note 升级为 preprint：建议门槛为至少一个真实机器人原型、明确 baseline、一个关键消融和可报告的负面结果。
