# Robotics CAP TechBlog

这个仓库同时保存 Robotics CAP 文章的写作过程与公开页面。当前 GitHub Pages 只发布 **Code as Runtime**：

1. `work/<article-id>/`：问题定义、提纲、证据边界、未决问题和迭代记录。
2. `candidates/<article-id>/` 与 `reviews/<article-id>/`：候选稿、多视角评审和选择决策。
3. `materials/code-as-runtime/article/`：当前唯一公开发布面。

完整流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。工作材料会进入 Git 历史，但不会被 GitHub Pages 部署；如果仓库本身是 public，这些材料仍然可从源码中看到。

## 当前公开内容

- `materials/code-as-runtime/article/`：**Code as Runtime** 系列，包含 Runtime、Context 与 RL + Teachers 三篇；Architecture Note 是 GitHub Pages 根入口。
- `materials/code-as-runtime/`：该方案的原始材料、写作笔记与评审记录。
- `site/ideas/`、`candidates/`、`work/` 与 `reviews/`：历史文章与形成过程，保留在源码中但不部署。

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

本地根路径与线上一致，直接显示 Code as Runtime。`_workspace/` 是本地 review 索引，可查看 `work/`、`candidates/`、`reviews/`、`previews/` 和 `materials/`；它不会被部署。

## 发布

`main` 上的 GitHub Actions 只部署 `materials/code-as-runtime/article/`：

```bash
./scripts/publish.sh
git add -A
git commit -m "Publish article"
git push origin main
```

`publish.sh` 只做发布前验证，不会自动暂存、提交或推送。
