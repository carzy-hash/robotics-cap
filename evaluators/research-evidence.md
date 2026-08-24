# Research evidence evaluator

## 目标

判断每项公开主张是否具有正确的证据边界。这个 evaluator 不判断文章是否写得优美，也不把相关工作的结果当作 Code as Runtime 的实验结果。

## 输入

读取以下内容：

- 目标文章及 `references.html`。
- 对应的 `evidence.md`、`open-questions.md`、`iteration-log.jsonl` 和 `decision.md`。
- 文章引用的公开来源。只有在能够访问原始论文、项目页或正式数据集说明时，才确认来源支持范围。
- 与实验、频率、延迟、成功率、数据规模、安全和性能有关的 diff。

无法访问来源时，把该引用标为 `Unverified`。不要根据标题推断论文结论。

## 主张分类

把每项重要主张归入以下一类：

- `Established context`：公开来源直接支持的背景事实。
- `Design proposal`：本文提出的架构、数据结构或训练方法。
- `Hypothesis`：需要实验比较才能判断的效果主张。
- `Open question`：当前没有足够依据作答的问题。
- `Measured result`：仓库提供实验协议、数据和可复核结果的主张。

如果主张无法归类，要求作者改写主张。不要创建新的模糊分类。

## 阻塞条件

出现以下任一情况时返回 `FAIL`：

- 把相关论文证明的局部构件写成完整 Code as Runtime 已被验证。
- 使用“提高”“降低”“更安全”“更高效”或“优于”等效果结论，却没有可复核实验。
- 把仿真结果写成真机结果，或没有明确标出二者边界。
- 把 illustrative 数字写成 measured 数字。
- 公开页面省略会改变结论的失败条件、负面结果或安全限制。
- 引用不存在、链接指向错误工作，或引用内容不能支持相邻主张。
- 页面宣称已通过 publication gate，但 `decision.md` 仍有未完成的阻塞项。
- 把模型隐藏思维链当作必须记录或公开的训练数据。

## 评分

总分为 100 分。

### 主张账本，25 分

检查以下问题：

- 每项核心主张是否有明确分类。
- 公开页面的措辞是否与分类一致。
- `evidence.md` 是否记录证据需求和当前状态。
- 一个主张改变后，引用边界和未决问题是否同步更新。

### 引用质量，20 分

检查以下问题：

- 引用是否指向原始论文、正式项目页或数据集说明。
- 作者、标题、年份和永久链接是否完整。
- 引用是否放在它支持的具体句子旁。
- 参考文献页是否明确声明组合设计仍待验证。

### 可证伪性，20 分

检查以下问题：

- 每个效果假设是否给出 baseline、指标和失败条件。
- 实验计划是否能区分 Code as Runtime 的贡献与底层 VLA、控制器或视觉模型的贡献。
- 页面是否报告成本、延迟、人工介入和失败率，而不只报告成功率。
- 文章是否说明什么结果会推翻当前路线判断。

### 数据与因果边界，20 分

检查以下问题：

- trace 是否区分 recorded、derived 和 projected 字段。
- 每个 policy 输入是否在决策时间之前可用。
- human intervention、simulation ground truth 和 teacher residual 是否与策略输入隔离。
- SFT、preference、verifier 和 RL reset 是否从同一可重放记录派生。

### 安全与限制，15 分

检查以下问题：

- 独立安全控制器是否拥有不可被模型覆盖的权限。
- handler 的触发条件、队列修改权限和取消语义是否明确。
- 真实数据的隐私、许可、署名和人工接管是否进入记录。
- 文章是否就地显示限制，而不是只在参考文献页末尾说明。

## 评审步骤

1. 从标题、摘要、图题、表格和结论中提取效果主张。
2. 为每项主张分配分类，并记录原文位置。
3. 检查相邻引用是否直接支持该主张。来源不可访问时标为 `Unverified`。
4. 对每项 `Hypothesis` 查找 baseline、指标、实验条件和否证条件。
5. 对每项 `Measured result` 查找数据、命令、日志或结果文件。缺少任一关键材料时降回 `Hypothesis`。
6. 对照 `decision.md` 的 publication gate。
7. 按 `evaluators/README.md` 的格式输出结论。

## 输出要求

除共同输出外，增加主张账本：

```markdown
## Claim ledger

| Claim | Classification | Evidence | Status | Required action |
| --- | --- | --- | --- | --- |
| ... | Established context | <source> | Verified | None |
| ... | Hypothesis | <experiment needed> | Unverified | Add falsification test |
```

`Status` 只能使用 `Verified`、`Partially verified`、`Unverified` 或 `Contradicted`。
