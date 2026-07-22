# Code as Runtime 文章材料包

这是后续准备相关文章时使用的完整材料包。GitHub Pages 只部署其中的 `article/`；其余原始方案、审阅入口和写作记录不会出现在公开入口。

## 目录

- `sources/original-architecture-notes.md`：完整原始方案，包含双原语、异步运行时、RL、采集改造、视觉上下文、训练规模与相关工作。
- `article/index.html`：Code as Runtime 的 canonical Architecture Note，以主 Agent、两类代码、共享 Action Queue 和香蕉七阶段 trace 为核心。
- `article/context.html`：Context Note，描述主 Agent 每轮获得的 cache-aware 多模态上下文、粘性历史图像采样和 token 预算。
- `article/training.html`：Runtime Trace RL，描述 on-policy runtime rollout、verifier/progress reward、信用分配，以及作为辅助的 teacher 冷启动。
- `article/data.html`：Real-data Trace SFT，描述从连续多频率真机采集、事件账本与伪时间回放，构造因果有效的多轮 SFT 样本。
- `article/assets/`：文章视觉资源。
- `review/index.html`：本地审阅封面，链接正文与提纲。
- `review/decision.md`：视觉选择和发布门槛。
- `notes/`：brief、outline、evidence、open questions 与 iteration log。

## 使用方式

准备后续文章时，优先从 `sources/` 选择论点，再参考 `notes/` 的证据边界；当前公开系列分别解释 runtime 架构、context 构建、Runtime Trace RL 和 Real-data Trace SFT，仍不代表已经完成实验验证。
