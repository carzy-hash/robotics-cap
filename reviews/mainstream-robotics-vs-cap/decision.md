# 主流机器人操作流水线与 CAP：Decision

## Canonical selection

不原样采用单一候选。以 Candidate B 的“看示范 / 写工单”叙事和篇幅为主体，吸收 Candidate A 的数据、评测、仿真边界，以及 Candidate C 的四模块架构、typed action API、六类监督端点和公平实验约束，形成新的 canonical HTML。

## Review decisions

| Feedback | Source | Decision | Destination | Rationale |
| --- | --- | --- | --- | --- |
| 使用红杯任务和工单类比 | General reader | Adopted | 开头与全文主线 | 最容易让非专业读者记住差别。 |
| 不把主流路线写成完全没有规划或安全模块 | General + robotics | Adopted | 主流流水线边界说明 | 保持对强基线的公平描述。 |
| 首次出现时用白话解释 VLA 和 Action Chunk | General reader | Adopted | 模型章节 | 术语不能成为理解主线的门槛。 |
| 加入最小过程记录链 | ML systems | Adopted | CAP 数据章节 | 说明过程数据不是自由文本日志。 |
| 区分规则、物理传感器与模型判断的可信度 | ML systems + robotics | Adopted | 监督端点章节 | 防止把模型自评当作世界真值。 |
| 仿真和真机共享 typed action API | ML systems | Adopted | 仿真章节 | 明确可执行接口和 sim-to-real 边界。 |
| 明确低频策略与高频控制分工 | Robotics | Adopted | CAP 模型形态章节 | 避免误解为语言模型进入实时伺服环。 |
| CAP 安全、恢复、诊断和迁移写成已证优势 | All reviewers | Rejected | 全文 | 当前仅是需要公平实验验证的假设。 |
| 把 Candidate C 全文作为正文 | Robotics | Partially adopted | 工程落地专栏 | 技术精确但不满足“任何人都听得懂”。 |
| 只发布 Candidate B | General reader | Partially adopted | 叙事骨架 | 易读，但需要补足工程契约和主流路线边界。 |
