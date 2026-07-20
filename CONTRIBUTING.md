# Article Workflow

每篇文章使用稳定的小写 kebab-case `article-id`，并按“讨论沉淀 → 候选与评审 → 正式发布”推进。不要把 Agent 原始 transcript 或一次性 prompt 当作项目记录；把真正影响判断的内容整理进对应文件。

## 1. 讨论沉淀

运行 `./scripts/new-article.sh <article-id>` 创建工作区，然后完成：

- `work/<article-id>/brief.md`：目标、核心主张、目标读者、范围和验收标准。
- `outline.md`：论证顺序以及每一节承担的职责。
- `evidence.md`：公开来源、事实边界、推断和待验证声明。
- `open-questions.md`：尚未解决且会影响方向的问题。
- `iteration-log.jsonl`：每轮一行 JSON，记录日期、读者视角、改动和后续事项。

只有当 brief 和证据边界足够稳定时才进入候选阶段。

## 2. 候选与评审

候选放在 `candidates/<article-id>/`。每个版本应有明确而不同的读者或论证策略；不要为凑数量创建机械改写。目录内 `README.md` 必须说明版本定位和共同基线。

评审放在 `reviews/<article-id>/`：

- 每个评审视角一份简短 Markdown，只保留优点、风险、必须修改项和建议。
- `decision.md` 汇总所有意见，明确采纳、拒绝和理由，并指定 canonical 版本。
- 原始 Agent 输出、聊天 transcript、上下文 dump 和临时 prompt 不进入 Git。

候选稿和评审在文章发布后继续原位保留，以便复盘。

## 3. 正式发布

只有通过评审并在 `decision.md` 中选定的版本才能进入 `site/ideas/`。发布时：

1. 将最终稿整理为 `site/ideas/<article-id>.html`。
2. 更新 `site/ideas/index.html`；需要时更新 `site/index.html`。
3. 确保公开页面不链接 `work/`、`candidates/` 或 `reviews/`。
4. 运行 `./scripts/validate.sh` 和 `./scripts/preview.sh restart`。
5. 在根路径检查公开站点，并通过 `_workspace/` 并排检查工作材料、候选和评审。
6. 检查桌面与移动端后，正常提交并推送 `main`。

GitHub Actions 只部署 `site/`。仓库目录不是保密边界：public repo 中的工作材料仍可见。

## Iteration log 格式

```json
{"date":"YYYY-MM-DD","target":"article-id","reader":"specific reader background","changes":["change"],"followups":["follow-up"]}
```

历史记录只追加；除非修正事实错误，不重写旧行。
