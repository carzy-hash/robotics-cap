# Robotics CAP evaluator suite

这组 evaluator 在文章进入公开发布前执行独立检查。它们既可作为人工评审清单，也可直接交给评审 Agent。Evaluator 只报告问题，不修改正文、引用、脚本或发布配置。

## 选择 evaluator

根据改动范围运行对应文档：

- [`article-content.md`](article-content.md)：检查仓库描述、文章开场、读者定位、术语和论证顺序。
- [`research-evidence.md`](research-evidence.md)：检查主张、引用边界、实验状态、可证伪性和安全声明。
- [`publication-repository.md`](publication-repository.md)：检查公开入口、中英文版本、仓库结构、发布门槛和 Pages artifact。

如果一次改动跨越多个范围，分别运行 evaluator。不要把三个分数平均成一个总分。任何一个 evaluator 返回 `FAIL`，整次发布即为 `FAIL`。

## 使用共同输入

每个 evaluator 至少读取以下文件：

- 本次改动的 diff。
- 对应文章的 `brief.md`、`outline.md`、`evidence.md` 和 `decision.md`。
- 准备发布的 HTML、CSS、JavaScript 和本地资源。
- `README.md`、`CONTRIBUTING.md`、`scripts/` 与 `.github/workflows/` 中和发布有关的文件。

只评价实际读取的内容。文件缺失时，记录缺失项，不推测文件可能包含什么。

## 使用共同结论

每个 evaluator 只能返回以下结论之一：

- `PASS`：没有阻塞项，得分不低于 85，文章可进入下一阶段。
- `PASS_WITH_CHANGES`：没有阻塞项，得分为 70 到 84，修正列出的必改项后再发布。
- `FAIL`：存在任一阻塞项，或得分低于 70。

阻塞项优先于分数。即使总分超过 85，只要页面把设计提案写成已验证结果，结论仍必须是 `FAIL`。

## 提供可复核证据

每条发现必须包含：

1. 严重级别：`P0`、`P1` 或 `P2`。
2. 证据：文件路径、行号、页面元素或命令输出。
3. 影响：读者会误解什么，或发布流程会漏掉什么。
4. 必要修正：最小可接受改动。
5. 验收方法：修正后如何证明问题已经消失。

严重级别含义如下：

- `P0`：会造成错误发布、错误研究结论、安全误导或无法访问主要内容。
- `P1`：显著降低理解、可信度、可复现性或发布质量。
- `P2`：不阻塞发布，但值得在后续版本改进。

不要用“可以优化”“建议加强”这类无法验收的表述。说明要改哪一处，以及什么结果算完成。

## 使用统一输出格式

Evaluator 使用以下 Markdown 结构：

```markdown
# Evaluation: <target>

## Verdict

- Result: PASS | PASS_WITH_CHANGES | FAIL
- Score: <0-100>
- Blocking findings: <count>
- Evaluated revision: <commit or working-tree description>

## Findings

### [P0] <finding title>

- Evidence: <path:line or command output>
- Impact: <specific consequence>
- Required correction: <smallest acceptable change>
- Acceptance check: <how to verify>

## Scorecard

| Criterion | Score | Maximum | Reason |
| --- | ---: | ---: | --- |
| ... | ... | ... | ... |

## Release recommendation

<one direct paragraph>
```

如果没有发现问题，在 `Findings` 中写 `No findings.`。不要为填满结构而制造问题。

## 保存评审结果

把评审结果放在被评文章的 review 目录中：

```text
reviews/<article-id>/evaluations/
  article-content.md
  research-evidence.md
  publication-repository.md
```

评审结果应记录 commit SHA。文章改变后，旧评审只代表旧版本，不自动沿用。
