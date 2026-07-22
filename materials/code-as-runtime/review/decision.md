# Code as Runtime: Decision

## Canonical selection

选择 `../article/index.html` 作为材料包内的 canonical 视觉版本。选择范围仅覆盖架构文章的视觉方向与阅读结构；发布仍需通过下列内容评审。

## Publication gate

- [ ] 核心术语与系统边界稳定。
- [ ] 至少有一条脱敏的真实轨迹 schema 示例。
- [ ] 关键背景引用已逐条核验。
- [ ] 原型状态、缺失结果和限制明确可见。
- [ ] 机器人学习、安全/数据治理、系统工程三个视角完成评审。
- [x] `decision.md` 已记录 canonical 选择，`article/` 作为唯一 GitHub Pages 发布入口。

## Review decisions

| Feedback | Source perspective | Decision | Destination | Rationale |
| --- | --- | --- | --- | --- |
| 保留版本 B，移除候选切换与读者不可见脚手架 | Editorial review | Accepted | `../article/index.html` | B 的认知中心与反射路径最贴近主 Agent 写出两类代码的核心论点。 |
