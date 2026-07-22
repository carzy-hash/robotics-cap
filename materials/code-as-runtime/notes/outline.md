# Code as Runtime: Focused Inference Architecture Outline

当前块只解释推理架构；SFT、RL、数据处理、相关工作和实验留给后续文章块。

## Thesis

`Observation → Thinking Agent → Decision → Action Queue → Robot`

在香蕉示例中，主 Agent 约 1Hz 审查一次动作是否仍然合适。它用代码构建 Action Chunk，也用代码生成并安装按任务所需频率或事件触发的 handler。一个 Action Chunk 可以跨越多个思考周期；只有阶段变化、动作失效或 queue 即将耗尽时，Agent 才需要执行新的 action-building code。

## Agent decision contract

- `CONTINUE`：显式审查结果；不生成动作，不修改 queue，只写入 trace。
- `EMIT`：主 Agent 生成并执行 action-building code，由代码构建 Chunk，并 append、replace tail 或 truncate 后写入。
- `RUN_ANALYSIS`：执行 SAM 3、多相机融合等 observation 处理，结果返回当前思考链路。
- `UPDATE_HANDLER`：主 Agent 写出代码，安装、修改或移除按频率或事件触发的 fast handler。

`CONTINUE` 仅在当前动作有效且 queue 余量充分时成立；余量不足时必须 `EMIT` 续接。

## Fast flow

- fast handler 不是第二个 Agent，而是主 Agent 留在 runtime 中的代码。
- 监听视觉、关节、力与触觉；具体触发频率由 Agent 按响应需求选择，香蕉示例使用 20Hz+，处理两次主思考之间 Agent 尚未检查的 observation。
- 可以 truncate、clear、overwrite、replace queue，也具备生成 Action Chunk 的完整能力。
- 香蕉示例只用它执行 TAP drop guard、力异常响应与快速稳定；正常任务动作主要来自主 Agent。
- 后续 RL 可以不鼓励 fast handler 生成 approach / grasp / transport / release，但架构上不将其设为非法。

## Banana timeline

1. `RUN_ANALYSIS + EMIT APPROACH`：SAM 3 和多相机融合后，主 Agent 发射覆盖数秒的 approach Chunk。
2. `CONTINUE`：一秒后的新观察确认轨迹仍合理，queue 不变。
3. `CONTINUE`：再次审查，queue 仍不变。
4. `EMIT GRASP`：near-banana observation 进入下一次主思考；Agent 替换 approach 尾部并发射 grasp。
5. `UPDATE_HANDLER`：抓取后安装 TAP guard；异常时 fast flow 清 queue 并稳定或回撤。
6. `EMIT TRANSPORT`：主 Agent 发射 move-to-bowl；中间观察可多次 `CONTINUE`。
7. `EMIT RELEASE`：主 Agent 确认碗位置和安全条件后发射 release。

每个阶段必须同时展示六项：new observation、Agent thought、generated / executed code、Action Queue effect、self-check、进入下一 turn 的条件。

## Long context anatomy

- 固定内容：task 与 safety contract。
- 最新输入：当前多相机 observation、proprio、force / tactile。
- 选择性 history：少量关键帧与最近 2–4 次 decision / thought 摘要，而不是整段视频。
- 可执行状态：queue 已执行前缀、remaining horizon、last truncate。
- 活跃代码：analysis functions、fast handlers 与版本。
- 工具结果：SAM 3 mask、融合 pose、TAP 统计等 stdout。

每次主 Agent 醒来都重新审查这些内容。`CONTINUE` 也必须记录 reason 与 self-check，后续 turn 才能知道上一轮为什么没有改动作。

## Visual direction

- Canonical：Nervous System。
- 模块图使用圆角计算图，强调主 Agent 写出 action-building code 与 fast-handler code。
- 香蕉 trace 使用紧凑 execution ledger。
