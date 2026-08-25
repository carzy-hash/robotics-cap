# 用 CAD 组合与配准验证 Agent 的目标想象

## 核心想法

要求 Agent 把它对刚体目标的理解外化为一个可渲染、可配准、可证伪的三维假设。Agent 不能只输出类别、自然语言描述或抓取位姿。它必须输出两类结果：

1. 由 CAD asset 或参数化几何体组成的目标形状。
2. 目标相对于世界坐标系或相机坐标系的位姿配准参数。

系统将这个三维假设渲染到多个已标定视角，得到每个视角的预期 mask。实际图像中的目标 mask 与预期 mask 产生一张有空间结构的残差图。如果 Agent 的假设正确，这些像素应该属于目标；实际观测却不支持该判断。这个残差可以触发重配准、替换 asset、补充部件、请求新视角或停止执行。

这不是让 Agent 生成一个看起来合理的 CAD 模型。目标是让 Agent 提交一个可以被相机观测直接否证的视觉解释。

## Agent 输出契约

最小输出包含 `asset_composition` 和 `registration`：

```json
{
  "target_id": "target_01",
  "asset_composition": [
    {
      "asset_id": "cylinder_12",
      "geometry_parameters": {
        "radius_m": 0.032,
        "height_m": 0.118
      },
      "transform_object_from_part": "4x4 homogeneous transform"
    }
  ],
  "registration": {
    "transform_world_from_object": "4x4 homogeneous transform",
    "scale": [1.0, 1.0, 1.0],
    "symmetry_class": "continuous_rotation_about_z",
    "camera_calibration_version": "rig_2026_08_24"
  }
}
```

`asset_composition` 可以有两种来源：

- 已知 CAD：从工厂 asset 库检索目标模型，只估计实例、尺度和位姿。
- 组合 CAD：从基础 asset、参数化几何体或可复用部件组合目标形状，再估计部件关系和整体位姿。

已知 CAD 是低风险起点。组合 CAD 才真正测试 Agent 能否把视觉理解写成结构化三维假设。

这里的“无 CAD”是指推理时没有目标的实例级 CAD，不是完全没有形状先验。系统仍可使用参数化几何、可复用部件、学习到的形状先验、相机标定和渲染器。有限视角通常对应多个合法三维解释，因此无实例 CAD 模式应保留多个几何假设、位姿不确定度和对称性等价类，而不是强制 Agent 过早提交单解。

## 多视角验证闭环

1. Agent 根据任务描述和部分视角提出 `asset_composition`。
2. 配准器估计或优化 `registration`。
3. 渲染器使用相机内参、外参和遮挡关系生成各视角的预期 mask。
4. 分割器从实际图像中生成观测 mask。
5. verifier 计算每个视角的差异，并保留残差的空间位置。
6. runtime 根据残差类型触发修正、补充观测或异常处理。
7. Agent 修改被否证的 asset、部件关系或位姿，再次渲染和验证。

验证不能只看用于配准的视角。最小实验应把相机视角分成两组：

- 拟合视角用于选择 asset 和优化位姿。
- 留出视角只用于验证三维假设。

留出视角可以暴露单视角下不可区分的错误形状。如果所有视角都参与优化，mask 一致性只能证明模型拟合了这些观测，不能证明 Agent 构造了正确的三维目标。

## Mask 残差与反事实异常

至少记录以下差异：

- mask IoU 和边界 F-score。
- 预期为前景、实际为背景的像素。
- 预期为背景、实际为前景的像素。
- 按可见面积归一化的逐视角残差。
- 在有深度数据时，渲染深度与实测深度的差异。

残差需要映射到可以执行的异常类型：

| 残差模式 | 候选解释 | runtime 动作 |
| --- | --- | --- |
| 所有视角发生同方向平移 | 位姿配准错误 | 重新优化位姿 |
| 一个局部在多个视角持续缺失 | asset 缺少部件 | 增加或替换部件 |
| 预期轮廓整体过大或过小 | 尺度或 asset 错误 | 调整尺度或重新检索 |
| 只在一个视角出现大残差 | 遮挡、分割或相机标定错误 | 请求新视角并检查标定 |
| 对称物体的 mask 正确但位姿不唯一 | 对称性歧义 | 保留位姿等价类，不强制单解 |

“反事实”在这里有严格含义：如果当前三维假设和配准成立，渲染器应该在指定像素产生前景。观测不满足这个结果，因此 verifier 否证当前假设的一部分。它不是模型对异常的自然语言解释。

## 与 Code as Runtime 的关系

这个方法可以成为 Code as Runtime 的一个可执行视觉检查端点：

- Agent 输出 asset 组合和配准参数。
- renderer 和 verifier 作为确定性工具运行。
- mask 残差进入下一轮 context。
- handler 根据阈值触发重配准、换视角、重建形状或停止。
- Runtime Trace 保存假设、位姿、相机版本、预期 mask、观测 mask、残差和修正决定。

这样，Agent 的“想象”不再是隐藏状态或自然语言。它成为 trace 中一个可重放、可比较、可监督的中间对象。

## 最小实验

### 任务

选择一组可获得精确 CAD 的刚体目标，并为每个目标准备：

- 至少三个已标定相机视角。
- 实例级观测 mask。
- 对称性标注。
- 真实位姿，或可用于评测的高精度配准结果。
- 缺部件、错误 asset、错误尺度和错误位姿等受控异常。

### 对照组

- Oracle CAD + pose registration：使用正确 CAD，只估计位姿。
- CAD retrieval + registration：从 asset 库检索，再估计位姿。
- Agent composition + registration：Agent 同时生成组合形状和位姿参数。
- Single-view validation：不使用留出视角，用于测量多视角验证的增益。

### 指标

- 留出视角的 mask IoU 和边界 F-score。
- 对称性感知的位姿误差，例如 ADD-S。
- 对错误 asset、缺部件和错误位姿的异常检测 AUROC。
- 从第一次假设到通过验证所需的修正轮数。
- 每轮推理、渲染和配准成本。

### 首轮消融

- 已知 CAD 与组合 CAD。
- 单视角与多视角。
- 仅 mask 与 mask 加深度。
- 所有视角参与拟合与保留验证视角。
- 只输出最终参数与保留完整 Runtime Trace。

## 主要失败方式

- 分割错误会被误判为形状或位姿错误。
- 相机标定误差会在多个视角产生一致残差。
- 遮挡使不可见表面无法由 mask 唯一确定。
- 多个不同三维形状可能产生相同的有限视角轮廓。
- 对称物体存在合法的位姿等价类。
- 参数化部件库的表达能力限制 Agent 可以提出的形状。
- Agent 可能选择一个容易拟合 mask、但不利于碰撞检查或抓取规划的几何解释。

因此，mask 验证适合否证错误假设，不足以单独证明完整三维模型正确。深度、接触、抓取可执行性和留出视角应提供独立约束。

## 灵感与证据边界

第一条工程灵感来自工厂场景中的已知 CAD 抓取：系统已知目标几何，只需完成实例识别、位姿配准和抓取规划。这里把已知 CAD 推广为 Agent 生成或组合的 CAD 假设，并增加多视角观测验证。

第二条研究灵感来自 Jiajun Wu 的分享 [Understanding the Visual World through Code](https://www.youtube.com/watch?v=y_DNZTDmA0s)。该方向研究如何用代码或结构化表示表达视觉世界中的对象、部件和规律；[Stanford 2021 AI Workshop](https://forum.stanford.edu/events/2023-annual-affiliates-meeting/annual-meeting-archives/2021-annual-affiliates-meeting/2021) 记录了这场分享。相关的 [Understanding the Visual World Through Naturally Supervised Code](https://talks.cs.umd.edu/talks/3406) 摘要进一步强调结构化表示与神经网络的互补关系。

这些来源支持“视觉结构可以用代码或结构化表示表达”这一动机。它们不证明 CAD 组合、位姿配准、多视角 mask 差异或反事实异常机制在机器人任务中有效。

[从形状程序到可证伪环境模型](jiajun-wu-lineage.md) 进一步梳理了这条研究线。文档将相关工作分为三维与物理反演、形状程序、持续环境模型和基础模型生成四个阶段，并说明无实例 CAD 模式需要怎样修改 Agent 输出和实验设计。

## 当前状态

这是研究想法和实验草案。尚未实现 Agent 输出协议、组合 CAD 搜索、配准器、跨视角 renderer/verifier 或机器人实验，也没有性能结果。
