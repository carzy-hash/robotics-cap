# Code as Runtime: Evidence

## Evidence policy

首版页面是路线提案，不用相关工作替代实验证据。每个技术主张应标注为：

- `Established context`：由公开资料直接支撑；
- `Design proposal`：本文提出的系统或数据设计；
- `Hypothesis`：需要实验验证；
- `Open question`：目前没有足够依据判断。

## Public-source buckets to collect

> 下列是检索方向，不是已经核验的正式引用。进入正文前逐条补齐作者、标题、年份、永久链接和支持边界。

### Robot learning from demonstrations and real-world data

- imitation learning / behavioral cloning 的分布偏移与数据覆盖。
- real-robot data collection、teleoperation、autonomous data collection。
- action chunking / hierarchical policy / skill library。

### Agentic and reasoning-time systems

- tool use、planning、verification、recovery 与 test-time compute。
- trajectory distillation / rejection sampling / self-training。
- 结构化 decision trace 与隐藏 chain-of-thought 的边界。

### SFT, preference and verifier training

- supervised fine-tuning from filtered trajectories。
- preference/ranking data from candidate executions。
- outcome/process supervision、reward modeling 和 verifier failure modes。

### Safety, governance and reproducibility

- robot safety metrics、human intervention reporting。
- visual/audio data privacy、provenance、consent 和 dataset documentation。
- hardware、controller、calibration、latency 与随机种子之外的复现信息。

## Claim ledger

| Claim | Type | Evidence needed | Current status |
| --- | --- | --- | --- |
| 结构化执行轨迹可以被转换为多种训练视图 | Design proposal | schema + conversion implementation | Draft only |
| 恢复轨迹可提高长时任务可靠性 | Hypothesis | controlled ablation | Unverified |
| 在线 agent 的能力可以通过 SFT 获得更低部署成本 | Hypothesis | capability/cost Pareto | Unverified |
| 失败轨迹对定向采集有价值 | Hypothesis | active vs. random collection | Unverified |
| 所有内部推理都应被记录并用于 SFT | Rejected claim | N/A | Outside scope |

## Evidence boundaries

- 相关语言模型或 agent 工作的结果不能直接证明其方法在真机机器人上成立。
- 仿真结果不能不加说明地替代真实机器人结果。
- 成功率不能单独代表安全、数据效率、延迟或泛化。
- 使用第三方 VLM/LLM 时，应固定可报告的模型版本、API 日期和采样配置。
- 如果只展示一个任务或一个机械臂，应称为 case study / prototype，不称为通用方法验证。

## Claims to verify before public release

- “Inference RL” 是否采用已有论文中的特定定义；若无统一定义，应明确为本文工作术语。
- Code as Runtime 与 Code as Policies、hierarchical policy、model-based planning、VLA-agent 和 robot harness 的差异。
- 保存和训练结构化 decision summaries 是否会引入敏感信息或不可复现依赖。
- 数据许可是否允许公开图像、视频、日志和模型生成内容。
