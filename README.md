# Robotics CAP

这是 Robotics CAP 的 GitHub Pages 轻量项目门户。当前站点按用途组织页面：

- `roadmap.html`：解释项目阶段、里程碑和交付方式。
- `concepts.html`：用概念、比喻和章节化叙事解释项目思想。
- `ideas/`：整理公开想法、方向和概念条目。
- `previews/`：放策展式预览摘要和外部演示入口。
- `proposals/`：收集可讨论的项目提案方向。

这个仓库不维护分支快照、完整实现构建、私密资料或访问控制逻辑。更完整的边界说明见 `docs/deployment-constraints.md`。

## 本地预览

为了让本地 review 尽量接近最终 GitHub Pages 版本，使用固定脚本启动本地服务：

```bash
./scripts/review.sh
```

打开：

```text
http://127.0.0.1:4000/robotics-cap/
```

这个路径模拟 GitHub Pages 项目站点的路径结构。仓库没有引入构建工具，并且使用 `.nojekyll`，所以线上发布版本就是这些静态文件本身。

如果 4000 端口被占用，可以换一个端口：

```bash
./scripts/review.sh 8080
```

## 固定发布脚本

项目使用最简单的 GitHub Pages 发布流程：推送到 `main` 后，由 GitHub Pages 从主分支根目录发布静态文件。

运行：

```bash
./scripts/publish.sh "Publish site framework"
```

如果不传提交信息，脚本会使用默认提交信息 `Publish GitHub Pages update`。

脚本会执行：

1. 确认当前分支是 `main`。
2. 暂存站点文件和发布脚本。
3. 创建提交。
4. 推送到 `origin/main`。

## 发布到 GitHub Pages

1. 进入仓库的 `Settings`。
2. 打开 `Pages`。
3. 在 `Build and deployment` 中选择 `Deploy from a branch`。
4. 选择主分支和 `/root` 目录。
5. 保存后等待 GitHub 生成访问地址。

## 部署约束

这个仓库定位为 Robotics CAP 的想法门户和预览入口，不承担完整实现、分支镜像或权限控制。
未来部署和目录规划请先参考 [`docs/deployment-constraints.md`](docs/deployment-constraints.md)。
