# Publication and repository evaluator

## 目标

判断仓库能否把经过评审的版本稳定地发布为唯一、可访问、可回滚的公开 artifact。这个 evaluator 检查构建、发布和仓库边界，不重新评价研究主张。

## 输入

读取并检查以下内容：

- `README.md` 和 `CONTRIBUTING.md`。
- `scripts/new-article.sh`、`scripts/validate.sh`、`scripts/preview.sh` 和 `scripts/publish.sh`。
- `.github/workflows/` 下的发布与检查配置。
- Pages 实际上传的目录。
- 公开目录中的 HTML、CSS、JavaScript、图片和语言版本。
- `work/`、`candidates/`、`reviews/`、`materials/` 和历史站点目录之间的边界。
- 本次改动的 git status、diff 和目标 commit。

运行 evaluator 时，优先使用仓库已有命令。命令失败时，保存退出码和错误，不用推测代替结果。

## 阻塞条件

出现以下任一情况时返回 `FAIL`：

- GitHub Actions 可以绕过 `scripts/validate.sh` 直接部署。
- publication gate 未完成，但 workflow 仍会把该版本部署到正式 Pages。
- Pages artifact 包含内部工作材料、候选稿、评审 prompt、上下文 dump 或敏感数据。
- 公开首页的主要内容只有 JavaScript 执行后才出现，且没有静态正文或 fallback。
- 任一主要页面、语言切换或本地资源链接损坏。
- README 描述的线上内容与 workflow 实际部署目录不一致。
- 中英文页面缺失对应版本，或语言切换指向错误页面。
- 构建结果依赖未提交文件、开发机绝对路径或无法复现的手工复制。
- 发布后没有可识别的 commit 或 tag，因而无法确定公开版本。

## 评分

总分为 100 分。

### 发布门槛，25 分

检查以下问题：

- PR 是否运行与正式发布相同的验证。
- deploy job 是否依赖所有必需检查。
- 机器可读状态是否区分 `draft`、`review`、`ready` 和 `released`。
- 正式发布是否记录 commit、版本和发布时间。
- 上一个 artifact 是否可以回滚。

### Artifact 边界，20 分

检查以下问题：

- workflow 是否只上传一个明确目录。
- 公开页面是否不会链接到 `work/`、`candidates/`、`reviews/` 或内部 `materials/`。
- 源文件、生成文件和历史文件是否分开。
- 大型原始素材是否留在发布 artifact 之外。

### 页面完整性，20 分

检查以下问题：

- 关闭 JavaScript 后是否仍能读取核心文章。
- HTML 是否有唯一的 `h1`、正确的标题层级和页面语言。
- 页面是否提供 canonical、hreflang、description 和状态信息。
- 长文是否有系列导航、页面内目录和前后篇入口。
- 桌面与移动端是否完成真实渲染检查。

### 中英文一致性，15 分

检查以下问题：

- 每个英文页面是否有唯一中文对应页，反向关系也成立。
- 标题、摘要、状态、图题、导航和结论是否同步。
- 校验是否同时检查英文页混入中文和中文页遗留未计划的英文 UI 文案。
- `x-default` 是否符合项目选择的默认语言。

### 仓库发布信息，20 分

检查以下问题：

- README 是否说明项目类型、研究状态、公开入口和本地验证命令。
- 仓库是否提供 `LICENSE`、`CITATION.cff` 和版本记录。
- 公开页面是否提供作者、更新时间、仓库链接和引用方式。
- 历史站点是否明确标为 archived，不与当前入口竞争。
- 目录名是否能让新贡献者判断哪些文件会被部署。

## 必须执行的检查

在仓库根目录运行：

```bash
git status --short --branch
git diff --check
./scripts/validate.sh
./scripts/preview.sh restart
```

随后检查桌面和移动端。至少覆盖以下入口：

```text
/<repo>/
/<repo>/context.html
/<repo>/training.html
/<repo>/data.html
/<repo>/references.html
/<repo>/zh/
```

如果环境无法完成浏览器检查，结论最高只能是 `PASS_WITH_CHANGES`。输出中必须列出未检查的 viewport 和页面。

## 评审步骤

1. 读取 workflow，确定实际上传目录和触发条件。
2. 对照 README 与 CONTRIBUTING，检查文档是否描述同一条发布路径。
3. 运行必须执行的命令，并保存结果。
4. 检查 artifact 中是否含有内部目录、绝对路径或缺失资源。
5. 在 JavaScript 开启和关闭两种情况下读取首页核心内容。
6. 检查中英文页面对和导航。
7. 检查版本、引用、许可、作者和回滚信息。
8. 按 `evaluators/README.md` 的格式输出结论。

## 输出要求

除共同输出外，增加检查记录：

```markdown
## Executed checks

| Check | Result | Evidence |
| --- | --- | --- |
| `git diff --check` | PASS | exit 0 |
| `./scripts/validate.sh` | PASS | <summary> |
| Desktop render | NOT RUN | <reason> |
| Mobile render | PASS | <viewport and pages> |

## Deployment path

- Trigger: <event and branch or tag>
- Validation job: <job name or missing>
- Uploaded artifact: <path>
- Public revision: <commit or tag>
- Rollback method: <method or missing>
```

不要把本地 `publish.sh` 的成功当作 CI 已执行验证。Evaluator 必须沿 GitHub Actions 的真实依赖关系检查一次。
