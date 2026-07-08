# Robotics CAP TechBlog

这是一个极简 GitHub Pages 技术博客。当前站点保留两篇公开路线文章：

- `index.html`：博客首页，突出第一篇主文。
- `ideas/index.html`：文章索引。
- `ideas/capx-2026-route.html`：主文《为什么 CapX 式策略代码会是 2026 年最值得押注的机器人路线》。
- `ideas/cap-ar-native-training.html`：文章《CAP 为什么应该坚持 AR 原生训练》。
- `docs/outlines/capx-route-full-outline.md`：主文的富提纲来源。

这个仓库不再维护项目门户、路线图、概念书、预览目录或旧拆分 idea 页面。后续只有当主文需要真正形成系列论证时，才新增文章页。

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

## 默认收尾

完成一次内容或样式改动后，默认收尾顺序是：

1. 验证静态页面可以正常预览。
2. 提交本次改动。
3. 重新启动或复用本地预览服务。
4. 在浏览器打开预览地址，让最后看到的是可阅读页面，而不是只停在提交结果。

## 发布

项目使用最简单的 GitHub Pages 发布流程：推送到 `main` 后，由 GitHub Pages 从主分支根目录发布静态文件。

运行：

```bash
./scripts/publish.sh "Publish Robotics CAP TechBlog"
```

脚本会暂存博客所需文件、创建提交并推送到 `origin/main`。
