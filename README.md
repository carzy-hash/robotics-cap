# Robotics CAP TechBlog

这个仓库同时保存 Robotics CAP 文章的写作过程与公开站点。内容按三个阶段组织：

1. `work/<article-id>/`：问题定义、提纲、证据边界、未决问题和迭代记录。
2. `candidates/<article-id>/` 与 `reviews/<article-id>/`：候选稿、多视角评审和选择决策。
3. `site/`：唯一公开发布面，只包含 canonical 文章及站点资源。

完整流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。工作材料会进入 Git 历史，但不会被 GitHub Pages 部署；如果仓库本身是 public，这些材料仍然可从源码中看到。

## 当前内容

- `site/ideas/mainstream-robotics-vs-cap.html`：主流机器人操作流水线与 CAP 的大众介绍。
- `site/ideas/capx-2026-route.html`：CapX 路线主文。
- `site/ideas/cap-ar-native-training.html`：CAP AR 原生训练 canonical 文章。
- `candidates/cap-ar-native-training/`：该文章的三个历史候选版本。
- `work/` 与 `reviews/`：文章形成过程和评审决策。

## 开始一篇文章

```bash
./scripts/new-article.sh my-article-id
```

脚本只创建阶段目录和空白模板，不生成文章正文。`article-id` 必须使用小写 kebab-case。

## 验证与预览

```bash
./scripts/validate.sh
./scripts/preview.sh
```

预览地址默认为：

```text
http://127.0.0.1:4000/robotics-cap/
```

服务在后台运行。可使用 `status`、`restart`、`stop` 管理，例如：

```bash
./scripts/preview.sh status
./scripts/preview.sh stop
```

本地预览与线上发布的边界不同：根路径显示正式站点，`_workspace/` 提供本地 review 索引，可以查看 `work/`、`candidates/` 和 `reviews/` 中的已提交材料。GitHub Pages 仍只部署 `site/`。

## 发布

`main` 上的 GitHub Actions 只部署 `site/`：

```bash
./scripts/publish.sh
git add -A
git commit -m "Publish article"
git push origin main
```

`publish.sh` 只做发布前验证，不会自动暂存、提交或推送。
