# Robotics CAP TechBlog

这是一个极简 GitHub Pages 技术博客。当前站点只保留一个公开阅读中心：

- `index.html`：博客首页，突出第一篇主文。
- `ideas/index.html`：文章索引。
- `ideas/capx-2026-route.html`：主文《为什么 CapX 式策略代码会是 2026 年最值得押注的机器人路线》。
- `docs/outlines/capx-route-full-outline.md`：主文的富提纲来源。

这个仓库不再维护项目门户、路线图、概念书、预览目录或拆分 idea 页面。后续只有当主文真的需要拆成系列文章时，才新增文章页。

## 本地预览

使用固定脚本启动本地服务：

```bash
./scripts/review.sh
```

打开：

```text
http://127.0.0.1:4000/robotics-cap/
```

如果 4000 端口被占用，可以换一个端口：

```bash
./scripts/review.sh 8080
```

## 发布

项目使用最简单的 GitHub Pages 发布流程：推送到 `main` 后，由 GitHub Pages 从主分支根目录发布静态文件。

运行：

```bash
./scripts/publish.sh "Publish Robotics CAP TechBlog"
```

脚本会暂存博客所需文件、创建提交并推送到 `origin/main`。
