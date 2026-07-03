# CapX Route Full Outline

This outline reorganizes the current CapX route material into one complete
introduction. It is a planning document, not the final polished article.

## Working Title

为什么 CapX 式策略代码会是 2026 年最值得押注的机器人路线

## Core Thesis

Robotics CAP 的核心判断是：在 2026 年这个时间点，让模型直接输出长动作序列不是最能释放模型智能的方式。更好的路线是让模型生成可读、可审计、可组合、可监督的策略代码，再由策略代码调用受约束的动作接口生成短 Action Chunk。

这条路线不是绕开机器人控制、视觉理解或硬件测试，而是把模型最擅长的 Code Agent 能力接到机器人任务中间层，让高层推理、低层控制、安全检查和仿真监督各自处在更合适的位置。

## Intended Reader

正文不写 reader lens，但写作时假设读者是：

- 懂大模型、Agent Coding 和工具调用；
- 不一定熟悉机器人控制、视觉伺服或 sim-to-real；
- 对“为什么不直接输出动作”有疑问；
- 需要看到路线的边界、失败模式和验证方式。

## Article Shape

The final article should move in this order:

1. 先给结论和问题背景；
2. 再解释为什么 coding 是强智能释放维度；
3. 接着重新定义 Action Chunk；
4. 然后说明代码如何接到机器人身体上；
5. 再展开安全节奏、多模块协作、视觉伺服 benchmark 和仿真监督；
6. 最后收束到路线边界、前提条件和下一步拆分。

## 1. Opening: Why This Question Matters Now

### Paragraph 1: State the moment

要说什么：

2026 年的机器人路线选择不只是“哪个模型更大”或“动作数据更多”。真正的问题是：当模型已经在 Agent Coding 中展示出强大的规划、分解、工具调用和纠错能力时，机器人系统应该怎样承接这种能力。

功能：

- 建立时间感；
- 把问题从机器人动作模型，拉到“如何释放模型智能”；
- 为后文的 Code Agent 路线铺垫。

### Paragraph 2: State the thesis

要说什么：

CapX 式路线的答案是：不要让模型只直接输出 Action Chunk，而是尽量让模型写策略代码。策略代码表达目标、约束、观察、检查、恢复和执行节奏，再由底层动作接口生成短动作。

功能：

- 直接给出主张；
- 明确不是反对 Action Chunk，而是改变它的位置；
- 给读者一个文章主线。

### Paragraph 3: Clarify what this does not claim

要说什么：

这不是说代码可以替代控制、动力学、视觉模型或真实硬件实验。它说的是：当模型参与机器人任务时，代码比长动作序列更适合作为中间表达，因为代码更容易检查、修改、复用和监督。

功能：

- 降低过度承诺感；
- 把路线边界提前放出来；
- 防止读者误读为“LLM 直接控制机器人”。

## 2. Why Agent Coding Is the Important Signal

### Paragraph 1: Coding reveals a higher capability mode

要说什么：

Agent Coding 的价值不只是代码生成，而是模型在代码环境中更自然地进行任务分解、工具调用、错误定位、迭代修复和长链路规划。很多任务只要被转译成 coding 问题，模型能力就会被更完整地释放。

功能：

- 解释为什么从 coding 出发；
- 不是把代码当语法，而是当认知工作台。

### Paragraph 2: Robot operation can also be reframed as coding

要说什么：

机器人任务也可以被转译：自然语言任务和视觉状态进入模型，模型不直接给关节轨迹，而是生成一段程序。程序决定要看什么、移动什么、检查什么、失败时怎么处理。

功能：

- 把 Agent Coding 迁移到机器人；
- 说明“代码接身体”的第一步。

### Paragraph 3: Code is inspectable before execution

要说什么：

动作序列往往只能在执行后看结果；代码可以在执行前审计。我们可以问：目标是否明确？约束是否足够？观察不足时是否会停？是否有重试和退出？

功能：

- 引出审计清单；
- 建立安全性和可解释性优势。

## 3. The Control Stack: From Task to Code to Action

### Paragraph 1: Introduce the layered model

要说什么：

整套系统可以分为四层：任务理解层、策略代码层、动作接口层、执行反馈层。Code Agent 不应该承担所有层的工作，而是在策略代码层发挥最大作用。

功能：

- 防止架构混乱；
- 说明 Code Agent 的位置。

### Paragraph 2: Task understanding layer

要说什么：

这一层把语言指令、图像观察和环境状态整理成目标、约束和成功条件。例如“拿起杯子”要变成目标物体、抓取姿态、避障区域和完成标准。

功能：

- 给读者具体接口想象；
- 解释从语言到机器人状态的过渡。

### Paragraph 3: Policy code layer

要说什么：

策略代码层生成可读程序：什么时候重新观察、什么时候求解路径、什么时候执行短动作、什么时候停止。它不是低层控制器，而是任务策略的可执行表达。

功能：

- 明确策略代码的职责；
- 避免读者以为它直接控制每个关节。

### Paragraph 4: Action interface layer

要说什么：

动作接口层把局部目标变成短动作、路径或控制参数。它应该暴露碰撞、力反馈、失败信号和停止能力。策略代码调用它，而不是替它实现所有控制细节。

功能：

- 说明代码如何落到动作；
- 连接 Action Chunk。

### Paragraph 5: Execution feedback layer

要说什么：

执行后，系统重新观察结果，并触发继续、重试、换视角、降级或停止。机器人不是一次性生成完整长计划，而是短执行、再检查、再修正。

功能：

- 建立闭环；
- 连接安全执行节奏。

## 4. Action Chunk as a Narrow-API Code Agent

### Paragraph 1: Define Action Chunk

要说什么：

Action Chunk 是一段可执行动作序列。它可以直接由模型输出，也可以由策略代码在局部约束下生成。当前很多范式近似于“图像 + 指令 -> 动作片段”。

功能：

- 给术语定义；
- 为对比做准备。

### Paragraph 2: Why direct Action Chunk is limited

要说什么：

直接输出动作有价值，但接口很窄。模型把目标、约束、恢复策略都压缩进轨迹里，外部很难知道它为什么这样动，也很难在执行前审计。

功能：

- 解释问题不是 Action Chunk 本身，而是表达层太窄。

### Paragraph 3: Policy code makes Action Chunk a product, not the answer

要说什么：

在 CapX 路线里，Action Chunk 仍然存在，但它变成策略代码调用动作接口后的产物。模型可以先写出目标、约束和检查逻辑，再生成短动作。

功能：

- 重新定位 Action Chunk；
- 连接伪代码。

### Paragraph 4: Include pseudocode explanation

要说什么：

用 `pick_object(task, vision, left_arm)` 这样的伪代码说明接口形状：先找目标，不可见就请求重新取景；可见就求解路径；路径带约束；执行短 chunk；最后验证或重规划。

功能：

- 把抽象路线变成可想象的程序；
- 让 AI 工程师读者更快理解。

### Paragraph 5: Comparison table logic

要说什么：

对比直接输出 Action Chunk 和策略代码生成 Action Chunk：前者难解释、难监督、迁移弱；后者可以检查目标、约束、中间状态和底层接口替换。

功能：

- 用清晰对照强化核心取舍。

## 5. Safe Tasks Make Long Thinking Acceptable

### Paragraph 1: Not every robot task is real-time reflex

要说什么：

很多机器人任务不是极速反应任务，而是安全场景：可以先观察、推演、检查，再执行短动作。长思考在这里不是拖累，而是安全机制。

功能：

- 回应“Code Agent 太慢”的疑问；
- 解释为什么 2026 年可行。

### Paragraph 2: The observe-plan-check-act-review rhythm

要说什么：

安全节奏是：观察多视角状态；生成策略代码；检查目标和风险；执行短动作；重新观察并决定下一步。不要一次性押注长动作。

功能：

- 给执行模式；
- 连接审计和短 Action Chunk。

### Paragraph 3: Why short actions matter

要说什么：

短 Action Chunk 把风险限制在局部范围。每一步之后系统都有机会检查、修正、停止，避免长序列把错误扩大。

功能：

- 解释安全性；
- 强化“短动作 + 长思考”的配比。

## 6. Human Skill Learning as a Robot Control Analogy

### Paragraph 1: People do not learn by controlling every joint continuously

要说什么：

学习网球时，教练常要求固定上身和手部姿态，通过脚步移动迎击。发球时手势更固定。许多技能学习不是连续精控所有关节，而是稳定姿态、关节组合和触发时机。

功能：

- 引入用户提出的运动学习比喻；
- 降低“必须全关节端到端输出”的直觉。

### Paragraph 2: Robot actions can also use joint subsets

要说什么：

机器人任务里也常见某些关节保持姿态，另一些关节负责接近、对齐或执行。策略代码可以显式表达“固定、等待、触发、释放”。

功能：

- 把人类技能比喻映射回机器人；
- 连接多模块控制。

### Paragraph 3: Why this supports code-based strategies

要说什么：

代码天然适合表达哪些部件固定、哪些部件行动、什么条件触发下一步。这比把所有自由度都压进一个动作输出更容易解释和迁移。

功能：

- 证明比喻服务于路线，而不是装饰。

## 7. Parallel Module Control

### Paragraph 1: Robot bodies are modular

要说什么：

一个机器人可能有左手、右手、头部、手部相机和其他传感器。与其让一个输出管所有自由度，不如让多个局部代码块负责不同模块。

功能：

- 引出并行代码序列；
- 说明迁移意义。

### Paragraph 2: Example roles

要说什么：

左手代码块负责接近、抓取、抬起；头部观察块负责看遮挡、偏移、目标丢失；右手感知块负责补盲、三角定位或第二视角确认。

功能：

- 用具体角色说明模块划分；
- 复用当前模块表。

### Paragraph 3: Local code blocks need simple signals

要说什么：

模块之间不需要共享所有内部状态，可以通过简单信号协作：pause、retry、reframe、confirm、abort。关键是知道什么时候继续、暂停、让出控制或终止。

功能：

- 防止“并行”听起来混乱；
- 给协作协议直觉。

### Paragraph 4: Local centers analogy

要说什么：

可以类比章鱼触手的局部神经中枢：不是所有控制都回到单一大脑。许多局部执行器和观测器组成代码 block，既能安全完成子动作，也能保持敏捷。

功能：

- 保留强比喻；
- 说明“超人”潜力来自并行局部控制。

## 8. Visual Servoing Is the Bottleneck to Measure

### Paragraph 1: The route depends on visual understanding

要说什么：

策略代码路线依赖视觉模型能理解画面，并把视觉元素转成行动建议。现在公开多模态模型仍未完全达到这个水平。

功能：

- 承认瓶颈；
- 为 benchmark 铺垫。

### Paragraph 2: Current gap: translation vs rotation

要说什么：

模型对画面中物体的平面位置可能已有较明确感知，例如知道怎么平移让物体居中。但当任务变成旋转到特定侧面或角度时，表现可能接近随机游走。

功能：

- 保留用户测试观察；
- 指出真正难点。

### Paragraph 3: Benchmark tasks

要说什么：

benchmark 应包括平移居中、旋转到侧面、遮挡恢复、多视角一致。不是只看识别物体，而是看观察能否变成可靠调整。

功能：

- 给验证方向；
- 连接独立 benchmark 页面。

### Paragraph 4: Why benchmark matters for the route

要说什么：

如果视觉伺服能力不足，策略代码会写出看似合理但执行漂移的计划。benchmark 能告诉我们哪些部分交给模型，哪些必须交给几何、控制或额外传感器。

功能：

- 把 benchmark 放回路线决策中。

## 9. Simulation Supervision and Sim-to-Real

### Paragraph 1: Code gives richer supervision signals

要说什么：

如果模型输出代码，仿真环境监督的不只是动作是否成功，还包括中间状态、约束表达、失败恢复和代码是否依赖捷径。

功能：

- 说明为什么代码适合训练；
- 连接 RL/预训练。

### Paragraph 2: Supervision ladder

要说什么：

从粗到细可以监督：任务成功、步骤顺序、约束满足、代码可迁移性。每一层都比单纯动作结果提供更多反馈。

功能：

- 组织当前 signal ladder；
- 给训练读者结构。

### Paragraph 3: Why code may reduce sim-to-real gap

要说什么：

代码较短，且不鼓励模型记住固定动作序列。它更像学习求解过程，而不是过拟合仿真轨迹。可审计代码也更容易发现仿真 shortcut。

功能：

- 明确 sim-to-real 论点；
- 不夸张，强调“可能减少”。

### Paragraph 4: Failure taxonomy

要说什么：

需要审计的失败包括：目标错、约束缺失、观察不足、仿真捷径。每类都可以设计奖励或惩罚。

功能：

- 让监督对象更具体；
- 给下一步研究方向。

## 10. Audit and Safety Before Execution

### Paragraph 1: Why audit belongs before motion

要说什么：

机器人动作一旦执行就会影响物理世界，所以审计应尽量发生在执行前。策略代码给了一个可检查对象。

功能：

- 强化安全意义；
- 引出 checklist。

### Paragraph 2: Audit checklist

要说什么：

执行前检查：目标是否明确；观察不足是否处理；是否有边界约束；失败后如何恢复；是否有仿真 shortcut。

功能：

- 保留当前 checklist；
- 作为读者可复用工具。

### Paragraph 3: Audit does not mean freezing the system

要说什么：

审计不是让机器人变慢到不可用，而是决定哪些动作可以自动执行、哪些需要重新观察、哪些必须人工确认或停止。

功能：

- 回应实用性疑虑。

## 11. Prerequisites

### Paragraph 1: Visual understanding

要说什么：

模型不必完美，但要能稳定识别目标、遮挡、粗位置和任务相关状态。否则策略代码会建立在不可靠观察上。

功能：

- 第一前提。

### Paragraph 2: Reliable action interfaces

要说什么：

底层系统需要提供可约束路径求解、短动作执行、碰撞/力反馈和安全停止。策略代码调用这些能力，而不是凭空生成物理控制。

功能：

- 第二前提。

### Paragraph 3: Replayable feedback records

要说什么：

每次任务要记录观察、代码、动作、反馈、失败和修正。没有记录，就很难监督、审计和迭代。

功能：

- 第三前提；
- 连接数据闭环。

## 12. What to Build Next

### Paragraph 1: The idea cluster

要说什么：

CapX 总论可以拆成四个独立入口：Action Chunk 作为窄 API Code Agent、视觉伺服 benchmark、并行模块控制、仿真监督与策略代码。

功能：

- 把现有独立条目串起来；
- 给阅读路径。

### Paragraph 2: Near-term validation plan

要说什么：

先验证视觉理解、动作接口和反馈记录；再做短任务 demo；再设计 benchmark 和仿真监督；最后看是否能迁移到不同模块或平台。

功能：

- 收束到路线图；
- 给项目下一步。

### Paragraph 3: Closing claim

要说什么：

这条路线的优势不在于让模型跳过机器人学，而在于把模型最强的 coding 能力放在合适位置：生成策略、组织约束、接受反馈、逐步改进。

功能：

- 回到核心 thesis；
- 给完整介绍一个收束句。

## Recommended Page Structure

For the final rewritten page:

1. Hero thesis
2. 30-second read
3. Key terms
4. Control stack diagram
5. Main article sections in the order above
6. Audit checklist and prerequisites near the middle, not only at the end
7. Next reading path to split idea pages

## Reuse From Current Page

Keep:

- argument map;
- key terms;
- flow diagram;
- quick read;
- audit checklist;
- boundaries panel;
- prerequisites;
- four-layer model;
- pseudocode;
- comparison table;
- rhythm list;
- module table and signal strip;
- benchmark grid;
- supervision ladder;
- failure taxonomy;
- next split links.

But reorder them around the story, instead of leaving them as accumulated blocks.

## Likely Deletions or Moves

Do not delete now. If the rewrite makes these obsolete, add proposals to
`to-delete.md` first:

- duplicated short cards that repeat a paragraph immediately below;
- standalone idea pages if they become too thin after the main page absorbs them;
- any navigation entry that does not lead to real content.
