# Robotics CAP

这是 Robotics CAP 的 GitHub Pages 说明框架。当前站点先确定两个入口：

- `路线图`：解释项目阶段、里程碑和交付方式。
- `概念书`：用概念、比喻和章节化叙事解释项目思想。

## 本地预览

直接打开 `index.html` 即可预览。仓库没有引入构建工具，GitHub Pages 可以直接从根目录发布。

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
