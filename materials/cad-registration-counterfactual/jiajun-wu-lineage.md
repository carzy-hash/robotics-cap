# 从形状程序到可证伪环境模型

本文梳理 Jiajun Wu 团队与当前方案最相关的工作。重点不是证明已有论文已经实现了机器人场景中的 CAD 组合与配准，而是识别哪些表示和推理方法可以成为这套系统的组成部分。

## 一条连续的研究线

Jiajun Wu 将自己的研究主题概括为 physical scene understanding，即让系统看见物理世界，推理物体与场景的结构，并据此交互。这条研究线大致经历了四次扩展。

| 阶段 | 代表工作 | 论文中的表示或机制 | 对当前方案的作用 | 不能直接推出的结论 |
| --- | --- | --- | --- | --- |
| 从图像反推三维与物理属性 | Galileo、MarrNet、ShapeHD、3D-SDN、Learning to Exploit Stability | 物体形状、位姿、物理属性、2.5D sketch、形状先验、可微渲染和物理稳定性 | 说明视觉解释可以通过渲染或物理结果接受检查 | 这些工作没有提供机器人 runtime 中的异常处理协议 |
| 把视觉结构写成程序 | Learning to Describe Scenes with Programs、Learning to Infer and Execute 3D Shape Programs、Multi-Plane Program Induction、ProGRIP | 场景 DSL、部件组合、重复和对称、隐式部件、平面与相机参数 | 为无实例 CAD 的 `asset_composition` 提供结构化表示 | 形状程序不等同于完成了度量配准，也不保证适合碰撞和抓取 |
| 从单物体扩展到环境模型 | PSGNet、DSR-Net、Scene Graph Memory、NS3D | 部件到物体的图结构、三维动态表征、持续场景记忆、对象和关系查询 | 支持跨时间保存物体、位姿、遮挡和关系，而不是每帧重新识别 | 关系推理和场景记忆本身不会恢复精确几何 |
| 用基础模型生成结构和布局 | The Scene Language、LayoutVLM、WonderWorld、FactoredScenes | 程序、词和 embedding 的组合，代码生成，位姿优化，单图场景生成，程序库与对象布局 | 说明 Agent 可以生成场景代码，并把离散结构交给连续优化器 | 这些工作多用于生成和编辑，不以观测一致性作为机器人级验证标准 |

## 从像素到可检查的三维解释

Galileo 把质量、摩擦、位置和三维形状放进物体级隐变量，再调用物理引擎生成结果并与视频比较。它给出了当前闭环最早的一种形式：提出隐变量，执行模拟，再用观测修正隐变量。

MarrNet 从单张 RGB 图像先预测深度、法线和轮廓，再恢复三维形状。ShapeHD 进一步强调单视图重建的不适定性。多个三维形状可以解释同一张图，因此系统需要形状先验。这个结论直接限制了当前方案：Agent 不应在证据不足时提交唯一几何答案。

3D-SDN 将场景拆成对象级语义、几何和外观，并通过渲染重建图像。Learning to Exploit Stability 则把物理稳定性加入三维场景解析。二者说明 verifier 不必停在 mask。系统可以逐步加入深度、接触、支撑关系、稳定性和抓取可执行性。

## 无实例 CAD 不等于没有形状先验

本文所说的“无 CAD”应写成“推理时没有目标实例 CAD”。系统仍然可以使用参数化几何、可复用部件、学习到的形状先验、相机标定和渲染器。完全没有这些先验时，有限视角无法唯一确定目标的完整三维形状。

Learning to Infer and Execute 3D Shape Programs 将三维物体表示为部件和关系组成的程序。ProGRIP 用可重复的隐式部件提高表示精度，并且不依赖人工编写的形状程序标注。The Scene Language 又把场景表示拆成三部分：程序保存层级与关系，词保存语义类别，embedding 保存实例差异。

这三类工作共同给出一种比“从 CAD 库选一个 ID”更一般的输出形式：

```json
{
  "geometry_hypotheses": [
    {
      "source": "part_program",
      "program": "executable shape program",
      "instance_embedding": "optional latent code",
      "symmetry_class": "continuous_rotation_about_z",
      "score": 0.54
    },
    {
      "source": "implicit_parts",
      "program": "alternative shape program",
      "instance_embedding": "optional latent code",
      "symmetry_class": "discrete_rotation_order_2",
      "score": 0.31
    }
  ],
  "pose_hypotheses": [
    {
      "transform_world_from_object": "4x4 homogeneous transform",
      "covariance": "6x6 pose covariance",
      "geometry_hypothesis_index": 0
    }
  ]
}
```

Agent 负责提出离散结构，例如部件数量、连接关系、对称性和候选几何来源。配准器负责优化连续变量，例如尺度、关节参数和六自由度位姿。LayoutVLM 中“模型生成代码，优化器求连续布局”的分工与此最接近，但 LayoutVLM 解决的是资产布置，不是从机器人观测中恢复未知目标。

## 环境模型需要保存什么

单个目标的几何与位姿只是环境模型的一部分。Multi-Plane Program Induction 把结构程序、三维平面和相机参数放在同一个推断问题中。PSGNet 将像素组织成部件、物体和关系图。DSR-Net 强调遮挡下的物体持续性、完整形状和时序连续性。Scene Graph Memory 则把多次局部观测累积为可更新的场景图。

沿着这条线，runtime 中的每个物体节点至少需要保存：

- 一组几何假设，而不是单个 mesh。
- 一组位姿假设、协方差和对称性等价类。
- 哪些相机、深度帧或接触事件支持当前假设。
- 可见区域、未观测表面和遮挡关系。
- 与平面、容器和其他物体的支撑、接触和空间关系。
- 每轮渲染残差，以及残差否证了哪个字段。

环境模型还要跨时间更新。物体暂时被遮挡时，系统保留它的几何和位姿分布。新视角到达后，verifier 更新证据，而不是从头构造场景。若多个假设在现有视角下无法区分，系统应选择能最大程度区分它们的新视角。

WonderWorld 表明系统可以从单张图生成没有实例 CAD 的三维场景候选。这类生成结果适合提出未观测区域的假设，但不适合直接充当 verifier 的真值。FactoredScenes 将高层程序、对象检索和位姿预测连接起来，适合描述房间级环境的组合过程。它同样偏向生成，而不是用真实观测持续否证当前环境模型。

## 当前方案补上的一环

这些论文分别研究重建、生成、编辑、关系推理和场景记忆。当前方案增加的是一份机器人 runtime 可以执行的视觉契约：

1. Agent 必须输出可渲染的几何假设和度量位姿。
2. renderer 将假设变成每个相机视角下的可观测结果。
3. verifier 只用留出视角、深度或接触证据检查这些结果。
4. 残差必须指向具体字段，例如位姿、尺度、部件、遮挡或标定。
5. handler 根据被否证的字段重配准、替换形状、请求新视角或停止动作。
6. Runtime Trace 保存每次假设、证据、残差和修正。

关键差别在第 3 至第 6 步。结构化场景表示在这里不是生成资产，而是让 Agent 对外承诺一组可被未来观测推翻的结果。

## 对实验设计的修改

吴佳俊这条研究线提示首轮实验增加以下对照和指标：

- 将 `no CAD` 改名为 `no instance-level CAD at inference`。
- 增加形状程序和隐式部件两个无实例 CAD 基线。
- 允许 Agent 输出 top-k 几何假设，测量留出视角排除错误假设的速度。
- 分别报告拟合视角和留出视角的 mask、轮廓与深度误差。
- 增加对称性等价类和位姿不确定度，避免把合法多解算作错误。
- 增加物理稳定性、碰撞和抓取可执行性检查，测量 mask 正确但物理错误的比例。
- 增加跨时间遮挡测试，检查环境模型是否保留物体并正确吸收新证据。
- 增加主动选视角基线，测量每次新增观测减少了多少假设熵。

## 主要论文与项目

- [Galileo: Perceiving Physical Object Properties by Integrating a Physics Engine with Deep Learning](https://proceedings.neurips.cc/paper_files/paper/2015/file/d09bf41544a3365a46c9077ebb5e35c3-Paper.pdf)
- [MarrNet: 3D Shape Reconstruction via 2.5D Sketches](https://arxiv.org/abs/1711.03129)
- [Learning Shape Priors for Single-View 3D Completion and Reconstruction](https://arxiv.org/abs/1809.05068)
- [3D-Aware Scene Manipulation via Inverse Graphics](https://arxiv.org/abs/1808.09351)
- [Learning to Exploit Stability for 3D Scene Parsing](https://proceedings.neurips.cc/paper/2018/hash/43feaeeecd7b2fe2ae2e26d917b6477d-Abstract.html)
- [Learning to Describe Scenes with Programs](https://jiajunwu.com/papers/scene2prog_iclr.pdf)
- [Learning to Infer and Execute 3D Shape Programs](https://arxiv.org/abs/1901.02875)
- [Multi-Plane Program Induction with 3D Box Priors](https://jiajunwu.com/papers/bpi_nips.pdf)
- [Learning Physical Graph Representations from Visual Scenes](https://jiajunwu.com/papers/psgnet_nips.pdf)
- [Learning 3D Dynamic Scene Representations for Robot Manipulation](https://arxiv.org/abs/2011.01968)
- [Unsupervised Learning of Shape Programs with Repeatable Implicit Parts](https://proceedings.neurips.cc/paper_files/paper/2022/hash/f6adf61977467560f79b95485d1f3a79-Abstract-Conference.html)
- [Neuro-Symbolic Grounding of 3D Objects and Relations](https://www.jiajunwu.com/papers/ns3d_cvpr.pdf)
- [Modeling Dynamic Environments with Scene Graph Memory](https://proceedings.mlr.press/v202/kurenkov23a.html)
- [Physical Scene Understanding](https://jiajunwu.com/papers/psu_aimagazine.pdf)
- [The Scene Language: Representing Scenes with Programs, Words, and Embeddings](https://ai.stanford.edu/~yzzhang/projects/scene-language/)
- [LayoutVLM: Differentiable Optimization of 3D Layout via Vision-Language Models](https://ai.stanford.edu/~sunfanyun/layoutvlm/)
- [WonderWorld: Interactive 3D Scene Generation from a Single Image](https://kovenyu.com/wonderworld/)
- [From Programs to Poses: Factored Real-World Scene Generation via Learned Program Libraries](https://stanford.edu/~joycj/projects/factoredscenes_neurips_2025.html)

## 证据边界

这条论文线支持四个设计选择：使用结构化形状表示、把离散程序与连续位姿分开、跨时间维护场景状态，以及用渲染或物理结果检查假设。它没有证明 mask 残差足以定位错误字段，也没有证明 Agent 可以在真实机器人任务中稳定生成可抓取的无实例 CAD 几何。后两点仍是当前方案需要实验验证的部分。
